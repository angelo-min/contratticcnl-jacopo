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
      <div className="relative border-b border-border/50 bg-background pb-12 pt-32 overflow-hidden">
        {/* Texture overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-primary)_0%,transparent_20%)] opacity-[0.03]"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          <h1 className="font-heading text-5xl font-normal tracking-[-0.02em] text-foreground sm:text-7xl lg:text-8xl">
            {query ? (
              <>Risultati per <br/><span className="italic text-primary">'{query}'</span></>
            ) : (
              <>Catalogo <span className="italic text-primary">Archivio</span></>
            )}
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-medium text-muted-foreground">
            {query
              ? `${filteredResults.length} contratti trovati`
              : 'Esplora e ricerca tra tutti i contratti collettivi nazionali sincronizzati dal database CNEL.'}
          </p>
          <div className="mt-10 w-full max-w-3xl">
            <SearchBar defaultValue={query} large />
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
