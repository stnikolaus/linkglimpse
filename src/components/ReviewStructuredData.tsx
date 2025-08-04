import Script from 'next/script'

interface Review {
  author: string
  rating: number
  reviewBody: string
  datePublished: string
  reviewTitle?: string
}

interface ReviewStructuredDataProps {
  reviews: Review[]
  aggregateRating: {
    ratingValue: number
    ratingCount: number
    bestRating: number
    worstRating: number
  }
}

export default function ReviewStructuredData({ reviews, aggregateRating }: ReviewStructuredDataProps) {
  const reviewData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'LinkGlimpse - Social Media Preview Debugger',
    description: 'Generate social media previews for any URL. See how your links will appear on Facebook, Twitter, LinkedIn, Instagram, and more platforms.',
    brand: {
      '@type': 'Brand',
      name: 'LinkGlimpse',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue,
      ratingCount: aggregateRating.ratingCount,
      bestRating: aggregateRating.bestRating,
      worstRating: aggregateRating.worstRating,
    },
    review: reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: review.reviewBody,
      datePublished: review.datePublished,
      ...(review.reviewTitle && { name: review.reviewTitle }),
    })),
  }

  return (
    <Script
      id="review-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(reviewData),
      }}
    />
  )
} 