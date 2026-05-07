import { StaticPage } from '@/components/static-page'
import type { Metadata } from 'next'
import staticPages from '@/data/xml-export/static-pages.json'

export const metadata: Metadata = {
  title: 'Contatti | ContrattiCCNL.it',
  description: 'Contatta il team di ContrattiCCNL.it per segnalazioni, suggerimenti o correzioni.',
}

export default function ContattiPage() {
  const data = staticPages['contatti']
  return <StaticPage title={data.title} html={data.content_html} />
}
