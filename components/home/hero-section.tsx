import Link from 'next/link'
import { SearchBar } from '@/components/search-bar'
import { Badge } from '@/components/ui/badge'

const popularContracts = [
  { label: 'Metalmeccanici', href: '/metalmeccanici' },
  { label: 'Commercio', href: '/commercio' },
  { label: 'Sanità', href: '/sanita' },
  { label: 'Bancari', href: '/bancari' },
  { label: 'Turismo', href: '/turismo' },
  { label: 'Lavoro domestico', href: '/lavoro-domestico' },
  { label: 'Studi professionali', href: '/studi-professionali' },
  { label: 'Telecomunicazioni', href: '/telecomunicazioni' },
]

export function HeroSection() {
  return (
    <section className="relative flex min-h-[90dvh] flex-col items-center justify-center overflow-hidden bg-background px-4 py-20 sm:px-6 lg:px-8">
      {/* Decorative asymmetric element softened */}
      <div className="absolute right-0 top-0 -z-10 h-[100vh] w-[40vw] rounded-bl-[100px] bg-secondary/30 hidden lg:block" />

      <div className="w-full max-w-5xl">
        <div className="flex flex-col items-center text-center">
          
          {/* Main Typography Block */}
          <div className="max-w-4xl">
            <h1 className="font-heading text-6xl font-normal leading-[1.05] tracking-tight text-foreground sm:text-7xl lg:text-8xl">
              I tuoi contratti,
              <br />
              <span className="italic text-primary">più semplici.</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg font-medium leading-relaxed text-muted-foreground sm:text-xl">
              La risorsa primaria e gratuita per orientarti nel mondo del lavoro. Cerca tra oltre 1.000 CCNL integrali e tabelle retributive aggiornate.
            </p>
          </div>
          
        </div>

        <div className="mx-auto mt-12 w-full max-w-3xl lg:mt-16">
          {/* Search Wrapper */}
          <div className="relative group">
            <SearchBar large />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Contratti più cercati:</span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {popularContracts.map((c) => (
                <Link key={c.href} href={c.href}>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer rounded-full border border-border/50 bg-secondary/50 px-4 py-1.5 text-xs font-semibold text-foreground transition-all hover:scale-105 hover:bg-primary hover:text-primary-foreground hover:shadow-sm"
                  >
                    {c.label}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
