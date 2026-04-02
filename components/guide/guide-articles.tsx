import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import { getPostsByCategory } from '@/data/db'

interface GuideArticlesProps {
  categorySlug: string
}

export function GuideArticles({ categorySlug }: GuideArticlesProps) {
  const posts = getPostsByCategory(categorySlug)

  if (posts.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="font-heading text-lg font-bold">
          Approfondimenti
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/${categorySlug}/${post.slug}`}
            className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <span className="line-clamp-2 flex-1">{post.title}</span>
            <ArrowRight className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
