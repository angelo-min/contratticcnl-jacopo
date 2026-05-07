import sanitizeHtml from 'sanitize-html'
import { addHeadingIds } from '@/lib/guide-utils'

interface RichContentProps {
  html: string
}

function wrapTables(html: string): string {
  return html
    .replace(/<table/g, '<div class="overflow-x-auto rounded-lg border border-border my-6"><table')
    .replace(/<\/table>/g, '</table></div>')
}

export function RichContent({ html }: RichContentProps) {
  const clean = sanitizeHtml(html, {
    allowedTags: ['h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'img',
                  'table', 'thead', 'tbody', 'tr', 'td', 'th', 'blockquote', 'br'],
    allowedAttributes: {
      a: ['href'],
      img: ['src', 'alt', 'width', 'height'],
      td: ['colspan', 'rowspan'],
      th: ['colspan', 'rowspan'],
    },
  })

  const withIds = addHeadingIds(clean)
  const withTables = wrapTables(withIds)

  return (
    <div
      className="prose-content"
      dangerouslySetInnerHTML={{ __html: withTables }}
    />
  )
}
