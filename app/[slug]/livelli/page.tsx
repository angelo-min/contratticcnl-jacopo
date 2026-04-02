import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { GuideSubpage } from '@/components/guide/guide-subpage'
import { getCCNLGuide } from '@/data/db'
import { resolveYoastTemplate } from '@/lib/seo'
import type { Metadata } from 'next'

export const revalidate = 86400

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const guide = getCCNLGuide(slug)

  if (!guide) {
    return { title: 'Pagina non trovata | ContrattiCCNL.it' }
  }

  const title = guide.livelli_title || `Livelli e mansioni — ${guide.info.titolo}`

  return {
    title: `${title} | ContrattiCCNL.it`,
    description: `Livelli, mansioni e classificazione del personale del ${guide.info.titolo}. Aggiornato al ${new Date().getFullYear()}.`,
  }
}

export default async function LivelliPage({ params }: Props) {
  const { slug } = await params
  const guide = getCCNLGuide(slug)

  if (!guide || !guide.livelli) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <GuideSubpage
          guide={guide}
          title={guide.livelli_title || 'Livelli e mansioni'}
          content={guide.livelli}
          currentSection="livelli"
        />
      </main>
      <Footer />
    </div>
  )
}
