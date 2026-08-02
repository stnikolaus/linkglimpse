import type { ReactNode } from 'react';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Nextdoor Link Preview Tool',
  description: 'Preview how a public URL may appear in a Nextdoor post. Check the representative link card, title, description and image before sharing.',
  path: '/nextdoor-social-preview',
  keywords: ['nextdoor link preview', 'nextdoor post preview'],
});

export default function Layout({ children }: { children: ReactNode }) { return children; }
