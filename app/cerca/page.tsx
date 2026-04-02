import { redirect } from 'next/navigation'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function CercaPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const target = q ? `/contratti-ccnl?q=${encodeURIComponent(q)}` : '/contratti-ccnl'
  redirect(target)
}
