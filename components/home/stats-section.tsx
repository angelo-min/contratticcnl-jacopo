import { Database, Search, LineChart } from 'lucide-react'
import { getStats } from '@/data/db'

export function StatsSection() {
  const { totaleCCNL } = getStats()

  const valueProps = [
    {
      icon: Database,
      value: `Oltre ${totaleCCNL}`,
      label: 'Accordi Indicizzati',
      description: 'Un database in continua espansione che storicizza ogni rinnovo e accordo integrativo.',
      className: 'sm:col-span-2 lg:col-span-1 bg-card hover:bg-card/90 border-border/50',
    },
    {
      icon: LineChart,
      value: 'Tabelle',
      label: 'Retributive Chiare',
      description: 'Livelli, minimi tabellari e indennità organizzati in interfacce leggibili e pronte all\'uso.',
      className: 'sm:col-span-1 lg:col-span-1 bg-primary text-primary-foreground border-transparent',
      iconClass: 'text-primary-foreground/80',
      valueClass: 'text-primary-foreground',
      descClass: 'text-primary-foreground/80',
    },
    {
      icon: Search,
      value: 'Ricerca',
      label: 'Semantica Veloce',
      description: 'Trova istantaneamente il contratto giusto incrociando parole chiave, codici o settori.',
      className: 'sm:col-span-1 lg:col-span-1 bg-secondary text-secondary-foreground border-border/30',
      iconClass: 'text-primary',
    },
  ]

  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-16 max-w-3xl">
          <h2 className="font-heading text-4xl sm:text-5xl font-normal tracking-tight text-foreground">
            L'architettura dei <span className="italic text-primary">dati.</span>
          </h2>
          <p className="mt-4 text-xl text-muted-foreground font-medium">
            Non una semplice lista, ma uno strumento progettato per offrire chiarezza contrattuale assoluta.
          </p>
        </div>

        {/* Asymmetric Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {valueProps.map((prop, i) => (
            <div 
              key={prop.label} 
              className={`group relative overflow-hidden rounded-[2rem] border p-8 sm:p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${prop.className} animate-in slide-in-from-bottom-12 fade-in fill-mode-both`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background/20 backdrop-blur-sm mb-12">
                <prop.icon className={`h-6 w-6 ${prop.iconClass || 'text-primary'}`} />
              </div>

              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className={`font-heading text-4xl font-medium tracking-tight ${prop.valueClass || 'text-foreground'}`}>
                    {prop.value}
                  </span>
                  <span className={`text-lg font-bold uppercase tracking-widest mt-2 ${prop.valueClass || 'text-foreground'}`}>
                    {prop.label}
                  </span>
                </div>
                <p className={`text-sm font-medium leading-relaxed ${prop.descClass || 'text-muted-foreground'}`}>
                  {prop.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
