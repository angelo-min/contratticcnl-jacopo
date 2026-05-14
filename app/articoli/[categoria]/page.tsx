import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PostCard } from '@/components/blog/post-card'
import { Badge } from '@/components/ui/badge'
import { LoadMoreButton } from '@/components/articoli/load-more-button'
import { getPostsByCategory, getAllCategories } from '@/data/db'
import type { Metadata } from 'next'

export const revalidate = 86400

const PER_PAGE = 9

interface Props {
  params: Promise<{ categoria: string }>
  searchParams: Promise<{ pag?: string }>
}

function buildPageUrl(categoria: string, pageNum: number): string {
  return pageNum > 1
    ? `/articoli/${categoria}?pag=${pageNum}`
    : `/articoli/${categoria}`
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { categoria } = await params
  const sp = await searchParams
  const posts = getPostsByCategory(categoria)

  if (posts.length === 0) {
    return { title: 'Categoria non trovata | ContrattiCCNL.it' }
  }

  const categoryName = posts[0].categories.find((c) => c.slug === categoria)?.name || categoria
  const page = Math.max(1, parseInt(sp.pag || '1', 10) || 1)
  const titleSuffix = page > 1 ? ` (pag. ${page})` : ''

  return {
    title: `${categoryName} — Articoli CCNL${titleSuffix} | ContrattiCCNL.it`,
    description: `Articoli e approfondimenti sul CCNL ${categoryName}.`,
    alternates: { canonical: buildPageUrl(categoria, page) },
    robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
  }
}

export default async function CategoriaPage({ params, searchParams }: Props) {
  const { categoria } = await params
  const sp = await searchParams
  const allPosts = getPostsByCategory(categoria)

  if (allPosts.length === 0) {
    notFound()
  }

  const categoryName =
    allPosts[0].categories.find((c) => c.slug === categoria)?.name || categoria
  const allCategories = getAllCategories()

  const totalPages = Math.max(1, Math.ceil(allPosts.length / PER_PAGE))
  const currentPage = Math.min(totalPages, Math.max(1, parseInt(sp.pag || '1', 10) || 1))
  // Cumulative slice: ogni pagina contiene N*PER_PAGE post (non solo gli ultimi 9).
  // Pattern SEO-safe: senza JS la navigazione "Carica altri" porta a /?pag=N+1
  // che mostra cumulativamente più post; con JS Next.js fa soft navigation e
  // appende i nuovi mantenendo scroll.
  const visiblePosts = allPosts.slice(0, currentPage * PER_PAGE)
  const hasMore = currentPage < totalPages

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="border-b border-border bg-card pb-8 pt-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              {categoryName}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {allPosts.length === 1 ? '1 articolo' : `${allPosts.length} articoli`}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/articoli">
                <Badge
                  variant="outline"
                  className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  Tutti
                </Badge>
              </Link>
              {allCategories.map((cat) => (
                <Link key={cat.slug} href={`/articoli/${cat.slug}`}>
                  <Badge
                    variant={cat.slug === categoria ? 'default' : 'secondary'}
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
            {visiblePosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {hasMore && (
            <LoadMoreButton href={buildPageUrl(categoria, currentPage + 1)} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
