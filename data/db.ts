import type {
  CCNL,
  CCNLRecord,
  CCNLStatus,
  AccordoRecord,
  PostRecord,
  CCNLGuideContent,
  Macrosettore,
} from '@/types/ccnl'

import ccnlCatalogRaw from './xml-export/ccnl-catalog.json'
import accordiRaw from './xml-export/accordi.json'
import blogPostsRaw from './xml-export/blog-posts.json'

// Guide editoriali — importate staticamente (5 file)
import guideCommercio from './xml-export/ccnl-guide/commercio.json'
import guideVigilanza from './xml-export/ccnl-guide/vigilanza-privata.json'
import guideMetalmeccanici from './xml-export/ccnl-guide/metalmeccanici.json'
import guideEnergia from './xml-export/ccnl-guide/energia-petrolio.json'
import guideLavoroDomestico from './xml-export/ccnl-guide/lavoro-domestico.json'

// ---------------------------------------------------------------------------
// Raw data
// ---------------------------------------------------------------------------

const ccnlCatalog = ccnlCatalogRaw as CCNLRecord[]
const accordi = accordiRaw as AccordoRecord[]
const blogPosts = blogPostsRaw as PostRecord[]

const guidesMap: Record<string, CCNLGuideContent> = {
  commercio: guideCommercio as unknown as CCNLGuideContent,
  'vigilanza-privata': guideVigilanza as unknown as CCNLGuideContent,
  metalmeccanici: guideMetalmeccanici as unknown as CCNLGuideContent,
  'energia-petrolio': guideEnergia as unknown as CCNLGuideContent,
  'lavoro-domestico': guideLavoroDomestico as unknown as CCNLGuideContent,
}

// ---------------------------------------------------------------------------
// Macrosettori CNEL (14 privati + 4 pubblici = 18)
// ---------------------------------------------------------------------------

const macrosettoriConfig: Record<string, { nome: string; icona: string; descrizione: string }> = {
  A: { nome: 'Agricoltura', icona: 'Wheat', descrizione: 'Contratti del settore agricolo e florovivaistico' },
  B: { nome: 'Chimici', icona: 'FlaskConical', descrizione: 'Industria chimica, farmaceutica, energia e petrolio' },
  C: { nome: 'Meccanici', icona: 'Wrench', descrizione: 'Industria metalmeccanica e siderurgica' },
  D: { nome: 'Tessili', icona: 'Shirt', descrizione: 'Industria tessile, abbigliamento e moda' },
  E: { nome: 'Alimentaristi', icona: 'UtensilsCrossed', descrizione: 'Industria alimentare e delle bevande' },
  F: { nome: 'Edilizia, Legno e Arredamento', icona: 'HardHat', descrizione: 'Costruzioni, legno e arredamento' },
  G: { nome: 'Poligrafici e Spettacolo', icona: 'Clapperboard', descrizione: 'Editoria, grafica, spettacolo e comunicazione' },
  H: { nome: 'Terziario e Servizi', icona: 'Store', descrizione: 'Commercio, turismo, vigilanza e studi professionali' },
  I: { nome: 'Lavoro Domestico', icona: 'Home', descrizione: 'Colf, badanti e collaboratori domestici' },
  L: { nome: 'Trasporti', icona: 'Truck', descrizione: 'Trasporto merci e persone, logistica' },
  M: { nome: 'Credito e Assicurazioni', icona: 'Landmark', descrizione: 'Banche, istituti di credito e assicurazioni' },
  N: { nome: 'Aziende di Servizi', icona: 'Zap', descrizione: 'Elettrico, telecomunicazioni, multiservizi' },
  O: { nome: 'Istruzione, Sanità, Assistenza', icona: 'Stethoscope', descrizione: 'Istruzione privata, sanità e assistenza sociale' },
  P: { nome: 'Plurisettoriali', icona: 'Boxes', descrizione: 'Contratti trasversali e plurisettoriali' },
  Q: { nome: 'Funzioni Centrali (PA)', icona: 'Building2', descrizione: 'Pubblica amministrazione centrale' },
  R: { nome: 'Funzioni Locali (PA)', icona: 'Building', descrizione: 'Pubblica amministrazione locale' },
  S: { nome: 'Sanità Pubblica', icona: 'HeartPulse', descrizione: 'Servizio sanitario nazionale' },
  T: { nome: 'Scuola Pubblica', icona: 'GraduationCap', descrizione: 'Istruzione pubblica' },
}

// Calcola conteggi reali dai 1032 record
function buildMacrosettori(): Macrosettore[] {
  const counts: Record<string, number> = {}
  for (const record of ccnlCatalog) {
    const cod = record.settore_cod
    counts[cod] = (counts[cod] || 0) + 1
  }

  return Object.entries(macrosettoriConfig)
    .filter(([cod]) => counts[cod] !== undefined || macrosettoriConfig[cod])
    .map(([cod, config]) => ({
      slug: config.nome
        .toLowerCase()
        .replace(/[^a-z0-9àèéìòù]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      cod,
      nome: config.nome,
      icona: config.icona,
      descrizione: config.descrizione,
      numeroContratti: counts[cod] || 0,
    }))
    .sort((a, b) => a.cod.localeCompare(b.cod))
}

export const macrosettori: Macrosettore[] = buildMacrosettori()

// Mappe veloci
const macrosettoreByCod = new Map(macrosettori.map((m) => [m.cod, m]))
const macrosettoreBySlug = new Map(macrosettori.map((m) => [m.slug, m]))

// ---------------------------------------------------------------------------
// Stato CCNL — calcolato dalla data di scadenza
// ---------------------------------------------------------------------------

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null
  const parts = dateStr.split('/')
  if (parts.length !== 3) return null
  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1
  let year = parseInt(parts[2], 10)
  if (year < 100) year += 2000
  return new Date(year, month, day)
}

function computeStato(scadenza: string): CCNLStatus {
  const date = parseDate(scadenza)
  if (!date) return 'vigente'
  return date >= new Date() ? 'vigente' : 'scaduto'
}

// ---------------------------------------------------------------------------
// Normalizzazione CCNL
// ---------------------------------------------------------------------------

function normalizeCCNL(record: CCNLRecord): CCNL {
  return {
    id: record.id,
    slug: record.slug,
    nome: record.titolo,
    settore: record.settore_desc,
    macrosettore: record.settore_cod,
    sottosettore: record.sottosettore_desc,
    scadenza: record.scadenza_contrattuale,
    stato: computeStato(record.scadenza_contrattuale),
    firmatariDatori: record.firmatari_datoriali,
    firmatariSindacali: record.firmatari_sindacali,
    dirigenti: record.dirigenti,
    settorePrivPubb: record.settore_priv_pubb,
    nDipendenti: record.n_dipendenti_tot_2023 || undefined,
  }
}

const allCCNL: CCNL[] = ccnlCatalog.map(normalizeCCNL)

// Indici veloci
const ccnlBySlug = new Map(allCCNL.map((c) => [c.slug, c]))
const ccnlById = new Map(allCCNL.map((c) => [c.id, c]))

// ---------------------------------------------------------------------------
// API — CCNL
// ---------------------------------------------------------------------------

export function getAllCCNL(): CCNL[] {
  return allCCNL
}

export function getCCNLBySlug(slug: string): CCNL | undefined {
  return ccnlBySlug.get(slug)
}

export function getCCNLById(id: string): CCNL | undefined {
  return ccnlById.get(id)
}

export function searchCCNL(query: string): CCNL[] {
  const lower = query.toLowerCase()
  return allCCNL.filter(
    (c) =>
      c.nome.toLowerCase().includes(lower) ||
      c.settore.toLowerCase().includes(lower) ||
      c.sottosettore.toLowerCase().includes(lower) ||
      c.id.toLowerCase().includes(lower) ||
      c.firmatariDatori.toLowerCase().includes(lower) ||
      c.firmatariSindacali.toLowerCase().includes(lower)
  )
}

export function getCCNLByMacrosettore(cod: string): CCNL[] {
  return allCCNL.filter((c) => c.macrosettore === cod)
}

export function getCCNLByMacrosettoreSlug(slug: string): CCNL[] {
  const m = macrosettoreBySlug.get(slug)
  if (!m) return []
  return getCCNLByMacrosettore(m.cod)
}

export function getMacrosettoreBySlug(slug: string): Macrosettore | undefined {
  return macrosettoreBySlug.get(slug)
}

export function getMacrosettoreByCod(cod: string): Macrosettore | undefined {
  return macrosettoreByCod.get(cod)
}

// ---------------------------------------------------------------------------
// API — Accordi
// ---------------------------------------------------------------------------

export function getAllAccordi(): AccordoRecord[] {
  return accordi
}

export function getAccordiByccnlId(ccnlId: string): AccordoRecord[] {
  return accordi.filter((a) => a.ccnl_id === ccnlId)
}

// ---------------------------------------------------------------------------
// API — Guide editoriali (5 pagine)
// ---------------------------------------------------------------------------

const GUIDE_SLUGS = Object.keys(guidesMap)

// Mappa codice CNEL → slug guida (costruita dinamicamente dai JSON)
const guideByCodiceCnel = new Map<string, string>()
for (const [slug, guide] of Object.entries(guidesMap)) {
  if (guide.info.codice_cnel) {
    guideByCodiceCnel.set(guide.info.codice_cnel, slug)
  }
}

export function getCCNLGuide(slug: string): CCNLGuideContent | undefined {
  return guidesMap[slug]
}

export function getAllGuideSlugs(): string[] {
  return GUIDE_SLUGS
}

/** Dato un codice CNEL (es. "H02X"), restituisce lo slug della guida se esiste */
export function getGuideSlugByCodiceCnel(codiceCnel: string): string | undefined {
  return guideByCodiceCnel.get(codiceCnel)
}

// ---------------------------------------------------------------------------
// API — Blog
// ---------------------------------------------------------------------------

export function getAllPosts(): PostRecord[] {
  return blogPosts
}

export function getPostBySlug(slug: string): PostRecord | undefined {
  return blogPosts.find((p) => p.slug === slug)
}

export function getPostsByCategory(categorySlug: string): PostRecord[] {
  return blogPosts.filter((p) =>
    p.categories.some((c) => c.slug === categorySlug)
  )
}

export function getAllCategories(): { name: string; slug: string; count: number }[] {
  const map = new Map<string, { name: string; count: number }>()
  for (const post of blogPosts) {
    for (const cat of post.categories) {
      const existing = map.get(cat.slug)
      if (existing) {
        existing.count++
      } else {
        map.set(cat.slug, { name: cat.name, count: 1 })
      }
    }
  }
  return Array.from(map.entries())
    .map(([slug, { name, count }]) => ({ slug, name, count }))
    .sort((a, b) => b.count - a.count)
}

// ---------------------------------------------------------------------------
// Statistiche globali
// ---------------------------------------------------------------------------

export function getStats() {
  const vigenti = allCCNL.filter((c) => c.stato === 'vigente').length
  const scaduti = allCCNL.filter((c) => c.stato === 'scaduto').length
  return {
    totaleCCNL: allCCNL.length,
    totaleAccordi: accordi.length,
    totaleMacrosettori: macrosettori.length,
    vigenti,
    scaduti,
  }
}
