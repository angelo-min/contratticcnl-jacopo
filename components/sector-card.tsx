import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import type { Macrosettore } from '@/types/ccnl'

interface SectorCardProps {
  sector: Macrosettore
}

export function SectorCard({ sector }: SectorCardProps) {
  return (
    <Link href={`/settore/${sector.slug}`}>
      <Card className="group h-full transition-all hover:border-primary/30 hover:shadow-md">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <span className="text-4xl" role="img" aria-label={sector.nome}>
            {sector.icona}
          </span>
          <h3 className="mt-3 font-heading text-sm font-bold text-foreground transition-colors group-hover:text-primary sm:text-base">
            {sector.nome}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            {sector.numeroContratti} contratti
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
