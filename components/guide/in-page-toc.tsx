'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface InPageTocProps {
  headings: { id: string; text: string }[]
}

export function InPageToc({ headings }: InPageTocProps) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? '')

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav aria-label="Indice paragrafi" className="rounded-xl border border-border bg-card px-4 py-4">
      <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        In questa pagina
      </p>
      <ul className="space-y-0.5">
        {headings.map(({ id, text }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={cn(
                'block rounded px-2 py-1.5 text-sm leading-tight transition-colors',
                activeId === id
                  ? 'font-medium text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
