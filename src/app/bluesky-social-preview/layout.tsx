import type { ReactNode } from 'react';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Bluesky Link Preview Tool',
  description: 'Preview how a public URL may appear in a Bluesky post. Check the representative link card, title, description and image before sharing.',
  path: '/bluesky-social-preview',
  keywords: ['bluesky link preview', 'bluesky social preview'],
});

export default function Layout({ children }: { children: ReactNode }) { return children; }
