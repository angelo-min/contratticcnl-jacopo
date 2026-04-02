import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { AccordiPageContent } from '@/components/accordi/accordi-page-content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Accordi depositati al CNEL | ContrattiCCNL.it',
  description:
    'Elenco completo degli accordi e rinnovi contrattuali depositati al CNEL. Filtra per tipologia e anno. Scarica i PDF.',
}

export default function AccordiPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <AccordiPageContent />
      </main>
      <Footer />
    </div>
  )
}
