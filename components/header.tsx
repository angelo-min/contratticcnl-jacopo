'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Search, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState, type FormEvent } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'

const NAV_ITEMS = [
  { name: 'CCNL', path: '/ccnl' },
  { name: 'Tabelle retributive', path: '/tabelle-retributive' },
  { name: 'Livelli', path: '/livelli' },
  { name: 'Settori', path: '/settori' },
  { name: 'PDF', path: '/pdf' },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    router.push(trimmed ? `/cerca?q=${encodeURIComponent(trimmed)}` : '/ccnl')
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none">
      <header
        className={cn(
          'pointer-events-auto flex items-center justify-between gap-3 rounded-full border px-4 py-2 transition-all duration-500',
          scrolled
            ? 'w-full max-w-6xl border-border/50 bg-card/70 backdrop-blur-md shadow-sm'
            : 'w-full max-w-7xl border-transparent bg-transparent',
        )}
      >
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <img
            src="/ccnl.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 object-contain transition-transform group-hover:scale-105"
          />
          <span className="font-heading text-xl font-bold text-foreground hidden sm:inline">
            ContrattiCCNL
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.path || pathname.startsWith(`${item.path}/`)
            return (
              <Link
                key={item.name}
                href={item.path}
                className={cn(
                  'relative rounded-full px-3 py-2 text-sm font-medium transition-all hover:text-primary whitespace-nowrap',
                  isActive ? 'text-primary' : 'text-muted-foreground',
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

        <div className="flex items-center gap-2 shrink-0">
          <form onSubmit={handleSubmit} className="flex items-center">
            <label className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="search"
                name="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cerca CCNL..."
                aria-label="Cerca CCNL"
                className="rounded-full border border-border/60 bg-background/60 backdrop-blur-sm pl-9 pr-4 py-2 text-sm w-32 sm:w-56 lg:w-64 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 focus:w-72"
              />
            </label>
          </form>

          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Apri menu"
                className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/60 backdrop-blur-sm text-foreground transition-all hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 sm:w-80">
              <SheetHeader>
                <SheetTitle className="font-heading text-2xl font-bold">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-2 flex flex-col gap-1 px-4 pb-6">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    pathname === item.path || pathname.startsWith(`${item.path}/`)
                  return (
                    <SheetClose asChild key={item.name}>
                      <Link
                        href={item.path}
                        className={cn(
                          'rounded-lg px-3 py-3 text-base font-medium transition-colors',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground hover:bg-muted',
                        )}
                      >
                        {item.name}
                      </Link>
                    </SheetClose>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </div>
  )
}
