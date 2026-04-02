import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText } from 'lucide-react'
import { getAllAccordi, getCCNLById } from '@/data/db'
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
        <div className="border-b border-border bg-card py-8">
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
          <div className="space-y-3">
            {testiDefinitivi.map((accordo) => {
              const ccnl = getCCNLById(accordo.ccnl_id)
              return (
                <Card key={`${accordo.ccnl_id}-${accordo.protocollo}`} className="transition-all hover:border-primary/30 hover:shadow-sm">
                  <CardContent className="flex items-center justify-between gap-4 p-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {accordo.ccnl_id}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(accordo.data_stipula)}
                        </span>
                      </div>
                      <h3 className="mt-2 line-clamp-2 text-sm font-medium text-foreground">
                        {accordo.titolo}
                      </h3>
                      {ccnl && (
                        <Link
                          href={`/ccnl/${ccnl.slug}`}
                          className="mt-1 inline-block text-xs text-primary hover:underline"
                        >
                          Vedi scheda CCNL
                        </Link>
                      )}
                    </div>
                    <a
                      href={accordo.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      <FileText className="h-4 w-4" />
                      PDF
                    </a>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
