import { permanentRedirect } from 'next/navigation'

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ContrattiCCNLRedirect({ searchParams }: PageProps) {
  const params = await searchParams
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (Array.isArray(v)) v.forEach((x) => qs.append(k, x))
    else if (v) qs.append(k, v)
  }
  const target = qs.toString() ? `/ccnl?${qs.toString()}` : '/ccnl'
  permanentRedirect(target)
}
