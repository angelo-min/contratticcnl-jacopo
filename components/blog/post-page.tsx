import Link from 'next/link'
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
import type { PostRecord } from '@/types/ccnl'

interface PostPageProps {
  post: PostRecord
}

export function PostPage({ post }: PostPageProps) {
  const category = post.categories[0]

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
        <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6">
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
      <header className="mx-auto max-w-2xl px-4 pt-12 sm:px-6">
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
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <div className="text-[1.125rem] leading-[1.8] text-foreground/85 whitespace-pre-line">
          {post.content_clean}
        </div>
      </div>

      {/* Footer */}
      <footer className="mx-auto max-w-2xl px-4 pb-16 sm:px-6">
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
    </article>
  )
}
