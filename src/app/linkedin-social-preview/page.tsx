import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'LinkedIn Post Inspector & Link Preview Tool',
  description: 'Preview and validate how your link appears on LinkedIn. Use our linkedin sharing debugger to check Open Graph tags and optimize for professional engagement.',
  keywords: [
    'linkedin debugger',
    'debugger linkedin',
    'linkedin debug',
    'debug linkedin',
    'linkedin open graph debugger',
    'linkedin share debugger',
    'linkedin sharing debugger',
    'linkedin link debugger',
    'linked debugger',
    'linked in debugger'
  ]
};

export default function Page() {
  return <Client />;
} 