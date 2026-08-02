import type { ReactNode } from 'react';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Tumblr Link Preview Tool',
  description: 'Preview how a public URL may appear in a Tumblr post. Check the representative link card, title, description and image before sharing.',
  path: '/tumblr-social-preview',
  keywords: ['tumblr link preview', 'tumblr social preview'],
});

export default function Layout({ children }: { children: ReactNode }) { return children; }
