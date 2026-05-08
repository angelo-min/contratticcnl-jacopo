'use client'

import * as React from 'react'
import { useDownloadInterstitial } from './download-interstitial'

interface DownloadPdfButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  pdfUrl: string
  title?: string
}

export const DownloadPdfButton = React.forwardRef<HTMLButtonElement, DownloadPdfButtonProps>(
  function DownloadPdfButton({ pdfUrl, title, type = 'button', ...props }, ref) {
    const { triggerDownload } = useDownloadInterstitial()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      triggerDownload(pdfUrl, title)
    }

    return <button ref={ref} type={type} onClick={handleClick} {...props} />
  },
)
