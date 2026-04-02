'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="font-heading text-lg font-bold text-primary-foreground">C</span>
          </div>
          <span className="font-heading text-xl font-bold text-foreground">ContrattiCCNL</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              pathname === '/' ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            Home
          </Link>
          <Link
            href="/contratti-ccnl"
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              pathname.startsWith('/contratti-ccnl') ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            CCNL
          </Link>
          <Link
            href="/accordi"
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              pathname.startsWith('/accordi') ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            Accordi
          </Link>
          <Link
            href="/articoli"
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              pathname.startsWith('/articoli') ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            Articoli
          </Link>
          <Link
            href="/pdf"
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              pathname.startsWith('/pdf') ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            PDF
          </Link>
          <Link
            href="/settori"
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              pathname.startsWith('/settori') ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            Settori
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/contratti-ccnl"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Cerca CCNL
          </Link>
        </div>
      </div>
    </header>
  )
}
