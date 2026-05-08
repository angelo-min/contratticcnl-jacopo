import Link from 'next/link'
import { FileText, Layers, Table2, Clock, HelpCircle, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CCNLGuideContent } from '@/types/ccnl'

interface GuideButtonGridProps {
  guide: CCNLGuideContent
  hasFaq?: boolean
}

export function GuideButtonGrid({ guide, hasFaq = false }: GuideButtonGridProps) {
  const items = [
    {
      label: 'Sintesi',
      href: `/${guide.slug}`,
      icon: FileText,
      enabled: true,
    },
    {
      label: 'Livelli',
      href: `/${guide.slug}/livelli`,
      icon: Layers,
      enabled: !!guide.livelli_html,
    },
    {
      label: 'Tabelle retributive',
      href: `/${guide.slug}/tabelle-retributive`,
      icon: Table2,
      enabled: !!guide.tabelle_html,
    },
    {
      label: 'Preavviso',
      href: `/${guide.slug}/preavviso`,
      icon: Clock,
      enabled: !!guide.preavviso_html,
    },
    {
      label: 'FAQ',
      href: `/${guide.slug}#faq`,
      icon: HelpCircle,
      enabled: hasFaq,
    },
    {
      label: 'PDF',
      href: '/pdf/',
      icon: Download,
      enabled: true,
    },
  ]

  return (
    <nav aria-label="Sezioni del CCNL" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => {
        const Icon = item.icon
        const baseClass = cn(
          'group flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-all',
          item.enabled
            ? 'border-border bg-card hover:border-primary/40 hover:shadow-sm'
            : 'border-dashed border-border/40 bg-card/40 opacity-50 pointer-events-none',
        )

        const content = (
          <>
            <Icon
              className={cn(
                'h-5 w-5 shrink-0',
                item.enabled ? 'text-primary' : 'text-muted-foreground',
              )}
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <span
              className={cn(
                'text-sm font-semibold leading-tight',
                item.enabled ? 'text-foreground group-hover:text-primary' : 'text-muted-foreground',
              )}
            >
              {item.label}
            </span>
          </>
        )

        return item.enabled ? (
          <Link key={item.label} href={item.href} className={baseClass}>
            {content}
          </Link>
        ) : (
          <div key={item.label} className={baseClass} aria-disabled>
            {content}
          </div>
        )
      })}
    </nav>
  )
}
