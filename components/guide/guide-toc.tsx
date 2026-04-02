import Link from 'next/link'
import { cn } from '@/lib/utils'
import { FileText, Layers, Table2, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CCNLGuideContent } from '@/types/ccnl'

interface GuideTocProps {
  guide: CCNLGuideContent
  currentSection?: 'contenuto' | 'livelli' | 'tabelle' | 'preavviso'
}

export function GuideToc({ guide, currentSection = 'contenuto' }: GuideTocProps) {
  const links = [
    {
      key: 'contenuto' as const,
      href: `/${guide.slug}`,
      label: guide.title,
      icon: FileText,
    },
    {
      key: 'livelli' as const,
      href: `/${guide.slug}/livelli`,
      label: guide.livelli_title || 'Livelli e mansioni',
      icon: Layers,
    },
    {
      key: 'tabelle' as const,
      href: `/${guide.slug}/tabelle-retributive`,
      label: guide.tabelle_title || 'Tabelle retributive',
      icon: Table2,
    },
    ...(guide.preavviso
      ? [
          {
            key: 'preavviso' as const,
            href: `/${guide.slug}/preavviso`,
            label: 'Preavviso',
            icon: Clock,
          },
        ]
      : []),
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="font-heading text-lg font-bold">
          Indice
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.key}
            href={link.href}
            className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
              currentSection === link.key
                ? 'bg-primary/10 font-medium text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <link.icon className="h-4 w-4 shrink-0" />
            <span className="line-clamp-2">{link.label}</span>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
