import { NextRequest, NextResponse } from 'next/server';
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { analyzeMetadata } from '@/lib/metadata-analysis';
import type { ApiResponse, ImageInspection, RedirectHop } from '@/types';

const MAX_HTML_BYTES = 2_000_000;
const MAX_IMAGE_HEADER_BYTES = 65_536;
const REQUEST_TIMEOUT_MS = 12_000;
const MAX_REDIRECTS = 8;

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required', url: '' }, { status: 400 });
  }

  try {
    const requestedUrl = await validatePublicUrl(url);
    const { response, finalUrl, redirectChain } = await fetchPageWithRedirects(requestedUrl);
    const contentType = response.headers.get('content-type') ?? '';

    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
      return NextResponse.json(
        { error: `Expected an HTML page but received ${contentType || 'an unknown content type'}`, url: requestedUrl.toString() },
        { status: 415 },
      );
    }

    const html = await readResponsePrefix(response, MAX_HTML_BYTES);
    const metadata = extractMetadata(html, requestedUrl.toString(), finalUrl.toString());
    const imageInfo = metadata.image ? await inspectImage(metadata.image) : undefined;
    const result: ApiResponse = {
      ...metadata,
      requestedUrl: requestedUrl.toString(),
      finalUrl: finalUrl.toString(),
      url: finalUrl.toString(),
      status: response.status,
      statusText: response.statusText,
      redirected: redirectChain.some((hop) => Boolean(hop.location)),
      redirectChain,
      contentType,
      imageInfo,
    };

    result.diagnostics = analyzeMetadata(result);

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch URL metadata';
    const status = error instanceof DOMException && error.name === 'TimeoutError' ? 504 : 422;

    console.error('Metadata inspection failed:', message);
    return NextResponse.json({ error: message, url }, { status });
  }
}

async function fetchPageWithRedirects(startUrl: URL): Promise<{
  response: Response;
  finalUrl: URL;
  redirectChain: RedirectHop[];
}> {
  let currentUrl = startUrl;
  const redirectChain: RedirectHop[] = [];

  for (let attempt = 0; attempt <= MAX_REDIRECTS; attempt += 1) {
    const response = await fetch(currentUrl, {
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'User-Agent': 'LinkGlimpse/2.0 (+https://www.linkglimpse.com)',
      },
      redirect: 'manual',
      cache: 'no-store',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    const location = response.headers.get('location');
    const isRedirect = location && [300, 301, 302, 303, 307, 308].includes(response.status);
    const resolvedLocation = isRedirect
      ? (await validatePublicUrl(new URL(location, currentUrl).toString())).toString()
      : undefined;

    redirectChain.push({
      url: currentUrl.toString(),
      status: response.status,
      statusText: response.statusText,
      location: resolvedLocation,
    });

    if (!resolvedLocation) {
      return { response, finalUrl: currentUrl, redirectChain };
    }

    currentUrl = new URL(resolvedLocation);
  }

  throw new Error(`Too many redirects (more than ${MAX_REDIRECTS})`);
}

async function validatePublicUrl(input: string): Promise<URL> {
  const parsed = new URL(input);

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Only HTTP and HTTPS URLs are supported');
  }
  if (parsed.username || parsed.password) {
    throw new Error('URLs containing credentials are not supported');
  }

  const hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');
  const blockedHostname = hostname === 'localhost'
    || hostname.endsWith('.localhost')
    || hostname.endsWith('.local')
    || hostname.endsWith('.internal')
    || hostname.endsWith('.test')
    || hostname.endsWith('.invalid');

  if (blockedHostname) {
    throw new Error('Private or local network URLs are not supported');
  }

  const addresses = isIP(hostname)
    ? [{ address: hostname }]
    : await lookup(hostname, { all: true, verbatim: true });

  if (addresses.length === 0 || addresses.some(({ address }) => isPrivateOrReservedAddress(address))) {
    throw new Error('Private or reserved network URLs are not supported');
  }

  return parsed;
}

function isPrivateOrReservedAddress(address: string): boolean {
  const normalized = address.toLowerCase().split('%')[0];
  const mappedIpv4 = normalized.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/)?.[1];
  if (mappedIpv4) return isPrivateOrReservedIpv4(mappedIpv4);
  if (isIP(normalized) === 4) return isPrivateOrReservedIpv4(normalized);
  if (isIP(normalized) !== 6) return true;

  return normalized === '::'
    || normalized === '::1'
    || normalized.startsWith('fc')
    || normalized.startsWith('fd')
    || /^fe[89ab]/.test(normalized)
    || normalized.startsWith('ff')
    || normalized.startsWith('2001:db8:');
}

function isPrivateOrReservedIpv4(hostname: string): boolean {
  const match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!match) return false;

  const octets = match.slice(1).map(Number);
  if (octets.some((octet) => octet > 255)) return true;

  const [a, b] = octets;
  return a === 10
    || a === 127
    || a === 0
    || (a === 169 && b === 254)
    || (a === 172 && b >= 16 && b <= 31)
    || (a === 192 && b === 168)
    || (a === 192 && b === 0)
    || (a === 192 && b === 0 && octets[2] === 2)
    || (a === 100 && b >= 64 && b <= 127)
    || (a === 198 && (b === 18 || b === 19))
    || (a === 198 && b === 51 && octets[2] === 100)
    || (a === 203 && b === 0 && octets[2] === 113)
    || a >= 224;
}

async function readResponsePrefix(response: Response, limit: number): Promise<string> {
  if (!response.body) return response.text();

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let received = 0;
  let output = '';

  while (received < limit) {
    const { done, value } = await reader.read();
    if (done) break;
    const remaining = limit - received;
    const chunk = value.byteLength > remaining ? value.subarray(0, remaining) : value;
    received += chunk.byteLength;
    output += decoder.decode(chunk, { stream: received < limit });
    if (value.byteLength > remaining) break;
  }

  await reader.cancel().catch(() => undefined);
  output += decoder.decode();
  return output;
}

function extractMetadata(html: string, requestedUrl: string, finalUrl: string): ApiResponse {
  const tags: Record<string, string> = {};

  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const attributes = parseAttributes(tag);
    const key = (attributes.property || attributes.name || attributes['http-equiv'])?.toLowerCase();
    if (key && attributes.content && !(key in tags)) {
      tags[key] = decodeHtmlEntities(attributes.content.trim());
    }
  }

  const titleTag = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  const pageTitle = decodeHtmlEntities(titleTag?.trim() ?? '');
  const pageDescription = tags.description;
  const canonicalTag = (html.match(/<link\b[^>]*>/gi) ?? [])
    .map(parseAttributes)
    .find((attributes) => attributes.rel?.toLowerCase().split(/\s+/).includes('canonical'));
  const canonical = resolveUrl(canonicalTag?.href, finalUrl);
  const image = resolveUrl(tags['og:image'] || tags['twitter:image'], finalUrl);
  const openGraph = Object.fromEntries(Object.entries(tags).filter(([key]) => key.startsWith('og:')));
  const twitter = Object.fromEntries(Object.entries(tags).filter(([key]) => key.startsWith('twitter:')));

  return {
    pageTitle,
    pageDescription,
    title: tags['og:title'] || tags['twitter:title'] || pageTitle,
    description: tags['og:description'] || tags['twitter:description'] || tags.description,
    image,
    url: finalUrl,
    requestedUrl,
    finalUrl,
    siteName: tags['og:site_name'],
    author: tags.author,
    canonical,
    robots: [tags.robots, tags.googlebot].filter(Boolean).join(', ') || undefined,
    tags,
    openGraph,
    twitter,
  };
}

function parseAttributes(tag: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  const pattern = /([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(tag))) {
    attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? '';
  }

  return attributes;
}

function decodeHtmlEntities(value: string): string {
  const named: Record<string, string> = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    quot: '"',
    nbsp: ' ',
  };

  return value.replace(/&(#x?[\da-f]+|[a-z]+);/gi, (entity, code: string) => {
    if (code.startsWith('#x') || code.startsWith('#X')) {
      return String.fromCodePoint(Number.parseInt(code.slice(2), 16));
    }
    if (code.startsWith('#')) {
      return String.fromCodePoint(Number.parseInt(code.slice(1), 10));
    }
    return named[code.toLowerCase()] ?? entity;
  });
}

function resolveUrl(value: string | undefined, base: string): string | undefined {
  if (!value) return undefined;
  try {
    return new URL(value, base).toString();
  } catch {
    return value;
  }
}

async function inspectImage(input: string): Promise<ImageInspection> {
  const inspection: ImageInspection = { url: input };

  try {
    let imageUrl = await validatePublicUrl(input);
    let response: Response | undefined;

    for (let attempt = 0; attempt <= MAX_REDIRECTS; attempt += 1) {
      response = await fetch(imageUrl, {
        headers: {
          Accept: 'image/*',
          Range: `bytes=0-${MAX_IMAGE_HEADER_BYTES - 1}`,
          'User-Agent': 'LinkGlimpse/2.0 (+https://www.linkglimpse.com)',
        },
        redirect: 'manual',
        cache: 'no-store',
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      const location = response.headers.get('location');
      if (!location || ![300, 301, 302, 303, 307, 308].includes(response.status)) break;
      imageUrl = await validatePublicUrl(new URL(location, imageUrl).toString());
      response = undefined;
    }

    if (!response) throw new Error(`Too many image redirects (more than ${MAX_REDIRECTS})`);
    const bytes = await readBinaryPrefix(response, MAX_IMAGE_HEADER_BYTES);
    const dimensions = getImageDimensions(bytes);

    inspection.status = response.status;
    inspection.contentType = response.headers.get('content-type') ?? undefined;
    inspection.contentLength = parseImageContentLength(response.headers);
    inspection.width = dimensions?.width;
    inspection.height = dimensions?.height;
  } catch (error) {
    inspection.error = error instanceof Error ? error.message : 'Unable to inspect image';
  }

  return inspection;
}

async function readBinaryPrefix(response: Response, limit: number): Promise<Uint8Array> {
  if (!response.body) return new Uint8Array(await response.arrayBuffer());

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  while (received < limit) {
    const { done, value } = await reader.read();
    if (done) break;
    const remaining = limit - received;
    const chunk = value.byteLength > remaining ? value.subarray(0, remaining) : value;
    chunks.push(chunk);
    received += chunk.byteLength;
    if (value.byteLength > remaining) break;
  }

  await reader.cancel().catch(() => undefined);
  const output = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return output;
}

function parseContentLength(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseImageContentLength(headers: Headers): number | undefined {
  const contentRange = headers.get('content-range');
  const totalFromRange = contentRange?.match(/\/(\d+)$/)?.[1];
  return parseContentLength(totalFromRange ?? headers.get('content-length'));
}

function getImageDimensions(bytes: Uint8Array): { width: number; height: number } | undefined {
  if (bytes.length >= 24 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    return { width: view.getUint32(16), height: view.getUint32(20) };
  }

  if (bytes.length >= 10 && String.fromCharCode(...bytes.subarray(0, 3)) === 'GIF') {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    return { width: view.getUint16(6, true), height: view.getUint16(8, true) };
  }

  if (bytes.length >= 30 && String.fromCharCode(...bytes.subarray(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.subarray(8, 12)) === 'WEBP') {
    const format = String.fromCharCode(...bytes.subarray(12, 16));
    if (format === 'VP8X') {
      return {
        width: 1 + bytes[24] + (bytes[25] << 8) + (bytes[26] << 16),
        height: 1 + bytes[27] + (bytes[28] << 8) + (bytes[29] << 16),
      };
    }
  }

  if (bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    let offset = 2;
    while (offset + 8 < bytes.length) {
      if (bytes[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = bytes[offset + 1];
      const length = (bytes[offset + 2] << 8) + bytes[offset + 3];
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return {
          height: (bytes[offset + 5] << 8) + bytes[offset + 6],
          width: (bytes[offset + 7] << 8) + bytes[offset + 8],
        };
      }
      if (length < 2) break;
      offset += length + 2;
    }
  }

  return undefined;
}
