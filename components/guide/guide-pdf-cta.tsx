import { Download } from 'lucide-react'
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
      className="flex h-full w-full items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-4 text-primary-foreground shadow-sm transition-all hover:shadow-md hover:bg-primary/95"
    >
      <Download className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden="true" />
      <span className="font-heading text-base font-bold leading-tight">
        Scarica gratis CCNL (PDF)
      </span>
    </DownloadPdfButton>
  )
}
