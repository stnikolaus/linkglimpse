import Script from 'next/script'
import { BlogPost } from '@/lib/blog'

interface BlogListStructuredDataProps {
  posts: BlogPost[]
  baseUrl: string
}

export default function BlogListStructuredData({ posts, baseUrl }: BlogListStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Blog Articles',
    description: 'Expert tips, tutorials, and insights on social media marketing, SEO, and content optimization.',
    url: `${baseUrl}/blog`,
    numberOfItems: posts.length,
    itemListElement: posts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        author: {
          '@type': 'Person',
          name: post.author,
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
        datePublished: post.date,
        dateModified: post.updated || post.date,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${baseUrl}/blog/${post.slug}`,
        },
        url: `${baseUrl}/blog/${post.slug}`,
        inLanguage: 'en-US',
        isAccessibleForFree: true,
        ...(post.category && { articleSection: post.category }),
        ...(post.tags.length > 0 && { keywords: post.tags.join(', ') }),
        ...(post.readTime && { wordCount: Math.round(parseInt(post.readTime) * 200) }),
        ...(post.featured && { isPartOf: { '@type': 'CreativeWorkSeries', name: 'Featured Articles' } }),
      },
    })),
  }

  return (
    <Script
      id="blog-list-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}
