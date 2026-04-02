import { StaticPage } from '@/components/static-page'
import type { Metadata } from 'next'
import data from '@/data/xml-export/cookie-policy.json'

export const metadata: Metadata = {
  title: 'Cookie Policy | ContrattiCCNL.it',
  description: 'Informativa sui cookie utilizzati dal sito ContrattiCCNL.it.',
}

export default function CookiePolicyPage() {
  return (
    <StaticPage title={data.title}>
      {data.content}
    </StaticPage>
  )
}
