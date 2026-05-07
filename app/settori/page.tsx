import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SectorCard } from '@/components/sector-card'
import { macrosettori } from '@/data/db'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settori CNEL — Macrosettori contrattuali | ContrattiCCNL.it',
  description:
    'Tutti i macrosettori CNEL: agricoltura, chimici, meccanici, terziario, trasporti e altri. Sfoglia i contratti collettivi per settore.',
}

export default function SettoriPage() {
  const totaleContratti = macrosettori.reduce((sum, m) => sum + m.numeroContratti, 0)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="border-b border-border bg-card pb-8 pt-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Settori CNEL
            </h1>
            <p className="mt-2 text-muted-foreground">
              {macrosettori.length} macrosettori — {totaleContratti.toLocaleString('it-IT')} contratti collettivi
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {macrosettori.map((sector) => (
              <SectorCard key={sector.slug} sector={sector} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
