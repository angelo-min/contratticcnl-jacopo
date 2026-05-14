import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'
import { BreadcrumbJsonLd } from '@/components/breadcrumb-jsonld'
import { RichContent } from '@/components/guide/rich-content'
import { PostCard } from '@/components/blog/post-card'
import { getPostsByCategory } from '@/data/db'
import type { PostRecord } from '@/types/ccnl'

interface PostPageProps {
  post: PostRecord
}

export function PostPage({ post }: PostPageProps) {
  const category = post.categories[0]
  const relatedPosts = category
    ? getPostsByCategory(category.slug)
        .filter((p) => p.id !== post.id)
        .slice(0, 3)
    : []

  return (
    <article>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Articoli', href: '/articoli' },
          ...(category ? [{ name: category.name, href: `/articoli/${category.slug}` }] : []),
          { name: post.title, href: category ? `/${category.slug}/${post.slug}` : `/${post.slug}` },
        ]}
      />
      {/* Breadcrumb */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-3xl px-4 pb-4 pt-28 sm:px-6">
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
                  <Link href="/articoli">Articoli</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {category && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={`/articoli/${category.slug}`}>{category.name}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{post.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Header */}
      <header className="mx-auto max-w-3xl px-4 pt-12 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          {post.categories.map((cat) => (
            <Link key={cat.slug} href={`/articoli/${cat.slug}`}>
              <Badge
                variant="secondary"
                className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {cat.name}
              </Badge>
            </Link>
          ))}
        </div>

        <h1 className="mt-5 font-heading text-3xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
          {post.title}
        </h1>

        <div className="mt-5 flex items-center gap-3 text-sm text-muted-foreground">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('it-IT', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
        </div>

        <div className="mt-8 h-px bg-border" />
      </header>

      {/* Body */}
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <RichContent html={post.content_html || post.content_clean} />
      </div>

      {/* Footer tags */}
      <footer className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
        <div className="h-px bg-border" />
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {post.categories.map((cat) => (
            <Link key={cat.slug} href={`/articoli/${cat.slug}`}>
              <Badge
                variant="outline"
                className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {cat.name}
              </Badge>
            </Link>
          ))}
        </div>
      </footer>

      {/* Related articles */}
      {relatedPosts.length > 0 && category && (
        <section className="border-t border-border bg-muted/30 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Articoli correlati
              </h2>
              <Link
                href={`/articoli/${category.slug}`}
                className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex"
              >
                Tutti gli articoli {category.name}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
