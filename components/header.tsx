'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none">
      <header
        className={cn(
          "pointer-events-auto flex items-center justify-between rounded-full border px-4 py-2 transition-all duration-500",
          scrolled
            ? "w-full max-w-4xl border-border/50 bg-card/70 backdrop-blur-md shadow-sm"
            : "w-full max-w-6xl border-transparent bg-transparent"
        )}
      >
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary transition-transform group-hover:scale-105">
            <span className="font-heading text-xl font-bold text-primary-foreground leading-none">C</span>
          </div>
          <span className="font-heading text-xl font-bold text-foreground">ContrattiCCNL</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {[
            { name: 'Home', path: '/' },
            { name: 'CCNL', path: '/contratti-ccnl' },
            { name: 'Accordi', path: '/accordi' },
            { name: 'Articoli', path: '/articoli' },
            { name: 'Settori', path: '/settori' },
          ].map((item) => {
            const isActive = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path)
            return (
              <Link
                key={item.name}
                href={item.path}
                className={cn(
                  'relative rounded-full px-4 py-2 text-sm font-medium transition-all hover:text-primary',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {isActive && (
                  <span className="absolute inset-0 -z-10 rounded-full bg-primary/10" />
                )}
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/contratti-ccnl"
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
          >
            Cerca
          </Link>
        </div>
      </header>
    </div>
  )
}
