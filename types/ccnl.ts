export type CCNLStatus = 'vigente' | 'scaduto'

// Record dal catalogo CNEL (1032 CCNL) — dati strutturati senza contenuto
export interface CCNLRecord {
  id: string              // Codice CNEL, es. "A011", "H02X"
  slug: string
  titolo: string
  firmatari_datoriali: string
  firmatari_sindacali: string
  scadenza_contrattuale: string // "dd/mm/yyyy"
  settore_cod: string     // Lettera macrosettore
  sottosettore_cod: string
  settore_desc: string
  sottosettore_desc: string
  dirigenti: boolean
  settore_priv_pubb: 'privato' | 'pubblico' | 'parasubordinato'
  settori: string[]
  n_dipendenti_tot_2023: string
}

// CCNL normalizzato per la UI
export interface CCNL {
  id: string
  slug: string
  nome: string
  settore: string         // settore_desc
  macrosettore: string    // settore_cod (lettera)
  sottosettore: string
  scadenza: string        // data scadenza originale
  stato: CCNLStatus
  firmatariDatori: string
  firmatariSindacali: string
  dirigenti: boolean
  settorePrivPubb: 'privato' | 'pubblico' | 'parasubordinato'
  nDipendenti?: string
}

export interface AccordoRecord {
  protocollo: string
  slug: string
  titolo: string
  ccnl_id: string
  tipologia: string
  data_stipula: string
  data_decorrenza: string
  data_scadenza: string
  link: string
}

export interface PostRecord {
  id: string
  slug: string
  title: string
  content_clean: string
  excerpt: string
  date: string
  categories: { name: string; slug: string }[]
  author: string
  seo: { title: string; description: string }
}

export interface CCNLGuideInfo {
  titolo: string
  settore: string
  contraenti_datoriali: string
  contraenti_sindacali?: string
  data_stipula?: string
  codice_cnel: string
  scadenza: string
}

export interface CCNLGuideContent {
  slug: string
  title: string
  seo_title: string
  seo_description: string
  info: CCNLGuideInfo
  content: string
  livelli: string
  livelli_title: string
  tabelle: string
  tabelle_title: string
  preavviso?: string
}

export interface Macrosettore {
  slug: string
  cod: string           // Lettera CNEL
  nome: string
  icona: string
  descrizione: string
  numeroContratti: number
}
