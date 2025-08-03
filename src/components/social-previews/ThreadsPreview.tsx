'use client';

import { ThreadsPreviews } from './threads-preview/previews';
import type { ThreadsPreviewsProps } from './threads-preview/previews';

export default function ThreadsPreview(props: ThreadsPreviewsProps) {
  return <ThreadsPreviews {...props} hideLinkPreview={false} hidePostPreview={true} headingLevel={3} />;
} 
