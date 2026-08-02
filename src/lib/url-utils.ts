import { ApiResponse } from '@/types';

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function normalizeUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

export async function fetchUrlMetadata(url: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`);
    const data = await response.json() as ApiResponse;
    if (!response.ok) {
      throw new Error(data.error || `Metadata request failed with HTTP ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error('Error fetching metadata:', error);
    throw error;
  }
}
