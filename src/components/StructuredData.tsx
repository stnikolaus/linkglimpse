import Script from 'next/script'

interface StructuredDataProps {
  type: 'website' | 'tool' | 'software'
  title: string
  description: string
  url: string
  image?: string
  author?: string
  datePublished?: string
  dateModified?: string
}

export default function StructuredData({
  type,
  title,
  description,
  url,
  image = 'https://www.linkglimpse.com/images/icon/social-preview.jpeg',
  author = 'LinkGlimpse',
  datePublished = '2025-01-01',
  dateModified = new Date().toISOString().split('T')[0],
}: StructuredDataProps) {
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'website' ? 'WebSite' : type === 'tool' ? 'SoftwareApplication' : 'WebApplication',
    name: title,
    description: description,
    url: url,
    image: image,
    author: {
      '@type': 'Organization',
      name: author,
      url: 'https://www.linkglimpse.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'LinkGlimpse',
      url: 'https://www.linkglimpse.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.linkglimpse.com/images/link-icon.svg',
      },
    },
    datePublished: datePublished,
    dateModified: dateModified,
    inLanguage: 'en-US',
    isAccessibleForFree: true,
  }

  const toolStructuredData = type === 'tool' || type === 'software' ? {
    ...baseStructuredData,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Social Media Preview Generation',
      'AI-Powered Enhancement',
      'Bulk URL Processing',
      'Multi-Platform Support',
      'REST API Access',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
  } : baseStructuredData

  const websiteStructuredData = type === 'website' ? {
    ...baseStructuredData,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.linkglimpse.com/api/preview?url={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  } : toolStructuredData

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(websiteStructuredData),
      }}
    />
  )
} 