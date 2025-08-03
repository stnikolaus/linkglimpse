'use client';

import { TumblrPreviews } from './tumblr-preview/previews';
import type { TumblrPreviewsProps } from './tumblr-preview/previews';

export default function TumblrPreview(props: TumblrPreviewsProps) {
  return <TumblrPreviews {...props} hideLinkPreview={true} hidePostPreview={false} headingLevel={3} />;
} 
