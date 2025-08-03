'use client';

import { BlueskyPreviews } from './bluesky-preview/previews';
import type { BlueskyPreviewsProps } from './bluesky-preview/previews';

export default function BlueskyPreview(props: BlueskyPreviewsProps) {
  return <BlueskyPreviews {...props} hideLinkPreview={false} hidePostPreview={true} headingLevel={3} />;
} 
