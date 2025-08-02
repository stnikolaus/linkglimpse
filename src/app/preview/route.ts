import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const platforms = searchParams.get('platforms')?.split(',') || ['facebook', 'twitter', 'linkedin', 'google'];

  if (!url) {
    return NextResponse.json({
      error: 'URL parameter is required',
      example: '/preview?url=https://example.com&platforms=facebook,twitter'
    }, { status: 400 });
  }

  try {
    // Fetch metadata from the existing metadata API
    const metadataResponse = await fetch(`${request.nextUrl.origin}/api/metadata?url=${encodeURIComponent(url)}`);
    if (!metadataResponse.ok) {
      throw new Error('Failed to fetch metadata');
    }
    
    const metadata: ApiResponse = await metadataResponse.json();
    
    // Check what data is missing
    const missingData = [];
    if (!metadata.title) missingData.push('title');
    if (!metadata.description) missingData.push('description');
    if (!metadata.image) missingData.push('image');
    if (!metadata.siteName) missingData.push('siteName');
    if (!metadata.author) missingData.push('author');

    // Generate iframe URLs for each platform
    const iframeUrls: Record<string, string> = {};
    const baseUrl = request.nextUrl.origin;
    
    platforms.forEach(platform => {
      iframeUrls[platform] = `${baseUrl}/${platform}-social-preview?url=${encodeURIComponent(url)}`;
    });

    // Generate preview data for each platform
    const previewData: Record<string, Record<string, string | null | undefined | object>> = {};
    
    platforms.forEach(platform => {
      const platformData: Record<string, string | null | undefined | object> = {
        title: metadata.title || 'No title available',
        description: metadata.description || 'No description available',
        url: metadata.url,
        image: metadata.image,
        siteName: metadata.siteName,
        author: metadata.author
      };

      // Platform-specific data adjustments
      switch (platform) {
        case 'facebook':
          platformData.ogTitle = metadata.title;
          platformData.ogDescription = metadata.description;
          platformData.ogImage = metadata.image;
          break;
        case 'twitter':
          platformData.twitterTitle = metadata.title;
          platformData.twitterDescription = metadata.description;
          platformData.twitterImage = metadata.image;
          break;
        case 'linkedin':
          platformData.linkedinTitle = metadata.title;
          platformData.linkedinDescription = metadata.description;
          platformData.linkedinImage = metadata.image;
          break;
        case 'google':
          platformData.googleTitle = metadata.title;
          platformData.googleDescription = metadata.description;
          break;
        case 'instagram':
          platformData.instagramImage = metadata.image;
          platformData.instagramCaption = `${metadata.title || 'No title'}\n\n${metadata.description || 'No description'}\n\n${metadata.url}`;
          break;
        case 'mastodon':
        case 'bluesky':
          platformData.user = {
            displayName: getDomain(metadata.url),
            avatarUrl: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_bigger.png',
            address: `@${getDomain(metadata.url).replace(/\./g, '')}@${platform === 'mastodon' ? 'mastodon.social' : 'bsky.social'}`
          };
          break;
      }

      previewData[platform] = platformData;
    });

    return NextResponse.json({
      success: true,
      url: metadata.url,
      metadata: {
        title: metadata.title,
        description: metadata.description,
        image: metadata.image,
        siteName: metadata.siteName,
        author: metadata.author
      },
      missingData,
      iframeUrls,
      previewData
    });
  } catch (error) {
    console.error('Error processing preview request:', error);
    return NextResponse.json({
      error: 'Failed to generate preview',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
} 