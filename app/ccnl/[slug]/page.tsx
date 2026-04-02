import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CCNLHeader } from '@/components/ccnl/ccnl-header'
import { CCNLTabs } from '@/components/ccnl/ccnl-tabs'
import { RelatedContracts } from '@/components/ccnl/related-contracts'
import { getCCNLBySlug } from '@/data/db'
import type { Metadata } from 'next'

export const revalidate = 86400

interface CCNLPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: CCNLPageProps): Promise<Metadata> {
  const { slug } = await params
  const ccnl = getCCNLBySlug(slug)

  if (!ccnl) {
    return {
      title: 'CCNL non trovato | ContrattiCCNL.it',
    }
  }

  return {
    title: `${ccnl.nome} | ContrattiCCNL.it`,
    description: `${ccnl.nome} — Settore ${ccnl.settore}. Scadenza: ${ccnl.scadenza}. Consulta il contratto collettivo nazionale.`,
  }
}

export default async function CCNLPage({ params }: CCNLPageProps) {
  const { slug } = await params
  const ccnl = getCCNLBySlug(slug)

  if (!ccnl) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <CCNLHeader ccnl={ccnl} />

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex-1">
              <CCNLTabs ccnl={ccnl} />
            </div>

            <aside className="w-full shrink-0 lg:w-80">
              <RelatedContracts
                currentSlug={ccnl.slug}
                macrosettore={ccnl.macrosettore}
              />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
