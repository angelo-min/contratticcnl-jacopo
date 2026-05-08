import { FileText, RefreshCw, Layers } from 'lucide-react'
import { getStats } from '@/data/db'

export function StatsSection() {
  const { totaleCCNL, totaleAccordi, totaleMacrosettori } = getStats()

  const stats = [
    {
      icon: FileText,
      value: totaleCCNL.toLocaleString('it-IT'),
      label: 'CCNL Integrali',
      description: 'Archivio nazionale corrente',
    },
    {
      icon: RefreshCw,
      value: totaleAccordi.toLocaleString('it-IT'),
      label: 'Accordi',
      description: 'Testi e rinnovi economici',
    },
    {
      icon: Layers,
      value: totaleMacrosettori.toString(),
      label: 'Settori',
      description: 'Copertura produttiva totale',
    },
  ]

  return (
    <section className="bg-popover py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-card p-8 sm:p-12 shadow-sm border border-border/50">
          <div className="grid gap-12 sm:grid-cols-3 sm:divide-x sm:divide-border/50">
            {stats.map((stat, i) => (
              <div key={stat.label} className={`flex flex-col items-center text-center sm:items-start sm:text-left ${i > 0 ? 'sm:pl-12' : ''}`}>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-colors hover:bg-primary/20">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex w-full items-baseline justify-center sm:justify-start gap-2">
                  <span className="font-heading text-5xl font-medium tracking-tighter text-foreground sm:text-6xl">
                    {stat.value}
                  </span>
                </div>
                <span className="mt-4 text-sm font-bold uppercase tracking-widest text-foreground">{stat.label}</span>
                <p className="mt-2 text-sm text-muted-foreground">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
