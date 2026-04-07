'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ArrowRight } from 'lucide-react'
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
        <div className="relative flex w-full items-center overflow-hidden rounded-full border border-border/80 bg-card/80 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] focus-within:border-primary/50 focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.08)] focus-within:ring-4 focus-within:ring-primary/10">
          <Search className="absolute left-8 h-6 w-6 text-muted-foreground/60 hidden sm:block transition-colors" />
          <Input
            type="text"
            placeholder="A quale settore cerchi? (es. Commercio, Edilizia...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-20 flex-1 rounded-full border-0 bg-transparent px-8 sm:pl-20 pr-4 text-xl font-medium placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button
            type="submit"
            size="lg"
            className="m-2 h-16 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 font-medium shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Cerca <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="relative flex w-full items-center rounded-full border border-border/80 bg-card/80 backdrop-blur-sm shadow-sm transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10">
        <Search className="absolute left-4 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Cerca CCNL..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-10 flex-1 rounded-full border-0 bg-transparent pl-12 pr-4 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button type="submit" size="sm" variant="ghost" className="rounded-full hover:bg-primary/10 hover:text-primary font-bold mr-1">
          Vai
        </Button>
      </div>
    </form>
  )
}
