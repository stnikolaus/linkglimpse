export const LANDSCAPE_MODE = 'landscape';
export const PORTRAIT_MODE = 'portrait';
export const TYPE_WEBSITE = 'website';
export const TYPE_ARTICLE = 'article';

export type Formatter = (text: string) => string;

export const stripHtmlTags: Formatter = (text) => {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '');
};

export const shortEnough = (maxLength: number): Formatter => (text) => {
  if (!text || text.length <= maxLength) return text;
  return '';
};

export const hardTruncation = (maxLength: number): Formatter => (text) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

export const firstValid = (...formatters: Formatter[]): Formatter => (text) => {
  for (const formatter of formatters) {
    const result = formatter(text);
    if (result) return result;
  }
  return '';
};

export const hasTag = (text: string, tag: string): boolean => {
  if (!text) return false;
  const regex = new RegExp(`<${tag}[^>]*>`, 'i');
  return regex.test(text);
};

export const preparePreviewText = (text: string, options: {
  platform: string;
  maxChars: number;
}): string => {
  if (!text) return '';
  
  const stripped = stripHtmlTags(text);
  if (stripped.length <= options.maxChars) return stripped;
  
  return stripped.substring(0, options.maxChars - 3) + '...';
};

export const baseDomain = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};

export const getTitleFromDescription = (description: string): string => {
  if (!description) return '';
  return description.split('.')[0] || description;
};

export const formatTweetDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

export const formatMastodonDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

export const formatNextdoorDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

export const formatThreadsDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

export const truncatedAtSpace = (maxLength: number): Formatter => (text) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}; 