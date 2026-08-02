import Script from 'next/script'

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
  image = 'https://www.linkglimpse.com/images/icon/social-preview.jpeg',
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
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(websiteStructuredData),
      }}
    />
  )
}
