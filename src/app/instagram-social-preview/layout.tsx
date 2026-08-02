import type { ReactNode } from 'react';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Instagram Post Preview from URL',
  description: 'Enter a public URL to preview a representative Instagram photo post using its image, title and description. Check the content before publishing.',
  path: '/instagram-social-preview',
  keywords: ['instagram link preview', 'instagram post preview'],
});

export default function Layout({ children }: { children: ReactNode }) { return children; }
