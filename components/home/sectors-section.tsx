import { SectorCard } from '@/components/sector-card'
import { macrosettori } from '@/data/db'

export function SectorsSection() {
  return (
    <section id="settori" className="scroll-mt-20 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Sfoglia per settore
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Seleziona un macrosettore per visualizzare tutti i contratti collettivi disponibili
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {macrosettori.map((sector) => (
            <SectorCard key={sector.slug} sector={sector} />
          ))}
        </div>
      </div>
    </section>
  )
}
