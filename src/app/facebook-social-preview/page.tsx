import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Free Facebook URL Debugger & Preview Tool',
  description: 'Use our facebook open graph debugger to test and validate og tags. Instant facebook linter for link previews: og:title, og:description, og:image, and more.',
  keywords: [
    'facebook debugger',
    'meta debugger',
    'facebook url debugger',
    'facebook open graph debugger',
    'facebook og debugger',
    'facebook linter',
    'facebook url linter',
    'url linter facebook',
    'debug facebook',
    'debugger facebook',
    'facebook link debug',
    'facebook debug link',
    'debug link facebook',
    'facebook opengraph tester'
  ]
};

export default function Page() {
  return <Client />;
} 