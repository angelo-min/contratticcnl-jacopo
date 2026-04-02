import { StaticPage } from '@/components/static-page'
import type { Metadata } from 'next'
import data from '@/data/xml-export/contatti.json'

export const metadata: Metadata = {
  title: 'Contatti | ContrattiCCNL.it',
  description: 'Contatta il team di ContrattiCCNL.it per segnalazioni, suggerimenti o correzioni.',
}

export default function ContattiPage() {
  return (
    <StaticPage title={data.title}>
      {data.content}
    </StaticPage>
  )
}
