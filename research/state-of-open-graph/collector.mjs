import { createHash } from 'node:crypto';
import { parse } from 'parse5';
import { getDomain } from 'tldts';
import { analyzeMetadata } from '../../packages/cli/src/core/analysis.mjs';
import { assertManifest } from './generate-manifest.mjs';
import {
  CollectorSafetyError,
  GLOBAL_PAGE_CONCURRENCY,
  MAX_HTML_BYTES,
  MAX_IMAGE_HEADER_BYTES,
  MIN_ORIGIN_DELAY_MS,
  REQUEST_TIMEOUT_MS,
  RESEARCH_USER_AGENT,
  createRequestScheduler,
  createRobotsGuard,
  fetchWithSafety,
  readResponsePrefix,
} from './collector-safety.mjs';

const SCHEMA_VERSION = '2.0.0';
const HTML_CONTENT_TYPES = ['text/html', 'application/xhtml+xml'];

export async function collectManifest(manifest, options) {
  assertManifest(manifest);
  const collectorCommit = options?.collectorCommit;
  if (!/^[a-f0-9]{40}$/.test(collectorCommit ?? '')) {
    throw new Error('Collector commit must be a complete lowercase 40-character Git SHA');
  }

  const concurrency = options.concurrency ?? GLOBAL_PAGE_CONCURRENCY;
  const scheduler = options.scheduler ?? createRequestScheduler({
    globalConcurrency: concurrency,
    now: options.now,
    sleep: options.sleep,
  });
  const robotsGuard = options.robotsGuard ?? createRobotsGuard({
    fetchImpl: options.fetchImpl,
    lookup: options.lookup,
    scheduler,
    now: options.now,
    sleep: options.sleep,
  });
  const dependencies = {
    fetchImpl: options.fetchImpl,
    lookup: options.lookup,
    scheduler,
    robotsGuard,
    now: options.now,
    sleep: options.sleep,
  };
  const observations = new Array(manifest.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < manifest.length) {
      const index = nextIndex;
      nextIndex += 1;
      const observation = await collectSample(manifest[index], {
        ...options,
        ...dependencies,
        collectorCommit,
        concurrency,
      });
      observations[index] = observation;
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  excludeDuplicateFinalDestinations(observations);
  return observations;
}

function excludeDuplicateFinalDestinations(observations) {
  const finalDestinations = new Set();
  observations.forEach((observation, index) => {
    if (observation.disposition !== 'collected') return;
    const destination = normalizeDestination(observation.final_url);
    if (!finalDestinations.has(destination)) {
      finalDestinations.add(destination);
      return;
    }
    observations[index] = {
      schema_version: observation.schema_version,
      methodology_version: observation.methodology_version,
      sample_id: observation.sample_id,
      observed_at: observation.observed_at,
      requested_url: observation.requested_url,
      final_url: observation.final_url,
      robots: observation.robots,
      collection: observation.collection,
      disposition: 'excluded',
      exclusion_reason: 'duplicate_final_destination',
    };
  });
}

export async function collectSample(sample, options) {
  const collection = collectionRecord(options);
  let robots;
  try {
    robots = normalizeRobots(await options.robotsGuard.check(sample.requested_url));
    if (!robots.allowed) {
      return {
        ...baseObservation(sample, robots, collection, options.now),
        disposition: 'excluded',
        exclusion_reason: robots.state === 'unreachable' ? 'robots_unreachable' : 'robots_disallowed',
      };
    }

    const result = await fetchWithSafety(sample.requested_url, {
      fetchImpl: options.fetchImpl,
      lookup: options.lookup,
      scheduler: options.scheduler,
      robotsGuard: options.robotsGuard,
      responseByteLimit: MAX_HTML_BYTES,
      now: options.now,
      sleep: options.sleep,
    });
    robots = normalizeRobots(result.robots ?? robots);
    const contentType = result.response.headers.get('content-type') ?? '';

    if (result.response.status === 401) {
      return excluded(sample, robots, collection, 'authentication_required', options.now, result.finalUrl);
    }
    if (result.response.status === 403) {
      return excluded(sample, robots, collection, 'access_challenge', options.now, result.finalUrl);
    }
    if (!result.response.ok) {
      return failed(sample, robots, collection, 'http_error', options.now, result.finalUrl);
    }
    if (!HTML_CONTENT_TYPES.some((type) => contentType.toLowerCase().includes(type))) {
      return excluded(sample, robots, collection, 'non_html', options.now, result.finalUrl);
    }

    const html = new TextDecoder().decode(result.bytes);
    const parsed = parseStudyMetadata(html, result.finalUrl);
    const image = await inspectStudyImage(parsed.imageUrl, {
      fetchImpl: options.fetchImpl,
      lookup: options.lookup,
      scheduler: options.scheduler,
      robotsGuard: options.robotsGuard,
      now: options.now,
      sleep: options.sleep,
    });
    const diagnosticInput = toDiagnosticInput(parsed, result, contentType, image);
    const diagnostics = analyzeMetadata(diagnosticInput);

    return {
      ...baseObservation(sample, robots, collection, options.now),
      disposition: 'collected',
      final_url: result.finalUrl.toString(),
      fetch: {
        http_status: result.response.status,
        content_type: contentType,
        html_bytes_read: result.bytes.byteLength,
        redirects: result.redirects,
        html_prefix_sha256: sha256(result.bytes),
      },
      metadata: buildMetadataRecord(parsed, result.finalUrl, image),
      diagnostics: {
        score: diagnostics.score,
        pass_count: diagnostics.counts.pass,
        warning_count: diagnostics.counts.warning,
        fail_count: diagnostics.counts.fail,
        checks: diagnostics.checks.map(({ id, status }) => ({ id, status })),
      },
    };
  } catch (error) {
    if (error instanceof CollectorSafetyError) {
      const errorRobots = error.details?.robots ? normalizeRobots(error.details.robots) : robots;
      if (!errorRobots) throw error;
      if (error.code === 'robots_disallowed' || error.code === 'robots_unreachable') {
        return excluded(sample, errorRobots, collection, error.code, options.now);
      }
      if (['unsafe_network', 'invalid_url', 'unsupported_protocol', 'credentialed_url'].includes(error.code)) {
        return excluded(sample, errorRobots, collection, 'unsafe_redirect', options.now);
      }
      return failed(sample, errorRobots, collection, mapFailureReason(error.code), options.now);
    }
    if (!robots) throw error;
    return failed(sample, robots, collection, 'parser_error', options.now);
  }
}

export function parseStudyMetadata(html, finalUrl) {
  const document = parse(String(html));
  const meta = new Map();
  const titles = [];
  const canonicals = [];

  visitHtmlElements(document, (element) => {
    const attributes = Object.fromEntries(element.attrs.map(({ name, value }) => [name.toLowerCase(), value]));
    if (element.tagName === 'title') {
      const value = elementText(element).trim();
      if (value) titles.push(value);
      return;
    }
    if (element.tagName === 'link') {
      if (!attributes.rel?.toLowerCase().split(/\s+/).includes('canonical')) return;
      const value = attributes.href?.trim();
      if (value) canonicals.push(value);
      return;
    }
    if (element.tagName !== 'meta') return;
    const key = (attributes.property || attributes.name)?.trim().toLowerCase();
    if (!key) return;
    const value = (attributes.content ?? '').trim();
    if (!value) return;
    meta.set(key, [...(meta.get(key) ?? []), value]);
  });
  const values = (key) => meta.get(key) ?? [];
  const imageCandidates = [...values('og:image'), ...values('og:image:url')];
  const imageUrl = firstValidUrl(imageCandidates, finalUrl);
  const twitterImageUrl = firstValidUrl(values('twitter:image'), finalUrl);

  return {
    titles,
    description: values('description'),
    canonical: canonicals,
    robots: [...values('robots'), ...values('googlebot')],
    ogTitle: values('og:title'),
    ogDescription: values('og:description'),
    ogUrl: values('og:url'),
    ogType: values('og:type'),
    imageCandidates,
    imageUrl,
    twitterCard: values('twitter:card'),
    twitterTitle: values('twitter:title'),
    twitterDescription: values('twitter:description'),
    twitterImage: values('twitter:image'),
    twitterImageUrl,
    rawTags: Object.fromEntries([...meta].map(([key, entries]) => [key, entries[0]])),
  };
}

export function buildMetadataRecord(parsed, finalUrl, image) {
  const robotsValue = parsed.robots.join(', ');
  const canonical = urlSignal(parsed.canonical, finalUrl);
  canonical.classification = classifyCanonical(parsed.canonical[0], finalUrl);
  const noindex = parsed.robots.some((value) => value.toLowerCase().split(/[\s,]+/).includes('noindex'));

  return {
    title: textSignal(parsed.titles),
    description: textSignal(parsed.description),
    canonical,
    robots: {
      present: parsed.robots.length > 0,
      noindex,
      duplicate_count: parsed.robots.length,
      ...(robotsValue ? { value_sha256: sha256(robotsValue) } : {}),
    },
    open_graph: {
      title: textSignal(parsed.ogTitle),
      description: textSignal(parsed.ogDescription),
      url: urlSignal(parsed.ogUrl, finalUrl),
      type: textSignal(parsed.ogType),
      image_count: parsed.imageCandidates.length,
    },
    twitter: {
      card: textSignal(parsed.twitterCard),
      title: textSignal(parsed.twitterTitle),
      description: textSignal(parsed.twitterDescription),
      image: urlSignal(parsed.twitterImage, finalUrl),
      uses_open_graph_fallback: !parsed.twitterImageUrl && Boolean(parsed.imageUrl),
    },
    image: {
      present: Boolean(parsed.imageUrl),
      url: urlSignal(parsed.imageCandidates, finalUrl, parsed.imageUrl),
      fetched: image.fetched,
      ...(image.fetched ? {
        http_status: image.httpStatus,
        content_type: image.contentType,
        ...(image.contentLength === undefined ? {} : { content_length: image.contentLength }),
        ...(image.width ? { width: image.width } : {}),
        ...(image.height ? { height: image.height } : {}),
        ...(image.width && image.height ? {
          aspect_ratio: Number((image.width / image.height).toFixed(4)),
          near_1_91_to_1: Math.abs(image.width / image.height - 1.91) <= 0.05,
        } : {}),
      } : {}),
    },
  };
}

export function getImageDimensions(bytes) {
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
        return { height: (bytes[offset + 5] << 8) + bytes[offset + 6], width: (bytes[offset + 7] << 8) + bytes[offset + 8] };
      }
      if (length < 2) break;
      offset += length + 2;
    }
  }
  return undefined;
}

async function inspectStudyImage(imageUrl, options) {
  if (!imageUrl) return { fetched: false };
  try {
    const result = await fetchWithSafety(imageUrl, {
      ...options,
      accept: 'image/*',
    });
    const bytes = await readResponsePrefix(result.response, MAX_IMAGE_HEADER_BYTES);
    const contentType = result.response.headers.get('content-type') ?? '';
    if (!result.response.ok || !contentType.toLowerCase().startsWith('image/')) return { fetched: false };
    const dimensions = getImageDimensions(bytes);
    return {
      fetched: true,
      httpStatus: result.response.status,
      contentType,
      contentLength: parseContentLength(result.response.headers),
      ...dimensions,
    };
  } catch {
    return { fetched: false };
  }
}

function toDiagnosticInput(parsed, result, contentType, image) {
  return {
    title: parsed.ogTitle[0] || parsed.twitterTitle[0] || parsed.titles[0],
    description: parsed.ogDescription[0] || parsed.twitterDescription[0] || parsed.description[0],
    image: parsed.imageUrl,
    url: result.finalUrl.toString(),
    finalUrl: result.finalUrl.toString(),
    canonical: resolveHttpUrl(parsed.canonical[0], result.finalUrl)?.toString(),
    robots: parsed.robots.join(', ') || undefined,
    tags: parsed.rawTags,
    status: result.response.status,
    statusText: result.response.statusText,
    redirected: result.redirects.length > 0,
    contentType,
    imageInfo: image.fetched ? {
      status: image.httpStatus,
      contentType: image.contentType,
      contentLength: image.contentLength,
      width: image.width,
      height: image.height,
    } : undefined,
  };
}

function textSignal(values) {
  const value = values[0];
  return {
    present: Boolean(value),
    character_length: value?.length ?? 0,
    duplicate_count: values.length,
    ...(value ? { value_sha256: sha256(value) } : {}),
  };
}

function urlSignal(values, finalUrl, selectedValue) {
  const raw = selectedValue ?? values[0];
  const parsed = resolveHttpUrl(raw, finalUrl);
  if (!raw) return { present: false, valid: false, duplicate_count: 0 };
  if (!parsed) return { present: true, valid: false, duplicate_count: values.length };
  return {
    present: true,
    valid: true,
    duplicate_count: values.length,
    scheme: parsed.protocol.slice(0, -1),
    host_relation: hostRelation(parsed, finalUrl),
    host_sha256: sha256(parsed.hostname.toLowerCase()),
  };
}

function classifyCanonical(raw, finalUrl) {
  if (!raw) return 'missing';
  const parsed = resolveHttpUrl(raw, finalUrl);
  if (!parsed) return 'invalid';
  const final = new URL(finalUrl);
  if (parsed.origin !== final.origin) return 'cross_origin';
  return normalizedPath(parsed) === normalizedPath(final) ? 'self' : 'same_origin_other_path';
}

function hostRelation(url, finalUrl) {
  const final = new URL(finalUrl);
  if (url.hostname.toLowerCase() === final.hostname.toLowerCase()) return 'same_host';
  const targetDomain = getDomain(url.hostname, { allowPrivateDomains: true });
  const finalDomain = getDomain(final.hostname, { allowPrivateDomains: true });
  return targetDomain && finalDomain && targetDomain === finalDomain ? 'same_registrable_domain' : 'cross_domain';
}

function normalizeRobots(robots) {
  return {
    robots_url: robots.robotsUrl,
    status: robots.status,
    state: robots.state,
    allowed: robots.allowed,
    ...(robots.errorCode ? { error_code: robots.errorCode } : {}),
    ...(robots.matchedUserAgent ? { matched_user_agent: robots.matchedUserAgent } : {}),
    ...(robots.crawlDelaySeconds === undefined ? {} : { crawl_delay_seconds: robots.crawlDelaySeconds }),
    checked_at: robots.checkedAt,
  };
}

function collectionRecord(options) {
  return {
    collector_commit: options.collectorCommit,
    node_version: process.version,
    ...(options.coreVersion ? { linkglimpse_core_version: options.coreVersion } : {}),
    user_agent: RESEARCH_USER_AGENT,
    request_timeout_ms: REQUEST_TIMEOUT_MS,
    max_html_bytes: MAX_HTML_BYTES,
    max_image_header_bytes: MAX_IMAGE_HEADER_BYTES,
    global_concurrency: options.concurrency ?? GLOBAL_PAGE_CONCURRENCY,
    minimum_origin_delay_ms: MIN_ORIGIN_DELAY_MS,
  };
}

function baseObservation(sample, robots, collection, now = Date.now) {
  return {
    schema_version: SCHEMA_VERSION,
    methodology_version: SCHEMA_VERSION,
    sample_id: sample.sample_id,
    observed_at: new Date(now()).toISOString(),
    requested_url: sample.requested_url,
    robots,
    collection,
  };
}

function excluded(sample, robots, collection, reason, now, finalUrl) {
  return {
    ...baseObservation(sample, robots, collection, now),
    ...(finalUrl ? { final_url: finalUrl.toString() } : {}),
    disposition: 'excluded',
    exclusion_reason: reason,
  };
}

function failed(sample, robots, collection, reason, now, finalUrl) {
  return {
    ...baseObservation(sample, robots, collection, now),
    ...(finalUrl ? { final_url: finalUrl.toString() } : {}),
    disposition: 'failed',
    failure_reason: reason,
  };
}

function mapFailureReason(code) {
  return ['dns_error', 'timeout', 'tls_error', 'connection_error', 'response_too_large', 'redirect_limit'].includes(code)
    ? code
    : 'http_error';
}

function visitHtmlElements(node, visitor) {
  for (const child of node.childNodes ?? []) {
    if (child.tagName) visitor(child);
    if (child.tagName !== 'template') visitHtmlElements(child, visitor);
  }
}

function elementText(node) {
  return (node.childNodes ?? []).map((child) => (
    child.nodeName === '#text' ? child.value : elementText(child)
  )).join('');
}

function firstValidUrl(values, base) {
  for (const value of values) {
    const parsed = resolveHttpUrl(value, base);
    if (parsed) return parsed.toString();
  }
  return undefined;
}

function resolveHttpUrl(value, base) {
  if (!value) return undefined;
  try {
    const parsed = new URL(value, base);
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function normalizedPath(url) {
  return url.pathname || '/';
}

function normalizeDestination(value) {
  const url = new URL(value);
  url.hash = '';
  return url.toString();
}

function parseContentLength(headers) {
  const total = headers.get('content-range')?.match(/\/(\d+)$/)?.[1];
  const value = total ?? headers.get('content-length');
  if (!value || !/^\d+$/.test(value)) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isSafeInteger(parsed) ? parsed : undefined;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}
