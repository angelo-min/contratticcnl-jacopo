import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { PostRecord } from '@/types/ccnl'

interface PostCardProps {
  post: PostRecord
}

export function PostCard({ post }: PostCardProps) {
  const category = post.categories[0]
  const href = category ? `/${category.slug}/${post.slug}` : `/${post.slug}`

  return (
    <Card className="group flex h-full flex-col transition-all hover:border-primary/30 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-2">
          {post.categories.map((cat) => (
            <Badge key={cat.slug} variant="secondary" className="text-xs">
              {cat.name}
            </Badge>
          ))}
          <span className="text-xs text-muted-foreground">
            {new Date(post.date).toLocaleDateString('it-IT', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
        <Link href={href}>
          <h3 className="mt-2 line-clamp-2 font-heading text-lg font-bold text-foreground transition-colors group-hover:text-primary">
            {post.title}
          </h3>
        </Link>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt || post.content_clean.slice(0, 200)}
        </p>
      </CardContent>
    </Card>
  )
}
