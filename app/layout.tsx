import type { Metadata, Viewport } from 'next'
import { Instrument_Serif, Manrope } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-playfair', // Keeping original variable name to avoid breaking tailwind config mapping, but it's Instrument Serif
  style: ['normal', 'italic'],
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-source-sans', // Keeping original variable name
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ContrattiCCNL.it - Archivio Contratti Collettivi Nazionali del Lavoro',
  description: 'Archivio gratuito di oltre 1.000 CCNL e 2.000 accordi di rinnovo. Trova il tuo contratto collettivo nazionale del lavoro, sempre aggiornato.',
  keywords: 'CCNL, contratti collettivi, lavoro, rinnovo contratti, metalmeccanico, commercio, edilizia',
  authors: [{ name: 'ContrattiCCNL.it' }],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1C1B1A',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it">
      <body className={`${instrumentSerif.variable} ${manrope.variable} font-sans antialiased bg-background`}>
        {/* Noise Texture Overlay */}
        <div className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.04] mix-blend-overlay">
          <svg className="absolute inset-0 h-full w-full">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
        </div>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
