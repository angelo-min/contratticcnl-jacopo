import { Download, ArrowRight } from 'lucide-react'
import { DownloadPdfButton } from '@/components/ads/download-pdf-button'

interface GuidePdfCtaProps {
  pdfUrl: string | null
  title?: string
}

export function GuidePdfCta({ pdfUrl, title }: GuidePdfCtaProps) {
  if (!pdfUrl) return null

  return (
    <DownloadPdfButton
      pdfUrl={pdfUrl}
      title={title}
      className="group flex w-full items-center gap-4 rounded-2xl bg-primary px-6 py-5 text-left text-primary-foreground shadow-sm transition-all hover:shadow-md hover:bg-primary/95"
    >
      <Download className="h-7 w-7 shrink-0" strokeWidth={1.75} aria-hidden="true" />
      <div className="flex-1">
        <p className="font-heading text-base font-bold leading-tight">
          Scarica il tuo CCNL in versione PDF
        </p>
        <p className="mt-1 text-xs opacity-80">
          {title ? `${title} — Documento ufficiale CNEL` : 'Documento ufficiale dal database CNEL'}
        </p>
      </div>
      <ArrowRight
        className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1"
        aria-hidden="true"
      />
    </DownloadPdfButton>
  )
}
