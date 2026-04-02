'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { macrosettori } from '@/data/db'
import type { CCNLStatus } from '@/types/ccnl'

interface SearchFiltersProps {
  selectedSectors: string[]
  selectedStatuses: CCNLStatus[]
}

const statusOptions: { value: CCNLStatus; label: string }[] = [
  { value: 'vigente', label: 'Vigente' },
  { value: 'scaduto', label: 'Scaduto' },
]

export function SearchFilters({ selectedSectors, selectedStatuses }: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilters = (type: 'sector' | 'status', value: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentValues = params.getAll(type === 'sector' ? 'settore' : 'stato')

    if (checked) {
      params.append(type === 'sector' ? 'settore' : 'stato', value)
    } else {
      params.delete(type === 'sector' ? 'settore' : 'stato')
      currentValues
        .filter((v) => v !== value)
        .forEach((v) => params.append(type === 'sector' ? 'settore' : 'stato', v))
    }

    router.push(`/contratti-ccnl?${params.toString()}`)
  }

  const clearFilters = () => {
    const params = new URLSearchParams()
    const query = searchParams.get('q')
    if (query) params.set('q', query)
    router.push(`/contratti-ccnl?${params.toString()}`)
  }

  const hasFilters = selectedSectors.length > 0 || selectedStatuses.length > 0

  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading text-lg font-bold">Filtri</CardTitle>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto p-0 text-sm text-primary">
              Cancella filtri
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Macrosettore filter */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-foreground">Macrosettore</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {macrosettori.map((sector) => (
              <div key={sector.slug} className="flex items-center gap-2">
                <Checkbox
                  id={`sector-${sector.slug}`}
                  checked={selectedSectors.includes(sector.cod)}
                  onCheckedChange={(checked) => updateFilters('sector', sector.cod, checked as boolean)}
                />
                <Label htmlFor={`sector-${sector.slug}`} className="cursor-pointer text-sm text-muted-foreground">
                  {sector.nome} ({sector.numeroContratti})
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Status filter */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-foreground">Stato contratto</h4>
          <div className="space-y-2">
            {statusOptions.map((status) => (
              <div key={status.value} className="flex items-center gap-2">
                <Checkbox
                  id={`status-${status.value}`}
                  checked={selectedStatuses.includes(status.value)}
                  onCheckedChange={(checked) => updateFilters('status', status.value, checked as boolean)}
                />
                <Label htmlFor={`status-${status.value}`} className="cursor-pointer text-sm text-muted-foreground">
                  {status.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
