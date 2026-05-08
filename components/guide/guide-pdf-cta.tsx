import Link from 'next/link'
import { Download, ArrowRight } from 'lucide-react'

export function GuidePdfCta() {
  return (
    <Link
      href="/pdf/"
      className="group flex items-center gap-4 rounded-2xl bg-primary px-6 py-5 text-primary-foreground shadow-sm transition-all hover:shadow-md hover:bg-primary/95"
    >
      <Download className="h-7 w-7 shrink-0" strokeWidth={1.75} aria-hidden="true" />
      <div className="flex-1">
        <p className="font-heading text-base font-bold leading-tight">
          Scarica il tuo CCNL in versione PDF
        </p>
        <p className="mt-1 text-xs opacity-80">
          Tutti i contratti collettivi nazionali aggiornati e scaricabili
        </p>
      </div>
      <ArrowRight
        className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1"
        aria-hidden="true"
      />
    </Link>
  )
}
