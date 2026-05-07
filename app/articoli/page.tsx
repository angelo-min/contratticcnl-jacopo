import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PostCard } from '@/components/blog/post-card'
import { Badge } from '@/components/ui/badge'
import { getAllPosts, getAllCategories } from '@/data/db'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Articoli e approfondimenti CCNL | ContrattiCCNL.it',
  description:
    'Articoli di approfondimento sui principali contratti collettivi nazionali del lavoro: ferie, preavviso, livelli, periodo di prova e altro.',
}

export default function ArticoliPage() {
  const posts = getAllPosts().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const categories = getAllCategories()

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
              {posts.length} articoli di approfondimento sui CCNL
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
