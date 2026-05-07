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
        <div className="relative border-b border-border/50 bg-background pb-16 pt-32 overflow-hidden">
          <div className="absolute left-10 top-0 -z-10 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[100px]" />
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10">
            <h1 className="max-w-4xl font-heading text-4xl font-normal leading-tight tracking-[-0.02em] text-foreground sm:text-6xl lg:text-7xl">
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
