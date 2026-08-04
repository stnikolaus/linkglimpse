export type DiagnosticStatus = 'pass' | 'warning' | 'fail';
export type PreviewPlatform = 'facebook' | 'x' | 'linkedin' | 'slack' | 'discord' | 'whatsapp' | 'google';

export interface MetadataCheck {
  id: string;
  label: string;
  category: 'fetch' | 'open-graph' | 'twitter' | 'indexing' | 'image';
  status: DiagnosticStatus;
  value?: string;
  recommendation: string;
  weight: number;
}

export interface DiagnosticReport {
  score: number;
  counts: Record<DiagnosticStatus, number>;
  checks: MetadataCheck[];
  platforms: Array<{ platform: 'Facebook' | 'LinkedIn' | 'X / Twitter'; status: 'ready' | 'needs-work'; missing: string[] }>;
}

export interface LinkGlimpseReport {
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
  redirectChain?: Array<{ url: string; status: number; statusText?: string; location?: string }>;
  contentType?: string;
  canonical?: string;
  robots?: string;
  tags?: Record<string, string>;
  openGraph?: Record<string, string>;
  twitter?: Record<string, string>;
  imageInfo?: { url: string; status?: number; contentType?: string; contentLength?: number; width?: number; height?: number; error?: string };
  diagnostics?: DiagnosticReport;
}

export interface InspectOptions {
  concurrency?: number;
  maxHtmlBytes?: number;
  maxImageHeaderBytes?: number;
  maxImageBytes?: number;
  requestTimeoutMs?: number;
  maxRedirects?: number;
  userAgent?: string;
}

export const PREVIEW_PLATFORMS: readonly PreviewPlatform[];
export const PREVIEW_IMAGE_CONTENT_TYPES: readonly string[];
export function inspectUrl(input: string, options?: InspectOptions): Promise<LinkGlimpseReport>;
export function inspectUrls(inputs: string[], options?: InspectOptions): Promise<Array<{ success: boolean; url: string; report?: LinkGlimpseReport; error?: string }>>;
export function fetchPublicImage(input: string, options?: InspectOptions): Promise<{ bytes: Uint8Array; contentType: string; finalUrl: string }>;
export function validatePublicUrl(input: string): Promise<URL>;
export function extractMetadata(html: string, requestedUrl: string, finalUrl: string): LinkGlimpseReport;
export function analyzeMetadata(metadata: LinkGlimpseReport): DiagnosticReport;
export function getRemediationCode(check: MetadataCheck, metadata: LinkGlimpseReport): string;
export function buildFixPlan(metadata: LinkGlimpseReport): Array<{ id: string; label: string; severity: Exclude<DiagnosticStatus, 'pass'>; currentValue: string | null; recommendation: string; suggestedImplementation: string }>;
export function buildAiAgentPrompt(metadata: LinkGlimpseReport): string;
export function renderPreviewSvg(metadata: LinkGlimpseReport, options?: { platform?: PreviewPlatform | 'all'; imageDataUrl?: string }): { width: number; height: number; platforms: PreviewPlatform[]; svg: string };
