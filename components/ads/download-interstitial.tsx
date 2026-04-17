'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, ExternalLink } from 'lucide-react'
import { AdSlot } from './ad-slot'

const COUNTDOWN_SECONDS = 10

// --- Context ---

interface DownloadInterstitialContextValue {
  triggerDownload: (url: string, title?: string) => void
}

const DownloadInterstitialContext = createContext<DownloadInterstitialContextValue | null>(null)

export function useDownloadInterstitial() {
  const ctx = useContext(DownloadInterstitialContext)
  if (!ctx) {
    throw new Error('useDownloadInterstitial must be used within DownloadInterstitialProvider')
  }
  return ctx
}

// --- Provider ---

export function DownloadInterstitialProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS)
  const [skippable, setSkippable] = useState(false)
  const [ready, setReady] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const linkRef = useRef<HTMLAnchorElement | null>(null)
  const downloadCountRef = useRef(0)

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const triggerDownload = useCallback((downloadUrl: string, downloadTitle?: string) => {
    setUrl(downloadUrl)
    setTitle(downloadTitle ?? 'documento')
    setCountdown(COUNTDOWN_SECONDS)
    setSkippable(false)
    setReady(false)
    setOpen(true)
  }, [])

  // Start countdown when dialog opens
  useEffect(() => {
    if (!open) {
      cleanup()
      return
    }

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          cleanup()
          setReady(true)
          return 0
        }
        if (prev <= COUNTDOWN_SECONDS - 5 + 1 && downloadCountRef.current === 0) {
          setSkippable(true)
        }
        return prev - 1
      })
    }, 1000)

    return cleanup
  }, [open, url, cleanup])

  const handleOpen = () => {
    cleanup()
    downloadCountRef.current += 1
    linkRef.current?.click()
    setOpen(false)
  }

  const progress = ((COUNTDOWN_SECONDS - countdown) / COUNTDOWN_SECONDS) * 100

  return (
    <DownloadInterstitialContext.Provider value={{ triggerDownload }}>
      {children}

      <Dialog open={open} onOpenChange={(v) => { if (!v) setOpen(false) }}>
        <DialogContent showCloseButton={false} className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2 text-xl">
              <Download className="h-5 w-5 text-primary" />
              Download in corso
            </DialogTitle>
            <DialogDescription className="text-sm">
              Il tuo documento si aprirà automaticamente tra pochi secondi.
            </DialogDescription>
          </DialogHeader>

          {/* Title of the document */}
          <p className="line-clamp-2 text-sm font-medium text-foreground">
            {title}
          </p>

          {/* Progress bar / Download button */}
          {ready ? (
            <Button onClick={handleOpen} className="w-full gap-2">
              <ExternalLink className="h-4 w-4" />
              Apri PDF
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-1000 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Il download inizierà tra {countdown}s...
                </span>
                {skippable ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleOpen}
                    className="h-auto px-2 py-1 text-xs text-primary"
                  >
                    Salta <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                ) : downloadCountRef.current === 0 ? (
                  <span className="text-xs text-muted-foreground/50">
                    Salta disponibile tra {5 - (COUNTDOWN_SECONDS - countdown)}s
                  </span>
                ) : null}
              </div>
            </div>
          )}

          {/* Ad Slot */}
          <div className="mt-2">
            <AdSlot format="rectangle" className="mx-auto" />
          </div>

          {/* Supporto */}
          <p className="text-center text-xs text-muted-foreground/60">
            La pubblicità ci permette di mantenere il servizio gratuito
          </p>

          {/* Hidden anchor for popup-safe navigation */}
          <a
            ref={linkRef}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden"
            aria-hidden
          />
        </DialogContent>
      </Dialog>
    </DownloadInterstitialContext.Provider>
  )
}
