import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import {
  fetchPublicImage,
  inspectUrl,
} from 'linkglimpse/core/inspection';
import {
  PREVIEW_IMAGE_CONTENT_TYPES,
  PREVIEW_PLATFORMS,
  renderPreviewSvg,
  type PreviewPlatform,
} from 'linkglimpse/core/preview';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  const requestedPlatform = request.nextUrl.searchParams.get('platform') ?? 'all';

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }
  if (requestedPlatform !== 'all' && !PREVIEW_PLATFORMS.includes(requestedPlatform as PreviewPlatform)) {
    return NextResponse.json({ error: `Platform must be all or one of: ${PREVIEW_PLATFORMS.join(', ')}` }, { status: 400 });
  }

  try {
    const report = await inspectUrl(url, {
      userAgent: 'LinkGlimpse-Preview/1.0 (+https://www.linkglimpse.com)',
    });
    let imageDataUrl: string | undefined;
    if (report.image) {
      try {
        const asset = await fetchPublicImage(report.image, {
          userAgent: 'LinkGlimpse-Preview/1.0 (+https://www.linkglimpse.com)',
        });
        const contentType = asset.contentType.split(';', 1)[0].trim().toLowerCase();
        if (PREVIEW_IMAGE_CONTENT_TYPES.includes(contentType)) {
          imageDataUrl = `data:${contentType};base64,${Buffer.from(asset.bytes).toString('base64')}`;
        }
      } catch {
        // A missing image is represented explicitly in the preview rather than failing the whole report.
      }
    }

    const rendered = renderPreviewSvg(report, {
      platform: requestedPlatform as PreviewPlatform | 'all',
      imageDataUrl,
    });
    const png = await sharp(Buffer.from(rendered.svg)).png({ compressionLevel: 8 }).toBuffer();
    const filename = `linkglimpse-${requestedPlatform}-preview.png`;

    return new NextResponse(new Uint8Array(png), {
      headers: {
        'Cache-Control': 'private, no-store',
        'Content-Disposition': `inline; filename="${filename}"`,
        'Content-Type': 'image/png',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to render preview';
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
