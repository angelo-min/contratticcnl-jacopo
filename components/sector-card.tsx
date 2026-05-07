import Link from 'next/link'
import { SectorIcon } from '@/components/sector/sector-icon'
import type { Macrosettore } from '@/types/ccnl'

interface SectorCardProps {
  sector: Macrosettore
}

export function SectorCard({ sector }: SectorCardProps) {
  return (
    <Link href={`/settore/${sector.slug}`} className="group block h-full">
      <div className="flex h-full flex-col items-start rounded-[2rem] bg-card p-6 border border-border/40 transition-all duration-500 hover:bg-card/60 hover:shadow-xl hover:-translate-y-2">
        
        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
          <SectorIcon name={sector.icona} className="h-6 w-6" />
        </div>
        
        <div className="mt-auto">
          <h3 className="font-heading text-xl font-medium leading-tight text-foreground transition-colors group-hover:text-primary">
            {sector.nome}
          </h3>
          <p className="mt-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {sector.numeroContratti} contratti
          </p>
        </div>
        
      </div>
    </Link>
  )
}
