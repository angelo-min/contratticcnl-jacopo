import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { GuidePage } from '@/components/guide/guide-page'
import { PostCard } from '@/components/blog/post-card'
import { getCCNLGuide, getPostsByCategory, getAllCategories } from '@/data/db'
import { resolveYoastTemplate } from '@/lib/seo'
import type { Metadata } from 'next'

export const revalidate = 86400

interface SlugPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params

  // 1. Guida CCNL
  const guide = getCCNLGuide(slug)
  if (guide) {
    return {
      title: resolveYoastTemplate(guide.seo_title, guide.title),
      description: resolveYoastTemplate(guide.seo_description, guide.title),
    }
  }

  // 2. Categoria blog
  const categoryPosts = getPostsByCategory(slug)
  if (categoryPosts.length > 0) {
    const categoryName = categoryPosts[0].categories.find((c) => c.slug === slug)?.name || slug
    return {
      title: `${categoryName} — Articoli CCNL | ContrattiCCNL.it`,
      description: `Articoli e approfondimenti sul CCNL ${categoryName}. Leggi tutti gli articoli del contratto.`,
    }
  }

  return { title: 'Pagina non trovata | ContrattiCCNL.it' }
}

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params

  // 1. Guida CCNL
  const guide = getCCNLGuide(slug)
  if (guide) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">
          <GuidePage guide={guide} />
        </main>
        <Footer />
      </div>
    )
  }

  // 2. Categoria blog (es. /multiservizi, /bancari)
  const categoryPosts = getPostsByCategory(slug)
  if (categoryPosts.length > 0) {
    const categoryName = categoryPosts[0].categories.find((c) => c.slug === slug)?.name || slug

    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">
          <div className="relative border-b border-border/50 bg-background pb-16 pt-32 overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
              <span className="mb-6 block text-xs font-bold uppercase tracking-widest text-primary">Archivio Articoli</span>
              <h1 className="font-heading text-5xl font-normal tracking-[-0.02em] text-foreground sm:text-7xl">
                {categoryName}
              </h1>
              <p className="mt-6 max-w-2xl text-lg font-medium text-muted-foreground">
                {categoryPosts.length} {categoryPosts.length === 1 ? 'Approfondimento disponibile' : 'Approfondimenti disponibili'} nel settore.
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categoryPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  notFound()
}
