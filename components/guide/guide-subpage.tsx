import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { GuideInfoCard } from '@/components/guide/guide-info-card'
import { GuideToc } from '@/components/guide/guide-toc'
import { RichContent } from '@/components/guide/rich-content'
import type { CCNLGuideContent } from '@/types/ccnl'

interface GuideSubpageProps {
  guide: CCNLGuideContent
  title: string
  contentHtml: string
  currentSection: 'livelli' | 'tabelle' | 'preavviso' | 'parametri'
}

export function GuideSubpage({ guide, title, contentHtml, currentSection }: GuideSubpageProps) {
  return (
    <>
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
                  <Link href={`/${guide.slug}`}>{guide.info.titolo}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="mt-6 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {guide.info.titolo}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main content */}
          <div className="min-w-0 flex-1">
            <div className="mx-auto max-w-3xl px-2 py-4">
              <RichContent html={contentHtml} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full shrink-0 space-y-6 lg:sticky lg:top-24 lg:w-80 lg:self-start">
            <GuideToc guide={guide} currentSection={currentSection} />
            <GuideInfoCard info={guide.info} />
          </aside>
        </div>
      </div>
    </>
  )
}
