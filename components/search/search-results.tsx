'use client'

import { CCNLCard } from '@/components/ccnl-card'
import { SearchBar } from '@/components/search-bar'
import { Button } from '@/components/ui/button'
import { SearchX } from 'lucide-react'
import type { CCNL } from '@/types/ccnl'

interface SearchResultsProps {
  results: CCNL[]
  query: string
  totalResults: number
}

export function SearchResults({ results, query, totalResults }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <SearchX className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-6 font-heading text-xl font-bold text-foreground">
          Nessun risultato trovato
        </h3>
        <p className="mt-2 max-w-md text-muted-foreground">
          {query
            ? `Non abbiamo trovato contratti per "${query}". Prova con termini diversi o sfoglia per settore.`
            : 'Nessun contratto corrisponde ai filtri selezionati.'}
        </p>
        <div className="mt-6 w-full max-w-md">
          <SearchBar defaultValue={query} />
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <p className="w-full text-sm text-muted-foreground">Suggerimenti di ricerca:</p>
          {['Metalmeccanico', 'Commercio', 'Edilizia', 'Chimico'].map((suggestion) => (
            <Button key={suggestion} variant="outline" size="sm" asChild>
              <a href={`/ccnl?q=${encodeURIComponent(suggestion)}`}>{suggestion}</a>
            </Button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {totalResults} {totalResults === 1 ? 'risultato' : 'risultati'}
          {query && (
            <>
              {' '}
              per <span className="font-medium text-foreground">&quot;{query}&quot;</span>
            </>
          )}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {results.map((ccnl) => (
          <CCNLCard key={ccnl.id} ccnl={ccnl} />
        ))}
      </div>
    </div>
  )
}
