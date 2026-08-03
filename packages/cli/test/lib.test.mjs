import assert from 'node:assert/strict';
import test from 'node:test';
import { buildApiUrl, buildReportUrl, formatReport, getExitCode, normalizeUrl } from '../src/lib.mjs';

const report = {
  url: 'https://example.com/',
  finalUrl: 'https://example.com/',
  status: 200,
  statusText: 'OK',
  diagnostics: {
    score: 75,
    counts: { pass: 1, warning: 1, fail: 1 },
    checks: [
      { status: 'pass', label: 'Page fetch', value: '200 OK', recommendation: '' },
      { status: 'warning', label: 'Canonical URL', recommendation: 'Add a canonical.' },
      { status: 'fail', label: 'Open Graph image', recommendation: 'Add og:image.' },
    ],
  },
};

test('normalizes domains and preserves complete URLs', () => {
  assert.equal(normalizeUrl('example.com'), 'https://example.com/');
  assert.equal(normalizeUrl('http://example.com/path'), 'http://example.com/path');
});

test('builds encoded API and report URLs', () => {
  assert.equal(new URL(buildApiUrl('https://www.linkglimpse.com', 'https://example.com/a?b=1')).pathname, '/api/metadata');
  assert.equal(new URL(buildApiUrl('https://www.linkglimpse.com', 'https://example.com/a?b=1')).searchParams.get('url'), 'https://example.com/a?b=1');
  assert.equal(new URL(buildReportUrl('https://example.com')).searchParams.get('utm_source'), 'cli');
});

test('maps diagnostic severity to CI exit codes', () => {
  assert.equal(getExitCode(report, 'none'), 0);
  assert.equal(getExitCode(report, 'warning'), 1);
  assert.equal(getExitCode(report, 'fail'), 1);
  assert.equal(getExitCode({ diagnostics: { counts: { pass: 2, warning: 1, fail: 0 } } }, 'fail'), 0);
});

test('formats an actionable text report', () => {
  const output = formatReport(report);
  assert.match(output, /75\/100/);
  assert.match(output, /Add og:image\./);
  assert.match(output, /Live report/);
});
