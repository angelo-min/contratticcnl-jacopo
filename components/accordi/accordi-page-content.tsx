'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { PdfDownloadLink } from '@/components/ads/pdf-download-link'
import { getAllAccordi } from '@/data/db'
import type { AccordoRecord } from '@/types/ccnl'

const ITEMS_PER_PAGE = 20

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null
  const parts = dateStr.split('/')
  if (parts.length !== 3) return null
  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1
  let year = parseInt(parts[2], 10)
  if (year < 100) year += 2000
  return new Date(year, month, day)
}

function formatDate(dateStr: string): string {
  const date = parseDate(dateStr)
  if (!date) return dateStr
  return date.toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getYear(dateStr: string): string {
  const date = parseDate(dateStr)
  if (!date) return ''
  return date.getFullYear().toString()
}

function normalizeTipologia(t: string): string {
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
}

export function AccordiPageContent() {
  const allAccordi = getAllAccordi()
  const [query, setQuery] = useState('')
  const [tipologia, setTipologia] = useState('tutti')
  const [anno, setAnno] = useState('tutti')
  const [page, setPage] = useState(1)

  // Calcola tipologie e anni disponibili
  const { tipologie, anni } = useMemo(() => {
    const tipSet = new Set<string>()
    const yearSet = new Set<string>()
    for (const a of allAccordi) {
      if (a.tipologia) tipSet.add(normalizeTipologia(a.tipologia))
      const y = getYear(a.data_stipula)
      if (y) yearSet.add(y)
    }
    return {
      tipologie: Array.from(tipSet).sort(),
      anni: Array.from(yearSet).sort((a, b) => parseInt(b) - parseInt(a)),
    }
  }, [allAccordi])

  // Filtra
  const filtered = useMemo(() => {
    return allAccordi.filter((a) => {
      if (query) {
        const lower = query.toLowerCase()
        if (
          !a.titolo.toLowerCase().includes(lower) &&
          !a.ccnl_id.toLowerCase().includes(lower) &&
          !a.protocollo.includes(lower)
        ) {
          return false
        }
      }
      if (tipologia !== 'tutti' && normalizeTipologia(a.tipologia) !== tipologia) {
        return false
      }
      if (anno !== 'tutti' && getYear(a.data_stipula) !== anno) {
        return false
      }
      return true
    })
  }, [allAccordi, query, tipologia, anno])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  // Reset pagina quando cambiano i filtri
  const updateQuery = (v: string) => { setQuery(v); setPage(1) }
  const updateTipologia = (v: string) => { setTipologia(v); setPage(1) }
  const updateAnno = (v: string) => { setAnno(v); setPage(1) }

  return (
    <>
      {/* Header */}
      <div className="border-b border-border bg-card py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Accordi
          </h1>
          <p className="mt-2 text-muted-foreground">
            {allAccordi.length.toLocaleString('it-IT')} accordi depositati al CNEL
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cerca per titolo, codice CCNL o protocollo..."
                value={query}
                onChange={(e) => updateQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={tipologia} onValueChange={updateTipologia}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Tipologia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tutti">Tutte le tipologie</SelectItem>
                {tipologie.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={anno} onValueChange={updateAnno}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Anno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tutti">Tutti gli anni</SelectItem>
                {anni.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="mb-6 text-sm text-muted-foreground">
          {filtered.length.toLocaleString('it-IT')} {filtered.length === 1 ? 'risultato' : 'risultati'}
        </p>

        {paginated.length > 0 ? (
          <div className="space-y-3">
            {paginated.map((accordo) => (
              <Card key={accordo.protocollo} className="transition-all hover:border-primary/30 hover:shadow-sm">
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {accordo.tipologia}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(accordo.data_stipula)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Prot. {accordo.protocollo}
                      </span>
                    </div>
                    <h3 className="mt-2 line-clamp-2 text-sm font-medium text-foreground">
                      {accordo.titolo}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      CCNL: {accordo.ccnl_id}
                      {accordo.data_scadenza && ` — Scadenza: ${formatDate(accordo.data_scadenza)}`}
                    </p>
                  </div>
                  <PdfDownloadLink
                    href={accordo.link}
                    title={accordo.titolo}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">Nessun accordo trovato con i filtri selezionati.</p>
          </div>
        )}

        {/* Paginazione */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Pagina {page} di {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
