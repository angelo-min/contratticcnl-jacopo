import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Layers, Table2, Clock } from 'lucide-react'
import { getAllGuideSlugs, getCCNLGuide } from '@/data/db'

export function GuidesSection() {
  const slugs = getAllGuideSlugs()
  const guides = slugs
    .map((slug) => ({ slug, guide: getCCNLGuide(slug)! }))
    .filter(({ guide }) => guide)

  return (
    <section className="border-t border-border bg-card py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Guide CCNL
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Approfondimenti completi sui principali contratti collettivi nazionali
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {guides.map(({ slug, guide }) => (
            <Card key={slug} className="group transition-all hover:border-primary/30 hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <Badge variant="secondary" className="text-xs">
                      {guide.info.settore}
                    </Badge>

                    <Link href={`/${slug}`}>
                      <h3 className="mt-3 font-heading text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                        {guide.info.titolo}
                      </h3>
                    </Link>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Scadenza: {guide.info.scadenza}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href={`/${slug}`}
                        className="inline-flex items-center gap-1 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        Testo contratto
                      </Link>
                      <Link
                        href={`/${slug}/livelli`}
                        className="inline-flex items-center gap-1 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        <Layers className="h-3 w-3" />
                        Livelli
                      </Link>
                      <Link
                        href={`/${slug}/tabelle-retributive`}
                        className="inline-flex items-center gap-1 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        <Table2 className="h-3 w-3" />
                        Tabelle retributive
                      </Link>
                      {guide.preavviso && (
                        <Link
                          href={`/${slug}/preavviso`}
                          className="inline-flex items-center gap-1 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                        >
                          <Clock className="h-3 w-3" />
                          Preavviso
                        </Link>
                      )}
                    </div>
                  </div>

                  <Link href={`/${slug}`}>
                    <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
