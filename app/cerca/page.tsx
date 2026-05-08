import { redirect } from 'next/navigation'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function CercaPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const target = q ? `/ccnl?q=${encodeURIComponent(q)}` : '/ccnl'
  redirect(target)
}
