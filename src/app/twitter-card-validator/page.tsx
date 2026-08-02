import Client from '../twitter-social-preview/Client';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Twitter Card Validator & X Preview',
  description: 'Validate Twitter Card and Open Graph tags for any URL. Preview the card on X and find missing title, description, image or card-type metadata.',
  path: '/twitter-card-validator',
  keywords: ['twitter card validator', 'twitter card test', 'twitter card preview', 'x card validator'],
});

export default function TwitterCardValidatorPage() {
  return <Client />;
}
