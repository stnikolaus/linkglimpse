'use client';

import { InstagramPreviews } from './instagram-preview/previews';
import type { InstagramPreviewsProps } from './instagram-preview/previews';

export default function InstagramPreview(props: InstagramPreviewsProps) {
  return <InstagramPreviews {...props} hideLinkPreview={false} hidePostPreview={false} headingLevel={3} />;
} 
