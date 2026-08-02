import type { ReactNode } from 'react';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Google Search Preview & SERP Snippet',
  description: 'Preview the title, meta description and URL Google may show for any public page. Spot truncation and review your search snippet before publishing.',
  path: '/google-search-preview',
  keywords: ['google search preview', 'serp snippet preview'],
});

export default function Layout({ children }: { children: ReactNode }) { return children; }
