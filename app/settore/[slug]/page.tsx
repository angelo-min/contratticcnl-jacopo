import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CCNLCard } from '@/components/ccnl-card'
import { SectorSidebar } from '@/components/sector/sector-sidebar'
import { SectorIcon } from '@/components/sector/sector-icon'
import { SectorSortSelect, type SortKey } from '@/components/sector/sector-sort-select'
import { SectorSignatoryFilter } from '@/components/sector/sector-signatory-filter'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from '@/components/ui/pagination'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getMacrosettoreBySlug, getCCNLByMacrosettoreSlug, macrosettori } from '@/data/db'
import type { CCNL } from '@/types/ccnl'
import type { Metadata } from 'next'

export const revalidate = 86400

const PER_PAGE = 24

interface SectorPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{
    pag?: string
    ordina?: string
    sigla?: string | string[]
    datoriale?: string | string[]
  }>
}

function toArray(v: string | string[] | undefined): string[] {
  if (!v) return []
  return Array.isArray(v) ? v : [v]
}

function splitSignatories(s: string | undefined): string[] {
  if (!s) return []
  return s
    .split(';')
    .map((p) => p.trim())
    .filter(Boolean)
}

function aggregateSignatories(
  list: CCNL[],
  field: 'firmatariSindacali' | 'firmatariDatori',
  limit = 30,
): Array<{ name: string; count: number }> {
  const counts = new Map<string, number>()
  for (const ccnl of list) {
    for (const part of splitSignatories(ccnl[field])) {
      counts.set(part, (counts.get(part) || 0) + 1)
    }
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'it'))
    .slice(0, limit)
}

function applySignatoryFilters(
  list: CCNL[],
  selectedSigle: string[],
  selectedDatoriali: string[],
): CCNL[] {
  if (selectedSigle.length === 0 && selectedDatoriali.length === 0) return list
  return list.filter((ccnl) => {
    if (selectedSigle.length > 0) {
      const parts = splitSignatories(ccnl.firmatariSindacali)
      if (!selectedSigle.some((s) => parts.includes(s))) return false
    }
    if (selectedDatoriali.length > 0) {
      const parts = splitSignatories(ccnl.firmatariDatori)
      if (!selectedDatoriali.some((d) => parts.includes(d))) return false
    }
    return true
  })
}

export async function generateStaticParams() {
  return macrosettori.map((sector) => ({ slug: sector.slug }))
}

function buildPageUrl(
  slug: string,
  pageNum: number,
  sort: SortKey,
  sigle: string[],
  datoriali: string[],
): string {
  const params = new URLSearchParams()
  if (sort !== 'name-asc') params.set('ordina', sort)
  sigle.forEach((s) => params.append('sigla', s))
  datoriali.forEach((d) => params.append('datoriale', d))
  if (pageNum > 1) params.set('pag', String(pageNum))
  const qs = params.toString()
  return qs ? `/settore/${slug}?${qs}` : `/settore/${slug}`
}

function buildPageItems(current: number, total: number): Array<number | 'ellipsis'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const items: Array<number | 'ellipsis'> = [1]
  if (current > 3) items.push('ellipsis')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    items.push(i)
  }
  if (current < total - 2) items.push('ellipsis')
  items.push(total)
  return items
}

function parseItalianDate(s: string): number {
  if (!s) return 0
  const [d, m, y] = s.split('/')
  const nd = parseInt(d, 10)
  const nm = parseInt(m, 10)
  const ny = parseInt(y, 10)
  if (!nd || !nm || !ny) return 0
  return new Date(ny, nm - 1, nd).getTime()
}

function parseEmployees(s?: string): number {
  if (!s) return -1
  const n = parseInt(s.replace(/[.,\s]/g, ''), 10)
  return isNaN(n) ? -1 : n
}

function sortCCNL(list: CCNL[], key: SortKey): CCNL[] {
  const sorted = [...list]
  switch (key) {
    case 'name-asc':
      return sorted.sort((a, b) => a.nome.localeCompare(b.nome, 'it'))
    case 'name-desc':
      return sorted.sort((a, b) => b.nome.localeCompare(a.nome, 'it'))
    case 'code-asc':
      return sorted.sort((a, b) => a.id.localeCompare(b.id))
    case 'code-desc':
      return sorted.sort((a, b) => b.id.localeCompare(a.id))
    case 'employees-desc':
      return sorted.sort((a, b) => parseEmployees(b.nDipendenti) - parseEmployees(a.nDipendenti))
    case 'companies-desc':
      return sorted.sort((a, b) => parseEmployees(b.nAziende) - parseEmployees(a.nAziende))
    case 'expiry':
      return sorted.sort((a, b) => parseItalianDate(b.scadenza) - parseItalianDate(a.scadenza))
    default:
      return sorted
  }
}

const VALID_SORTS = new Set<SortKey>([
  'name-asc',
  'name-desc',
  'code-asc',
  'code-desc',
  'employees-desc',
  'expiry',
])

function parseSort(raw?: string): SortKey {
  return raw && VALID_SORTS.has(raw as SortKey) ? (raw as SortKey) : 'name-asc'
}

export async function generateMetadata({
  params,
  searchParams,
}: SectorPageProps): Promise<Metadata> {
  const { slug } = await params
  const sp = await searchParams
  const sector = getMacrosettoreBySlug(slug)

  if (!sector) {
    return { title: 'Settore non trovato | ContrattiCCNL.it' }
  }

  const page = Math.max(1, parseInt(sp.pag || '1', 10) || 1)
  const sort = parseSort(sp.ordina)
  const sigle = toArray(sp.sigla)
  const datoriali = toArray(sp.datoriale)
  const titleSuffix = page > 1 ? ` (pag. ${page})` : ''
  return {
    title: `${sector.nome} — CCNL del settore${titleSuffix} | ContrattiCCNL.it`,
    description: sector.descrizione,
    alternates: { canonical: buildPageUrl(slug, page, sort, sigle, datoriali) },
  }
}

export default async function SectorPage({ params, searchParams }: SectorPageProps) {
  const { slug } = await params
  const sp = await searchParams
  const sector = getMacrosettoreBySlug(slug)

  if (!sector) notFound()

  const sort = parseSort(sp.ordina)
  const selectedSigle = toArray(sp.sigla)
  const selectedDatoriali = toArray(sp.datoriale)

  const sectorAll = getCCNLByMacrosettoreSlug(slug)
  const sigleOptions = aggregateSignatories(sectorAll, 'firmatariSindacali')
  const datorialiOptions = aggregateSignatories(sectorAll, 'firmatariDatori')

  const filteredCCNL = applySignatoryFilters(sectorAll, selectedSigle, selectedDatoriali)
  const sortedCCNL = sortCCNL(filteredCCNL, sort)

  const totalPages = Math.max(1, Math.ceil(sortedCCNL.length / PER_PAGE))
  const currentPage = Math.min(totalPages, Math.max(1, parseInt(sp.pag || '1', 10) || 1))
  const start = (currentPage - 1) * PER_PAGE
  const pageCCNL = sortedCCNL.slice(start, start + PER_PAGE)
  const pageItems = buildPageItems(currentPage, totalPages)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Header section */}
        <div className="border-b border-border bg-card pb-8 pt-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/settori">Settori</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{sector.nome}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-6 flex items-start gap-4">
              <SectorIcon name={sector.icona} className="h-12 w-12 shrink-0 text-primary" />
              <div>
                <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
                  {sector.nome}
                </h1>
                <p className="mt-2 max-w-2xl text-muted-foreground">{sector.descrizione}</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{sortedCCNL.length}</span>{' '}
                  {sortedCCNL.length === 1 ? 'contratto disponibile' : 'contratti disponibili'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex-1">
              {sortedCCNL.length > 0 ? (
                <>
                  <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <p className="text-sm text-muted-foreground">
                      {totalPages > 1
                        ? `Pagina ${currentPage} di ${totalPages} — ${sortedCCNL.length} contratti`
                        : `${sortedCCNL.length} contratti`}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <SectorSignatoryFilter
                        kind="sigla"
                        label="Sigle sindacali"
                        options={sigleOptions}
                        selected={selectedSigle}
                      />
                      <SectorSignatoryFilter
                        kind="datoriale"
                        label="Firmatari datoriali"
                        options={datorialiOptions}
                        selected={selectedDatoriali}
                      />
                      <SectorSortSelect current={sort} />
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    {pageCCNL.map((ccnl) => (
                      <CCNLCard key={ccnl.id} ccnl={ccnl} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <Pagination className="mt-12">
                      <PaginationContent>
                        <PaginationItem>
                          {currentPage > 1 ? (
                            <PaginationLink
                              href={buildPageUrl(slug, currentPage - 1, sort, selectedSigle, selectedDatoriali)}
                              size="default"
                              className="gap-1 px-2.5"
                              aria-label="Pagina precedente"
                            >
                              <ChevronLeft className="h-4 w-4" />
                              <span className="hidden sm:block">Precedente</span>
                            </PaginationLink>
                          ) : (
                            <span
                              aria-hidden="true"
                              className="pointer-events-none flex h-9 items-center gap-1 rounded-md px-2.5 text-sm text-muted-foreground/50"
                            >
                              <ChevronLeft className="h-4 w-4" />
                              <span className="hidden sm:block">Precedente</span>
                            </span>
                          )}
                        </PaginationItem>

                        {pageItems.map((item, i) =>
                          item === 'ellipsis' ? (
                            <PaginationItem key={`e-${i}`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          ) : (
                            <PaginationItem key={item}>
                              <PaginationLink
                                href={buildPageUrl(slug, item, sort, selectedSigle, selectedDatoriali)}
                                isActive={item === currentPage}
                              >
                                {item}
                              </PaginationLink>
                            </PaginationItem>
                          ),
                        )}

                        <PaginationItem>
                          {currentPage < totalPages ? (
                            <PaginationLink
                              href={buildPageUrl(slug, currentPage + 1, sort, selectedSigle, selectedDatoriali)}
                              size="default"
                              className="gap-1 px-2.5"
                              aria-label="Pagina successiva"
                            >
                              <span className="hidden sm:block">Successiva</span>
                              <ChevronRight className="h-4 w-4" />
                            </PaginationLink>
                          ) : (
                            <span
                              aria-hidden="true"
                              className="pointer-events-none flex h-9 items-center gap-1 rounded-md px-2.5 text-sm text-muted-foreground/50"
                            >
                              <span className="hidden sm:block">Successiva</span>
                              <ChevronRight className="h-4 w-4" />
                            </span>
                          )}
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              ) : (
                <div className="rounded-lg border border-border bg-card p-8 text-center">
                  <p className="text-muted-foreground">
                    Non ci sono ancora contratti disponibili per questo settore.
                  </p>
                </div>
              )}
            </div>

            <aside className="w-full shrink-0 lg:w-72">
              <SectorSidebar currentSlug={slug} />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
