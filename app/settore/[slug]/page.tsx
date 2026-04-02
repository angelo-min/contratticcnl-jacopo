import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CCNLCard } from '@/components/ccnl-card'
import { SectorSidebar } from '@/components/sector/sector-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { getMacrosettoreBySlug, getCCNLByMacrosettoreSlug, macrosettori } from '@/data/db'
import type { Metadata } from 'next'

export const revalidate = 86400

interface SectorPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return macrosettori.map((sector) => ({
    slug: sector.slug,
  }))
}

export async function generateMetadata({ params }: SectorPageProps): Promise<Metadata> {
  const { slug } = await params
  const sector = getMacrosettoreBySlug(slug)

  if (!sector) {
    return {
      title: 'Settore non trovato | ContrattiCCNL.it',
    }
  }

  return {
    title: `${sector.nome} - CCNL del settore | ContrattiCCNL.it`,
    description: sector.descrizione,
  }
}

export default async function SectorPage({ params }: SectorPageProps) {
  const { slug } = await params
  const sector = getMacrosettoreBySlug(slug)

  if (!sector) {
    notFound()
  }

  const sectorCCNL = getCCNLByMacrosettoreSlug(slug)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Header section */}
        <div className="border-b border-border bg-card py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/#settori">Settori</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{sector.nome}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-6 flex items-start gap-4">
              <span className="text-5xl" role="img" aria-label={sector.nome}>
                {sector.icona}
              </span>
              <div>
                <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
                  {sector.nome}
                </h1>
                <p className="mt-2 max-w-2xl text-muted-foreground">{sector.descrizione}</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{sectorCCNL.length}</span>{' '}
                  {sectorCCNL.length === 1 ? 'contratto disponibile' : 'contratti disponibili'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex-1">
              {sectorCCNL.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {sectorCCNL.map((ccnl) => (
                    <CCNLCard key={ccnl.id} ccnl={ccnl} />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-border bg-card p-8 text-center">
                  <p className="text-muted-foreground">
                    Non ci sono ancora contratti disponibili per questo settore.
                  </p>
                </div>
              )}
            </div>

            <aside className="w-full shrink-0 lg:w-72">
              <SectorSidebar currentSlug={slug} />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
