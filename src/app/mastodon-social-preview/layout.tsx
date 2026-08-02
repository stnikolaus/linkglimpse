import type { ReactNode } from 'react';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Mastodon Link Preview Tool',
  description: 'Preview how a public URL may appear in a Mastodon post. Check the representative Open Graph card, title, description and image before sharing.',
  path: '/mastodon-social-preview',
  keywords: ['mastodon link preview', 'mastodon card preview'],
});

export default function Layout({ children }: { children: ReactNode }) { return children; }
