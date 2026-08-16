import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { pagePathFromMarkdown } from '@/lib/markdown-paths';

const INTERNAL_MARKDOWN_ROUTE = '/api/markdown';
const MARKDOWN_SOURCE_HEADER = 'x-linkglimpse-markdown-source';
const NON_PAGE_PATHS = new Set([
  '/favicon.ico',
  '/llms.txt',
  '/manifest.json',
  '/preview',
  '/robots.txt',
  '/sitemap.xml',
]);

export function middleware(request: NextRequest) {
  if (!isPageRequest(request)) {
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;
  const explicitPagePath = pagePathFromMarkdown(pathname);

  if (explicitPagePath) {
    return rewriteToMarkdown(request, `${explicitPagePath}${search}`);
  }

  if (prefersMarkdown(request.headers.get('accept'))) {
    return rewriteToMarkdown(request, `${pathname}${search}`);
  }

  const response = NextResponse.next();
  response.headers.set('Vary', 'Accept');
  return response;
}

function isPageRequest(request: NextRequest): boolean {
  if (request.method !== 'GET' && request.method !== 'HEAD') return false;
  if (request.headers.has(MARKDOWN_SOURCE_HEADER)) return false;

  const { pathname } = request.nextUrl;
  if (NON_PAGE_PATHS.has(pathname)) return false;
  if (pathname === INTERNAL_MARKDOWN_ROUTE || pathname.startsWith('/api/')) return false;
  if (pathname.startsWith('/_next/') || pathname.startsWith('/images/')) return false;

  const lastSegment = pathname.split('/').pop() ?? '';
  return !lastSegment.includes('.') || pathname.endsWith('.md');
}

function rewriteToMarkdown(request: NextRequest, sourcePath: string): NextResponse {
  const destination = new URL(INTERNAL_MARKDOWN_ROUTE, request.url);
  destination.searchParams.set('source', sourcePath);
  return NextResponse.rewrite(destination);
}

function prefersMarkdown(acceptHeader: string | null): boolean {
  if (!acceptHeader) return false;

  const accepted = acceptHeader.toLowerCase().split(',').map((entry) => {
    const [type, ...parameters] = entry.trim().split(';');
    const qualityParameter = parameters.find((parameter) => parameter.trim().startsWith('q='));
    const quality = qualityParameter ? Number.parseFloat(qualityParameter.split('=')[1]) : 1;
    return { type: type.trim(), quality: Number.isFinite(quality) ? quality : 0 };
  });

  const markdownQuality = Math.max(
    ...accepted
      .filter(({ type }) => type === 'text/markdown' || type === 'text/x-markdown')
      .map(({ quality }) => quality),
    0,
  );
  const htmlQuality = Math.max(
    ...accepted
      .filter(({ type }) => type === 'text/html' || type === 'application/xhtml+xml')
      .map(({ quality }) => quality),
    0,
  );

  return markdownQuality > 0 && markdownQuality >= htmlQuality;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
