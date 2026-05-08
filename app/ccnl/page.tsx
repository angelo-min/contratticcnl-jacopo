import { Suspense } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SearchBar } from '@/components/search-bar'
import { SearchFilters } from '@/components/search/search-filters'
import { SearchResults } from '@/components/search/search-results'
import { ShareButtons } from '@/components/share-buttons'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from '@/components/ui/pagination'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getAllCCNL, searchCCNL } from '@/data/db'
import type { CCNL, CCNLStatus } from '@/types/ccnl'
import type { Metadata } from 'next'

export const revalidate = 86400

const PER_PAGE = 50
const BASE_PATH = '/ccnl'

interface PageProps {
  searchParams: Promise<{
    q?: string
    settore?: string | string[]
    stato?: string | string[]
    pag?: string
  }>
}

function buildPageUrl(pageNum: number, sp: Record<string, string | string[] | undefined>): string {
  const params = new URLSearchParams()
  if (sp.q) params.set('q', String(sp.q))
  for (const key of ['settore', 'stato'] as const) {
    const val = sp[key]
    if (Array.isArray(val)) val.forEach((v) => params.append(key, v))
    else if (val) params.append(key, val)
  }
  if (pageNum > 1) params.set('pag', String(pageNum))
  const qs = params.toString()
  return qs ? `${BASE_PATH}?${qs}` : BASE_PATH
}

function buildPageItems(current: number, total: number): Array<number | 'ellipsis'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const items: Array<number | 'ellipsis'> = [1]
  if (current > 3) items.push('ellipsis')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    items.push(i)
  }
  if (current < total - 2) items.push('ellipsis')
  items.push(total)
  return items
}

function filterCCNL(data: CCNL[], sectors: string[], statuses: CCNLStatus[]): CCNL[] {
  return data.filter((ccnl) => {
    if (sectors.length > 0 && !sectors.includes(ccnl.macrosettore)) return false
    if (statuses.length > 0 && !statuses.includes(ccnl.stato)) return false
    return true
  })
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams
  const page = Math.max(1, parseInt(sp.pag || '1', 10) || 1)
  const titleBase = 'Catalogo CCNL — Tutti i contratti collettivi nazionali'
  const title = page > 1 ? `${titleBase} (pag. ${page}) | ContrattiCCNL.it` : `${titleBase} | ContrattiCCNL.it`
  const canonical = buildPageUrl(page, sp)
  return {
    title,
    description:
      'Cerca tra oltre 1.000 contratti collettivi nazionali del lavoro. Filtra per settore e stato. Archivio completo dal database CNEL.',
    alternates: { canonical },
  }
}

function CatalogContent({
  searchParams,
}: {
  searchParams: Awaited<PageProps['searchParams']>
}) {
  const query = searchParams.q || ''
  const sectorsParam = searchParams.settore
  const statusParam = searchParams.stato

  const selectedSectors = Array.isArray(sectorsParam)
    ? sectorsParam
    : sectorsParam
      ? [sectorsParam]
      : []

  const selectedStatuses = (Array.isArray(statusParam)
    ? statusParam
    : statusParam
      ? [statusParam]
      : []) as CCNLStatus[]

  const baseResults = query ? searchCCNL(query) : getAllCCNL()
  const filteredResults = filterCCNL(baseResults, selectedSectors, selectedStatuses)

  const totalResults = filteredResults.length
  const totalPages = Math.max(1, Math.ceil(totalResults / PER_PAGE))
  const currentPage = Math.min(
    totalPages,
    Math.max(1, parseInt(searchParams.pag || '1', 10) || 1),
  )
  const start = (currentPage - 1) * PER_PAGE
  const pageResults = filteredResults.slice(start, start + PER_PAGE)
  const pageItems = buildPageItems(currentPage, totalPages)

  return (
    <>
      {/* Search header */}
      <div className="relative border-b border-border/50 bg-background pb-12 pt-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-primary)_0%,transparent_20%)] opacity-[0.03]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          <h1 className="font-heading text-5xl font-normal tracking-[-0.02em] text-foreground sm:text-7xl lg:text-8xl">
            {query ? (
              <>
                Risultati per <br />
                <span className="italic text-primary">&apos;{query}&apos;</span>
              </>
            ) : (
              <>
                Catalogo <span className="italic text-primary">CCNL</span>
              </>
            )}
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-medium text-muted-foreground">
            {query
              ? `${totalResults} contratti trovati`
              : 'Esplora tutti i contratti collettivi nazionali sincronizzati dal database CNEL.'}
          </p>
          <div className="mt-10 w-full max-w-3xl">
            <SearchBar defaultValue={query} large />
          </div>

          <ShareButtons
            title={query ? `Risultati CCNL per "${query}"` : 'Catalogo CCNL — Tutti i contratti collettivi'}
            className="mt-8"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full shrink-0 lg:w-72">
            <SearchFilters
              selectedSectors={selectedSectors}
              selectedStatuses={selectedStatuses}
            />
          </aside>

          <main className="flex-1">
            <SearchResults
              results={pageResults}
              query={query}
              totalResults={totalResults}
            />

            {totalPages > 1 && (
              <Pagination className="mt-12">
                <PaginationContent>
                  <PaginationItem>
                    {currentPage > 1 ? (
                      <PaginationLink
                        href={buildPageUrl(currentPage - 1, searchParams)}
                        size="default"
                        className="gap-1 px-2.5"
                        aria-label="Pagina precedente"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:block">Precedente</span>
                      </PaginationLink>
                    ) : (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none flex h-9 items-center gap-1 rounded-md px-2.5 text-sm text-muted-foreground/50"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:block">Precedente</span>
                      </span>
                    )}
                  </PaginationItem>

                  {pageItems.map((item, i) =>
                    item === 'ellipsis' ? (
                      <PaginationItem key={`e-${i}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={item}>
                        <PaginationLink
                          href={buildPageUrl(item, searchParams)}
                          isActive={item === currentPage}
                        >
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}

                  <PaginationItem>
                    {currentPage < totalPages ? (
                      <PaginationLink
                        href={buildPageUrl(currentPage + 1, searchParams)}
                        size="default"
                        className="gap-1 px-2.5"
                        aria-label="Pagina successiva"
                      >
                        <span className="hidden sm:block">Successiva</span>
                        <ChevronRight className="h-4 w-4" />
                      </PaginationLink>
                    ) : (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none flex h-9 items-center gap-1 rounded-md px-2.5 text-sm text-muted-foreground/50"
                      >
                        <span className="hidden sm:block">Successiva</span>
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    )}
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </main>
        </div>
      </div>
    </>
  )
}

export default async function CCNLCatalogPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center">Caricamento...</div>
        }
      >
        <CatalogContent searchParams={resolvedParams} />
      </Suspense>
      <Footer />
    </div>
  )
}
