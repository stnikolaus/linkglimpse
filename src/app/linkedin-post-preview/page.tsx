import Client from '../linkedin-social-preview/Client';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'LinkedIn Post Inspector Alternative',
  description: 'Preview a LinkedIn link post and inspect its live Open Graph tags, redirects and image. Diagnose metadata issues without changing LinkedIn\'s cache.',
  path: '/linkedin-post-preview',
  keywords: ['linkedin post preview', 'linkedin post inspector', 'linkedin link preview', 'linkedin preview tool'],
});

export default function LinkedInPostPreviewPage() {
  return <Client />;
}
