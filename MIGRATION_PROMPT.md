# Prompt di migrazione — Dati reali dall'export WordPress XML

## Contesto

Questo progetto ha già una UI funzionante che piace al cliente (palette editoriale calda, Playfair Display + Source Sans 3, shadcn/ui). I dati attuali in `data/ccnl.ts` sono **18 CCNL di esempio hardcodati**.

Ora abbiamo estratto i **dati reali** dall'export XML del sito WordPress `contratticcnl.it`. I file si trovano in `data/xml-export/`. L'obiettivo è sostituire i dati finti con quelli reali, aggiungere le pagine di contenuto editoriale, e replicare esattamente la struttura URL del sito WordPress per preservare il SEO.

**Regole:**
- Mantieni la UI e il design system esistenti (palette, font, componenti). Non cambiare lo stile.
- Tutti i dati devono venire dai file JSON in `data/xml-export/`. Non inventare contenuti.
- Le URL devono corrispondere esattamente a quelle del sito WordPress.
- Lingua: italiano ovunque (UI, placeholder, meta tag).

---

## File dati disponibili

### `data/xml-export/ccnl-catalog.json` — 1032 CCNL dal database CNEL

Ogni record ha questa struttura:

```typescript
interface CCNLRecord {
  id: string              // Codice CNEL, es. "A011", "C011", "H02X"
  slug: string            // es. "a011"
  titolo: string          // Nome completo del contratto
  firmatari_datoriali: string  // Organizzazioni datoriali (separati da ";")
  firmatari_sindacali: string  // Sindacati (separati da ";")
  scadenza_contrattuale: string // Data formato "dd/mm/yyyy" o "dd/mm/yy"
  settore_cod: string     // Lettera macrosettore, es. "A", "C", "H"
  sottosettore_cod: string // es. "A01", "C01", "H02"
  settore_desc: string    // es. "AGRICOLTURA"
  sottosettore_desc: string
  dirigenti: boolean
  settore_priv_pubb: "privato" | "pubblico" | "parasubordinato"
  settori: string[]       // Slug taxonomy settore-ccnl
  n_dipendenti_tot_2023: string // Numero dipendenti (spesso vuoto)
}
```

**Nota:** questi record NON hanno contenuto testuale. Sono schede dati strutturati del catalogo CNEL. Lo "stato" (vigente/scaduto/in-rinnovo) va calcolato dalla data scadenza.

### `data/xml-export/accordi.json` — 2093 accordi depositati al CNEL

```typescript
interface AccordoRecord {
  protocollo: string      // Numero protocollo CNEL, es. "20603"
  slug: string            // Stesso del protocollo
  titolo: string          // Nome dell'accordo
  ccnl_id: string         // Riferimento al CCNL (es. "T19H")
  tipologia: string       // "Accordo economico", "Testo definitivo", "Ipotesi di accordo"
  data_stipula: string    // "dd/mm/yyyy" o "dd/m/yyyy"
  data_decorrenza: string
  data_scadenza: string
  link: string            // URL PDF su https://static.cnel.it/...
}
```

### `data/xml-export/blog-posts.json` — 112 articoli pubblicati

```typescript
interface PostRecord {
  id: string
  slug: string
  title: string
  content_clean: string   // Testo pulito (HTML rimosso)
  excerpt: string
  date: string            // "YYYY-MM-DD"
  categories: { name: string; slug: string }[]
  author: string
  seo: { title: string; description: string }
}
```

Categorie blog (con count calcolati dinamicamente dai dati):
- vigilanza-privata, multiservizi, energia-petrolio, lavoro-domestico, metalmeccanici, commercio, turismo, bancari, elettrico, studi-professionali, gomma-plastica

### `data/xml-export/ccnl-guide/[slug].json` — 5 pagine CCNL editoriali

Queste sono le pagine "guida" del sito WordPress: contenuto lungo scritto a mano con il testo degli articoli del contratto. Ci sono 5 file, uno per CCNL:

- `commercio.json` (27k chars) — Macrosettore: Terziario/Servizi
- `vigilanza-privata.json` (19k chars) — Macrosettore: Terziario/Servizi  
- `metalmeccanici.json` (13k chars, livelli 74k chars) — Macrosettore: Meccanici
- `energia-petrolio.json` (26k chars) — Macrosettore: Chimici
- `lavoro-domestico.json` (21k chars) — Macrosettore: Lavoro Domestico

Ogni file ha:

```typescript
interface CCNLGuideContent {
  slug: string
  title: string           // Titolo pagina WordPress
  seo_title: string       // Template Yoast (contiene %%title%%, %%currentyear%%, ecc.)
  seo_description: string
  info: {                  // Scheda contratto (estratta dal contenuto)
    titolo: string         // Nome ufficiale del CCNL
    settore: string
    contraenti_datoriali: string
    contraenti_sindacali?: string
    data_stipula?: string
    codice_cnel: string    // es. "H02X"
    scadenza: string       // "dd/mm/yyyy"
  }
  content: string          // Testo completo della pagina principale (articoli del contratto)
  livelli: string          // Testo della sotto-pagina "livelli e mansioni"
  livelli_title: string
  tabelle: string          // Testo della sotto-pagina "tabelle retributive"
  tabelle_title: string
  preavviso: string        // Testo della sotto-pagina "preavviso" (solo commercio)
}
```

I template SEO Yoast usano variabili da sostituire:
- `%%title%%` → titolo della pagina
- `%%currentyear%%` → anno corrente (2026)
- `%%sitename%%` → "ContrattiCCNL.it"
- `%%sep%%` → "—"

---

## Macrosettori CNEL (14 + 4 pubblici)

La tassonomia ufficiale. Codice lettera → nome:

```
A  Agricoltura
B  Chimici (include Energia/Petrolio, Gomma Plastica, Farmaceutico)
C  Meccanici (include Metalmeccanici)
D  Tessili
E  Alimentaristi
F  Edilizia, Legno e Arredamento
G  Poligrafici e Spettacolo
H  Terziario e Servizi (include Commercio, Vigilanza, Turismo, Studi Professionali)
I  Lavoro Domestico
L  Trasporti
M  Credito e Assicurazioni (include Bancari)
N  Aziende di Servizi (include Elettrico, Telecomunicazioni, Multiservizi)
O  Istruzione, Sanità, Assistenza
P  Plurisettoriali
Q  Funzioni Centrali (PA)
R  Funzioni Locali (PA)
S  Sanità Pubblica
T  Scuola Pubblica
```

---

## Struttura URL da rispettare (SEO)

Queste URL DEVONO esistere identiche al sito WordPress originale:

### Pagine principali
```
/                              → Homepage (search bar + CCNL in evidenza + settori)
/contratti-ccnl                → Catalogo completo CCNL con search e filtri
/accordi                       → Lista accordi paginata
/settori                       → Tassonomia settori CNEL
/articoli                      → Blog index
/contatti                      → Pagina contatti
/pdf                           → Lista CCNL in PDF
/cookie-policy
/disclaimer
/privacy-policy
```

### 5 pagine CCNL guida (contenuto editoriale da `ccnl-guide/*.json`)
```
/commercio                           → Contenuto da commercio.json
/commercio/livelli                   → campo "livelli" del JSON
/commercio/tabelle-retributive       → campo "tabelle" del JSON
/commercio/preavviso                 → campo "preavviso" del JSON

/vigilanza-privata
/vigilanza-privata/livelli
/vigilanza-privata/tabelle-retributive

/metalmeccanici
/metalmeccanici/livelli
/metalmeccanici/tabelle-retributive

/energia-petrolio
/energia-petrolio/livelli
/energia-petrolio/tabelle-retributive

/lavoro-domestico
/lavoro-domestico/livelli
/lavoro-domestico/tabelle-retributive
```

### Route dinamiche
```
/ccnl/[slug]                  → Scheda CCNL dal catalogo (1032 record)
/settore/[slug]               → CCNL filtrati per macrosettore
/articoli/[categoria]         → Post filtrati per categoria blog
/[post-slug]                  → Singolo blog post (URL flat senza prefix)
```

---

## Cosa fare

### Step 1 — Data layer

Crea un file `data/db.ts` (o aggiorna `data/ccnl.ts`) che:
- Importa i JSON da `data/xml-export/`
- Espone funzioni async per query (pronte per essere sostituite con Supabase in futuro):
  - `getAllCCNL()`, `getCCNLBySlug()`, `getCCNLById()`, `searchCCNL(query)`
  - `getAllAccordi()`, `getAccordiByccnlId(ccnlId)`
  - `getCCNLGuide(slug)` — per le 5 pagine editoriali
  - `getAllPosts()`, `getPostBySlug()`, `getPostsByCategory()`
- Calcola lo stato del CCNL (vigente/scaduto) dalla data di scadenza
- Aggiorna i `macrosettori` con i count reali calcolati dai 1032 record
- Mappa il `settore_cod` alla struttura `Macrosettore` esistente

### Step 2 — Aggiorna i tipi

Aggiorna `types/ccnl.ts` per supportare sia i CCNL dal catalogo CNEL (dati strutturati senza contenuto) sia le guide editoriali (con contenuto lungo). Il tipo `CCNL` attuale ha campi come `sintesi`, `tabelleRetributive`, `entiBilaterali` che non esistono nei dati reali — adattali o rendili opzionali.

### Step 3 — Route per le 5 pagine guida

Crea una route dinamica per le pagine CCNL editoriali. Ogni pagina ha:
- Breadcrumb
- Scheda contratto (dati da `info` nel JSON)
- Contenuto testuale lungo (da `content` nel JSON), diviso in sezioni
- Table of contents laterale (desktop) con le sezioni
- Link a sotto-pagine (livelli, tabelle retributive)

Le sotto-pagine (`/[slug]/livelli`, `/[slug]/tabelle-retributive`) seguono lo stesso pattern.

Usa ISR (`export const revalidate = 86400`) invece di `generateStaticParams` — scalabile per quando aggiungeremo tutte le 18 pagine guida.

### Step 4 — Homepage e catalogo

- **Homepage (`/`):** mantieni il design attuale (HeroSection, StatsSection, SectorsSection) ma aggiorna i numeri con i dati reali (1032 CCNL, 2093 accordi, 18 macrosettori)
- **Pagina `/contratti-ccnl`:** lista/griglia di tutti i 1032 CCNL con search e filtri per settore e stato
- **Settori (`/settore/[slug]`):** aggiorna con i macrosettori reali CNEL

### Step 5 — Blog

Crea le route per il blog:
- `/articoli` — griglia dei 112 post pubblicati
- `/articoli/[categoria]` — filtro per categoria
- `/[post-slug]` — singolo post (URL flat)

I dati vengono da `blog-posts.json`.

### Step 6 — Accordi

- `/accordi` — lista paginata dei 2093 accordi con filtri (tipo, anno, CCNL collegato)
- Ogni accordo ha un link diretto al PDF su `static.cnel.it`
- Nella scheda CCNL (`/ccnl/[slug]`), mostra gli accordi collegati (filtrati per `ccnl_id`)

### Step 7 — SEO

- `generateMetadata()` per ogni pagina con title/description reali
- Per le pagine guida, sostituisci i template Yoast (%%title%%, %%currentyear%%, ecc.)
- Breadcrumb con JSON-LD `BreadcrumbList`
- FAQ schema sulla homepage
- `sitemap.ts` che genera tutte le URL
- `robots.ts`

---

## Cosa NON fare

- Non cambiare la palette colori, i font, o il design system
- Non cambiare le URL rispetto a quelle elencate sopra
- Non inventare contenuti — tutto viene dai JSON
- Non aggiungere features nuove (newsletter, login, commenti, dark mode)
- Non usare Framer Motion o animazioni pesanti
- Non installare dipendenze non necessarie
