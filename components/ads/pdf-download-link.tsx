'use client'

import { FileText } from 'lucide-react'
import { useDownloadInterstitial } from './download-interstitial'
import { cn } from '@/lib/utils'

interface PdfDownloadLinkProps {
  href: string
  title?: string
  variant?: 'button' | 'inline'
  className?: string
}

export function PdfDownloadLink({ href, title, variant = 'button', className }: PdfDownloadLinkProps) {
  const { triggerDownload } = useDownloadInterstitial()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    triggerDownload(href, title)
  }

  if (variant === 'inline') {
    return (
      <button
        onClick={handleClick}
        className={cn(
          'flex shrink-0 items-center gap-1 text-sm text-primary hover:underline cursor-pointer',
          className,
        )}
      >
        <FileText className="h-4 w-4" />
        PDF
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex shrink-0 items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground cursor-pointer',
        className,
      )}
    >
      <FileText className="h-4 w-4" />
      PDF
    </button>
  )
}
