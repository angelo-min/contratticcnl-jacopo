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
import { BreadcrumbJsonLd } from '@/components/breadcrumb-jsonld'
import { getStatoContratto, addHeadingIds, extractHeadings } from '@/lib/guide-utils'
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

  const withIds = addHeadingIds(guide.content_html)
  const headings = extractHeadings(withIds)

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'CCNL', href: '/contratti-ccnl' },
          { name: guide.info.titolo, href: `/${guide.slug}` },
        ]}
      />
      {/* Header */}
      <div className="border-b border-border bg-card py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/contratti-ccnl">CCNL</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{guide.info.titolo}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="mt-6 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            {guide.title}
          </h1>

          {/* Key-facts row */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <Badge
              variant="outline"
              style={{
                color: `var(${cssVar})`,
                borderColor: `color-mix(in srgb, var(${cssVar}) 40%, transparent)`,
                backgroundColor: `color-mix(in srgb, var(${cssVar}) 12%, transparent)`,
              }}
            >
              {statoLabel}
            </Badge>

            {guide.info.scadenza && (
              <span className="text-muted-foreground">
                Scad.{' '}
                <span className="font-medium text-foreground">{guide.info.scadenza}</span>
              </span>
            )}

            {guide.info.codice_cnel && (
              <span className="text-muted-foreground">
                CNEL{' '}
                <span className="font-mono font-medium text-foreground">
                  {guide.info.codice_cnel}
                </span>
              </span>
            )}

            <Badge variant="secondary">{guide.info.settore}</Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main content — capped at max-w-3xl for readability */}
          <div className="min-w-0 flex-1">
            <div className="mx-auto max-w-3xl px-2 py-4">
              <RichContent html={guide.content_html} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full shrink-0 space-y-6 lg:w-72">
            <GuideToc guide={guide} currentSection="contenuto" />
            {headings.length > 2 && <InPageToc headings={headings} />}
            <GuideInfoCard info={guide.info} />
          </aside>
        </div>
      </div>
    </>
  )
}
