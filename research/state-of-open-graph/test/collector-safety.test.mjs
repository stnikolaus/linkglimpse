import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CollectorSafetyError,
  MAX_HTML_BYTES,
  createOriginScheduler,
  createRequestScheduler,
  createRobotsGuard,
  fetchWithSafety,
  isPublicIpAddress,
  parseRobotsTxt,
  readBoundedResponse,
  validatePublicHttpUrl,
} from '../collector-safety.mjs';

const publicLookup = async () => [{ address: '93.184.216.34', family: 4 }];

test('applies RFC 9309 user-agent selection, longest-match precedence, and allow-on-tie', () => {
  const policy = parseRobotsTxt(`
    User-agent: *
    Disallow: /private/

    User-agent: LinkGlimpse
    Disallow: /research/

    User-agent: LinkGlimpse-Research
    Disallow: /research/
    Allow: /research/public$
    Disallow: /encoded/~user
    Crawl-delay: 3.5
  `);

  assert.equal(policy.matchedUserAgent, 'LinkGlimpse-Research');
  assert.equal(policy.crawlDelaySeconds, 3.5);
  assert.equal(policy.isAllowed('/private/'), true, 'the most-specific product group replaces the wildcard group');
  assert.equal(policy.isAllowed('/research/private'), false);
  assert.equal(policy.isAllowed('/research/public'), true);
  assert.equal(policy.isAllowed('/research/public/child'), false);
  assert.equal(policy.isAllowed('/encoded/%7Euser'), false, 'unreserved percent-encoded octets normalize before matching');
});

test('falls back to wildcard robots rules and treats an empty disallow as allow', () => {
  const policy = parseRobotsTxt('User-agent: *\nDisallow:\nDisallow: /blocked\nAllow: /blocked/public\n');
  assert.equal(policy.matchedUserAgent, '*');
  assert.equal(policy.isAllowed('/'), true);
  assert.equal(policy.isAllowed('/blocked/file'), false);
  assert.equal(policy.isAllowed('/blocked/public/file'), true);
});

test('rejects private, reserved, credential-bearing, and special-use destinations', async () => {
  const blocked = [
    'http://127.0.0.1/',
    'http://10.0.0.1/',
    'http://169.254.169.254/latest/meta-data/',
    'http://192.0.2.1/',
    'http://[::1]/',
    'http://[fc00::1]/',
    'http://[2001:db8::1]/',
    'https://user:secret@public.site/',
    'https://service.internal/',
  ];
  for (const url of blocked) {
    await assert.rejects(validatePublicHttpUrl(url, { lookup: publicLookup }), CollectorSafetyError);
  }
  await assert.rejects(
    validatePublicHttpUrl('https://mixed-resolution.site/', {
      lookup: async () => [{ address: '93.184.216.34' }, { address: '127.0.0.1' }],
    }),
    /private or reserved/i,
  );
  assert.equal(isPublicIpAddress('8.8.8.8'), true);
  assert.equal(isPublicIpAddress('2606:4700:4700::1111'), true);
  assert.equal((await validatePublicHttpUrl('https://public.site/', { lookup: publicLookup })).hostname, 'public.site');
});

test('revalidates redirect targets and never requests an unsafe destination', async () => {
  const requested = [];
  const fetchImpl = async (url) => {
    requested.push(url.toString());
    return new Response('', { status: 302, headers: { location: 'http://127.0.0.1/admin' } });
  };

  await assert.rejects(fetchWithSafety('https://public.site/', {
    fetchImpl,
    lookup: publicLookup,
    scheduler: immediateScheduler(),
  }), (error) => error.code === 'unsafe_network');
  assert.deepEqual(requested, ['https://public.site/']);
});

test('checks the target origin robots policy before a cross-origin redirect request', async () => {
  const requested = [];
  const fetchImpl = async (url) => {
    requested.push(url.toString());
    if (url.pathname === '/robots.txt' && url.hostname === 'public.site') return new Response('User-agent: *\nAllow: /\n');
    if (url.pathname === '/robots.txt' && url.hostname === 'blocked.site') return new Response('User-agent: LinkGlimpse-Research\nDisallow: /private\n');
    if (url.hostname === 'public.site') return new Response('', { status: 302, headers: { location: 'https://blocked.site/private' } });
    throw new Error(`Unsafe request reached ${url}`);
  };
  const scheduler = immediateScheduler();
  const robotsGuard = createRobotsGuard({ fetchImpl, lookup: publicLookup, scheduler, sleep: async () => undefined });

  await assert.rejects(fetchWithSafety('https://public.site/', {
    fetchImpl,
    lookup: publicLookup,
    scheduler,
    robotsGuard,
  }), (error) => error.code === 'robots_disallowed');
  assert.deepEqual(requested, [
    'https://public.site/robots.txt',
    'https://public.site/',
    'https://blocked.site/robots.txt',
  ]);
});

test('uses conservative robots outcomes for unavailable and unreachable files', async () => {
  const scheduler = immediateScheduler();
  const missingGuard = createRobotsGuard({
    fetchImpl: async () => new Response('', { status: 404 }),
    lookup: publicLookup,
    scheduler,
    sleep: async () => undefined,
  });
  const unavailable = await missingGuard.check('https://public.site/page');
  assert.equal(unavailable.state, 'unavailable');
  assert.equal(unavailable.allowed, true);

  const unreachableGuard = createRobotsGuard({
    fetchImpl: async () => new Response('', { status: 503 }),
    lookup: publicLookup,
    scheduler,
    sleep: async () => undefined,
  });
  const unreachable = await unreachableGuard.check('https://public.site/page');
  assert.equal(unreachable.state, 'unreachable');
  assert.equal(unreachable.allowed, false);

  await assert.rejects(fetchWithSafety('https://public.site/page', {
    fetchImpl: async () => new Response('', { status: 503 }),
    lookup: publicLookup,
    scheduler,
    robotsGuard: unreachableGuard,
    sleep: async () => undefined,
  }), (error) => error.code === 'robots_unreachable' && error.details.robots.state === 'unreachable');

  let lookupCount = 0;
  const dnsGuard = createRobotsGuard({
    lookup: async () => {
      lookupCount += 1;
      if (lookupCount === 1) return [{ address: '93.184.216.34', family: 4 }];
      const error = new Error('lookup failed');
      error.code = 'ENOTFOUND';
      throw error;
    },
    scheduler,
    sleep: async () => undefined,
  });
  const dnsFailure = await dnsGuard.check('https://public.site/page');
  assert.equal(dnsFailure.state, 'unreachable');
  assert.equal(dnsFailure.allowed, false);
  assert.equal(dnsFailure.errorCode, 'dns_error');
});

test('rejects declared and streamed responses above the byte boundary', async () => {
  await assert.rejects(
    readBoundedResponse(new Response('small', { headers: { 'content-length': String(MAX_HTML_BYTES + 1) } }), MAX_HTML_BYTES),
    (error) => error.code === 'response_too_large',
  );
  await assert.rejects(
    readBoundedResponse(new Response('123456'), 5),
    (error) => error.code === 'response_too_large',
  );
  const exact = await readBoundedResponse(new Response('12345'), 5);
  assert.equal(new TextDecoder().decode(exact), '12345');
});

test('serializes same-origin work and waits after the previous request finishes', async () => {
  let currentTime = 0;
  const sleeps = [];
  let active = 0;
  let maxActive = 0;
  const scheduler = createOriginScheduler({
    now: () => currentTime,
    sleep: async (milliseconds) => {
      sleeps.push(milliseconds);
      currentTime += milliseconds;
    },
  });
  const task = async () => {
    active += 1;
    maxActive = Math.max(maxActive, active);
    currentTime += 10;
    active -= 1;
  };

  await Promise.all([
    scheduler.run('https://public.site/a', task, 2_000),
    scheduler.run('https://public.site/b', task, 2_000),
  ]);
  assert.equal(maxActive, 1);
  assert.deepEqual(sleeps, [2_000]);
});

test('caps global request concurrency at two across different origins', async () => {
  const scheduler = createRequestScheduler({ sleep: async () => undefined });
  let active = 0;
  let maxActive = 0;
  const releases = [];
  const task = () => new Promise((resolve) => {
    active += 1;
    maxActive = Math.max(maxActive, active);
    releases.push(() => {
      active -= 1;
      resolve();
    });
  });
  const requests = ['a.site', 'b.site', 'c.site'].map((host) => scheduler.run(`https://${host}/`, task));

  await waitUntil(() => releases.length === 2);
  assert.equal(maxActive, 2);
  releases.shift()();
  await waitUntil(() => releases.length === 2);
  releases.shift()();
  releases.shift()();
  await Promise.all(requests);
  assert.equal(maxActive, 2);
});

function immediateScheduler() {
  return { run: async (_url, task) => task() };
}

async function waitUntil(predicate) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (predicate()) return;
    await new Promise((resolve) => setImmediate(resolve));
  }
  throw new Error('Timed out waiting for the concurrency fixture');
}
