'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchBarProps {
  large?: boolean
  defaultValue?: string
  className?: string
}

export function SearchBar({ large = false, defaultValue = '', className = '' }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/contratti-ccnl?q=${encodeURIComponent(query.trim())}`)
    }
  }

  if (large) {
    return (
      <form onSubmit={handleSubmit} className={`w-full ${className}`}>
        <div className="relative flex w-full items-center overflow-hidden rounded-xl border border-border bg-card shadow-lg transition-shadow focus-within:shadow-xl">
          <Search className="absolute left-5 h-6 w-6 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cerca per settore, categoria o nome CCNL..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-16 flex-1 border-0 bg-transparent pl-14 pr-4 text-lg placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button
            type="submit"
            size="lg"
            className="m-2 h-12 rounded-lg px-8 font-medium"
          >
            Cerca
          </Button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="relative flex w-full items-center">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Cerca CCNL..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-10 flex-1 pl-10 pr-4"
        />
        <Button type="submit" size="sm" className="ml-2">
          Cerca
        </Button>
      </div>
    </form>
  )
}
