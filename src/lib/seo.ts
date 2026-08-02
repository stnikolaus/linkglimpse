import type { Metadata } from 'next';

export const SITE_URL = 'https://www.linkglimpse.com';
export const DEFAULT_OG_IMAGE = '/images/icon/social-preview.jpeg';

interface PageMetadataInput {
  title: string;
  description: string;
  path: `/${string}` | '/';
  keywords?: string[];
}

export function createPageMetadata({ title, description, path, keywords }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type: 'website',
      url: path,
      siteName: 'LinkGlimpse',
      images: [{
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${title} preview`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
