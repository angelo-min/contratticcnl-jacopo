import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { RichContent } from '@/components/guide/rich-content'

interface StaticPageProps {
  title: string
  html: string
}

export function StaticPage({ title, html }: StaticPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="border-b border-border bg-card py-8">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              {title}
            </h1>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          <RichContent html={html} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
