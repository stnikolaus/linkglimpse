import type { ReactNode } from 'react';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'URL Metadata API for Open Graph',
  description: 'Extract Open Graph, Twitter Card, canonical, robots and image metadata from any public URL. Test the free API and copy examples in eight languages.',
  path: '/api',
  keywords: ['open graph api', 'url metadata api', 'social preview api'],
});

export default function ApiLayout({ children }: { children: ReactNode }) { return children; }
