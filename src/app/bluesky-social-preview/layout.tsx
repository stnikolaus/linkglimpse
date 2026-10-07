import type { ReactNode } from 'react';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Bluesky Link Preview Checker: Test Cards & OG Tags',
  description: 'Test a public URL before sharing it on Bluesky. Preview the link card, inspect Open Graph tags, check the image, and find metadata problems.',
  path: '/bluesky-social-preview',
  keywords: ['bluesky link preview', 'bluesky card validator', 'bluesky preview checker', 'bluesky social preview'],
});

export default function Layout({ children }: { children: ReactNode }) { return children; }
