'use client';

import { MastodonPreviews } from './mastodon-preview/previews';
import type { MastodonPreviewsProps } from './mastodon-preview/previews';

export default function MastodonPreview(props: MastodonPreviewsProps) {
  return <MastodonPreviews {...props} hideLinkPreview={true} hidePostPreview={false} headingLevel={3} />;
} 
