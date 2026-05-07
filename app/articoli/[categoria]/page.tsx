import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PostCard } from '@/components/blog/post-card'
import { Badge } from '@/components/ui/badge'
import { getPostsByCategory, getAllCategories } from '@/data/db'
import type { Metadata } from 'next'

export const revalidate = 86400

interface Props {
  params: Promise<{ categoria: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params
  const posts = getPostsByCategory(categoria)

  if (posts.length === 0) {
    return { title: 'Categoria non trovata | ContrattiCCNL.it' }
  }

  const categoryName = posts[0].categories.find((c) => c.slug === categoria)?.name || categoria

  return {
    title: `${categoryName} — Articoli CCNL | ContrattiCCNL.it`,
    description: `Articoli e approfondimenti sul CCNL ${categoryName}.`,
  }
}

export default async function CategoriaPage({ params }: Props) {
  const { categoria } = await params
  const posts = getPostsByCategory(categoria)

  if (posts.length === 0) {
    notFound()
  }

  const categoryName = posts[0].categories.find((c) => c.slug === categoria)?.name || categoria
  const allCategories = getAllCategories()

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
              {posts.length} {posts.length === 1 ? 'articolo' : 'articoli'}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/articoli">
                <Badge variant="outline" className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground">
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
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
