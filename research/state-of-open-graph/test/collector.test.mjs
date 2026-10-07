import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { assertObservations } from '../collect-observations.mjs';
import { buildMetadataRecord, collectSample, getImageDimensions, parseStudyMetadata } from '../collector.mjs';

const publicLookup = async () => [{ address: '93.184.216.34', family: 4 }];
const collectorCommit = 'a'.repeat(40);
const execFileAsync = promisify(execFile);
const collectorPath = fileURLToPath(new URL('../collect-observations.mjs', import.meta.url));
const sample = {
  schema_version: '1.0.0',
  sample_id: 'sog-2026-0001',
  source: {
    provider: 'Tranco',
    list_id: 'ABCDE',
    download_url: 'https://tranco-list.eu/download/ABCDE/10000',
    retrieved_at: '2026-10-07T08:00:00.000Z',
    sha256: 'b'.repeat(64),
  },
  source_rank: 3,
  stratum: 'rank_1_100',
  source_domain: 'public.site',
  requested_url: 'https://public.site/',
};

test('extracts case-insensitive first non-empty values, duplicates, fallbacks, and URL classes', () => {
  const parsed = parseStudyMetadata(`
    <TITLE> Example &amp; Page </TITLE>
    <meta NAME="description" content="  A useful page.  ">
    <meta PROPERTY="OG:TITLE" content="">
    <meta property="og:title" content="First title">
    <meta property="og:title" content="Second title">
    <meta property="og:description" content="OG description">
    <meta property="og:url" content="https://www.public.site/story?tracking=1">
    <meta property="og:type" content="website">
    <meta property="og:image" content="/card.png">
    <meta property="og:image:url" content="https://cdn.public.site/backup.png">
    <meta name="robots" content="index, follow">
    <meta name="googlebot" content="NOINDEX">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="alternate canonical" href="/story#section">
  `, new URL('https://public.site/story'));

  assert.deepEqual(parsed.ogTitle, ['First title', 'Second title']);
  assert.equal(parsed.imageUrl, 'https://public.site/card.png');
  const record = buildMetadataRecord(parsed, new URL('https://public.site/story'), { fetched: false });
  assert.equal(record.open_graph.title.duplicate_count, 2);
  assert.equal(record.canonical.classification, 'self');
  assert.equal(record.open_graph.url.host_relation, 'same_registrable_domain');
  assert.equal(record.robots.noindex, true);
  assert.equal(record.twitter.image.present, false);
  assert.equal(record.twitter.uses_open_graph_fallback, true);
  assert.equal(record.image.present, true);
  assert.equal(record.image.url.duplicate_count, 2);
});

test('reads common image dimensions from the bounded prefix', () => {
  const png = new Uint8Array(24);
  png.set([0x89, 0x50, 0x4e, 0x47]);
  const view = new DataView(png.buffer);
  view.setUint32(16, 1200);
  view.setUint32(20, 630);
  assert.deepEqual(getImageDimensions(png), { width: 1200, height: 630 });

  const gif = new Uint8Array(10);
  gif.set([0x47, 0x49, 0x46]);
  const gifView = new DataView(gif.buffer);
  gifView.setUint16(6, 600, true);
  gifView.setUint16(8, 315, true);
  assert.deepEqual(getImageDimensions(gif), { width: 600, height: 315 });
});

test('collects and validates one privacy-minimized observation end to end with mocked HTTP', async () => {
  const png = new Uint8Array(24);
  png.set([0x89, 0x50, 0x4e, 0x47]);
  const view = new DataView(png.buffer);
  view.setUint32(16, 1200);
  view.setUint32(20, 630);
  const fetchImpl = async (url) => {
    if (url.pathname === '/card.png') {
      return new Response(png, { status: 200, headers: { 'content-type': 'image/png', 'content-length': '24' } });
    }
    return new Response(`
      <title>Fixture page</title>
      <meta name="description" content="Fixture description">
      <meta property="og:title" content="Fixture page">
      <meta property="og:description" content="Fixture description">
      <meta property="og:url" content="https://public.site/">
      <meta property="og:type" content="website">
      <meta property="og:image" content="/card.png">
      <meta name="twitter:card" content="summary_large_image">
      <link rel="canonical" href="https://public.site/">
    `, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } });
  };
  const robots = {
    robotsUrl: 'https://public.site/robots.txt',
    status: 404,
    state: 'unavailable',
    allowed: true,
    checkedAt: '2026-10-07T08:00:00.000Z',
  };
  const observation = await collectSample(sample, {
    collectorCommit,
    coreVersion: '0.2.0',
    concurrency: 1,
    fetchImpl,
    lookup: publicLookup,
    scheduler: { run: async (_url, task) => task() },
    robotsGuard: { check: async () => robots },
    now: () => Date.parse('2026-10-07T08:00:01.000Z'),
    sleep: async () => undefined,
  });

  assert.equal(observation.disposition, 'collected');
  assert.equal(observation.metadata.image.width, 1200);
  assert.equal(observation.metadata.image.near_1_91_to_1, true);
  assert.equal('title' in observation.metadata, true);
  assert.equal('value' in observation.metadata.title, false);
  assert.equal(assertObservations([sample], [observation]), true);
});

test('records unreachable robots separately and never fetches the page', async () => {
  let fetchCount = 0;
  const observation = await collectSample(sample, {
    collectorCommit,
    coreVersion: '0.2.0',
    concurrency: 1,
    fetchImpl: async () => {
      fetchCount += 1;
      return new Response('unexpected');
    },
    lookup: publicLookup,
    scheduler: { run: async (_url, task) => task() },
    robotsGuard: {
      check: async () => ({
        robotsUrl: 'https://public.site/robots.txt',
        status: 503,
        state: 'unreachable',
        allowed: false,
        checkedAt: '2026-10-07T08:00:00.000Z',
      }),
    },
    now: () => Date.parse('2026-10-07T08:00:01.000Z'),
    sleep: async () => undefined,
  });

  assert.equal(observation.disposition, 'excluded');
  assert.equal(observation.exclusion_reason, 'robots_unreachable');
  assert.equal(fetchCount, 0);
  assert.equal(assertObservations([sample], [observation]), true);
});

test('keeps the documented CLI locked until an operator acknowledges reviewed gates', async () => {
  await assert.rejects(execFileAsync(process.execPath, [
    collectorPath,
    '--',
    '--input', '/tmp/collector-must-not-read.json',
    '--output', '/tmp/collector-must-not-write.json',
    '--collector-commit', collectorCommit,
    '--core-version', '0.2.0',
  ]), /Collection is locked until an operator passes --acknowledge-reviewed-gates/);
});
