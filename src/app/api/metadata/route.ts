import { NextRequest, NextResponse } from 'next/server';
import { inspectUrl } from 'linkglimpse/core/inspection';

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
    const errorStatus = error && typeof error === 'object' && 'status' in error ? Number(error.status) : undefined;
    const status = error instanceof DOMException && error.name === 'TimeoutError' ? 504 : errorStatus === 415 ? 415 : 422;

    console.error('Metadata inspection failed:', message);
    return NextResponse.json({ error: message, url }, { status });
  }
}
