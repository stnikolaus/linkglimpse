import { htmlToMarkdown } from '@/lib/html-to-markdown';
import { markdownPathForPage, normalizePagePath } from '@/lib/markdown-paths';

const MARKDOWN_SOURCE_HEADER = 'x-linkglimpse-markdown-source';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const source = requestUrl.searchParams.get('source');

  if (!source || !isSafeSourcePath(source)) {
    return markdownResponse('# Invalid Markdown source\n', 400);
  }

  const sourceUrl = new URL(source, requestUrl.origin);
  if (sourceUrl.origin !== requestUrl.origin) {
    return markdownResponse('# Invalid Markdown source\n', 400);
  }

  const fetched = await fetchSameOriginPage(sourceUrl);
  if (!fetched) {
    return markdownResponse('# Page unavailable\n', 502);
  }

  const { response: htmlResponse, finalUrl } = fetched;

  if (!htmlResponse.ok) {
    const message = htmlResponse.status === 404 ? '# Page not found\n' : '# Page unavailable\n';
    return markdownResponse(message, htmlResponse.status);
  }

  const contentType = htmlResponse.headers.get('content-type') ?? '';
  if (!contentType.includes('text/html')) {
    return markdownResponse('# Markdown representation unavailable\n', 406);
  }

  const markdown = htmlToMarkdown(await htmlResponse.text(), finalUrl.toString());
  const response = markdownResponse(markdown, 200);
  response.headers.set('Content-Location', markdownPathForPage(normalizePagePath(sourceUrl.pathname)));
  return response;
}

async function fetchSameOriginPage(
  initialUrl: URL,
): Promise<{ response: Response; finalUrl: URL } | null> {
  let currentUrl = initialUrl;

  for (let redirectCount = 0; redirectCount <= 5; redirectCount += 1) {
    const response = await fetch(currentUrl, {
      headers: {
        Accept: 'text/html',
        [MARKDOWN_SOURCE_HEADER]: '1',
      },
      redirect: 'manual',
      cache: 'no-store',
    });

    if (response.status < 300 || response.status >= 400) {
      return { response, finalUrl: currentUrl };
    }

    const location = response.headers.get('location');
    if (!location) return { response, finalUrl: currentUrl };

    const redirectUrl = new URL(location, currentUrl);
    if (redirectUrl.origin !== initialUrl.origin || !isSafeSourcePath(`${redirectUrl.pathname}${redirectUrl.search}`)) {
      return null;
    }
    currentUrl = redirectUrl;
  }

  return null;
}

function isSafeSourcePath(source: string): boolean {
  if (!source.startsWith('/') || source.startsWith('//')) return false;
  const sourceUrl = new URL(source, 'https://www.linkglimpse.com');
  return !sourceUrl.pathname.startsWith('/api/')
    && sourceUrl.pathname !== '/llms.txt'
    && sourceUrl.pathname !== '/preview'
    && !sourceUrl.pathname.endsWith('.md');
}

function markdownResponse(body: string, status: number): Response {
  return new Response(body, {
    status,
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400',
      'Content-Type': 'text/markdown; charset=utf-8',
      Vary: 'Accept',
    },
  });
}
