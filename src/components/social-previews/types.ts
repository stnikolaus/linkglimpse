export interface SocialPreviewBaseProps {
  title?: string;
  description?: string;
  url: string;
  image?: string;
}

export interface FacebookUser {
  displayName: string;
  avatarUrl?: string;
}

export interface FacebookPreviewProps extends SocialPreviewBaseProps {
  user?: FacebookUser;
  type?: 'website' | 'article';
  customText?: string;
  customImage?: string;
  imageMode?: 'landscape' | 'portrait';
  media?: Array<{
    url: string;
    type: string;
    alt?: string;
  }>;
}

export interface MediaItem {
  url: string;
  type: string;
  alt?: string;
}

export interface SocialPreviewsBaseProps {
  hideLinkPreview?: boolean;
  hidePostPreview?: boolean;
  headingLevel?: number;
} 