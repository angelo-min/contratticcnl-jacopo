import { Card, CardContent } from '@/components/ui/card'
import { FileText, RefreshCw, Layers } from 'lucide-react'
import { getStats } from '@/data/db'

export function StatsSection() {
  const { totaleCCNL, totaleAccordi, totaleMacrosettori } = getStats()

  const stats = [
    {
      icon: FileText,
      value: totaleCCNL.toLocaleString('it-IT'),
      label: 'CCNL',
      description: 'Tutti i contratti nazionali correnti',
    },
    {
      icon: RefreshCw,
      value: totaleAccordi.toLocaleString('it-IT'),
      label: 'Accordi',
      description: 'Rinnovi e aggiornamenti economici',
    },
    {
      icon: Layers,
      value: totaleMacrosettori.toString(),
      label: 'Macrosettori',
      description: 'Dalla manifattura ai servizi',
    },
  ]

  return (
    <section className="border-y border-border bg-card py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-0 bg-transparent shadow-none">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <stat.icon className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading text-3xl font-extrabold text-foreground">
                      {stat.value}
                    </span>
                    <span className="text-lg font-medium text-muted-foreground">{stat.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
