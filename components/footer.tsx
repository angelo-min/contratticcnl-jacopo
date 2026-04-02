import Link from 'next/link'
import { macrosettori } from '@/data/db'

export function Footer() {
  const topSectors = macrosettori.slice(0, 6)

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo and description */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="font-heading text-lg font-bold text-primary-foreground">C</span>
              </div>
              <span className="font-heading text-xl font-bold text-foreground">ContrattiCCNL</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Archivio gratuito e sempre aggiornato di Contratti Collettivi Nazionali del Lavoro italiani.
              Consulta, cerca e scarica i CCNL di tutti i settori.
            </p>
          </div>

          {/* Settori */}
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
              Settori
            </h3>
            <ul className="mt-4 space-y-2">
              {topSectors.map((settore) => (
                <li key={settore.slug}>
                  <Link
                    href={`/settore/${settore.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {settore.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Risorse */}
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
              Risorse
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/contratti-ccnl"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Catalogo CCNL
                </Link>
              </li>
              <li>
                <Link
                  href="/accordi"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Accordi
                </Link>
              </li>
              <li>
                <Link
                  href="/articoli"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Articoli
                </Link>
              </li>
              <li>
                <Link
                  href="/pdf"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  CCNL in PDF
                </Link>
              </li>
              <li>
                <a
                  href="https://www.cnel.it/Archivio-Contratti"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Archivio CNEL
                </a>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
              Info
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/contatti"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Contatti
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie-policy"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            Dati aggiornati al {new Date().getFullYear()} — Fonte ufficiale:{' '}
            <a
              href="https://www.cnel.it/Archivio-Contratti"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              archivio CNEL
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
