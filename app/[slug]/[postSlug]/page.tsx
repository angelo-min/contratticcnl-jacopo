import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PostPage } from '@/components/blog/post-page'
import { getPostBySlug, getPostsByCategory } from '@/data/db'
import { resolveYoastTemplate } from '@/lib/seo'
import type { Metadata } from 'next'

export const revalidate = 86400

interface Props {
  params: Promise<{ slug: string; postSlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postSlug } = await params
  const post = getPostBySlug(postSlug)

  if (!post) {
    return { title: 'Articolo non trovato | ContrattiCCNL.it' }
  }

  return {
    title: post.seo.title
      ? resolveYoastTemplate(post.seo.title, post.title)
      : `${post.title} | ContrattiCCNL.it`,
    description: post.seo.description
      ? resolveYoastTemplate(post.seo.description, post.title)
      : post.excerpt || post.content_clean.slice(0, 160),
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug, postSlug } = await params
  const post = getPostBySlug(postSlug)

  // Verifica che il post esista e che la categoria nell'URL corrisponda
  if (!post) {
    notFound()
  }

  const belongsToCategory = post.categories.some((c) => c.slug === slug)
  if (!belongsToCategory) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <PostPage post={post} />
      </main>
      <Footer />
    </div>
  )
}
