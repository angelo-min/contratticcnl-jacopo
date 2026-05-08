import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PostCard } from '@/components/blog/post-card'
import { getPostsByCategory } from '@/data/db'

interface GuideRelatedPostsProps {
  slug: string
  title?: string
  limit?: number
}

export function GuideRelatedPosts({
  slug,
  title = 'Notizie e articoli correlati',
  limit = 4,
}: GuideRelatedPostsProps) {
  const posts = getPostsByCategory(slug).slice(0, limit)
  if (posts.length === 0) return null

  return (
    <section id="articoli-correlati" className="mt-16 scroll-mt-24">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        <Link
          href={`/articoli/${slug}`}
          className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex"
        >
          Tutti gli articoli
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}
