import Script from 'next/script'

interface BlogStructuredDataProps {
  title: string
  description: string
  url: string
  image?: string
  author: string
  datePublished: string
  dateModified?: string
  category?: string
  tags?: string[]
  readTime?: string
  featured?: boolean
}

export default function BlogStructuredData({
  title,
  description,
  url,
  image = 'https://www.linkglimpse.com/images/icon/social-preview-1200x630.jpeg',
  author,
  datePublished,
  dateModified,
  category,
  tags = [],
  readTime,
  featured = false,
}: BlogStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: image,
    author: {
      '@type': 'Person',
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
    dateModified: dateModified || datePublished,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    ...(category && { articleSection: category }),
    ...(tags.length > 0 && { keywords: tags.join(', ') }),
    ...(readTime && { wordCount: Math.round(parseInt(readTime) * 200) }), // Estimate word count based on read time
    ...(featured && { isPartOf: { '@type': 'CreativeWorkSeries', name: 'Featured Articles' } }),
  }

  return (
    <Script
      id="blog-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}
