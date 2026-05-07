import Link from 'next/link'
import { macrosettori } from '@/data/db'

export function Footer() {
  const topSectors = macrosettori.slice(0, 6)

  return (
    <footer className="mt-20 bg-foreground text-background rounded-t-[3rem] px-4 pt-20 pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          
          {/* Logo and description */}
          <div className="lg:col-span-5 flex flex-col items-start pr-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary transition-transform group-hover:scale-105">
                <span className="font-heading text-2xl font-bold text-primary-foreground leading-none">C</span>
              </div>
              <span className="font-heading text-3xl font-normal text-background">ContrattiCCNL</span>
            </Link>
            <p className="mt-8 max-w-md text-base leading-relaxed text-muted">
              Archivio gratuito e sempre aggiornato di Contratti Collettivi Nazionali del Lavoro italiani. Un digital instrument progettato per l'eccellenza.
            </p>
            
            <div className="mt-10 flex items-center gap-3 rounded-full bg-background/10 px-4 py-2 border border-background/20 backdrop-blur-sm">
              <span className="inline-flex rounded-full h-2 w-2 bg-background/60"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-background">Dati aggiornati al 04/2026</span>
            </div>
          </div>

          {/* Settori */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-background/60 mb-6">
              Settori Primari
            </h3>
            <ul className="space-y-4">
              {topSectors.map((settore) => (
                <li key={settore.slug}>
                  <Link
                    href={`/settore/${settore.slug}`}
                    className="text-sm font-medium text-background/90 transition-colors hover:text-primary hover:underline underline-offset-4"
                  >
                    {settore.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Risorse */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-background/60 mb-6">
              Risorse
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/contratti-ccnl" className="text-sm font-medium text-background/90 transition-colors hover:text-primary hover:underline underline-offset-4">
                  Catalogo CCNL
                </Link>
              </li>
              <li>
                <Link href="/accordi" className="text-sm font-medium text-background/90 transition-colors hover:text-primary hover:underline underline-offset-4">
                  Accordi Integrativi
                </Link>
              </li>
              <li>
                <Link href="/articoli" className="text-sm font-medium text-background/90 transition-colors hover:text-primary hover:underline underline-offset-4">
                  Archivio Articoli
                </Link>
              </li>
              <li>
                <Link href="/pdf" className="text-sm font-medium text-background/90 transition-colors hover:text-primary hover:underline underline-offset-4">
                  Download PDF
                </Link>
              </li>
              <li>
                <a href="https://www.cnel.it/Archivio-Contratti" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-background/90 transition-colors hover:text-primary hover:underline underline-offset-4">
                  Portale CNEL ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-background/60 mb-6">
              Informazioni
            </h3>
            <ul className="space-y-4 flex flex-col items-start">
              <li>
                <Link href="/contatti" className="text-sm font-medium text-background/90 transition-colors hover:text-primary hover:underline underline-offset-4">
                  Contatti e Supporto
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-sm font-medium text-background/90 transition-colors hover:text-primary hover:underline underline-offset-4">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-sm font-medium text-background/90 transition-colors hover:text-primary hover:underline underline-offset-4">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-sm font-medium text-background/90 transition-colors hover:text-primary hover:underline underline-offset-4">
                  Disclaimer Legale
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 border-t border-background/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-medium text-background/60 uppercase tracking-widest">
            © {new Date().getFullYear()} ContrattiCCNL. Tutti i diritti riservati.
          </p>
          <p className="text-xs font-medium text-background/60 uppercase tracking-widest">
            Dati CNEL Aggiornati
          </p>
        </div>
      </div>
    </footer>
  )
}
