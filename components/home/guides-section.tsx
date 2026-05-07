import Link from 'next/link'
import { ArrowRight, Layers, Table2, FileText, ChevronRight } from 'lucide-react'
import { getAllGuideSlugs, getCCNLGuide } from '@/data/db'

export function GuidesSection() {
  const slugs = getAllGuideSlugs()
  const guides = slugs
    .map((slug) => ({ slug, guide: getCCNLGuide(slug)! }))
    .filter(({ guide }) => guide)

  return (
    <section className="bg-muted/30 py-24 sm:py-32 relative overflow-hidden">
      {/* Texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-primary)_0%,transparent_15%)] opacity-10"></div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        
        <div className="mb-20 flex flex-col items-start gap-4 border-l-4 border-primary pl-6">
          <span className="text-sm font-bold uppercase tracking-widest text-primary">In Evidenza</span>
          <h2 className="font-heading text-5xl sm:text-7xl font-normal tracking-tight text-foreground">
            I Contratti<br />
            <span className="italic text-muted-foreground">più consultati.</span>
          </h2>
        </div>

        <div className="flex flex-col gap-12 sm:gap-16">
          {guides.map(({ slug, guide }, index) => (
            <article 
              key={slug} 
              className="group relative flex flex-col md:flex-row items-center gap-8 rounded-[2rem] bg-card p-6 sm:p-10 transition-all duration-500 hover:bg-card/60 shadow-sm hover:shadow-xl border border-border/40 animate-in slide-in-from-bottom-12 fade-in fill-mode-both"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              
              {/* Left Column: Title and Meta */}
              <div className="flex-1 flex flex-col items-start">
                <div className="mb-6 flex w-full items-center gap-4">
                  <span className="rounded-full bg-secondary px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-secondary-foreground shadow-sm">
                    {guide.info.settore}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                    Scadenza: <span className="text-foreground">{guide.info.scadenza}</span>
                  </span>
                </div>

                <Link href={`/${slug}`} className="mb-8 inline-block w-full">
                  <h3 className="font-heading text-4xl sm:text-5xl font-normal leading-tight text-foreground transition-colors group-hover:text-primary">
                    {guide.info.titolo}
                  </h3>
                </Link>
                
                <Link href={`/${slug}`} className="mt-auto hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary transition-transform group-hover:translate-x-2">
                  Esplora Documento <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Right Column: Interactive Quick Links */}
              <div className="w-full md:w-[320px] lg:w-[400px] shrink-0 flex flex-col gap-3">
                {guide.tabelle_html && (
                  <Link
                    href={`/${slug}/tabelle-retributive`}
                    className="flex w-full items-center justify-between rounded-xl bg-background/50 border border-border/50 px-5 py-4 text-sm font-medium text-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary group/link hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <Table2 className="h-5 w-5 opacity-70 group-hover/link:opacity-100" />
                      <span>Tabelle Salari</span>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-50 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                )}

                {guide.livelli_html && (
                  <Link
                    href={`/${slug}/livelli`}
                    className="flex w-full items-center justify-between rounded-xl bg-background/50 border border-border/50 px-5 py-4 text-sm font-medium text-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary group/link hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <Layers className="h-5 w-5 opacity-70 group-hover/link:opacity-100" />
                      <span>Livelli e Qualifiche</span>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-50 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                )}

                {guide.parametri_html && (
                  <Link
                    href={`/${slug}/parametri`}
                    className="flex w-full items-center justify-between rounded-xl bg-background/50 border border-border/50 px-5 py-4 text-sm font-medium text-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary group/link hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <Layers className="h-5 w-5 opacity-70 group-hover/link:opacity-100" />
                      <span>Parametri retributivi</span>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-50 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                )}

                {guide.preavviso_html && (
                  <Link
                    href={`/${slug}/preavviso`}
                    className="flex w-full items-center justify-between rounded-xl bg-background/50 border border-border/50 px-5 py-4 text-sm font-medium text-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary group/link hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-5 w-5 opacity-70 group-hover/link:opacity-100 flex items-center justify-center text-lg">⏱</span>
                      <span>Regole Preavviso</span>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-50 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
              
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
