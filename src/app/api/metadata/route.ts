import { NextRequest, NextResponse } from 'next/server';
import { InspectionError, inspectUrl } from 'linkglimpse/core/inspection';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required', url: '' }, { status: 400 });
  }

  try {
    const result = await inspectUrl(url, {
      userAgent: 'LinkGlimpse/2.0 (+https://www.linkglimpse.com)',
    });
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch URL metadata';
    const isExpectedRejection = error instanceof InspectionError;
    const status = isExpectedRejection ? error.status : 500;

    if (isExpectedRejection) {
      console.warn(`Metadata inspection rejected (${error.code}):`, message);
    } else {
      console.error('Metadata inspection failed:', message);
    }
    return NextResponse.json({ error: message, url }, { status });
  }
}
