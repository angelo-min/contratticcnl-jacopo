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

  if (!guide || !guide.preavviso) {
    return { title: 'Pagina non trovata | ContrattiCCNL.it' }
  }

  return {
    title: `Preavviso — ${guide.info.titolo} | ContrattiCCNL.it`,
    description: `Termini di preavviso per dimissioni e licenziamento del ${guide.info.titolo}. Aggiornato al ${new Date().getFullYear()}.`,
  }
}

export default async function PreavvisoPage({ params }: Props) {
  const { slug } = await params
  const guide = getCCNLGuide(slug)

  if (!guide || !guide.preavviso) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <GuideSubpage
          guide={guide}
          title="Preavviso"
          content={guide.preavviso}
          currentSection="preavviso"
        />
      </main>
      <Footer />
    </div>
  )
}
