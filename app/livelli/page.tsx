import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Layers, ArrowRight } from 'lucide-react'
import { getAllGuideSlugs, getCCNLGuide } from '@/data/db'
import type { Metadata } from 'next'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Livelli e inquadramento CCNL — Classificazione del personale | ContrattiCCNL.it',
  description:
    'Livelli, mansioni e classificazione del personale per ciascun contratto collettivo nazionale. Consulta i livelli del CCNL di tuo interesse.',
}

export default function LivelliIndexPage() {
  const guides = getAllGuideSlugs()
    .map((slug) => getCCNLGuide(slug))
    .filter((g): g is NonNullable<typeof g> => g != null && !!g.livelli_html)
    .sort((a, b) => a.info.titolo.localeCompare(b.info.titolo, 'it'))

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="relative border-b border-border/50 bg-background pb-16 pt-32 overflow-hidden">
          <div className="absolute left-10 top-0 -z-10 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[100px]" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <h1 className="max-w-4xl font-heading text-4xl font-normal leading-tight tracking-[-0.02em] text-foreground sm:text-6xl lg:text-7xl">
              Livelli e inquadramento
            </h1>
            <p className="mt-6 max-w-2xl text-base font-medium text-muted-foreground">
              Livelli, mansioni e classificazione del personale dei contratti collettivi nazionali.
              Consulta l'inquadramento del CCNL di tuo interesse.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((g) => (
              <Link
                key={g.slug}
                href={`/${g.slug}/livelli`}
                className="group transition-opacity"
              >
                <Card className="h-full transition-all hover:border-primary/30 hover:shadow-md">
                  <CardContent className="flex h-full flex-col p-6">
                    <Layers
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
