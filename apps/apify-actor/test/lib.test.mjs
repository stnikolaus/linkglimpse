import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeInput, toDatasetItem } from '../src/lib.mjs';

test('normalizes URL input and bounds concurrency', () => {
  assert.deepEqual(normalizeInput({ urls: ['https://example.com'], concurrency: 99 }), {
    urls: ['https://example.com'], concurrency: 8, renderPreviews: true, previewPlatform: 'all',
  });
});

test('rejects an unsupported preview platform', () => {
  assert.throws(
    () => normalizeInput({ urls: ['https://example.com'], previewPlatform: 'made-up-network' }),
    /Preview platform must be all or one of/,
  );
});

test('creates a compact actor dataset row', () => {
  const item = toDatasetItem({
    success: true,
    report: {
      url: 'https://example.com', title: 'Example',
      diagnostics: { score: 75, counts: { pass: 3, warning: 1, fail: 1 }, platforms: [], checks: [] },
    },
  });
  assert.equal(item.score, 75);
  assert.equal(item.success, true);
});
