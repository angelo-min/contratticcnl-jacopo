import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PostCard } from '@/components/blog/post-card'
import { Badge } from '@/components/ui/badge'
import { PaginationControls } from '@/components/articoli/pagination-controls'
import { getAllPosts, getAllCategories } from '@/data/db'
import type { Metadata } from 'next'

export const revalidate = 86400

const PER_PAGE = 12

interface PageProps {
  searchParams: Promise<{ pag?: string }>
}

function buildPageUrl(pageNum: number): string {
  return pageNum > 1 ? `/articoli?pag=${pageNum}` : '/articoli'
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams
  const page = Math.max(1, parseInt(sp.pag || '1', 10) || 1)
  const titleSuffix = page > 1 ? ` (pag. ${page})` : ''
  return {
    title: `Articoli e approfondimenti CCNL${titleSuffix} | ContrattiCCNL.it`,
    description:
      'Articoli di approfondimento sui principali contratti collettivi nazionali del lavoro: ferie, preavviso, livelli, periodo di prova e altro.',
    alternates: { canonical: buildPageUrl(page) },
  }
}

export default async function ArticoliPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const allPosts = getAllPosts().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
  const categories = getAllCategories()

  const totalPages = Math.max(1, Math.ceil(allPosts.length / PER_PAGE))
  const currentPage = Math.min(totalPages, Math.max(1, parseInt(sp.pag || '1', 10) || 1))
  const start = (currentPage - 1) * PER_PAGE
  const pagePosts = allPosts.slice(start, start + PER_PAGE)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="border-b border-border bg-card pb-8 pt-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Articoli
            </h1>
            <p className="mt-2 text-muted-foreground">
              {totalPages > 1
                ? `Pagina ${currentPage} di ${totalPages} — ${allPosts.length} articoli di approfondimento sui CCNL`
                : `${allPosts.length} articoli di approfondimento sui CCNL`}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link key={cat.slug} href={`/articoli/${cat.slug}`}>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    {cat.name} ({cat.count})
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pagePosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            buildHref={buildPageUrl}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
