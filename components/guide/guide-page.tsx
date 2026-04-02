import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Card, CardContent } from '@/components/ui/card'
import { GuideInfoCard } from '@/components/guide/guide-info-card'
import { GuideToc } from '@/components/guide/guide-toc'
import { GuideArticles } from '@/components/guide/guide-articles'
import { BreadcrumbJsonLd } from '@/components/breadcrumb-jsonld'
import type { CCNLGuideContent } from '@/types/ccnl'

interface GuidePageProps {
  guide: CCNLGuideContent
}

export function GuidePage({ guide }: GuidePageProps) {
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
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main content */}
          <div className="min-w-0 flex-1">
            <Card>
              <CardContent className="prose prose-sm max-w-none p-6 text-muted-foreground sm:p-8">
                <div className="whitespace-pre-line leading-relaxed">
                  {guide.content}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="w-full shrink-0 space-y-6 lg:w-80">
            <GuideToc guide={guide} currentSection="contenuto" />
            <GuideInfoCard info={guide.info} />
            <GuideArticles categorySlug={guide.slug} />
          </aside>
        </div>
      </div>
    </>
  )
}
