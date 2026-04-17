'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PdfDownloadLink } from './pdf-download-link'

interface PdfItem {
  ccnlId: string
  protocollo: string
  dataStipula: string
  titolo: string
  link: string
  ccnlSlug?: string
}

export function PdfPageList({ items }: { items: PdfItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={`${item.ccnlId}-${item.protocollo}`} className="transition-all hover:border-primary/30 hover:shadow-sm">
          <CardContent className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {item.ccnlId}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {item.dataStipula}
                </span>
              </div>
              <h3 className="mt-2 line-clamp-2 text-sm font-medium text-foreground">
                {item.titolo}
              </h3>
              {item.ccnlSlug && (
                <Link
                  href={`/ccnl/${item.ccnlSlug}`}
                  className="mt-1 inline-block text-xs text-primary hover:underline"
                >
                  Vedi scheda CCNL
                </Link>
              )}
            </div>
            <PdfDownloadLink href={item.link} title={item.titolo} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
