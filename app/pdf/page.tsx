import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getAllAccordi, getCCNLById } from '@/data/db'
import { PdfPageList } from '@/components/ads/pdf-page-list'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CCNL in PDF — Scarica i contratti collettivi | ContrattiCCNL.it',
  description:
    'Scarica i testi completi dei contratti collettivi nazionali del lavoro in formato PDF dall\'archivio CNEL.',
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null
  const parts = dateStr.split('/')
  if (parts.length !== 3) return null
  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1
  let year = parseInt(parts[2], 10)
  if (year < 100) year += 2000
  return new Date(year, month, day)
}

function formatDate(dateStr: string): string {
  const date = parseDate(dateStr)
  if (!date) return dateStr
  return date.toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function PdfPage() {
  const accordi = getAllAccordi()

  // Prendi solo i "Testo definitivo", il più recente per ogni ccnl_id
  const latestByccnl = new Map<string, typeof accordi[0]>()
  for (const a of accordi) {
    if (a.tipologia.toLowerCase() !== 'testo definitivo') continue
    const existing = latestByccnl.get(a.ccnl_id)
    if (!existing) {
      latestByccnl.set(a.ccnl_id, a)
    } else {
      const dateA = parseDate(a.data_stipula)
      const dateB = parseDate(existing.data_stipula)
      if (dateA && dateB && dateA > dateB) {
        latestByccnl.set(a.ccnl_id, a)
      }
    }
  }

  const testiDefinitivi = Array.from(latestByccnl.values()).sort((a, b) => {
    const dateA = parseDate(a.data_stipula)
    const dateB = parseDate(b.data_stipula)
    if (!dateA || !dateB) return 0
    return dateB.getTime() - dateA.getTime()
  })

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="border-b border-border bg-card pb-8 pt-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              CCNL in PDF
            </h1>
            <p className="mt-2 text-muted-foreground">
              {testiDefinitivi.length} testi definitivi scaricabili dall&apos;archivio CNEL
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <PdfPageList
            items={testiDefinitivi.map((accordo) => {
              const ccnl = getCCNLById(accordo.ccnl_id)
              return {
                ccnlId: accordo.ccnl_id,
                protocollo: accordo.protocollo,
                dataStipula: formatDate(accordo.data_stipula),
                titolo: accordo.titolo,
                link: accordo.link,
                ccnlSlug: ccnl?.slug,
              }
            })}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
