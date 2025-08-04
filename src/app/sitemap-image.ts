import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.linkglimpse.com'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
      images: [
        `${baseUrl}/images/icon/social-preview.jpeg`,
        `${baseUrl}/images/link-icon.svg`,
        `${baseUrl}/images/company-logos/aiskill.svg`,
        `${baseUrl}/images/company-logos/lead-magnet-creator-logo.png`,
        `${baseUrl}/images/company-logos/podfan.svg`,
        `${baseUrl}/images/company-logos/saas-garden.png`,
        `${baseUrl}/images/company-logos/shorts-faceless.svg`,
      ],
    },
  ]
} 