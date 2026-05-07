# Handoff — ContrattiCCNL.it

## Guide estratte (18)

| Slug | Titolo | Codice CNEL | Sezioni |
|------|--------|-------------|---------|
| agricoltura-florovivaisti | CCNL Agricoltura, operai agricoli e florovivaisti | E00A | contenuto, livelli, tabelle |
| agricoltura-impiegati | CCNL Agricoltura - Impiegati agricoli | A021 | contenuto, livelli, tabelle |
| autoferrotranvieri | Contratto Autoferrotranvieri - Internavigatori | I022 | contenuto, tabelle, parametri |
| autoscuole | CCNL Autoscuole e scuole di Nautica | IC91 | contenuto, livelli, tabelle |
| bancari | CCNL Bancari - Contratto collettivo credito e banche | J2E0 | contenuto, livelli, tabelle |
| commercio | CCNL Commercio | H02X | contenuto, livelli, tabelle, preavviso |
| elettrico | CCNL Elettrico | B371 | contenuto, tabelle |
| energia-petrolio | Contratto Petrolio Energia | B254 | contenuto, livelli, tabelle |
| enti-pubblici | CCNL enti pubblici non economici - funzioni locali | H124 | contenuto, tabelle |
| gomma-plastica | CCNL Gomma plastica industria | B371 | contenuto, livelli, tabelle |
| lavoro-domestico | CCNL Lavoro Domestico, Colf e Badanti | H50X | contenuto, livelli, tabelle |
| metalmeccanici | CCNL Metalmeccanici | C011 | contenuto, livelli, tabelle |
| multiservizi | Contratto Nazionale Pulizie e Multiservizi | K511 | contenuto, livelli, tabelle |
| sanita | CCNL Sanità | T011 | contenuto, livelli, tabelle |
| studi-professionali | CCNL Studi Professionali | H475 | contenuto, livelli, tabelle |
| telecomunicazioni | CCNL Telecomunicazioni | K411 | contenuto, livelli, tabelle |
| turismo | CCNL Turismo, Agenzie di Viaggio e Servizi | H05Y | contenuto, livelli, tabelle |
| vigilanza-privata | Contratto Vigilanza Privata e Investigazioni | HV51 | contenuto, livelli, tabelle |

Pagine statiche estratte: `contatti`, `privacy-policy`, `disclaimer`, `cookie-policy`.

---

## Scelte tecniche rilevanti

### Estrazione XML
- **Fonte unica**: `ccnl.WordPress.2026-04-02.xml` (31 MB). Nessun dato inventato.
- **Slug da URL**: lo slug viene estratto dal campo `<link>` del post WP, non da `wp:post_name`. Questo perché per alcune guide (es. `sanita`, `enti-pubblici`) il post name in WP non corrisponde all'URL pubblico reale.
- **Sottopagine parent=0**: le sottopagine di `sanita` hanno `parent=0` nel database WP invece del parent ID corretto. Il matching viene fatto tramite path URL (`/sanita/livelli-mansioni-sanita/`), non tramite parent ID.
- **Pulizia HTML**: whitelist di tag (`h2 h3 h4 p ul ol li strong em a img table thead tbody tr td th blockquote br`). Tag strutturali WP (`div figure span section`) vengono "spacchettati" (mantenuto il contenuto interno). Tag rimossi del tutto: `script style noscript iframe button form svg`.
- **Commenti Gutenberg**: rimossi (`<!-- wp:... -->`).
- **Immagini**: tutte le immagini da `wp-content/uploads/` restituiscono 403 (il sito WP blocca l'hotlinking). Gli URL nei contenuti sono riscritti in `/uploads/` ma i file non sono scaricabili. Le immagini **non appaiono**.

### Architettura dati
- Ogni sezione (contenuto, livelli, tabelle, preavviso, parametri) è un campo `*_html` separato nel JSON. `null` se la sezione non esiste per quel contratto.
- I campi legacy `content`, `livelli`, `tabelle` sono stati mantenuti nel type per backward compat ma non sono più usati nel rendering.

### Rendering HTML
- `sanitize-html` lato server — nessuna stringa HTML grezza esposta al client senza sanitizzazione.
- `addHeadingIds` aggiunge `id` a h2/h3/h4 per l'anchor navigation (generato dallo slug del testo).
- Le tabelle vengono avvolte in un `div overflow-x-auto` per il mobile.
- Tipografia via classe `.prose-content` in `globals.css` (il plugin `@tailwindcss/typography` non è installato nel progetto).

### Dev server
- Il server va avviato con `next dev --webpack`. Turbopack causa un blocco indefinito in compilazione (bug NUD23) su questo progetto.

---

## Limitazioni note

| Problema | Causa | Stato |
|----------|-------|-------|
| Immagini non visibili | WordPress blocca hotlinking con 403 | Irrisolvibile senza accesso FTP/admin WP |
| `autoferrotranvieri` ha sezione `parametri` invece di `livelli` | Struttura del post WP diversa | Gestita — route `/autoferrotranvieri/parametri` esistente |
| Codice CNEL duplicato (`B371` per elettrico e gomma-plastica) | Dato presente così nel catalogo CNEL originale | Non è un bug del sito |
| Stato contratto derivato da data scadenza | Non c'è un campo "stato" esplicito nel WP | Vigente se non scaduto, in-rinnovo se scaduto da <12 mesi, scaduto altrimenti |

---

## URL testati

- `/commercio` — 12 h2, 1 tabella, badge "Scaduto", CNEL H02X
- `/bancari` — 18 h2, 8 tabelle
- `/bancari/livelli` — sezione livelli
- `/commercio/tabelle-retributive` — sezione tabelle
- `/privacy-policy`, `/disclaimer`, `/contatti`, `/cookie-policy` — pagine statiche
- `/contratti-ccnl` — lista con tutte le 18 guide
