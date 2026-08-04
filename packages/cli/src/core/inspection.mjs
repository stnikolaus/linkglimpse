import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { analyzeMetadata } from './analysis.mjs';

const DEFAULTS = {
  maxHtmlBytes: 2_000_000,
  maxImageHeaderBytes: 65_536,
  maxImageBytes: 5_000_000,
  requestTimeoutMs: 12_000,
  maxRedirects: 8,
  userAgent: 'LinkGlimpse/2.0 (+https://www.linkglimpse.com)',
};

export async function inspectUrl(input, options = {}) {
  const config = { ...DEFAULTS, ...options };
  const requestedUrl = await validatePublicUrl(input);
  const { response, finalUrl, redirectChain } = await fetchWithRedirects(requestedUrl, {
    accept: 'text/html,application/xhtml+xml', config,
  });
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
    const error = new Error(`Expected an HTML page but received ${contentType || 'an unknown content type'}`);
    error.status = 415;
    throw error;
  }

  const html = await readResponsePrefix(response, config.maxHtmlBytes);
  const metadata = extractMetadata(html, requestedUrl.toString(), finalUrl.toString());
  const imageInfo = metadata.image ? await inspectImage(metadata.image, config) : undefined;
  const result = {
    ...metadata,
    requestedUrl: requestedUrl.toString(), finalUrl: finalUrl.toString(), url: finalUrl.toString(),
    status: response.status, statusText: response.statusText,
    redirected: redirectChain.some((hop) => Boolean(hop.location)), redirectChain, contentType, imageInfo,
  };
  result.diagnostics = analyzeMetadata(result);
  return result;
}

export async function inspectUrls(inputs, options = {}) {
  const concurrency = Math.max(1, Math.min(Number(options.concurrency) || 4, 10));
  const results = new Array(inputs.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < inputs.length) {
      const index = nextIndex++;
      try {
        results[index] = { success: true, url: inputs[index], report: await inspectUrl(inputs[index], options) };
      } catch (error) {
        results[index] = { success: false, url: inputs[index], error: error instanceof Error ? error.message : String(error) };
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, inputs.length) }, worker));
  return results;
}

export async function fetchPublicImage(input, options = {}) {
  const config = { ...DEFAULTS, ...options };
  const startUrl = await validatePublicUrl(input);
  const { response, finalUrl } = await fetchWithRedirects(startUrl, { accept: 'image/*', config });
  if (!response.ok) throw new Error(`Share image returned HTTP ${response.status}`);
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.startsWith('image/')) throw new Error(`Share image returned ${contentType || 'an unknown content type'}`);
  const bytes = await readBinaryPrefix(response, config.maxImageBytes, true);
  return { bytes, contentType, finalUrl: finalUrl.toString() };
}

export async function validatePublicUrl(input) {
  const parsed = new URL(input);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Only HTTP and HTTPS URLs are supported');
  if (parsed.username || parsed.password) throw new Error('URLs containing credentials are not supported');
  const hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');
  const blockedHostname = hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.local')
    || hostname.endsWith('.internal') || hostname.endsWith('.test') || hostname.endsWith('.invalid');
  if (blockedHostname) throw new Error('Private or local network URLs are not supported');
  const addresses = isIP(hostname) ? [{ address: hostname }] : await lookup(hostname, { all: true, verbatim: true });
  if (addresses.length === 0 || addresses.some(({ address }) => isPrivateOrReservedAddress(address))) {
    throw new Error('Private or reserved network URLs are not supported');
  }
  return parsed;
}

async function fetchWithRedirects(startUrl, { accept, config }) {
  let currentUrl = startUrl;
  const redirectChain = [];
  for (let attempt = 0; attempt <= config.maxRedirects; attempt += 1) {
    const response = await fetch(currentUrl, {
      headers: { Accept: accept, 'User-Agent': config.userAgent }, redirect: 'manual', cache: 'no-store',
      signal: AbortSignal.timeout(config.requestTimeoutMs),
    });
    const location = response.headers.get('location');
    const isRedirect = location && [300, 301, 302, 303, 307, 308].includes(response.status);
    const resolvedLocation = isRedirect ? (await validatePublicUrl(new URL(location, currentUrl).toString())).toString() : undefined;
    redirectChain.push({ url: currentUrl.toString(), status: response.status, statusText: response.statusText, location: resolvedLocation });
    if (!resolvedLocation) return { response, finalUrl: currentUrl, redirectChain };
    currentUrl = new URL(resolvedLocation);
  }
  throw new Error(`Too many redirects (more than ${config.maxRedirects})`);
}

async function inspectImage(input, config) {
  const inspection = { url: input };
  try {
    const imageUrl = await validatePublicUrl(input);
    const { response } = await fetchWithRedirects(imageUrl, { accept: 'image/*', config });
    const bytes = await readBinaryPrefix(response, config.maxImageHeaderBytes);
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

async function readResponsePrefix(response, limit) {
  const bytes = await readBinaryPrefix(response, limit);
  return new TextDecoder().decode(bytes);
}

async function readBinaryPrefix(response, limit, rejectOverflow = false) {
  if (!response.body) {
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (rejectOverflow && bytes.byteLength > limit) throw new Error(`Response exceeds the ${limit} byte limit`);
    return bytes.subarray(0, limit);
  }
  const reader = response.body.getReader();
  const chunks = [];
  let received = 0;
  while (received <= limit) {
    const { done, value } = await reader.read();
    if (done) break;
    if (rejectOverflow && received + value.byteLength > limit) {
      await reader.cancel().catch(() => undefined);
      throw new Error(`Response exceeds the ${limit} byte limit`);
    }
    const remaining = limit - received;
    const chunk = value.byteLength > remaining ? value.subarray(0, remaining) : value;
    chunks.push(chunk); received += chunk.byteLength;
    if (value.byteLength > remaining || received === limit) break;
  }
  await reader.cancel().catch(() => undefined);
  const output = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) { output.set(chunk, offset); offset += chunk.byteLength; }
  return output;
}

export function extractMetadata(html, requestedUrl, finalUrl) {
  const tags = {};
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const attributes = parseAttributes(tag);
    const key = (attributes.property || attributes.name || attributes['http-equiv'])?.toLowerCase();
    if (key && attributes.content && !(key in tags)) tags[key] = decodeHtmlEntities(attributes.content.trim());
  }
  const titleTag = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  const pageTitle = decodeHtmlEntities(titleTag?.trim() ?? '');
  const canonicalTag = (html.match(/<link\b[^>]*>/gi) ?? []).map(parseAttributes)
    .find((attributes) => attributes.rel?.toLowerCase().split(/\s+/).includes('canonical'));
  const canonical = resolveUrl(canonicalTag?.href, finalUrl);
  const image = resolveUrl(tags['og:image'] || tags['twitter:image'], finalUrl);
  return {
    pageTitle, pageDescription: tags.description,
    title: tags['og:title'] || tags['twitter:title'] || pageTitle,
    description: tags['og:description'] || tags['twitter:description'] || tags.description,
    image, url: finalUrl, requestedUrl, finalUrl, siteName: tags['og:site_name'], author: tags.author,
    canonical, robots: [tags.robots, tags.googlebot].filter(Boolean).join(', ') || undefined, tags,
    openGraph: Object.fromEntries(Object.entries(tags).filter(([key]) => key.startsWith('og:'))),
    twitter: Object.fromEntries(Object.entries(tags).filter(([key]) => key.startsWith('twitter:'))),
  };
}

function parseAttributes(tag) {
  const attributes = {};
  const pattern = /([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;
  let match;
  while ((match = pattern.exec(tag))) attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? '';
  return attributes;
}

function decodeHtmlEntities(value) {
  const named = { amp: '&', apos: "'", gt: '>', lt: '<', quot: '"', nbsp: ' ' };
  return value.replace(/&(#x?[\da-f]+|[a-z]+);/gi, (entity, code) => {
    if (code.startsWith('#x') || code.startsWith('#X')) return String.fromCodePoint(Number.parseInt(code.slice(2), 16));
    if (code.startsWith('#')) return String.fromCodePoint(Number.parseInt(code.slice(1), 10));
    return named[code.toLowerCase()] ?? entity;
  });
}

function resolveUrl(value, base) {
  if (!value) return undefined;
  try { return new URL(value, base).toString(); } catch { return value; }
}

function isPrivateOrReservedAddress(address) {
  const normalized = address.toLowerCase().split('%')[0];
  const mappedIpv4 = normalized.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/)?.[1];
  if (mappedIpv4) return isPrivateOrReservedIpv4(mappedIpv4);
  if (isIP(normalized) === 4) return isPrivateOrReservedIpv4(normalized);
  if (isIP(normalized) !== 6) return true;
  return normalized === '::' || normalized === '::1' || normalized.startsWith('fc') || normalized.startsWith('fd')
    || /^fe[89ab]/.test(normalized) || normalized.startsWith('ff') || normalized.startsWith('2001:db8:');
}

function isPrivateOrReservedIpv4(hostname) {
  const match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!match) return false;
  const octets = match.slice(1).map(Number);
  if (octets.some((octet) => octet > 255)) return true;
  const [a, b] = octets;
  return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31)
    || (a === 192 && b === 168) || (a === 192 && b === 0) || (a === 100 && b >= 64 && b <= 127)
    || (a === 198 && (b === 18 || b === 19)) || (a === 198 && b === 51 && octets[2] === 100)
    || (a === 203 && b === 0 && octets[2] === 113) || a >= 224;
}

function parseContentLength(value) {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseImageContentLength(headers) {
  const totalFromRange = headers.get('content-range')?.match(/\/(\d+)$/)?.[1];
  return parseContentLength(totalFromRange ?? headers.get('content-length'));
}

function getImageDimensions(bytes) {
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
    if (format === 'VP8X') return { width: 1 + bytes[24] + (bytes[25] << 8) + (bytes[26] << 16), height: 1 + bytes[27] + (bytes[28] << 8) + (bytes[29] << 16) };
  }
  if (bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    let offset = 2;
    while (offset + 8 < bytes.length) {
      if (bytes[offset] !== 0xff) { offset += 1; continue; }
      const marker = bytes[offset + 1];
      const length = (bytes[offset + 2] << 8) + bytes[offset + 3];
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return { height: (bytes[offset + 5] << 8) + bytes[offset + 6], width: (bytes[offset + 7] << 8) + bytes[offset + 8] };
      }
      if (length < 2) break;
      offset += length + 2;
    }
  }
  return undefined;
}
