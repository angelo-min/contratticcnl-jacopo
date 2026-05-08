import Link from 'next/link'

const TOP_CONTRACTS = [
  { name: 'CCNL metalmeccanici', href: '/metalmeccanici' },
  { name: 'CCNL commercio', href: '/commercio' },
  { name: 'CCNL scuola', href: '/scuola' },
  { name: 'CCNL turismo', href: '/turismo' },
]

const RESOURCES = [
  { name: 'Settori CNEL', href: '/settori' },
  { name: 'CCNL in pdf', href: '/pdf' },
  { name: 'Accordi', href: '/accordi' },
  { name: 'Articoli', href: '/articoli' },
]

const INFO = [
  { name: 'Contatti', href: '/contatti' },
  { name: 'Disclaimer', href: '/disclaimer' },
  { name: 'Privacy policy', href: '/privacy-policy' },
  { name: 'Cookie policy', href: '/cookie-policy' },
]

export function Footer() {
  return (
    <footer className="mt-20 bg-foreground text-background rounded-t-[3rem] px-4 pt-20 pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">

          {/* 1. Logo + descrizione */}
          <div className="lg:col-span-5 flex flex-col items-start pr-8">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/ccnl.png"
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 object-contain invert transition-transform group-hover:scale-105"
              />
              <span className="font-heading text-3xl font-normal text-background">ContrattiCCNL</span>
            </Link>
            <p className="mt-8 max-w-md text-base leading-relaxed text-muted">
              Archivio gratuito e sempre aggiornato dei contratti collettivi nazionali del lavoro italiani depositati al CNEL.
            </p>
          </div>

          {/* 2. Contratti più letti */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-background/60 mb-6">
              Contratti più letti
            </h3>
            <ul className="space-y-4">
              {TOP_CONTRACTS.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="text-sm font-medium text-background/90 transition-colors hover:text-primary hover:underline underline-offset-4"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Risorse */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-background/60 mb-6">
              Risorse
            </h3>
            <ul className="space-y-4">
              {RESOURCES.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="text-sm font-medium text-background/90 transition-colors hover:text-primary hover:underline underline-offset-4"
                  >
                    {r.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Info */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-background/60 mb-6">
              Info
            </h3>
            <ul className="space-y-4">
              {INFO.map((i) => (
                <li key={i.href}>
                  <Link
                    href={i.href}
                    className="text-sm font-medium text-background/90 transition-colors hover:text-primary hover:underline underline-offset-4"
                  >
                    {i.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Linea di fondo */}
        <div className="mt-20 border-t border-background/20 pt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-xs font-medium text-background/60">
            Dati aggiornati al 2026 — Fonte ufficiale: CNEL (Contratti collettivi nazionali del lavoro)
          </p>
          <p className="text-xs font-medium text-background/40">
            © {new Date().getFullYear()} ContrattiCCNL
          </p>
        </div>
      </div>
    </footer>
  )
}
