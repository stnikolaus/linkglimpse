'use client';

import { NextdoorPreviews } from './nextdoor-preview/previews';
import type { NextdoorPreviewsProps } from './nextdoor-preview/previews';

export default function NextdoorPreview(props: NextdoorPreviewsProps) {
  return <NextdoorPreviews {...props} hideLinkPreview={true} hidePostPreview={false} headingLevel={3} />;
} 
