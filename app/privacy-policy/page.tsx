import { StaticPage } from '@/components/static-page'
import type { Metadata } from 'next'
import staticPages from '@/data/xml-export/static-pages.json'

export const metadata: Metadata = {
  title: 'Privacy Policy | ContrattiCCNL.it',
  description: 'Informativa sulla privacy e il trattamento dei dati personali di ContrattiCCNL.it.',
}

export default function PrivacyPolicyPage() {
  const data = staticPages['privacy-policy']
  return <StaticPage title={data.title} html={data.content_html} />
}
