import Script from 'next/script'

interface FAQItem {
  question: string
  answer: string
}

interface FAQStructuredDataProps {
  items: FAQItem[]
}

export default function FAQStructuredData({ items }: FAQStructuredDataProps) {
  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <Script
      id="faq-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqPage),
      }}
    />
  )
} 