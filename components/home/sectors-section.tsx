import { SectorCard } from '@/components/sector-card'
import { macrosettori } from '@/data/db'

export function SectorsSection() {
  return (
    <section id="settori" className="scroll-mt-20 bg-background py-24 sm:py-32 border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="font-heading text-4xl sm:text-6xl font-normal tracking-tight text-foreground">
              L'Indice <span className="italic text-primary">Nazionale</span>
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Esplora i contratti collettivi partendo dalle macro-categorie produttive. Ogni settore è mappato e costantemente aggiornato.
            </p>
          </div>
          <div className="shrink-0 text-right">
            <span className="text-sm font-bold uppercase tracking-widest text-primary">{macrosettori.length} Categorie</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {macrosettori.map((sector, index) => (
            <div 
              key={sector.slug} 
              className="animate-in fade-in zoom-in-95 fill-mode-both duration-500"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <SectorCard sector={sector} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
