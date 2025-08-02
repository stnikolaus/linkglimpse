import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SocialPreview/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    
    // Extract metadata using regex patterns
    const metadata = extractMetadata(html, url);
    
    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error fetching URL:', error);
    return NextResponse.json(
      { error: 'Failed to fetch URL metadata' },
      { status: 500 }
    );
  }
}

function extractMetadata(html: string, url: string): ApiResponse {
  const metadata: Partial<ApiResponse> = { url };

  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    metadata.title = titleMatch[1].trim();
  }

  // Extract Open Graph tags
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  if (ogTitleMatch) {
    metadata.title = ogTitleMatch[1].trim();
  }

  const ogDescriptionMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  if (ogDescriptionMatch) {
    metadata.description = ogDescriptionMatch[1].trim();
  }

  const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  if (ogImageMatch) {
    metadata.image = ogImageMatch[1].trim();
  }

  const ogSiteNameMatch = html.match(/<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  if (ogSiteNameMatch) {
    metadata.siteName = ogSiteNameMatch[1].trim();
  }

  // Extract Twitter Card tags
  const twitterTitleMatch = html.match(/<meta[^>]*name=["']twitter:title["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  if (twitterTitleMatch && !metadata.title) {
    metadata.title = twitterTitleMatch[1].trim();
  }

  const twitterDescriptionMatch = html.match(/<meta[^>]*name=["']twitter:description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  if (twitterDescriptionMatch && !metadata.description) {
    metadata.description = twitterDescriptionMatch[1].trim();
  }

  const twitterImageMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  if (twitterImageMatch && !metadata.image) {
    metadata.image = twitterImageMatch[1].trim();
  }

  // Extract meta description as fallback
  const metaDescriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  if (metaDescriptionMatch && !metadata.description) {
    metadata.description = metaDescriptionMatch[1].trim();
  }

  return metadata as ApiResponse;
} 