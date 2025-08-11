import { z } from 'zod';

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
  title?: string;
  description?: string;
  image?: string;
  url: string;
  siteName?: string;
  author?: string;
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
}

// AI Enhancement Schema
export const aiEnhancementSchema = z.object({
  title: z.object({
    optimized: z.string(),
    score: z.number().min(0).max(100),
    feedback: z.string(),
  }),
  description: z.object({
    optimized: z.string(),
    score: z.number().min(0).max(100),
    feedback: z.string(),
  }),
  hashtags: z.array(z.string()),
  improvements: z.array(z.string()),
  overallScore: z.number().min(0).max(100),
  platformOptimizations: z.record(z.string(), z.object({
    score: z.number().min(0).max(100),
    feedback: z.string(),
  })),
});

export type AiEnhancementResult = z.infer<typeof aiEnhancementSchema>; 