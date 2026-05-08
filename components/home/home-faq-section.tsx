import sanitizeHtml from 'sanitize-html'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import homeFaqData from '@/data/xml-export/home-faq.json'

export function HomeFaqSection() {
  const { title, intro, faqs } = homeFaqData

  if (!faqs || faqs.length === 0) return null

  const sanitizedFaqs = faqs.map((item) => ({
    question: item.question,
    answer: sanitizeHtml(item.answer, {
      allowedTags: ['p', 'a', 'strong', 'em', 'ul', 'ol', 'li', 'br'],
      allowedAttributes: { a: ['href'] },
    }),
  }))

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer.replace(/<[^>]+>/g, ''),
      },
    })),
  }

  return (
    <section className="bg-background py-24 sm:py-32 border-t border-border/50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-4xl font-normal leading-tight tracking-[-0.02em] text-foreground sm:text-5xl">
          {title}
        </h2>
        {intro && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {intro}
          </p>
        )}

        <div className="mt-16">
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-6">
            Domande frequenti
          </h3>
          <Accordion type="single" collapsible className="w-full">
            {sanitizedFaqs.map((item, i) => (
              <AccordionItem key={i} value={`home-faq-${i}`}>
                <AccordionTrigger className="text-base font-semibold">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <div
                    className="prose-content text-sm leading-relaxed text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </div>
    </section>
  )
}
