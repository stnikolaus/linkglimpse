'use client';

import { LinkedInPreviews } from './linkedin-preview/previews';
import type { LinkedInPreviewsProps } from './linkedin-preview/previews';

export default function LinkedInPreview(props: LinkedInPreviewsProps) {
  return <LinkedInPreviews {...props} hideLinkPreview={true} hidePostPreview={false} headingLevel={3} />;
} 
