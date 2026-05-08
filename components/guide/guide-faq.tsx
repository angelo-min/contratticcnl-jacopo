import sanitizeHtml from 'sanitize-html'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import type { FaqItem } from '@/lib/guide-utils'

interface GuideFaqProps {
  items: FaqItem[]
  title?: string
}

export function GuideFaq({ items, title = 'Domande frequenti' }: GuideFaqProps) {
  if (items.length === 0) return null

  const sanitized = items.map((item) => ({
    question: item.question,
    answer: sanitizeHtml(item.answer, {
      allowedTags: ['p', 'a', 'strong', 'em', 'ul', 'ol', 'li', 'br'],
      allowedAttributes: { a: ['href'] },
    }),
  }))

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer.replace(/<[^>]+>/g, ''),
      },
    })),
  }

  return (
    <section id="faq" className="mt-16 scroll-mt-24">
      <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      <Accordion type="single" collapsible className="mt-6 w-full">
        {sanitized.map((item, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-base font-semibold">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>
              <div
                className="prose-content text-sm text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: item.answer }}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </section>
  )
}
