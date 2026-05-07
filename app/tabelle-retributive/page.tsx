import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { TableProperties, ArrowRight } from 'lucide-react'
import { getAllGuideSlugs, getCCNLGuide } from '@/data/db'
import type { Metadata } from 'next'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Tabelle retributive CCNL — Archivio minimi salariali | ContrattiCCNL.it',
  description:
    'Archivio delle tabelle retributive dei contratti collettivi nazionali. Minimi tabellari per livello, scatti di anzianità e decorrenze aggiornate.',
}

export default function TabelleRetributiveIndexPage() {
  const guides = getAllGuideSlugs()
    .map((slug) => getCCNLGuide(slug))
    .filter((g): g is NonNullable<typeof g> => g != null && !!g.tabelle_html)
    .sort((a, b) => a.info.titolo.localeCompare(b.info.titolo, 'it'))

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="border-b border-border bg-card py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Tabelle retributive
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Archivio dei minimi tabellari per livello, scatti di anzianità e decorrenze dei
              contratti collettivi nazionali. Consulta la tabella del CCNL di tuo interesse.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((g) => (
              <Link
                key={g.slug}
                href={`/${g.slug}/tabelle-retributive`}
                className="group transition-opacity"
              >
                <Card className="h-full transition-all hover:border-primary/30 hover:shadow-md">
                  <CardContent className="flex h-full flex-col p-6">
                    <TableProperties
                      className="h-8 w-8 shrink-0 text-primary"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <h2 className="mt-4 font-heading text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                      {g.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {g.info.titolo}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted-foreground">
                      {g.info.codice_cnel && (
                        <span>Codice CNEL: {g.info.codice_cnel}</span>
                      )}
                      <ArrowRight className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
