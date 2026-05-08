'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type SignatoryKind = 'sigla' | 'datoriale'

export interface SignatoryOption {
  name: string
  count: number
}

interface SectorSignatoryFilterProps {
  kind: SignatoryKind
  label: string
  options: SignatoryOption[]
  selected: string[]
}

const PARAM_BY_KIND: Record<SignatoryKind, string> = {
  sigla: 'sigla',
  datoriale: 'datoriale',
}

export function SectorSignatoryFilter({
  kind,
  label,
  options,
  selected,
}: SectorSignatoryFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const param = PARAM_BY_KIND[kind]

  const updateSelection = (next: string[]) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(param)
    next.forEach((v) => params.append(param, v))
    params.delete('pag')
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  const toggle = (name: string, checked: boolean) => {
    const next = checked ? [...selected, name] : selected.filter((s) => s !== name)
    updateSelection(next)
  }

  const clear = () => updateSelection([])

  if (options.length === 0) return null

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'h-9 gap-2 rounded-full text-sm',
            selected.length > 0 && 'border-primary/50 text-primary',
          )}
        >
          <span className="font-medium">{label}</span>
          {selected.length > 0 && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
              {selected.length}
            </span>
          )}
          <ChevronDown className="h-4 w-4 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end">
        <div className="border-b border-border px-4 py-3 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {label}
          </span>
          {selected.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Pulisci
            </button>
          )}
        </div>
        <div className="max-h-[320px] overflow-y-auto p-2">
          {options.map((opt) => {
            const isChecked = selected.includes(opt.name)
            return (
              <label
                key={opt.name}
                className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(c) => toggle(opt.name, c === true)}
                />
                <span className="flex-1 truncate">{opt.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{opt.count}</span>
              </label>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
