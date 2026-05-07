import { StaticPage } from '@/components/static-page'
import type { Metadata } from 'next'
import staticPages from '@/data/xml-export/static-pages.json'

export const metadata: Metadata = {
  title: 'Cookie Policy | ContrattiCCNL.it',
  description: 'Informativa sui cookie utilizzati dal sito ContrattiCCNL.it.',
}

export default function CookiePolicyPage() {
  const data = staticPages['cookie-policy']
  return <StaticPage title={data.title} html={data.content_html} />
}
