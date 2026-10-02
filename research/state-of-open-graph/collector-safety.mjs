import { lookup as dnsLookup } from 'node:dns/promises';
import { isIP } from 'node:net';

export const RESEARCH_USER_AGENT = 'LinkGlimpse-Research/1.0 (+https://www.linkglimpse.com/methodology)';
export const RESEARCH_PRODUCT_TOKEN = 'LinkGlimpse-Research';
export const REQUEST_TIMEOUT_MS = 12_000;
export const MAX_ROBOTS_BYTES = 512 * 1024;
export const MAX_HTML_BYTES = 2_000_000;
export const MAX_IMAGE_HEADER_BYTES = 65_536;
export const MAX_PAGE_REDIRECTS = 8;
export const MAX_ROBOTS_REDIRECTS = 5;
export const MIN_ORIGIN_DELAY_MS = 2_000;
export const ROBOTS_CACHE_TTL_MS = 24 * 60 * 60 * 1_000;
export const GLOBAL_PAGE_CONCURRENCY = 2;

export class CollectorSafetyError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'CollectorSafetyError';
    this.code = code;
    this.details = details;
  }
}

export async function validatePublicHttpUrl(input, { lookup = dnsLookup } = {}) {
  let url;
  try {
    url = input instanceof URL ? new URL(input) : new URL(input);
  } catch {
    throw new CollectorSafetyError('invalid_url', 'URL must be an absolute HTTP or HTTPS URL');
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new CollectorSafetyError('unsupported_protocol', 'Only HTTP and HTTPS URLs are supported');
  }
  if (url.username || url.password) {
    throw new CollectorSafetyError('credentialed_url', 'URLs containing credentials are not supported');
  }

  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (isBlockedHostname(hostname)) {
    throw new CollectorSafetyError('unsafe_network', 'Private, reserved, local, or special-use hostnames are not supported');
  }

  let addresses;
  try {
    addresses = isIP(hostname) ? [{ address: hostname }] : await lookup(hostname, { all: true, verbatim: true });
  } catch (error) {
    throw new CollectorSafetyError('dns_error', `DNS lookup failed for ${hostname}`, { cause: error });
  }

  if (addresses.length === 0) {
    throw new CollectorSafetyError('dns_error', `DNS lookup returned no addresses for ${hostname}`);
  }
  if (addresses.some(({ address }) => !isPublicIpAddress(address))) {
    throw new CollectorSafetyError('unsafe_network', `DNS for ${hostname} resolved to a private or reserved address`);
  }
  return url;
}

export function isPublicIpAddress(input) {
  const address = input.toLowerCase().split('%')[0];
  const mappedIpv4 = address.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/)?.[1];
  if (mappedIpv4) return isPublicIpv4(mappedIpv4);
  if (isIP(address) === 4) return isPublicIpv4(address);
  if (isIP(address) !== 6) return false;

  const value = ipv6ToBigInt(address);
  if (value === null) return false;
  const firstThreeBits = value >> 125n;
  if (firstThreeBits !== 1n) return false;

  return ![
    ['2001::', 32],
    ['2001:db8::', 32],
    ['2001:2::', 48],
    ['2001:10::', 28],
    ['2001:20::', 28],
    ['2002::', 16],
  ].some(([prefix, length]) => hasIpv6Prefix(value, prefix, length));
}

export function parseRobotsTxt(text, productToken = RESEARCH_PRODUCT_TOKEN) {
  const groups = [];
  let agents = [];
  let rules = [];
  let crawlDelays = [];

  const flush = () => {
    if (agents.length > 0) groups.push({ agents, rules, crawlDelays });
    agents = [];
    rules = [];
    crawlDelays = [];
  };

  for (const rawLine of String(text).split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (!line) continue;
    const separator = line.indexOf(':');
    if (separator < 1) continue;
    const field = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();

    if (field === 'user-agent') {
      if (rules.length > 0 || crawlDelays.length > 0) flush();
      agents.push(value.toLowerCase());
      continue;
    }
    if (agents.length === 0) continue;
    if (field === 'allow' || field === 'disallow') {
      if (value || field === 'allow') rules.push({ type: field, pattern: value });
      continue;
    }
    if (field === 'crawl-delay') {
      const delay = Number.parseFloat(value);
      if (Number.isFinite(delay) && delay >= 0) crawlDelays.push(delay);
    }
  }
  flush();

  const token = productToken.toLowerCase();
  const matching = groups.map((group) => {
    const specificAgents = group.agents.filter((agent) => agent !== '*' && token.includes(agent));
    const length = specificAgents.reduce((maximum, agent) => Math.max(maximum, agent.length), -1);
    return { group, length };
  });
  const longest = matching.reduce((maximum, candidate) => Math.max(maximum, candidate.length), -1);
  const selected = longest >= 0
    ? matching.filter(({ length }) => length === longest).map(({ group }) => group)
    : groups.filter((group) => group.agents.includes('*'));
  const matchedUserAgent = longest >= 0 ? productToken : selected.length > 0 ? '*' : undefined;
  const selectedRules = selected.flatMap((group) => group.rules);
  const crawlDelaySeconds = selected.flatMap((group) => group.crawlDelays).reduce((maximum, delay) => Math.max(maximum, delay), 0);

  return {
    matchedUserAgent,
    crawlDelaySeconds: crawlDelaySeconds || undefined,
    isAllowed(pathAndQuery) {
      const target = normalizeRobotsOctets(pathAndQuery.startsWith('/') ? pathAndQuery : `/${pathAndQuery}`);
      const matches = selectedRules.map((rule) => ({ ...rule, specificity: robotsMatchSpecificity(rule.pattern, target) }))
        .filter(({ specificity }) => specificity >= 0);
      if (matches.length === 0) return true;
      const longestMatch = Math.max(...matches.map(({ specificity }) => specificity));
      return matches.filter(({ specificity }) => specificity === longestMatch).some(({ type }) => type === 'allow');
    },
  };
}

export function createOriginScheduler({ now = Date.now, sleep = defaultSleep } = {}) {
  const tails = new Map();
  const finishedAt = new Map();

  return {
    async run(input, task, delayMs = MIN_ORIGIN_DELAY_MS) {
      const origin = new URL(input).origin;
      const previous = tails.get(origin) ?? Promise.resolve();
      let release;
      const current = new Promise((resolve) => { release = resolve; });
      tails.set(origin, current);
      await previous;

      try {
        const elapsed = now() - (finishedAt.get(origin) ?? Number.NEGATIVE_INFINITY);
        if (elapsed < delayMs) await sleep(delayMs - elapsed);
        return await task();
      } finally {
        finishedAt.set(origin, now());
        release();
        if (tails.get(origin) === current) tails.delete(origin);
      }
    },
  };
}

export function createRequestScheduler({
  globalConcurrency = GLOBAL_PAGE_CONCURRENCY,
  now = Date.now,
  sleep = defaultSleep,
} = {}) {
  if (!Number.isInteger(globalConcurrency) || globalConcurrency < 1 || globalConcurrency > GLOBAL_PAGE_CONCURRENCY) {
    throw new CollectorSafetyError('invalid_concurrency', `Global concurrency must be between 1 and ${GLOBAL_PAGE_CONCURRENCY}`);
  }
  const originScheduler = createOriginScheduler({ now, sleep });
  const runGlobally = createConcurrencyLimiter(globalConcurrency);
  return {
    run(input, task, delayMs = MIN_ORIGIN_DELAY_MS) {
      return originScheduler.run(input, () => runGlobally(task), delayMs);
    },
  };
}

export function createRobotsGuard({
  fetchImpl = fetch,
  lookup = dnsLookup,
  scheduler = createRequestScheduler(),
  now = Date.now,
  sleep = defaultSleep,
  cacheTtlMs = ROBOTS_CACHE_TTL_MS,
} = {}) {
  const cache = new Map();

  return {
    async check(input) {
      const url = await validatePublicHttpUrl(input, { lookup });
      const origin = url.origin;
      let cached = cache.get(origin);
      if (!cached || now() - cached.cachedAt >= cacheTtlMs) {
        cached = await loadRobotsPolicy(new URL('/robots.txt', origin), {
          fetchImpl, lookup, scheduler, now, sleep,
        });
        cache.set(origin, { ...cached, cachedAt: now() });
      }

      const allowed = cached.state === 'unavailable'
        ? true
        : cached.state === 'available' && cached.policy.isAllowed(`${url.pathname}${url.search}`);
      return {
        robotsUrl: cached.robotsUrl,
        status: cached.status,
        state: cached.state,
        allowed,
        matchedUserAgent: cached.policy?.matchedUserAgent,
        crawlDelaySeconds: cached.policy?.crawlDelaySeconds,
        checkedAt: cached.checkedAt,
      };
    },
    clear() {
      cache.clear();
    },
  };
}

export async function fetchWithSafety(input, {
  fetchImpl = fetch,
  lookup = dnsLookup,
  scheduler = createRequestScheduler(),
  robotsGuard,
  maxRedirects = MAX_PAGE_REDIRECTS,
  accept = 'text/html,application/xhtml+xml',
  responseByteLimit,
  now = Date.now,
  sleep = defaultSleep,
} = {}) {
  let currentUrl = await validatePublicHttpUrl(input, { lookup });
  const redirects = [];

  for (let redirectCount = 0; redirectCount <= maxRedirects; redirectCount += 1) {
    const robots = robotsGuard ? await robotsGuard.check(currentUrl) : undefined;
    if (robots && !robots.allowed) {
      throw new CollectorSafetyError('robots_disallowed', `Robots policy disallows ${currentUrl.pathname}`, { robots });
    }
    const delayMs = Math.max(MIN_ORIGIN_DELAY_MS, (robots?.crawlDelaySeconds ?? 0) * 1_000);
    const response = await requestWithSingleRetry(currentUrl, {
      accept, fetchImpl, scheduler, delayMs, now, sleep,
      beforeAttempt: () => validatePublicHttpUrl(currentUrl, { lookup }),
    });

    const location = response.headers.get('location');
    const isRedirect = Boolean(location) && [300, 301, 302, 303, 307, 308].includes(response.status);
    if (!isRedirect) {
      const bytes = responseByteLimit === undefined ? undefined : await readBoundedResponse(response, responseByteLimit);
      return { response, bytes, finalUrl: currentUrl, redirects, robots };
    }
    if (redirectCount === maxRedirects) {
      await response.body?.cancel().catch(() => undefined);
      throw new CollectorSafetyError('redirect_limit', `Response exceeded the ${maxRedirects}-redirect limit`);
    }

    const nextUrl = await validatePublicHttpUrl(new URL(location, currentUrl), { lookup });
    redirects.push({ url: currentUrl.toString(), status: response.status, location: nextUrl.toString() });
    await response.body?.cancel().catch(() => undefined);
    currentUrl = nextUrl;
  }

  throw new CollectorSafetyError('redirect_limit', `Response exceeded the ${maxRedirects}-redirect limit`);
}

export async function readBoundedResponse(response, limit) {
  const contentLength = parseContentLength(response.headers.get('content-length'));
  if (contentLength !== undefined && contentLength > limit) {
    await response.body?.cancel().catch(() => undefined);
    throw new CollectorSafetyError('response_too_large', `Response exceeds the ${limit}-byte limit`);
  }
  if (!response.body) {
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength > limit) throw new CollectorSafetyError('response_too_large', `Response exceeds the ${limit}-byte limit`);
    return bytes;
  }

  const reader = response.body.getReader();
  const chunks = [];
  let received = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (received + value.byteLength > limit) {
      await reader.cancel().catch(() => undefined);
      throw new CollectorSafetyError('response_too_large', `Response exceeds the ${limit}-byte limit`);
    }
    chunks.push(value);
    received += value.byteLength;
  }

  const output = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return output;
}

async function loadRobotsPolicy(robotsUrl, { fetchImpl, lookup, scheduler, now, sleep }) {
  const checkedAt = new Date(now()).toISOString();
  try {
    const { response, bytes, finalUrl } = await fetchWithSafety(robotsUrl, {
      fetchImpl,
      lookup,
      scheduler,
      maxRedirects: MAX_ROBOTS_REDIRECTS,
      accept: 'text/plain,*/*;q=0.1',
      responseByteLimit: MAX_ROBOTS_BYTES,
      now,
      sleep,
    });
    if (response.status >= 200 && response.status < 300) {
      return {
        robotsUrl: finalUrl.toString(),
        status: response.status,
        state: 'available',
        checkedAt,
        policy: parseRobotsTxt(new TextDecoder().decode(bytes)),
      };
    }
    if (response.status >= 400 && response.status < 500 && response.status !== 429) {
      await response.body?.cancel().catch(() => undefined);
      return { robotsUrl: finalUrl.toString(), status: response.status, state: 'unavailable', checkedAt };
    }
    await response.body?.cancel().catch(() => undefined);
    return { robotsUrl: finalUrl.toString(), status: response.status, state: 'unreachable', checkedAt };
  } catch (error) {
    return {
      robotsUrl: robotsUrl.toString(),
      status: 0,
      state: 'unreachable',
      checkedAt,
      errorCode: error instanceof CollectorSafetyError ? error.code : classifyNetworkError(error),
    };
  }
}

async function requestWithSingleRetry(url, { accept, fetchImpl, scheduler, delayMs, now, sleep, beforeAttempt }) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    let response;
    try {
      await beforeAttempt?.();
      response = await scheduler.run(url, () => fetchImpl(url, {
        headers: { Accept: accept, 'User-Agent': RESEARCH_USER_AGENT },
        redirect: 'manual',
        cache: 'no-store',
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      }), delayMs);
    } catch (error) {
      throw normalizeNetworkError(error);
    }
    if (![429, 503].includes(response.status) || attempt === 1) return response;
    const waitMs = parseRetryAfter(response.headers.get('retry-after'), now()) ?? 30_000;
    await response.body?.cancel().catch(() => undefined);
    await sleep(waitMs);
  }
  throw new CollectorSafetyError('http_error', `Request failed for ${url}`);
}

function robotsMatchSpecificity(pattern, target) {
  if (!pattern) return -1;
  const normalized = normalizeRobotsOctets(pattern);
  const anchored = normalized.endsWith('$');
  const sourcePattern = anchored ? normalized.slice(0, -1) : normalized;
  const regex = new RegExp(`^${sourcePattern.split('*').map(escapeRegex).join('.*')}${anchored ? '$' : ''}`);
  if (!regex.test(target)) return -1;
  return sourcePattern.replaceAll('*', '').length;
}

function normalizeRobotsOctets(value) {
  return String(value).replace(/%[0-9a-f]{2}/gi, (encoded) => {
    const code = Number.parseInt(encoded.slice(1), 16);
    const character = String.fromCharCode(code);
    return /^[A-Za-z0-9._~-]$/.test(character) ? character : encoded.toUpperCase();
  });
}

function escapeRegex(value) {
  return value.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
}

function isBlockedHostname(hostname) {
  return hostname === 'localhost'
    || hostname === 'metadata.google.internal'
    || hostname.endsWith('.localhost')
    || hostname.endsWith('.local')
    || hostname.endsWith('.internal')
    || hostname.endsWith('.home.arpa')
    || hostname.endsWith('.test')
    || hostname.endsWith('.invalid')
    || hostname.endsWith('.onion');
}

function isPublicIpv4(address) {
  const parts = address.split('.').map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  const [a, b, c] = parts;
  return !(a === 0
    || a === 10
    || a === 127
    || (a === 100 && b >= 64 && b <= 127)
    || (a === 169 && b === 254)
    || (a === 172 && b >= 16 && b <= 31)
    || (a === 192 && b === 0)
    || (a === 192 && b === 168)
    || (a === 192 && b === 88 && c === 99)
    || (a === 198 && (b === 18 || b === 19))
    || (a === 198 && b === 51 && c === 100)
    || (a === 203 && b === 0 && c === 113)
    || a >= 224);
}

function ipv6ToBigInt(address) {
  const [head, tail] = address.split('::');
  if (address.split('::').length > 2) return null;
  const left = head ? head.split(':') : [];
  const right = tail ? tail.split(':') : [];
  const expandIpv4 = (parts) => parts.flatMap((part) => {
    if (!part.includes('.')) return [part];
    const octets = part.split('.').map(Number);
    if (octets.length !== 4 || octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)) return ['invalid'];
    return [((octets[0] << 8) | octets[1]).toString(16), ((octets[2] << 8) | octets[3]).toString(16)];
  });
  const expandedLeft = expandIpv4(left);
  const expandedRight = expandIpv4(right);
  const missing = 8 - expandedLeft.length - expandedRight.length;
  if ((tail === undefined && missing !== 0) || missing < 0) return null;
  const parts = [...expandedLeft, ...Array.from({ length: missing }, () => '0'), ...expandedRight];
  if (parts.length !== 8 || parts.some((part) => !/^[0-9a-f]{1,4}$/i.test(part))) return null;
  return parts.reduce((result, part) => (result << 16n) + BigInt(`0x${part}`), 0n);
}

function hasIpv6Prefix(value, prefix, length) {
  const prefixValue = ipv6ToBigInt(prefix);
  const shift = 128n - BigInt(length);
  return prefixValue !== null && (value >> shift) === (prefixValue >> shift);
}

function parseRetryAfter(value, nowMs) {
  if (!value) return undefined;
  if (/^\d+$/.test(value.trim())) return Number.parseInt(value, 10) * 1_000;
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? undefined : Math.max(0, timestamp - nowMs);
}

function parseContentLength(value) {
  if (!value || !/^\d+$/.test(value)) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isSafeInteger(parsed) ? parsed : undefined;
}

function normalizeNetworkError(error) {
  if (error instanceof CollectorSafetyError) return error;
  const code = classifyNetworkError(error);
  const message = error instanceof Error ? error.message : String(error);
  return new CollectorSafetyError(code, message, { cause: error });
}

function classifyNetworkError(error) {
  if (error?.name === 'TimeoutError' || error?.name === 'AbortError') return 'timeout';
  const code = error?.code ?? error?.cause?.code;
  if (['ENOTFOUND', 'EAI_AGAIN'].includes(code)) return 'dns_error';
  if (String(code).startsWith('ERR_TLS') || ['CERT_HAS_EXPIRED', 'DEPTH_ZERO_SELF_SIGNED_CERT'].includes(code)) return 'tls_error';
  return 'connection_error';
}

function defaultSleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function createConcurrencyLimiter(limit) {
  let active = 0;
  const queue = [];
  const release = () => {
    active -= 1;
    queue.shift()?.();
  };

  return async (task) => {
    if (active >= limit) await new Promise((resolve) => queue.push(resolve));
    active += 1;
    try {
      return await task();
    } finally {
      release();
    }
  };
}
