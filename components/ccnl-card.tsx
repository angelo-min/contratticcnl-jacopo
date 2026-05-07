import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
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
      <Link href={`/ccnl/${ccnl.slug}`} className="group block h-full">
        <div className="flex h-full items-center justify-between rounded-[2rem] bg-card p-5 border border-border/40 transition-all duration-300 hover:bg-card/60 hover:shadow-xl hover:-translate-y-1">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest bg-secondary/50">
                {ccnl.settore}
              </Badge>
              <StatusBadge status={ccnl.stato} className="text-[10px] font-bold uppercase tracking-widest" />
            </div>
            <h3 className="truncate font-heading text-xl font-medium text-foreground transition-colors group-hover:text-primary">
              {ccnl.nome}
            </h3>
            <p className="mt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Scadenza: {ccnl.scadenza}
            </p>
          </div>
          <div className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
            <ArrowRight className="h-5 w-5" />
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/ccnl/${ccnl.slug}`} className="group block h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-[2rem] bg-card p-6 border border-border/40 transition-all duration-500 hover:bg-card/60 hover:shadow-xl hover:-translate-y-2">
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest bg-secondary/50">
            {ccnl.settore}
          </Badge>
          <StatusBadge status={ccnl.stato} className="text-[10px] font-bold uppercase tracking-widest" />
        </div>
        
        <div className="flex-1">
          <h3 className="mb-4 line-clamp-3 font-heading text-2xl leading-tight font-medium text-foreground transition-colors group-hover:text-primary">
            {ccnl.nome}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {ccnl.sottosettore}
          </p>
        </div>
        
        <div className="mt-8 flex items-end justify-between border-t border-border/40 pt-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Scadenza</span>
            <span className="text-sm font-medium text-foreground">{ccnl.scadenza}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary transition-transform group-hover:translate-x-1">
            Consulta <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  )
}
