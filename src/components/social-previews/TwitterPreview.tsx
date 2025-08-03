'use client';

import { TwitterPreviews } from './twitter-preview/previews';
import type { TwitterPreviewsProps } from './twitter-preview/previews';

export default function TwitterPreview(props: TwitterPreviewsProps) {
  return <TwitterPreviews {...props} hideLinkPreview={true} hidePostPreview={false} headingLevel={3} />;
} 
