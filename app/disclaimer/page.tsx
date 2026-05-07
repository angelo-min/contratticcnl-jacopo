import { StaticPage } from '@/components/static-page'
import type { Metadata } from 'next'
import staticPages from '@/data/xml-export/static-pages.json'

export const metadata: Metadata = {
  title: 'Disclaimer | ContrattiCCNL.it',
  description: 'Dichiarazione di non responsabilità di ContrattiCCNL.it.',
}

export default function DisclaimerPage() {
  const data = staticPages['disclaimer']
  return <StaticPage title={data.title} html={data.content_html} />
}
