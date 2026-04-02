import Link from 'next/link'
import { SearchBar } from '@/components/search-bar'
import { Badge } from '@/components/ui/badge'

const quickTags = [
  { label: 'Metalmeccanico', query: 'metalmeccanico' },
  { label: 'Commercio', query: 'commercio' },
  { label: 'Edilizia', query: 'edilizia' },
  { label: 'Sanità', query: 'sanità' },
  { label: 'Bancario', query: 'bancario' },
  { label: 'Chimico', query: 'chimico' },
  { label: 'Trasporti', query: 'trasporti' },
  { label: 'Artigianato', query: 'artigianato' },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-24 lg:py-32">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#E7E0D8_1px,transparent_1px),linear-gradient(to_bottom,#E7E0D8_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
      </div>

      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          <span className="text-balance">Trova il tuo contratto collettivo</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Oltre 1.000 CCNL e 2.000 accordi di rinnovo, gratis e sempre aggiornati
        </p>

        <div className="mx-auto mt-10 max-w-2xl">
          <SearchBar large />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">Ricerche frequenti:</span>
          {quickTags.map((tag) => (
            <Link key={tag.query} href={`/contratti-ccnl?q=${encodeURIComponent(tag.query)}`}>
              <Badge
                variant="secondary"
                className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {tag.label}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
