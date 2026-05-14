'use client'

import { useRouter } from 'next/navigation'
import { useState, type MouseEvent } from 'react'

interface LoadMoreButtonProps {
  href: string
}

export function LoadMoreButton({ href }: LoadMoreButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Permette al browser di seguire il link normalmente quando l'utente apre
    // in nuova tab (Cmd/Ctrl-click) o usa il middle-click.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return
    }
    e.preventDefault()
    setLoading(true)
    router.push(href, { scroll: false })
  }

  return (
    <div className="mt-12 flex justify-center">
      <a
        href={href}
        onClick={handleClick}
        rel="next"
        aria-label="Carica altri articoli"
        className="inline-flex items-center justify-center rounded-full border border-border bg-card px-8 py-3 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-primary/40 hover:text-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50"
      >
        {loading ? 'Caricamento...' : 'Carica altri'}
      </a>
    </div>
  )
}
