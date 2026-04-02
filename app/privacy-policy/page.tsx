import { StaticPage } from '@/components/static-page'
import type { Metadata } from 'next'
import data from '@/data/xml-export/privacy-policy.json'

export const metadata: Metadata = {
  title: 'Privacy Policy | ContrattiCCNL.it',
  description: 'Informativa sulla privacy e il trattamento dei dati personali di ContrattiCCNL.it.',
}

export default function PrivacyPolicyPage() {
  return (
    <StaticPage title={data.title}>
      {data.content}
    </StaticPage>
  )
}
