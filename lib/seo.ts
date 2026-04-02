/**
 * Sostituisce le variabili Yoast nei template SEO del sito WordPress.
 */
export function resolveYoastTemplate(template: string, pageTitle: string): string {
  if (!template) return ''
  return template
    .replace(/%%title%%/g, pageTitle)
    .replace(/%%currentyear%%/g, new Date().getFullYear().toString())
    .replace(/%%sitename%%/g, 'ContrattiCCNL.it')
    .replace(/%%sep%%/g, '—')
    .replace(/%%page%%/g, '')
    .trim()
    .replace(/\s+/g, ' ')
}
