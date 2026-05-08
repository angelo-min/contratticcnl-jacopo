import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'
import { SectorIcon } from '@/components/sector/sector-icon'
import { macrosettori } from '@/data/db'

interface SectorSidebarProps {
  currentSlug: string
}

const externalLinks = [
  { name: 'INPS', url: 'https://www.inps.it' },
  { name: 'Archivio CNEL', url: 'https://www.cnel.it/Archivio-Contratti-Collettivi/Entra-nellarchivio' },
  { name: 'Ministero del Lavoro', url: 'https://www.lavoro.gov.it' },
  { name: 'INAIL', url: 'https://www.inail.it' },
]

export function SectorSidebar({ currentSlug }: SectorSidebarProps) {
  const otherSectors = macrosettori.filter((s) => s.slug !== currentSlug).slice(0, 6)

  return (
    <div className="space-y-6">
      {/* Other sectors */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg font-bold">Altri settori</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {otherSectors.map((sector) => (
            <Link
              key={sector.slug}
              href={`/settore/${sector.slug}`}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <SectorIcon name={sector.icona} className="h-5 w-5 shrink-0 text-primary" />
              <span>{sector.nome}</span>
            </Link>
          ))}
          <Link
            href="/settori"
            className="mt-4 block text-center text-sm font-medium text-primary hover:underline"
          >
            Vedi tutti i settori
          </Link>
        </CardContent>
      </Card>

      {/* External links */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg font-bold">Link utili</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {externalLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="nofollow noopener"
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <span>{link.name}</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
