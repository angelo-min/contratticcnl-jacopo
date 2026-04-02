import { StaticPage } from '@/components/static-page'
import type { Metadata } from 'next'
import data from '@/data/xml-export/disclaimer.json'

export const metadata: Metadata = {
  title: 'Disclaimer | ContrattiCCNL.it',
  description: 'Dichiarazione di non responsabilità di ContrattiCCNL.it.',
}

export default function DisclaimerPage() {
  return (
    <StaticPage title={data.title}>
      {data.content}
    </StaticPage>
  )
}
