import { Suspense } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SearchBar } from '@/components/search-bar'
import { SearchFilters } from '@/components/search/search-filters'
import { SearchResults } from '@/components/search/search-results'
import { getAllCCNL, searchCCNL } from '@/data/db'
import type { CCNL, CCNLStatus } from '@/types/ccnl'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Catalogo CCNL — Tutti i contratti collettivi | ContrattiCCNL.it',
  description:
    'Cerca tra oltre 1.000 contratti collettivi nazionali del lavoro. Filtra per settore e stato. Archivio completo dal database CNEL.',
}

interface PageProps {
  searchParams: Promise<{
    q?: string
    settore?: string | string[]
    stato?: string | string[]
  }>
}

function filterCCNL(
  data: CCNL[],
  sectors: string[],
  statuses: CCNLStatus[]
): CCNL[] {
  return data.filter((ccnl) => {
    if (sectors.length > 0 && !sectors.includes(ccnl.macrosettore)) {
      return false
    }
    if (statuses.length > 0 && !statuses.includes(ccnl.stato)) {
      return false
    }
    return true
  })
}

function CatalogContent({ searchParams }: { searchParams: Awaited<PageProps['searchParams']> }) {
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

  return (
    <>
      {/* Search header */}
      <div className="border-b border-border bg-card py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            {query ? `Risultati per: ${query}` : 'Catalogo CCNL'}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {query
              ? `${filteredResults.length} contratti trovati`
              : 'Tutti i contratti collettivi nazionali dal database CNEL'}
          </p>
          <div className="mt-6 max-w-2xl">
            <SearchBar defaultValue={query} />
          </div>
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
              results={filteredResults}
              query={query}
              totalResults={filteredResults.length}
            />
          </main>
        </div>
      </div>
    </>
  )
}

export default async function ContrattiCCNLPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center">Caricamento...</div>}>
        <CatalogContent searchParams={resolvedParams} />
      </Suspense>
      <Footer />
    </div>
  )
}
