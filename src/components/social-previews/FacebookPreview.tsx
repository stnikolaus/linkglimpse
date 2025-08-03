'use client';

import { FacebookPreviews } from './facebook-preview/previews';
import type { FacebookPreviewProps } from './types';

export default function FacebookPreview(props: FacebookPreviewProps) {
  return <FacebookPreviews {...props} hideLinkPreview={false} hidePostPreview={true} headingLevel={3} />;
} 
