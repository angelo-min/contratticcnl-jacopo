import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'
import { GuideInfoCard } from '@/components/guide/guide-info-card'
import { GuideToc } from '@/components/guide/guide-toc'
import { InPageToc } from '@/components/guide/in-page-toc'
import { RichContent } from '@/components/guide/rich-content'
import { GuideButtonGrid } from '@/components/guide/guide-button-grid'
import { GuidePdfCta } from '@/components/guide/guide-pdf-cta'
import { GuideFaq } from '@/components/guide/guide-faq'
import { GuideRelatedPosts } from '@/components/guide/guide-related-posts'
import { BreadcrumbJsonLd } from '@/components/breadcrumb-jsonld'
import { ShareButtons } from '@/components/share-buttons'
import {
  getStatoContratto,
  addHeadingIds,
  extractHeadings,
  parseGuideContent,
} from '@/lib/guide-utils'
import { getPostsByCategory, getMainPdfUrlForCCNL } from '@/data/db'
import type { CCNLGuideContent } from '@/types/ccnl'

interface GuidePageProps {
  guide: CCNLGuideContent
}

const STATO_CONFIG = {
  vigente: { label: 'Vigente', cssVar: '--status-vigente' },
  'in-rinnovo': { label: 'In rinnovo', cssVar: '--status-in-rinnovo' },
  scaduto: { label: 'Scaduto', cssVar: '--status-scaduto' },
} as const

export function GuidePage({ guide }: GuidePageProps) {
  const stato = getStatoContratto(guide.info.scadenza)
  const { label: statoLabel, cssVar } = STATO_CONFIG[stato]

  const { body, faqItems } = parseGuideContent(guide.content_html)
  const withIds = addHeadingIds(body)
  const bodyHeadings = extractHeadings(withIds)
  const hasRelatedPosts = getPostsByCategory(guide.slug).length > 0
  const pdfUrl = guide.info.codice_cnel ? getMainPdfUrlForCCNL(guide.info.codice_cnel) : null
  const tocHeadings = [
    ...bodyHeadings,
    ...(hasRelatedPosts ? [{ id: 'articoli-correlati', text: 'Notizie e articoli correlati' }] : []),
    ...(faqItems.length > 0 ? [{ id: 'faq', text: 'Domande frequenti' }] : []),
  ]

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'CCNL', href: '/ccnl' },
          { name: guide.info.titolo, href: `/${guide.slug}` },
        ]}
      />
      {/* Header */}
      <div className="relative border-b border-border/50 bg-background pb-12 pt-32 overflow-hidden">
        <div className="absolute left-10 top-0 -z-10 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[100px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-8">
            <Breadcrumb>
              <BreadcrumbList className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/ccnl" className="hover:text-primary transition-colors">CCNL</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-foreground">{guide.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <h1 className="max-w-4xl font-heading text-4xl font-normal leading-tight tracking-[-0.02em] text-foreground sm:text-6xl lg:text-7xl">
            {guide.title}
          </h1>

          {/* Key-facts row */}
          <div className="mt-10 flex flex-wrap items-center gap-4 text-sm font-medium">
            <Badge
              variant="outline"
              className="text-xs uppercase tracking-widest px-3 py-1.5 font-bold"
              style={{
                color: `var(${cssVar})`,
                borderColor: `color-mix(in srgb, var(${cssVar}) 40%, transparent)`,
                backgroundColor: `color-mix(in srgb, var(${cssVar}) 12%, transparent)`,
              }}
            >
              {statoLabel}
            </Badge>

            {guide.info.scadenza && (
              <span className="text-muted-foreground uppercase tracking-widest text-xs font-bold">
                Scadenza{' '}
                <span className="text-foreground ml-1">{guide.info.scadenza}</span>
              </span>
            )}

            {guide.info.codice_cnel && (
              <span className="text-muted-foreground uppercase tracking-widest text-xs font-bold flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-border/80"></span>
                CNEL{' '}
                <span className="text-foreground ml-1">{guide.info.codice_cnel}</span>
              </span>
            )}

            <Badge variant="secondary" className="text-xs font-bold uppercase tracking-widest ml-auto lg:ml-0 bg-secondary/50">
              {guide.info.settore}
            </Badge>
          </div>

          {/* Top: 6-button grid + PDF CTA */}
          <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <GuideButtonGrid guide={guide} hasFaq={faqItems.length > 0} />
            {pdfUrl && (
              <div className="lg:max-w-md">
                <GuidePdfCta pdfUrl={pdfUrl} title={guide.title} />
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <ShareButtons title={guide.title} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="min-w-0 flex-1">
            <div className="mx-auto max-w-3xl px-2 py-4">
              <RichContent html={body} />
              <GuideRelatedPosts slug={guide.slug} />
              <GuideFaq items={faqItems} />
            </div>
          </div>

          <aside className="w-full shrink-0 space-y-6 lg:sticky lg:top-24 lg:w-72 lg:self-start">
            <GuideToc guide={guide} currentSection="contenuto" />
            {tocHeadings.length > 2 && <InPageToc headings={tocHeadings} />}
            <GuideInfoCard info={guide.info} />
          </aside>
        </div>
      </div>
    </>
  )
}
