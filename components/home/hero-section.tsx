import Link from 'next/link'
import { SearchBar } from '@/components/search-bar'
import { Badge } from '@/components/ui/badge'

const quickTags = [
  { label: 'Metalmeccanico', query: 'metalmeccanico' },
  { label: 'Commercio', query: 'commercio' },
  { label: 'Edilizia', query: 'edilizia' },
  { label: 'Sanità', query: 'sanità' },
  { label: 'Bancario', query: 'bancario' },
]

export function HeroSection() {
  return (
    <section className="relative flex min-h-[100dvh] w-full flex-col justify-end overflow-hidden bg-background px-4 pb-20 pt-32 sm:px-6 lg:px-12">
      {/* Decorative architectural elements */}
      <div className="absolute right-0 top-0 -z-10 h-full w-[45vw] bg-secondary/40 clip-path-hero animate-in fade-in duration-1000 hidden lg:block" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }} />
      <div className="absolute left-10 top-32 -z-10 h-[200px] w-[200px] rounded-full border border-primary/20 bg-transparent blur-3xl" />

      <div className="w-full max-w-7xl mx-auto flex flex-col items-start gap-12 lg:flex-row lg:items-end lg:justify-between">
        
        {/* Main Typography Block - Anchored Left/Bottom */}
        <div className="max-w-4xl flex-1">
          <h1 className="font-heading text-6xl font-normal leading-[0.95] tracking-[-0.03em] text-foreground sm:text-8xl lg:text-[10rem] animate-in slide-in-from-bottom-8 fade-in duration-1000 fill-mode-both" style={{ animationDelay: '100ms' }}>
            L'Archivio
            <br />
            <span className="italic text-primary">Definitivo.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg font-medium leading-relaxed text-muted-foreground sm:text-xl animate-in slide-in-from-bottom-8 fade-in duration-1000 fill-mode-both" style={{ animationDelay: '300ms' }}>
            Non solo documenti. Una piattaforma intelligente per esplorare, confrontare e comprendere tutti i Contratti Collettivi Nazionali del Lavoro e le relative tabelle retributive.
          </p>
        </div>

        {/* Search & Tags - Anchored Right */}
        <div className="w-full max-w-lg shrink-0 animate-in slide-in-from-bottom-8 fade-in duration-1000 fill-mode-both" style={{ animationDelay: '500ms' }}>
          <div className="rounded-3xl border border-border/50 bg-card/50 p-6 shadow-xl backdrop-blur-sm">
            <h2 className="mb-4 font-heading text-xl font-bold">Cerca il tuo CCNL</h2>
            <div className="relative group">
              <SearchBar large />
            </div>

            <div className="mt-6">
              <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Settori più cercati</span>
              <div className="flex flex-wrap gap-2">
                {quickTags.map((tag) => (
                  <Link key={tag.query} href={`/contratti-ccnl?q=${encodeURIComponent(tag.query)}`}>
                    <Badge
                      variant="secondary"
                      className="cursor-pointer rounded-xl border border-border/50 bg-background/80 px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
                    >
                      {tag.label}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
