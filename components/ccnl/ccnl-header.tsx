import Link from 'next/link'
import { StatusBadge } from '@/components/status-badge'
import { BreadcrumbJsonLd } from '@/components/breadcrumb-jsonld'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { ExternalLink, Calendar, Users, BookOpen } from 'lucide-react'
import type { CCNL } from '@/types/ccnl'
import { getMacrosettoreByCod, getGuideSlugByCodiceCnel } from '@/data/db'

interface CCNLHeaderProps {
  ccnl: CCNL
}

export function CCNLHeader({ ccnl }: CCNLHeaderProps) {
  const macrosettore = getMacrosettoreByCod(ccnl.macrosettore)
  const guideSlug = getGuideSlugByCodiceCnel(ccnl.id)

  return (
    <div className="border-b border-border bg-card">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'CCNL', href: '/contratti-ccnl' },
          ...(macrosettore ? [{ name: macrosettore.nome, href: `/settore/${macrosettore.slug}` }] : []),
          { name: ccnl.nome, href: `/ccnl/${ccnl.slug}` },
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/contratti-ccnl">CCNL</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {macrosettore && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={`/settore/${macrosettore.slug}`}>
                      {macrosettore.nome}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{ccnl.nome}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header content */}
        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={ccnl.stato} />
              <span className="text-sm text-muted-foreground">{ccnl.settore}</span>
            </div>

            <h1 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              {ccnl.nome}
            </h1>

            <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
              {ccnl.sottosettore}
            </p>

            {/* Meta info */}
            <div className="mt-6 flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Scadenza: {ccnl.scadenza}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-medium">Codice CNEL:</span> {ccnl.id}
              </div>
            </div>

            {/* Firmatari */}
            <div className="mt-4 flex flex-col gap-3 text-sm sm:flex-row sm:gap-6">
              <div className="flex items-start gap-2">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <span className="font-medium text-foreground">Datori: </span>
                  <span className="text-muted-foreground">{ccnl.firmatariDatori}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <span className="font-medium text-foreground">Sindacati: </span>
                  <span className="text-muted-foreground">{ccnl.firmatariSindacali}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
            {guideSlug && (
              <Button size="lg" asChild>
                <Link href={`/${guideSlug}`}>
                  <BookOpen className="mr-2 h-5 w-5" />
                  Leggi la guida
                </Link>
              </Button>
            )}
            <Button variant="outline" size="lg" asChild>
              <a href="https://www.cnel.it/Archivio-Contratti" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-5 w-5" />
                Archivio CNEL
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
