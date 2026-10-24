import test from 'node:test';
import assert from 'node:assert/strict';
import {
  InspectionError,
  analyzeMetadata,
  extractMetadata,
  inspectUrl,
  renderPreviewSvg,
  validatePublicUrl,
} from '../src/core/index.mjs';

test('extracts metadata and produces a diagnostic report', () => {
  const report = extractMetadata(`<!doctype html><html><head>
    <title>HTML title</title>
    <meta name="description" content="Search description">
    <meta property="og:title" content="Social title">
    <meta property="og:description" content="Social description">
    <meta property="og:image" content="/card.png">
    <meta property="og:url" content="https://example.com/page">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="canonical" href="/page">
  </head></html>`, 'https://example.com/page', 'https://example.com/page');
  report.status = 200;
  report.diagnostics = analyzeMetadata(report);
  assert.equal(report.title, 'Social title');
  assert.equal(report.image, 'https://example.com/card.png');
  assert.ok(report.diagnostics.score > 50);
});

test('renders escaped platform previews and a contact sheet', () => {
  const rendered = renderPreviewSvg({
    url: 'https://example.com/post',
    finalUrl: 'https://example.com/post',
    title: 'A <strong> title & more',
    description: 'Description for the preview.',
    pageTitle: 'Search title',
    pageDescription: 'Search description',
    tags: { 'og:title': 'Social title', 'og:description': 'Social description' },
  });
  assert.equal(rendered.platforms.length, 7);
  assert.match(rendered.svg, /Google search preview/);
  assert.doesNotMatch(rendered.svg, /A <strong>/);
  assert.ok(rendered.width > 1000);
});

test('rejects unsafe image data passed to the SVG renderer', () => {
  const rendered = renderPreviewSvg(
    { url: 'https://example.com', title: 'Example' },
    { platform: 'facebook', imageDataUrl: 'data:image/png" onload="alert(1),AAAA' },
  );
  assert.doesNotMatch(rendered.svg, /onload|alert/);
  assert.match(rendered.svg, /No share image available/);
});

test('blocks private network URLs before fetching', async () => {
  await assert.rejects(
    validatePublicUrl('http://127.0.0.1/admin'),
    (error) => error instanceof InspectionError && error.code === 'private_network' && error.status === 422,
  );
});

test('classifies malformed URLs as expected inspection errors', async () => {
  await assert.rejects(
    validatePublicUrl('not-a-url'),
    (error) => error instanceof InspectionError && error.code === 'invalid_url' && error.status === 422,
  );
});

test('classifies target timeouts as expected gateway timeouts', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new DOMException('The operation was aborted due to timeout', 'TimeoutError');
  };
  try {
    await assert.rejects(
      inspectUrl('https://93.184.216.34'),
      (error) => error instanceof InspectionError && error.code === 'target_timeout' && error.status === 504,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
