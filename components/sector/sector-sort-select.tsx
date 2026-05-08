'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type SortKey =
  | 'name-asc'
  | 'name-desc'
  | 'code-asc'
  | 'code-desc'
  | 'employees-desc'
  | 'companies-desc'
  | 'expiry'

export const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'name-asc', label: 'Nome (A → Z)' },
  { value: 'name-desc', label: 'Nome (Z → A)' },
  { value: 'code-asc', label: 'Codice CNEL (A001 → Z999)' },
  { value: 'code-desc', label: 'Codice CNEL (Z999 → A001)' },
  { value: 'employees-desc', label: 'N. dipendenti (più alto)' },
  { value: 'companies-desc', label: 'N. aziende (più alto)' },
  { value: 'expiry', label: 'Scadenza più recente' },
]

interface SectorSortSelectProps {
  current: SortKey
}

export function SectorSortSelect({ current }: SectorSortSelectProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'name-asc') {
      params.delete('ordina')
    } else {
      params.set('ordina', value)
    }
    params.delete('pag')
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
        Ordina per
      </span>
      <Select value={current} onValueChange={handleChange}>
        <SelectTrigger className="h-9 w-[220px] rounded-full text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
