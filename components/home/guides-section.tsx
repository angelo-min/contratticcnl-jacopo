import Link from 'next/link'
import { ArrowRight, Layers, Table2, FileText, Download, ChevronRight } from 'lucide-react'
import { getAllGuideSlugs, getCCNLGuide } from '@/data/db'

export function GuidesSection() {
  const slugs = getAllGuideSlugs()
  const guides = slugs
    .map((slug) => ({ slug, guide: getCCNLGuide(slug)! }))
    .filter(({ guide }) => guide)

  return (
    <section className="bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-16 flex flex-col items-center text-center gap-4">
          <span className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">I più consultati</span>
          <h2 className="font-heading text-4xl sm:text-5xl font-normal tracking-tight text-foreground">
            Contratti in <span className="italic text-primary">evidenza</span>
          </h2>
          <p className="max-w-2xl text-muted-foreground mt-2">
            Accesso rapido ai CCNL più rilevanti, completi di tabelle retributive, livelli e regole di preavviso.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:gap-10">
          {guides.map(({ slug, guide }) => (
            <article key={slug} className="group relative flex flex-col items-start rounded-3xl border border-border/50 bg-card p-8 shadow-sm transition-all hover:bg-card/80 hover:shadow-md">
              
              <div className="mb-6 flex w-full items-center justify-between">
                <span className="rounded-full bg-secondary px-4 py-1.5 text-xs font-bold text-secondary-foreground shadow-sm">
                  {guide.info.settore}
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  Scadenza: <span className="text-foreground">{guide.info.scadenza}</span>
                </span>
              </div>

              <Link href={`/${slug}`} className="mb-8 inline-block w-full">
                <h3 className="font-heading text-3xl font-medium leading-tight text-foreground transition-colors group-hover:text-primary">
                  {guide.info.titolo}
                </h3>
              </Link>

              <div className="mt-auto flex w-full flex-col gap-3">
                
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Link
                    href={`/${slug}`}
                    className="flex w-full items-center justify-between rounded-xl bg-muted/50 px-4 py-3.5 text-sm font-medium text-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 opacity-70" />
                      <span>Testo Integrale</span>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </Link>

                  <Link
                    href={`/${slug}/tabelle-retributive`}
                    className="flex w-full items-center justify-between rounded-xl bg-muted/50 px-4 py-3.5 text-sm font-medium text-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Table2 className="h-4 w-4 opacity-70" />
                      <span>Tabelle Salari</span>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </Link>
                  
                  <Link
                    href={`/${slug}/livelli`}
                    className="flex w-full items-center justify-between rounded-xl bg-muted/50 px-4 py-3.5 text-sm font-medium text-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 opacity-70" />
                      <span>Livelli e Qualifiche</span>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </Link>
                  
                  {guide.preavviso && (
                    <Link
                      href={`/${slug}/preavviso`}
                      className="flex w-full items-center justify-between rounded-xl bg-muted/50 px-4 py-3.5 text-sm font-medium text-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-4 w-4 opacity-70 flex items-center justify-center">⏱</span>
                        <span>Preavviso</span>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
