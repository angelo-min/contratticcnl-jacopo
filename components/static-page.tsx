import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

interface StaticPageProps {
  title: string
  children: React.ReactNode
}

export function StaticPage({ title, children }: StaticPageProps) {
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
          <div className="text-[1.0625rem] leading-[1.8] text-foreground/85 whitespace-pre-line">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
