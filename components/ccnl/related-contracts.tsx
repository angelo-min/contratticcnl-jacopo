import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/status-badge'
import { ArrowRight } from 'lucide-react'
import { getCCNLByMacrosettore, getMacrosettoreByCod } from '@/data/db'

interface RelatedContractsProps {
  currentSlug: string
  macrosettore: string // cod lettera
}

export function RelatedContracts({ currentSlug, macrosettore }: RelatedContractsProps) {
  const relatedCCNL = getCCNLByMacrosettore(macrosettore)
    .filter((c) => c.slug !== currentSlug)
    .slice(0, 4)

  const settore = getMacrosettoreByCod(macrosettore)

  if (relatedCCNL.length === 0) {
    return null
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="font-heading text-lg font-bold">Contratti correlati</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {relatedCCNL.map((ccnl) => (
          <Link
            key={ccnl.id}
            href={`/ccnl/${ccnl.slug}`}
            className="group block rounded-lg border border-border p-3 transition-all hover:border-primary/30 hover:bg-muted/50"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <StatusBadge status={ccnl.stato} className="text-xs" />
                <h4 className="mt-2 line-clamp-2 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                  {ccnl.nome}
                </h4>
              </div>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
            </div>
          </Link>
        ))}

        {settore && (
          <Link
            href={`/settore/${settore.slug}`}
            className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Vedi tutti i contratti del settore
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
