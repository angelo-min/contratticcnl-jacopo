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
