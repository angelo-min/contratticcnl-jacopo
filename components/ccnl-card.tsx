import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/status-badge'
import { ArrowRight, FileText } from 'lucide-react'
import type { CCNL } from '@/types/ccnl'

interface CCNLCardProps {
  ccnl: CCNL
  variant?: 'default' | 'compact'
}

export function CCNLCard({ ccnl, variant = 'default' }: CCNLCardProps) {
  if (variant === 'compact') {
    return (
      <Card className="group transition-all hover:border-primary/30 hover:shadow-md">
        <CardContent className="flex items-center justify-between p-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {ccnl.settore}
              </Badge>
              <StatusBadge status={ccnl.stato} className="text-xs" />
            </div>
            <Link href={`/ccnl/${ccnl.slug}`}>
              <h3 className="mt-2 truncate font-heading text-base font-bold text-foreground transition-colors group-hover:text-primary">
                {ccnl.nome}
              </h3>
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              Scadenza: {ccnl.scadenza}
            </p>
          </div>
          <Link
            href={`/ccnl/${ccnl.slug}`}
            className="ml-4 flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            Consulta
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="group flex h-full flex-col transition-all hover:border-primary/30 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{ccnl.settore}</Badge>
          <StatusBadge status={ccnl.stato} />
        </div>
        <Link href={`/ccnl/${ccnl.slug}`}>
          <h3 className="mt-2 line-clamp-2 font-heading text-lg font-bold text-foreground transition-colors group-hover:text-primary">
            {ccnl.nome}
          </h3>
        </Link>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {ccnl.sottosettore}
        </p>
        <div className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
          Scadenza: {ccnl.scadenza}
        </div>
        <div className="mt-4">
          <Button asChild variant="default" size="sm" className="w-full">
            <Link href={`/ccnl/${ccnl.slug}`}>
              <FileText className="mr-2 h-4 w-4" />
              Consulta
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
