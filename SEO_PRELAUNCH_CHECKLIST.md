# SEO Pre-Launch Checklist

> ⚠️ **NON PUBBLICARE IL SITO IN PRODUZIONE PRIMA DI AVER COMPLETATO QUESTA CHECKLIST.**
>
> Lo stato attuale del codice è volutamente **non indicizzabile** (robots disallow + meta noindex) per proteggere lo staging. Andare live senza i fix sotto = perdita totale del traffico organico (~20.000 visite/mese).

**Contesto:** migrazione da WordPress (attualmente live su contratticcnl.it) a Next.js 16. Il WordPress ha ranking consolidato che NON deve andare perso.

**Riferimenti tecnici:**
- [Next.js Rendering Strategies](https://nextjs.org/learn/seo/rendering-strategies)
- [Google JavaScript SEO Basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics?hl=it)

---

## 0. Premessa: perché Next.js è OK per la SEO

Il timore "JavaScript = male per SEO" era valido per i siti React-only di vecchia scuola (SPA che caricano HTML vuoto). Next.js in modalità SSG genera **HTML pre-renderizzato** in fase di build: Google riceve un documento HTML completo, identico a quello che produrrebbe WordPress. Nessuna penalizzazione.

**Strategia di rendering scelta:** Static Site Generation (SSG) con `generateStaticParams()` su tutte le route dinamiche.

---

## 1. BUG BLOCCANTI (devono essere risolti, altrimenti zero indicizzazione)

### [ ] 1.1 — Riabilitare crawling in `robots.txt`
**File:** [app/robots.ts](app/robots.ts)
**Stato attuale (linee 4–9):**
```typescript
return {
  rules: {
    userAgent: '*',
    disallow: '/',  // ← BLOCCA TUTTO
  },
}
```
**Da cambiare in:**
```typescript
return {
  rules: {
    userAgent: '*',
    allow: '/',
  },
  sitemap: 'https://www.contratticcnl.it/sitemap.xml',
}
```

### [ ] 1.2 — Rimuovere `noindex` dal layout root
**File:** [app/layout.tsx](app/layout.tsx#L27-L36)
**Stato attuale (linee 27–36):**
```typescript
robots: {
  index: false,        // ← NON INDICIZZA
  follow: false,       // ← NON SEGUE LINK
  nocache: true,
  googleBot: { index: false, follow: false, noimageindex: true },
}
```
**Da cambiare in:**
```typescript
robots: {
  index: true,
  follow: true,
  googleBot: { index: true, follow: true },
}
```

### [ ] 1.3 — Configurare `metadataBase` nel layout root
**File:** [app/layout.tsx](app/layout.tsx)
**Aggiungere all'oggetto `metadata`:**
```typescript
metadataBase: new URL('https://www.contratticcnl.it'),
```
> Senza questo, gli URL relativi in `openGraph`/`canonical` non funzionano correttamente.

### [ ] 1.4 — Mappare e configurare i redirect 301 da WordPress → Next.js
**Problema:** gli URL del WordPress usano pattern come `/ccnl/h341/20389/` (codice settore + ID accordo numerico). Il nuovo Next.js usa slug semantici come `/ccnl/metalmeccanici-industria/`. **1.000+ URL già indicizzati cambieranno** → tutti devono restituire 301.

**Step:**
1. Esportare la lista completa degli URL indicizzati da Google Search Console (Coverage → Export CSV)
2. Estrarre URL anche da WordPress sitemap e da `ccnl.WordPress.2026-04-02.xml`
3. Creare mapping CSV `(old_url, new_url)` per ogni URL
4. Generare la configurazione redirects in `next.config.mjs`:
```typescript
async redirects() {
  return [
    { source: '/ccnl/h341/20389/', destination: '/ccnl/metalmeccanici-industria', permanent: true },
    // ... uno per ogni URL del vecchio sito
  ]
}
```
> ⚠️ Se l'hosting finale è **vhosting (FTP statico)** o **Cloudflare Pages**, la sezione `redirects()` di Next.js NON funziona con `output: "export"`. In quel caso usare:
> - **Cloudflare Pages**: file `public/_redirects` (sintassi `/old-path /new-path 301`)
> - **vhosting / Apache**: file `public/.htaccess` con `RewriteRule`
> - **Netlify**: `public/_redirects`

### [ ] 1.5 — Aggiungere `alternates.canonical` su TUTTE le pagine
**Problema:** zero canonical in tutto il codice (`grep -r "canonical" app` → 0 risultati).
**Effetto se non risolto:** Google può considerare il sito duplicato del WordPress (durante il periodo di transizione in cui entrambi sono live).

**Pattern da applicare in ogni `generateMetadata`:**
```typescript
return {
  title: '...',
  description: '...',
  alternates: {
    canonical: `/percorso-pagina`,  // path relativo, metadataBase si aggiunge da solo
  },
  openGraph: { /* vedi 2.1 */ },
}
```

**Pagine da modificare (tutte i 19 page.tsx — vedi sezione 4):**
- [ ] `app/page.tsx` (homepage — vedi anche 1.6)
- [ ] `app/contratti-ccnl/page.tsx`
- [ ] `app/accordi/page.tsx`
- [ ] `app/articoli/page.tsx`
- [ ] `app/articoli/[categoria]/page.tsx`
- [ ] `app/pdf/page.tsx`
- [ ] `app/contatti/page.tsx`
- [ ] `app/privacy-policy/page.tsx`
- [ ] `app/cookie-policy/page.tsx`
- [ ] `app/disclaimer/page.tsx`
- [ ] `app/settori/page.tsx`
- [ ] `app/tabelle-retributive/page.tsx`
- [ ] `app/[slug]/page.tsx`
- [ ] `app/ccnl/[slug]/page.tsx`
- [ ] `app/[slug]/livelli/page.tsx`
- [ ] `app/[slug]/tabelle-retributive/page.tsx`
- [ ] `app/[slug]/preavviso/page.tsx`
- [ ] `app/[slug]/parametri/page.tsx`
- [ ] `app/[slug]/[postSlug]/page.tsx`

### [ ] 1.6 — Aggiungere metadata custom alla homepage
**File:** [app/page.tsx](app/page.tsx)
**Stato attuale:** non esporta `metadata` né `generateMetadata`. Eredita solo dal root layout (generico).
**Da aggiungere:**
```typescript
export const metadata: Metadata = {
  title: 'ContrattiCCNL.it — Archivio Online Contratti Collettivi Nazionali',
  description: 'Accedi a 1.032 CCNL e 2.000+ accordi di rinnovo. Ricerca, confronta e scarica i contratti collettivi. Database CNEL aggiornato.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'ContrattiCCNL.it — Archivio Online CCNL',
    description: '...',
    url: '/',
    type: 'website',
    images: [{ url: '/og-home.png', width: 1200, height: 630 }],
  },
}
```

---

## 1.bis CONVENZIONI DI CONTENUTO (richieste cliente)

### [ ] 1.bis.1 — Tutti i titoli in sentence case (no title case)

**Regola:** niente titoli stile americano con ogni parola in maiuscolo.

| ❌ NO | ✅ SÌ |
|---|---|
| CCNL Metalmeccanici: Testo Completo | CCNL metalmeccanici: testo completo |
| Tabelle Retributive Edilizia 2025 | Tabelle retributive edilizia 2025 |
| Guida Pratica Al Calcolo Tredicesima | Guida pratica al calcolo tredicesima |

Solo la prima lettera è maiuscola, più sigle (CCNL, INPS, CNEL, INAIL…) e nomi propri.

**Si applica a:**
- Tag `<title>` (meta-title) di ogni pagina
- `og:title` e Twitter card title
- h1 di pagina
- h2/h3 dei blocchi di contenuto
- Label dei link interni e breadcrumb
- Titoli delle card (CCNL, articoli, settori)
- Pulsanti / CTA con testo descrittivo lungo

**Da rivedere prima del go-live:**
- [ ] Audit di tutti i `metadata.title` e `generateMetadata` → verificare casing
- [ ] Audit dei titoli derivati dall'XML (es. `ccnl.nome`, `post.title`) → se l'XML li ha già in title case, applicare una normalizzazione in fase di estrazione/render
- [ ] Audit dei testi hardcoded nelle pagine (hero, sezioni home, label menu)

---

## 2. MIGLIORAMENTI NECESSARI (per non perdere traffico nel tempo)

### [ ] 2.1 — Open Graph + Twitter Card su tutte le pagine
**Problema:** zero `openGraph` in tutto il codice. Senza, le condivisioni social mostrano preview vuote → CTR e brand image penalizzati.

**Pattern in ogni `generateMetadata`:**
```typescript
openGraph: {
  title: '...',
  description: '...',
  url: `/percorso`,
  type: 'website',  // o 'article' per i post
  images: [{ url: '/og-image.png', width: 1200, height: 630 }],
},
twitter: {
  card: 'summary_large_image',
  title: '...',
  description: '...',
  images: ['/og-image.png'],
},
```

### [ ] 2.2 — `generateStaticParams` su tutte le route dinamiche
**Stato attuale:** presente solo su [app/settore/[slug]/page.tsx](app/settore/[slug]/page.tsx).
**Effetto se mancante:** le pagine vengono generate "on-demand" alla prima visita (più lento → Google crawla peggio).

**Da aggiungere su:**

```typescript
// app/ccnl/[slug]/page.tsx
export async function generateStaticParams() {
  return getAllCCNL().map(ccnl => ({ slug: ccnl.slug }))
}

// app/[slug]/page.tsx
export async function generateStaticParams() {
  return [
    ...getAllGuideSlugs().map(slug => ({ slug })),
    ...getAllCategories().map(cat => ({ slug: cat.slug })),
  ]
}

// app/[slug]/[postSlug]/page.tsx
export async function generateStaticParams() {
  return getAllPosts().map(post => ({
    slug: post.categories[0]?.slug,
    postSlug: post.slug,
  }))
}

// app/articoli/[categoria]/page.tsx
export async function generateStaticParams() {
  return getAllCategories().map(cat => ({ categoria: cat.slug }))
}

// app/[slug]/livelli, /tabelle-retributive, /preavviso, /parametri
export async function generateStaticParams() {
  return getAllCCNLSlugs().map(slug => ({ slug }))
}
```

### [ ] 2.3 — Schema.org JSON-LD: `Organization` + `WebSite`
**Stato attuale:** solo `BreadcrumbList` ([components/breadcrumb-jsonld.tsx](components/breadcrumb-jsonld.tsx)).
**Da creare:** `components/schema-jsonld.tsx` con `Organization` e `WebSite + SearchAction`. Inserire in [app/layout.tsx](app/layout.tsx).

```typescript
// Da inserire nel <body> di app/layout.tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ContrattiCCNL.it',
  url: 'https://www.contratticcnl.it',
  logo: 'https://www.contratticcnl.it/logo.png',
})}} />

<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: 'https://www.contratticcnl.it',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://www.contratticcnl.it/cerca?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
})}} />
```

### [ ] 2.4 — Schema.org JSON-LD: `Article` sui post
**File:** [app/[slug]/[postSlug]/page.tsx](app/%5Bslug%5D/%5BpostSlug%5D/page.tsx)
**Da aggiungere:** un componente `<ArticleJsonLd>` con tipo `Article` o `NewsArticle`, headline, datePublished, dateModified, author, image.

### [ ] 2.5 — Sitemap: includere pagina `/tabelle-retributive`
**File:** [app/sitemap.ts](app/sitemap.ts)
**Da verificare e aggiungere se mancante:** voce per la pagina statica `/tabelle-retributive`.

### [ ] 2.6 — Verifica Google Search Console
**File:** [app/layout.tsx](app/layout.tsx) — oggetto `metadata`
**Da aggiungere:**
```typescript
verification: {
  google: 'TUA-VERIFICATION-CODE-DA-GSC',
}
```
Codice ottenuto da Google Search Console → Property → Settings → Ownership verification → HTML tag.

### [ ] 2.7 — `output: "export"` (solo se hosting su Cloudflare Pages o vhosting)
**File:** [next.config.mjs](next.config.mjs)
**Da aggiungere se l'hosting è statico:**
```typescript
const nextConfig = {
  output: 'export',
  trailingSlash: true,  // per compatibilità con WordPress URL pattern
  // ...
}
```
> ⚠️ Con `output: "export"` la sezione `redirects()` non funziona → usare `_redirects` o `.htaccess` (vedi 1.4).
> ⚠️ Verificare che nessun componente usi `dynamic = 'force-dynamic'`, server actions, o middleware (incompatibili con export statico).

---

## 3. PROCEDURA DI GO-LIVE

### Fase A — Pre-deploy (su staging)
- [ ] Tutti i punti della sezione 1 completati
- [ ] Tutti i punti della sezione 2 completati
- [ ] `npm run build` completa senza errori
- [ ] Mapping CSV `(old_url, new_url)` validato (campione di 30+ URL testati)

### Fase B — Staging environment
- [ ] Deploy su dominio temporaneo (es. `staging.contratticcnl.it`) con `noindex` ATTIVO
- [ ] Crawl completo con [Screaming Frog](https://www.screamingfrog.co.uk/seo-spider/) → zero 404 interni, zero redirect chain
- [ ] Test 30+ URL del WordPress: ogni URL vecchio deve restituire 301 → nuovo URL corretto
- [ ] Validazione JSON-LD con [Rich Results Test](https://search.google.com/test/rich-results) di Google
- [ ] [PageSpeed Insights](https://pagespeed.web.dev/) → confronto WP vs nuovo (atteso: nuovo ≥ WP su tutti i Core Web Vitals)
- [ ] Verifica meta tag con [Meta Tags](https://metatags.io/) — preview Google + social

### Fase C — Go-live
- [ ] Riabilitare indicizzazione (1.1 + 1.2 già fatti = `index: true`, `allow: '/'`)
- [ ] Switch DNS: il nuovo sito risponde sul dominio principale
- [ ] Submit della nuova `sitemap.xml` in Google Search Console
- [ ] Forzare re-crawl dei top 50 URL via "Inspect URL → Request indexing"
- [ ] **Mantenere il vecchio WordPress disattivato ma NON eliminato** per almeno 30 giorni (rollback safety)

### Fase D — Monitoraggio post-launch (4–6 settimane)
- [ ] Check giornaliero Google Search Console: copertura, errori di crawl, posizionamenti
- [ ] **Atteso:** dip temporaneo di 1–2 settimane mentre Google ricrawla (normale)
- [ ] **Atteso:** dopo 3–4 settimane recupero ai livelli pre-migrazione, poi miglioramento dovuto a Core Web Vitals superiori
- [ ] Se a 6 settimane il traffico è ancora >20% sotto: investigare URL specifici in calo, verificare redirect, check anchor text dei backlink esterni

---

## 4. RIEPILOGO STATO METADATA per ogni page.tsx

| File | `generateMetadata` | canonical | OG | da fare |
|------|---|---|---|---|
| `app/page.tsx` | ❌ Nessun metadata | ❌ | ❌ | aggiungere TUTTO (1.6) |
| `app/contratti-ccnl/page.tsx` | static | ❌ | ❌ | + canonical + OG |
| `app/accordi/page.tsx` | static | ❌ | ❌ | + canonical + OG |
| `app/articoli/page.tsx` | static | ❌ | ❌ | + canonical + OG |
| `app/articoli/[categoria]/page.tsx` | dinamico | ❌ | ❌ | + canonical + OG + staticParams |
| `app/pdf/page.tsx` | static | ❌ | ❌ | + canonical + OG |
| `app/contatti/page.tsx` | static | ❌ | ❌ | + canonical + OG |
| `app/privacy-policy/page.tsx` | static | ❌ | ❌ | + canonical + OG |
| `app/cookie-policy/page.tsx` | static | ❌ | ❌ | + canonical + OG |
| `app/disclaimer/page.tsx` | static | ❌ | ❌ | + canonical + OG |
| `app/settori/page.tsx` | static | ❌ | ❌ | + canonical + OG |
| `app/tabelle-retributive/page.tsx` | static | ❌ | ❌ | + canonical + OG + sitemap |
| `app/[slug]/page.tsx` | dinamico | ❌ | ❌ | + canonical + OG + staticParams |
| `app/ccnl/[slug]/page.tsx` | dinamico | ❌ | ❌ | + canonical + OG + staticParams |
| `app/[slug]/livelli/page.tsx` | dinamico | ❌ | ❌ | + canonical + OG + staticParams |
| `app/[slug]/tabelle-retributive/page.tsx` | dinamico | ❌ | ❌ | + canonical + OG + staticParams |
| `app/[slug]/preavviso/page.tsx` | dinamico | ❌ | ❌ | + canonical + OG + staticParams |
| `app/[slug]/parametri/page.tsx` | dinamico | ❌ | ❌ | + canonical + OG + staticParams |
| `app/[slug]/[postSlug]/page.tsx` | dinamico | ❌ | ❌ | + canonical + OG + staticParams + Article JSON-LD |

---

## 5. STIMA TEMPI

| Sezione | Tempo |
|---|---|
| Bug bloccanti (1.1 → 1.6) | 2–3 ore |
| Migration 301 mapping (1.4) | 1–2 ore (dipende dal numero di URL) |
| Miglioramenti (2.1 → 2.7) | 3–4 ore |
| Staging + testing (Fase B) | 1 giornata |
| **Totale tecnico:** | **6–8 ore di lavoro + 1 giornata di test** |

---

## 6. NOTE FINALI

- I bug 1.1 e 1.2 sono volutamente attivi durante lo sviluppo per evitare che Google indicizzi versioni di staging. **NON rimuoverli prima del go-live**, ma **DEVONO** essere rimossi al go-live.
- Il vecchio WordPress dovrà restare offline ma backup-ato per almeno 30 giorni dopo il deploy.
- Il dip post-migrazione di 1–2 settimane è normale e non va confuso con un fallimento della migrazione.

---

**Ultimo aggiornamento audit:** 2026-05-07
