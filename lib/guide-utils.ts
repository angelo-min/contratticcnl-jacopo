export function addHeadingIds(html: string): string {
  return html.replace(/<(h[234])[^>]*>(.*?)<\/\1>/gi, (_, tag, inner) => {
    const text = inner.replace(/<[^>]+>/g, '')
    const id = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
    return `<${tag} id="${id}">${inner}</${tag}>`
  })
}

export function extractHeadings(html: string): { id: string; text: string }[] {
  const headings: { id: string; text: string }[] = []
  const regex = /<h2 id="([^"]+)"[^>]*>(.*?)<\/h2>/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    const id = match[1]
    const text = match[2].replace(/<[^>]+>/g, '').trim()
    if (id && text) headings.push({ id, text })
  }
  return headings
}

export interface FaqItem {
  question: string
  answer: string
}

export interface ParsedGuideContent {
  body: string
  faqItems: FaqItem[]
}

/**
 * Splits a guide's content_html into:
 * - body: main pillar content with the trailing FAQ + "Notizie e articoli" placeholder removed,
 *         and any "Scarica PDF" anchor normalized to /pdf/
 * - faqItems: parsed Q/A pairs (when an FAQ section exists)
 */
export function parseGuideContent(html: string): ParsedGuideContent {
  const faqMatch = html.match(/<h3[^>]*>[^<]*(?:domand[ae]\s+frequent|\bfaq\b)[^<]*<\/h3>/i)
  const notizieMatch = html.match(/<h3[^>]*>[^<]*notizie\s+e\s+articoli[^<]*<\/h3>/i)

  const cuts: number[] = []
  if (faqMatch?.index !== undefined) cuts.push(faqMatch.index)
  if (notizieMatch?.index !== undefined) cuts.push(notizieMatch.index)
  const bodyEnd = cuts.length > 0 ? Math.min(...cuts) : html.length

  let body = html.substring(0, bodyEnd)
  body = body.replace(
    /<a\s+href="[^"]*"\s*>(\s*[Ss]carica[^<]*)<\/a>/g,
    '<a href="/pdf/">$1</a>',
  )

  const faqItems: FaqItem[] = []
  if (faqMatch?.index !== undefined) {
    const after = html.substring(faqMatch.index + faqMatch[0].length)
    const nextH2 = after.search(/<h2[^>]*>/i)
    const region = nextH2 >= 0 ? after.substring(0, nextH2) : after

    const pair = /<strong>([\s\S]*?)<\/strong>\s*<p>([\s\S]*?)<\/p>/g
    let m: RegExpExecArray | null
    while ((m = pair.exec(region)) !== null) {
      const question = m[1].replace(/<[^>]+>/g, '').trim()
      const answer = m[2].trim()
      if (question && answer) faqItems.push({ question, answer })
    }
  }

  return { body, faqItems }
}

export function getStatoContratto(scadenza: string): 'vigente' | 'in-rinnovo' | 'scaduto' {
  if (!scadenza) return 'vigente'
  const parts = scadenza.split('/')
  if (parts.length !== 3) return 'vigente'
  const [d, m, y] = parts
  const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d))
  const now = new Date()
  if (date >= now) return 'vigente'
  const oneYearAgo = new Date(now)
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  if (date >= oneYearAgo) return 'in-rinnovo'
  return 'scaduto'
}
