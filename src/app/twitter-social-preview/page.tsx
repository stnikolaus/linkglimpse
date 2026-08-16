import type { Metadata } from 'next';
import Client from './Client';
import { createPageAlternates } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Twitter Card Debugger & Validator',
  description: 'Debugger for Twitter Cards: test, validate, and refresh your twitter card. See an instant tweet preview and verify tags before posting.',
  alternates: createPageAlternates('/twitter-social-preview'),
  keywords: [
    'twitter debugger',
    'debugger twitter',
    'debug twitter',
    'twitter cards test',
    'twitter card refresh',
    'twitter card update',
    'twitter sharing debugger',
    'depurar url twitter'
  ]
};

export default function Page() {
  return <Client />;
}
