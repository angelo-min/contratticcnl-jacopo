import { SectorCard } from '@/components/sector-card'
import { macrosettori } from '@/data/db'

export function SectorsSection() {
  return (
    <section id="settori" className="scroll-mt-20 bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col items-center text-center gap-4">
          <span className="rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold text-secondary-foreground">Le Categorie</span>
          <h2 className="font-heading text-4xl sm:text-5xl font-normal tracking-tight text-foreground">
            Esplora per <span className="italic text-primary">settore</span>
          </h2>
          <p className="max-w-2xl text-muted-foreground mt-2">
            Seleziona una macro-categoria per visualizzare l'indice completo dei relativi contratti collettivi.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {macrosettori.map((sector) => (
            <SectorCard key={sector.slug} sector={sector} />
          ))}
        </div>
      </div>
    </section>
  )
}
