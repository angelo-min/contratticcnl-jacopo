# PROJECT_REPORT.md — ContrattiCCNL.it

> Generato il: 2026-03-22
> Progetto: Archivio gratuito dei Contratti Collettivi Nazionali del Lavoro italiani

---

## 1. STACK TECNICO

### Framework & Runtime
| Layer | Tecnologia | Versione |
|---|---|---|
| Framework | Next.js (App Router) | 16.1.6 |
| UI Library | React | 19.2.4 |
| Language | TypeScript | 5.7.3 |
| Package Manager | pnpm | (lock file presente) |

### UI & Styling
| Libreria | Versione | Scopo |
|---|---|---|
| Tailwind CSS | 4.2.0 | Utility-first CSS |
| @tailwindcss/postcss | — | Plugin PostCSS per Tailwind v4 |
| shadcn/ui | 4.0.0 | Libreria componenti (45+ componenti) |
| Radix UI | varie | Headless UI primitives |
| Lucide React | 0.564.0 | Libreria icone |
| tailwind-merge | 3.3.1 | Merge classi Tailwind senza conflitti |
| tailwindcss-animate | 1.0.7 | Animazioni CSS |
| clsx | 2.1.1 | Gestione classi condizionali |
| next-themes | 0.4.6 | Dark mode |

### Form & Validazione
| Libreria | Versione | Scopo |
|---|---|---|
| react-hook-form | 7.54.1 | Form handling performante |
| @hookform/resolvers | 3.9.1 | Adattatori schema validation |
| Zod | 3.24.1 | Schema validation TypeScript-first |

### UI Components Specializzati
| Libreria | Versione | Scopo |
|---|---|---|
| Embla Carousel | 8.6.0 | Carosello/slider |
| React Resizable Panels | 2.1.7 | Layout con pannelli ridimensionabili |
| Recharts | 2.15.0 | Grafici e visualizzazioni dati |
| Sonner | 1.7.1 | Toast notifications |
| cmdk | 1.1.1 | Command palette |
| Vaul | 1.1.2 | Drawer component |
| date-fns | 4.1.0 | Utilità date |
| input-otp | 1.4.2 | Input OTP |

### Analytics & Infrastruttura
| Servizio | Libreria | Note |
|---|---|---|
| Vercel Analytics | @vercel/analytics 1.6.1 | Web vitals e traffico |
| Hosting target | Vercel | Implicito dall'analytics |

### Database
**Nessun database.** Tutti i dati sono statici e hardcodati in `data/ccnl.ts`.

### CMS
**Nessun CMS.** Nessuna integrazione con Contentful, Sanity, WordPress, ecc.

### Autenticazione
**Nessuna.** Nessun sistema di login/registrazione utenti.

---

## 2. STRUTTURA DEL PROGETTO

```
/contratticcnl/
│
├── app/                          # Next.js App Router — pagine e layout
│   ├── layout.tsx                # Root layout: font Google, metadata globale, Analytics
│   ├── page.tsx                  # Homepage
│   ├── globals.css               # CSS globale con variabili tema (light/dark)
│   ├── cerca/
│   │   └── page.tsx              # Pagina ricerca CCNL con filtri
│   ├── tabelle-retributive/
│   │   └── page.tsx              # Browser tabelle retributive
│   ├── settore/
│   │   └── [slug]/
│   │       └── page.tsx          # Pagina dettaglio settore (dinamica)
│   └── ccnl/
│       └── [slug]/
│           ├── page.tsx          # Pagina dettaglio CCNL (dinamica)
│           └── tabelle-retributive/
│               └── page.tsx      # Tabelle retributive CCNL specifico
│
├── components/                   # Componenti React
│   ├── header.tsx                # Header sticky con navigazione responsive
│   ├── footer.tsx                # Footer multi-colonna con link
│   ├── search-bar.tsx            # Input di ricerca (variante large e compact)
│   ├── status-badge.tsx          # Badge stato contratto (vigente/scaduto/in-rinnovo)
│   ├── ccnl-card.tsx             # Card CCNL (varianti default e compact)
│   ├── sector-card.tsx           # Card settore cliccabile
│   ├── theme-provider.tsx        # Contesto dark mode (next-themes)
│   │
│   ├── home/                     # Sezioni specifiche homepage
│   │   ├── hero-section.tsx      # Hero con search bar e tag suggeriti
│   │   ├── stats-section.tsx     # Statistiche (1017 CCNL, 2000+ accordi, 14 settori)
│   │   ├── sectors-section.tsx   # Griglia settori
│   │   └── latest-updates-section.tsx  # Ultimi aggiornamenti
│   │
│   ├── ccnl/                     # Componenti pagina dettaglio CCNL
│   │   ├── ccnl-header.tsx       # Header con breadcrumb, firmatari, pulsanti download
│   │   ├── ccnl-tabs.tsx         # Sistema a tab (5 tab: sintesi, tabelle, accordi, enti, PDF)
│   │   ├── ccnl-pdf-viewer.tsx   # Visualizzatore PDF
│   │   └── related-contracts.tsx # Sidebar contratti correlati
│   │
│   ├── search/                   # Componenti ricerca
│   │   ├── search-filters.tsx    # Sidebar filtri (macrosettore, stato)
│   │   └── search-results.tsx    # Griglia risultati con stato vuoto
│   │
│   ├── tabelle/                  # Componenti tabelle retributive
│   │   ├── tabelle-card.tsx      # Card tabella retributiva
│   │   ├── tabelle-confronto.tsx # Vista comparazione tabelle
│   │   ├── tabelle-filters.tsx   # Filtri per tabelle
│   │   └── tabelle-page-content.tsx  # Layout pagina tabelle
│   │
│   ├── sector/
│   │   └── sector-sidebar.tsx    # Sidebar settori correlati
│   │
│   └── ui/                       # shadcn/ui — 45+ componenti pre-built
│       ├── button.tsx, badge.tsx, card.tsx, dialog.tsx, drawer.tsx
│       ├── tabs.tsx, table.tsx, form.tsx, input.tsx, select.tsx
│       ├── accordion.tsx, breadcrumb.tsx, pagination.tsx, checkbox.tsx
│       ├── alert.tsx, alert-dialog.tsx, toast.tsx, toaster.tsx
│       ├── dropdown-menu.tsx, context-menu.tsx, command.tsx
│       ├── popover.tsx, hover-card.tsx, tooltip.tsx, navigation-menu.tsx
│       ├── aspect-ratio.tsx, avatar.tsx, calendar.tsx, carousel.tsx, chart.tsx
│       ├── separator.tsx, scroll-area.tsx, sheet.tsx, sidebar.tsx
│       └── [altri ~20 componenti shadcn]
│
├── data/
│   └── ccnl.ts                   # Tutti i dati CCNL statici + funzioni helper
│
├── types/
│   └── ccnl.ts                   # Definizioni TypeScript (CCNL, Macrosettore, ecc.)
│
├── lib/
│   ├── utils.ts                  # Utility: cn() per merge classi Tailwind
│   └── format.ts                 # Formattazione valuta (€) e date in italiano
│
├── hooks/
│   ├── use-mobile.ts             # Hook media query per rilevamento mobile
│   └── use-toast.ts              # Hook toast notifications (Sonner)
│
├── public/                       # Asset statici
│   ├── icon.svg                  # Logo SVG
│   ├── icon-light-32x32.png      # Favicon modalità chiara
│   ├── icon-dark-32x32.png       # Favicon modalità scura
│   ├── apple-icon.png            # Apple touch icon
│   └── placeholder-*.png/svg     # Immagini placeholder
│
├── package.json                  # Dipendenze e script npm
├── tsconfig.json                 # Configurazione TypeScript
├── tailwind.config.ts            # Configurazione Tailwind CSS
├── next.config.mjs               # Configurazione Next.js
├── postcss.config.mjs            # Configurazione PostCSS
├── components.json               # Configurazione shadcn/ui
└── .gitignore                    # Regole ignore (include pattern v0)
```

---

## 3. PAGINE E ROUTE

### Route Implementate

| Route | File | Generazione | Descrizione |
|---|---|---|---|
| `/` | `app/page.tsx` | Statica | Homepage: hero search, statistiche piattaforma, griglia 14 settori, ultimi 5 aggiornamenti |
| `/cerca` | `app/cerca/page.tsx` | Statica (CSR filtri) | Ricerca CCNL: query full-text + filtri macrosettore + filtri stato contratto + griglia risultati |
| `/tabelle-retributive` | `app/tabelle-retributive/page.tsx` | Statica | Browser di tutte le tabelle retributive disponibili con filtri |
| `/settore/[slug]` | `app/settore/[slug]/page.tsx` | SSG (14 slug) | Dettaglio settore: breadcrumb, descrizione, lista CCNL del settore, sidebar |
| `/ccnl/[slug]` | `app/ccnl/[slug]/page.tsx` | SSG (18 slug) | Dettaglio CCNL: header (firmatari, date), tab (sintesi / tabelle / accordi / enti bilaterali / testo PDF), sidebar correlati |
| `/ccnl/[slug]/tabelle-retributive` | `app/ccnl/[slug]/tabelle-retributive/page.tsx` | SSG (subset) | Tabelle retributive storiche del CCNL: multiple versioni con decorrenza, livelli, importi |

### Route Previste ma NON Implementate (link nel footer)

| Route | Riferimento | Stato |
|---|---|---|
| `/chi-siamo` | `components/footer.tsx` | Non esiste la pagina |
| `/contatti` | `components/footer.tsx` | Non esiste la pagina |
| `/privacy` | `components/footer.tsx` | Non esiste la pagina |
| `/termini` | `components/footer.tsx` | Non esiste la pagina |

### API Routes
**Nessuna.** Non ci sono file in `app/api/`. Tutta la logica dati è client-side con dati statici.

### Parametri `generateStaticParams`
- **Settori**: genera 14 slug dal array `macrosettori` in `data/ccnl.ts`
- **CCNL**: genera 18 slug dal array `ccnlData` in `data/ccnl.ts`
- **Tabelle retributive CCNL**: genera slug solo per contratti che hanno `tabelleRetributive`

---

## 4. MODELLI DATI

> Tutti i tipi sono definiti in `types/ccnl.ts`. Non esiste un database — i dati vivono in `data/ccnl.ts`.

### `CCNL` (entità principale)
```typescript
interface CCNL {
  id: string                          // Identificatore univoco (es: "metalmeccanico-industria")
  slug: string                        // URL slug (es: "metalmeccanico-industria")
  nome: string                        // Nome completo (es: "CCNL Metalmeccanico Industria")
  settore: string                     // Nome settore leggibile (es: "Metalmeccanico")
  macrosettore: string                // Slug macrosettore (es: "metalmeccanico")
  dataFirma: string                   // Data firma ISO (es: "2024-02-05")
  dataScadenza: string                // Data scadenza ISO
  stato: CCNLStatus                   // 'vigente' | 'scaduto' | 'in-rinnovo'
  firmatariDatori: string[]           // Associazioni datoriali (es: ["Federmeccanica", "Assistal"])
  firmatariSindacati: string[]        // Organizzazioni sindacali (es: ["FIM-CISL", "FIOM-CGIL"])
  descrizione: string                 // Descrizione estesa del contratto
  urlPdf: string                      // Path al PDF (es: "/documenti/ccnl-metalmeccanico.pdf")
  sintesi?: string                    // Testo di sintesi opzionale
  tabelleRetributive?: TabellaRetributiva[]    // Array tabelle salariali storiche
  accordiRinnovo?: AccordoRinnovo[]   // Array accordi di rinnovo
  entiBilaterali?: EnteBilaterale[]   // Array enti bilaterali (fondi pensione, sanitari)
}
```

### `CCNLStatus`
```typescript
type CCNLStatus = 'vigente' | 'scaduto' | 'in-rinnovo'
```

### `TabellaRetributiva`
```typescript
interface TabellaRetributiva {
  id: string              // Identificatore univoco tabella
  decorrenza: string      // Data decorrenza ISO (es: "2024-01-01")
  note?: string           // Note opzionali sulla tabella
  voci: VoceRetributiva[] // Array livelli retributivi
}
```

### `VoceRetributiva`
```typescript
interface VoceRetributiva {
  livello: string         // Livello contrattuale (es: "1", "2", "5S", "Q")
  minimoTabellare: number // Minimo contrattuale mensile lordo (€)
  contingenza: number     // Indennità di contingenza (€)
  edr: number             // Elemento Distinto della Retribuzione (€)
  totale: number          // Totale lordo mensile = minimo + contingenza + edr (€)
}
```

### `AccordoRinnovo`
```typescript
interface AccordoRinnovo {
  id: string
  data: string            // Data accordo ISO
  titolo: string          // Titolo breve accordo
  descrizione: string     // Descrizione contenuto
}
```

### `EnteBilaterale`
```typescript
interface EnteBilaterale {
  id: string
  nome: string            // Es: "Cometa", "Metasalute"
  tipo: string            // Es: "Fondo Pensione", "Fondo Sanitario"
  descrizione: string
}
```

### `Macrosettore`
```typescript
interface Macrosettore {
  slug: string            // Identificatore URL (es: "metalmeccanico")
  nome: string            // Nome visualizzato (es: "Metalmeccanico")
  icona: string           // Emoji (es: "⚙️")
  descrizione: string     // Descrizione breve settore
  numeroContratti: number // Conteggio CCNL nel settore
}
```

### Dati Attuali in `data/ccnl.ts`
- **14 macrosettori** definiti
- **18 contratti CCNL** con dati completi
- Ogni CCNL ha: 2-3 tabelle retributive storiche, 1-2 accordi di rinnovo, 0-2 enti bilaterali
- Funzioni helper esportate:
  - `getCCNLBySlug(slug: string): CCNL | undefined`
  - `getCCNLByMacrosettore(macrosettoreSlug: string): CCNL[]`
  - `getMacrosettoreBySlug(slug: string): Macrosettore | undefined`
  - `searchCCNL(query: string): CCNL[]` — full-text su nome, settore, descrizione, firmatari
  - `getCCNLWithTabelle(): CCNL[]`
  - `getLatestUpdates(count: number): CCNL[]` — ordina per dataFirma decrescente

---

## 5. FUNZIONALITÀ IMPLEMENTATE

### Core Features
- **Ricerca full-text** per nome, settore, firmatari, descrizione (`searchCCNL()`)
- **Filtri combinati**: macrosettore (multiselect checkbox) + stato contratto (vigente/in-rinnovo/scaduto)
- **Browse per settore**: 14 macrosettori con conteggio contratti
- **Scheda dettaglio CCNL** con 5 tab:
  - Sintesi testuale
  - Tabelle retributive (multiple versioni storiche con importi per livello)
  - Accordi di rinnovo cronologici
  - Enti bilaterali (fondi pensione, fondi sanitari)
  - Testo contratto (PDF viewer)
- **Tabelle retributive**: vista dedicata per livelli, confronto storico, formattazione valuta italiana (€)
- **Stato contratto**: badge visivi per vigente (verde), in-rinnovo (arancione), scaduto (grigio)
- **Contratti correlati**: sidebar con altri contratti dello stesso macrosettore

### UI/UX
- **Design responsive** mobile-first (breakpoint sm/md/lg/xl/2xl)
- **Dark mode** con toggle persistente (localStorage via next-themes)
- **Navigazione breadcrumb** su tutte le pagine interne
- **Header sticky** con backdrop blur
- **Favicon adattivo** light/dark mode (2 versioni PNG)
- **Formattazione italiana** date (es: "5 febbraio 2024") e valuta (es: "€ 1.234,56")

### Performance
- **Static Site Generation (SSG)** per tutte le route
- **`generateStaticParams`** su ogni route dinamica (pre-rendering build-time)
- **Nessuna chiamata API runtime** — dati già incorporati nel bundle

### SEO
- **Metadata statica** per ogni pagina (title, description, keywords, OG tags)
- **Metadata dinamica** per pagine settore e CCNL (generate da dati contratto)
- **Open Graph** per condivisione social
- **Theme color**: `#9B2335`
- **Font ottimizzati**: caricamento tramite `next/font/google`

### Analytics
- Vercel Analytics integrato in `app/layout.tsx` (`<Analytics />`)

---

## 6. FUNZIONALITÀ PREVISTE MA NON IMPLEMENTATE

### Pagine Mancanti (link nel footer senza pagina)
| Pagina | Path | Note |
|---|---|---|
| Chi siamo | `/chi-siamo` | Link presente in `components/footer.tsx`, pagina assente |
| Contatti | `/contatti` | Link presente in `components/footer.tsx`, pagina assente |
| Privacy Policy | `/privacy` | Link presente in `components/footer.tsx`, pagina assente |
| Termini di utilizzo | `/termini` | Link presente in `components/footer.tsx`, pagina assente |

### Documenti PDF
- I campi `urlPdf` in ogni CCNL puntano a percorsi `/documenti/ccnl-*.pdf`
- **Nessun file PDF reale** è presente in `public/documenti/`
- Il componente `ccnl-pdf-viewer.tsx` è implementato ma non ha documenti reali da mostrare

### Dati Statici vs Database
- **18 contratti hardcodati**: non è possibile aggiungere/modificare contratti senza modificare il codice
- **Nessun backend**: impossibile aggiornare i dati senza un nuovo deploy
- **Nessuna paginazione server-side**: la ricerca lavora sull'intero dataset in memoria

### Componenti Scaffolded/Inutilizzati
- `components/ui/` contiene ~45 componenti shadcn/ui, molti dei quali non sono utilizzati nelle pagine attuali (es: `calendar.tsx`, `carousel.tsx`, `chart.tsx`, `input-otp.tsx`, `resizable.tsx`, ecc.). Sono stati installati come libreria standard ma non tutti integrati.

### Funzionalità Non Presenti (probabile roadmap)
- Form di contatto (`/contatti`)
- Newsletter / email subscription
- Sistema di commenti o feedback utenti
- Account utente / area riservata
- Notifiche rinnovi contratto
- API pubblica per i dati CCNL
- CMS per aggiornamento contratti senza deploy
- Confronto diretto tra più CCNL
- Export dati in CSV/Excel

---

## 7. AUTOMAZIONI

**Nessuna automazione presente.** Il progetto è interamente statico:

- Nessuno script di scraping dati
- Nessun cron job
- Nessuna pipeline dati
- Nessun task di build automatizzato oltre ai comandi standard Next.js (`dev`, `build`, `start`, `lint`)
- Nessun webhook o integrazione CI/CD configurata (nessun file `.github/workflows/`)

### Script `package.json`
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

---

## 8. INTEGRAZIONI ESTERNE

### Analytics
| Servizio | Integrazione | File | Stato |
|---|---|---|---|
| Vercel Analytics | `@vercel/analytics/next` | `app/layout.tsx` | Attivo |

### Tipografia / Font
| Servizio | Font | Caricamento | File |
|---|---|---|---|
| Google Fonts (via next/font) | Playfair Display | Automatico | `app/layout.tsx` |
| Google Fonts (via next/font) | Source Sans 3 | Automatico | `app/layout.tsx` |

### Link Istituzionali Esterni (nel footer/pagine)
| Ente | URL | Scopo |
|---|---|---|
| CNEL | Link archivio ufficiale | Fonte originale contratti |
| INPS | inps.it | Previdenza sociale |
| Ministero del Lavoro | lavoro.gov.it | Normativa lavoro |
| INAIL | inail.it | Assicurazioni occupazionali |

### Integrazioni NON Presenti (ma comuni per questo tipo di sito)
- Google Analytics / GA4
- Google AdSense o altri sistemi pubblicitari
- Sistema di affiliate marketing
- Email marketing (Mailchimp, Brevo, ecc.)
- CRM
- Chat live / chatbot
- Cookie consent manager

---

## 9. DESIGN SYSTEM

### Palette Colori

#### Modalità Chiara (Light)
| Token | Valore Hex | Descrizione |
|---|---|---|
| `--background` | `#FAF8F5` | Crema calda — sfondo principale |
| `--foreground` | `#1C1917` | Quasi-nero — testo principale |
| `--primary` | `#9B2335` | Cremisi scuro — colore brand principale |
| `--primary-foreground` | `#FEFCFB` | Bianco crema — testo su primario |
| `--secondary` | `#F5F0EB` | Bianco sporco — sfondo secondario |
| `--muted` | `#F0EBE4` | Beige chiaro — sfondi muted |
| `--border` | `#E7E0D8` | Beige-tan — bordi e divisori |
| `--card` | `#FFFFFF` | Bianco puro — sfondo cards |

#### Modalità Scura (Dark)
| Token | Valore Hex | Descrizione |
|---|---|---|
| `--background` | `#1C1917` | Quasi-nero caldo |
| `--foreground` | `#F5F0EB` | Bianco crema |
| `--primary` | `#E8A0A0` | Rosa pallido — accento in dark mode |
| `--border` | `#44403C` | Grigio-marrone scuro |

#### Colori Stato Contratto
| Stato | Token | Valore Hex | Colore |
|---|---|---|---|
| Vigente | `--status-vigente` | `#166534` | Verde foresta |
| In Rinnovo | `--status-in-rinnovo` | `#B45309` | Arancione bruciato |
| Scaduto | `--status-scaduto` | `#78716C` | Grigio neutro |

### Tipografia
| Ruolo | Font | Pesi | Fonte |
|---|---|---|---|
| Titoli (heading) | Playfair Display | 700, 800, 900 | Google Fonts |
| Corpo (body) | Source Sans 3 | 400, 500, 600, 700 | Google Fonts |
| Monospace (fallback) | Geist Mono | — | Sistema |

### Layout & Spaziatura
- **Container max-width**: `max-w-7xl` (80rem / 1280px)
- **Grid system**: Tailwind CSS grid, da 1 a 5 colonne responsive
- **Gap standard**: 4/6/8 unità Tailwind
- **Padding pagina**: `px-4 sm:px-6 lg:px-8`
- **Raggio border**: variabile CSS `--radius` (arrotondamenti morbidi)

### Responsive Breakpoints (Tailwind defaults)
| Nome | Valore |
|---|---|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

### Componenti UI Chiave
| Componente | File | Varianti |
|---|---|---|
| CCNLCard | `components/ccnl-card.tsx` | default, compact |
| SectorCard | `components/sector-card.tsx` | — |
| StatusBadge | `components/status-badge.tsx` | vigente, in-rinnovo, scaduto |
| SearchBar | `components/search-bar.tsx` | large (hero), compact (header) |
| Button | `components/ui/button.tsx` | default, outline, ghost, link, destructive, secondary |
| Badge | `components/ui/badge.tsx` | default, secondary, outline, destructive |

### Animazioni
- Transizioni hover: 200ms ease
- Tailwind CSS animate (fade, slide, bounce, accordion expand)
- Backdrop blur su header sticky

---

## 10. SEO

### Metadata per Pagina

| Pagina | Title | Description | Keywords |
|---|---|---|---|
| Homepage | "ContrattiCCNL.it - Archivio Contratti Collettivi Nazionali del Lavoro" | "Archivio gratuito di oltre 1.000 CCNL e 2.000 accordi di rinnovo..." | CCNL, contratti collettivi, lavoro, rinnovo contratti... |
| `/cerca` | "Cerca CCNL \| ContrattiCCNL.it" | dinamica | — |
| `/tabelle-retributive` | "Tabelle retributive CCNL \| ContrattiCCNL.it" | "Consulta e confronta le tabelle retributive..." | — |
| `/settore/[slug]` | "[Nome Settore] - CCNL \| ContrattiCCNL.it" | dinamica da dati settore | — |
| `/ccnl/[slug]` | "[Nome CCNL] \| ContrattiCCNL.it" | `ccnl.descrizione` | — |

### Open Graph
- `og:title`, `og:description` su tutte le pagine
- Configurati in `app/layout.tsx` e nelle singole `generateMetadata()`

### Favicon
- SVG: `public/icon.svg`
- 32×32 PNG light: `public/icon-light-32x32.png`
- 32×32 PNG dark: `public/icon-dark-32x32.png`
- Apple Touch Icon: `public/apple-icon.png`
- Theme color: `#9B2335`

### Struttura URL
- **Settori**: `/settore/metalmeccanico`, `/settore/commercio`, ecc. — URL leggibili, slug lowercase-hyphen
- **CCNL**: `/ccnl/metalmeccanico-industria`, `/ccnl/commercio-confcommercio`, ecc.
- **Tabelle**: `/ccnl/metalmeccanico-industria/tabelle-retributive` — URL gerarchico

### Sitemap
**Non presente.** Nessun file `sitemap.xml` o `app/sitemap.ts`.

### Robots.txt
**Non presente.** Nessun file `public/robots.txt` o `app/robots.ts`.

### Structured Data (JSON-LD)
**Non presente.** Nessun markup schema.org (potenzialmente utile per `Article`, `Dataset`, `Table`).

### Punti SEO Mancanti
| Feature | Stato | Note |
|---|---|---|
| `sitemap.xml` | Mancante | Da implementare con `app/sitemap.ts` |
| `robots.txt` | Mancante | Da aggiungere in `public/robots.txt` |
| JSON-LD structured data | Mancante | Utile per contratti, tabelle, FAQ |
| Canonical URL | Non verificato | Raccomandato per evitare duplicati |
| hreflang | N/A | Solo italiano, non necessario |

---

## 11. PERFORMANCE E INFRASTRUTTURA

### Strategia di Rendering
| Tipo | Tecnica | Dettaglio |
|---|---|---|
| Tutte le pagine | Static Site Generation (SSG) | Build-time con `generateStaticParams` |
| Filtri/Ricerca | Client-side rendering | Stato React, nessuna richiesta server |
| Temi dark/light | Client-side | next-themes con localStorage |

### Configurazione Next.js (`next.config.mjs`)
```javascript
{
  typescript: {
    ignoreBuildErrors: true   // ⚠️ Sopprime errori TypeScript in build
  },
  images: {
    unoptimized: true         // Disabilita ottimizzazione immagini Next.js
  }
}
```
> **Nota**: `ignoreBuildErrors: true` è rischioso in produzione — potrebbe mascherare errori reali.

### CSS & Bundle
- **Tailwind CSS v4**: genera solo le classi usate (tree-shaking automatico)
- **PostCSS**: plugin `@tailwindcss/postcss` per processare CSS
- **CSS Variables**: tema basato su custom properties, nessun overhead JS per switch tema
- Bundle ottimizzato da Next.js (code splitting automatico per route)

### Font
- Font Google caricati tramite `next/font/google` (ottimizzati, self-hosted automaticamente, no layout shift)

### Immagini
- `images: { unoptimized: true }` — le immagini non vengono ottimizzate da Next.js
- Solo placeholder PNG presenti (`public/placeholder-*.png`)
- Favicon in doppia versione (light/dark) gestita via CSS/browser hint

### Caching
- **Nessun caching esplicito configurato** (Redis, ISR, ecc.)
- Le pagine SSG sono già statiche — il caching è a carico del CDN Vercel

### Hosting / Deploy
| Layer | Tecnologia | Note |
|---|---|---|
| Hosting | Vercel (target implicito) | `@vercel/analytics` è l'indicatore principale |
| CDN | Vercel Edge Network | Automatico con Vercel |
| CI/CD | Non configurato | Nessun file `.github/workflows/` presente |

### Monitoring
- Vercel Analytics: traccia page views, web vitals (LCP, FID, CLS), traffico

### Aree di Miglioramento Performance
| Area | Problema Attuale | Soluzione Raccomandata |
|---|---|---|
| `images.unoptimized` | Immagini non ottimizzate | Rimuovere flag o usare CDN immagini |
| `ignoreBuildErrors` | Errori TS silenziati | Correggere gli errori e rimuovere il flag |
| Nessuna ISR | Dati aggiornabili solo con deploy | Aggiungere ISR se si introduce un backend |
| Dati statici | 18 contratti hardcodati | Database + API per scalabilità |
| Nessun sitemap | Crawlability limitata | Aggiungere `app/sitemap.ts` |

---

## APPENDICE: CONTRATTI CCNL NEL DATABASE

| # | Slug | Nome | Macrosettore | Stato |
|---|---|---|---|---|
| 1 | `metalmeccanico-industria` | CCNL Metalmeccanico Industria | metalmeccanico | vigente |
| 2 | `commercio-confcommercio` | CCNL Commercio Confcommercio | commercio | vigente |
| 3 | `bancario-abi` | CCNL Bancario ABI | bancario | vigente |
| 4 | `chimico-farmaceutico` | CCNL Chimico Farmaceutico | chimico | in-rinnovo |
| 5 | `edilizia-ance` | CCNL Edilizia ANCE | edilizia | vigente |
| 6 | `sanita-privata` | CCNL Sanità Privata | sanità | scaduto |
| 7 | `trasporti-logistica` | CCNL Trasporti e Logistica | trasporti | vigente |
| 8 | `alimentare` | CCNL Alimentare | alimentare | vigente |
| 9 | `turismo-federalberghi` | CCNL Turismo | turismo | vigente |
| 10 | `gomma-plastica` | CCNL Gomma e Plastica | chimico | in-rinnovo |
| 11 | `tessile-abbigliamento` | CCNL Tessile Abbigliamento | tessile | vigente |
| 12 | `elettrico` | CCNL Elettrico | energia | in-rinnovo |
| 13 | `scuola-privata` | CCNL Scuola Privata | istruzione | vigente |
| 14 | `assicurazioni-ania` | CCNL Assicurazioni ANIA | assicurazioni | in-rinnovo |
| 15 | `pubblici-esercizi` | CCNL Pubblici Esercizi FIPE | turismo | vigente |
| 16 | `cooperative-sociali` | CCNL Cooperative Sociali | sociale | vigente |
| 17 | `artigianato-meccanica` | CCNL Artigianato Meccanica | metalmeccanico | vigente |
| 18 | `agricoltura` | CCNL Agricoltura | agricoltura | in-rinnovo |
