import {
  LINKGLIMPSE_ORGANIZATION_ID,
  LINKGLIMPSE_PUBLIC_LINKS,
  LINKGLIMPSE_SAME_AS,
} from '@/lib/entity'

interface StructuredDataProps {
  type: 'website' | 'tool' | 'software'
  title: string
  description: string
  url: string
  image?: string
  author?: string
}

export default function StructuredData({
  type,
  title,
  description,
  url,
  image = 'https://www.linkglimpse.com/images/icon/social-preview-1200x630.jpeg',
  author = 'LinkGlimpse',
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
      '@id': LINKGLIMPSE_ORGANIZATION_ID,
      name: author,
      url: LINKGLIMPSE_PUBLIC_LINKS.website,
      sameAs: LINKGLIMPSE_SAME_AS,
    },
    publisher: {
      '@type': 'Organization',
      '@id': LINKGLIMPSE_ORGANIZATION_ID,
      name: 'LinkGlimpse',
      url: LINKGLIMPSE_PUBLIC_LINKS.website,
      sameAs: LINKGLIMPSE_SAME_AS,
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.linkglimpse.com/images/link-icon.svg',
      },
    },
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
      'Bulk URL Processing',
      'Multi-Platform Support',
      'Actionable Metadata Diagnostics',
      'Open Graph and Twitter Card Validation',
      'Share Image Inspection',
      'JSON Report Export',
      'REST API Access',
    ],
  } : baseStructuredData

  const websiteStructuredData = type === 'website' ? {
    ...baseStructuredData,
  } : toolStructuredData

  return (
    <script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(websiteStructuredData).replace(/</g, '\\u003c'),
      }}
    />
  )
}
