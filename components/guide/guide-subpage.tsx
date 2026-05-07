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
      <div className="relative border-b border-border/50 bg-background pb-16 pt-32 overflow-hidden">
        {/* Subtle accent blur */}
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
                    <Link href={`/${guide.slug}`} className="hover:text-primary transition-colors">{guide.title}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-foreground">{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <h1 className="max-w-4xl font-heading text-4xl font-normal leading-tight tracking-[-0.02em] text-foreground sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base font-medium text-muted-foreground">
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
