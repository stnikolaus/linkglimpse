export interface UrlMetadata {
  title?: string;
  description?: string;
  image?: string;
  url: string;
  siteName?: string;
  author?: string;
}

export interface ApiResponse {
  error?: string;
  pageTitle?: string;
  pageDescription?: string;
  title?: string;
  description?: string;
  image?: string;
  url: string;
  siteName?: string;
  author?: string;
  requestedUrl?: string;
  finalUrl?: string;
  status?: number;
  statusText?: string;
  redirected?: boolean;
  redirectChain?: RedirectHop[];
  contentType?: string;
  canonical?: string;
  robots?: string;
  tags?: Record<string, string>;
  openGraph?: Record<string, string>;
  twitter?: Record<string, string>;
  imageInfo?: ImageInspection;
  diagnostics?: DiagnosticReport;
}

export interface RedirectHop {
  url: string;
  status: number;
  statusText?: string;
  location?: string;
}

export type DiagnosticStatus = 'pass' | 'warning' | 'fail';

export interface MetadataCheck {
  id: string;
  label: string;
  category: 'fetch' | 'open-graph' | 'twitter' | 'indexing' | 'image';
  status: DiagnosticStatus;
  value?: string;
  recommendation: string;
  weight: number;
}

export interface ImageInspection {
  url: string;
  status?: number;
  contentType?: string;
  contentLength?: number;
  width?: number;
  height?: number;
  error?: string;
}

export interface PlatformReadiness {
  platform: 'Facebook' | 'LinkedIn' | 'X / Twitter';
  status: 'ready' | 'needs-work';
  missing: string[];
}

export interface DiagnosticReport {
  score: number;
  counts: Record<DiagnosticStatus, number>;
  checks: MetadataCheck[];
  platforms: PlatformReadiness[];
}

export interface SocialPreview {
  platform: string;
  title: string;
  description: string;
  image?: string;
  url: string;
}

export interface PreviewCardProps {
  preview: SocialPreview;
  platform: string;
}

export interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  ctaLabel?: string;
  placeholder?: string;
  initialValue?: string;
}
