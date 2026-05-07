import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { GuideSubpage } from '@/components/guide/guide-subpage'
import { getCCNLGuide } from '@/data/db'
import type { Metadata } from 'next'

export const revalidate = 86400

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const guide = getCCNLGuide(slug)

  if (!guide || !guide.parametri_html) {
    return { title: 'Pagina non trovata | ContrattiCCNL.it' }
  }

  return {
    title: `Parametri — ${guide.info.titolo} | ContrattiCCNL.it`,
    description: `Parametri e classificazione del personale del ${guide.info.titolo}. Aggiornato al ${new Date().getFullYear()}.`,
  }
}

export default async function ParametriPage({ params }: Props) {
  const { slug } = await params
  const guide = getCCNLGuide(slug)

  if (!guide || !guide.parametri_html) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <GuideSubpage
          guide={guide}
          title="Parametri"
          contentHtml={guide.parametri_html}
          currentSection="parametri"
        />
      </main>
      <Footer />
    </div>
  )
}
