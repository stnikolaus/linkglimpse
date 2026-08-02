import Client from '../facebook-social-preview/Client';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Facebook Debugger Alternative & OG Preview',
  description: 'Check live Open Graph tags and preview a Facebook link card without signing in. Find missing titles, descriptions and images before sharing.',
  path: '/facebook-open-graph-debugger',
  keywords: ['facebook open graph debugger', 'facebook link preview', 'facebook url debugger', 'facebook og checker'],
});

export default function FacebookOpenGraphDebuggerPage() {
  return <Client />;
}
