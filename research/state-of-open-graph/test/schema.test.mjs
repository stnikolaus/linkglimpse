import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const directory = new URL('../', import.meta.url);
const sampleSchema = JSON.parse(await readFile(new URL('sample.schema.json', directory), 'utf8'));
const observationSchema = JSON.parse(await readFile(new URL('observation.schema.json', directory), 'utf8'));

const hash = 'a'.repeat(64);
const commit = 'b'.repeat(40);

function createAjv() {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  return ajv;
}

test('compiles the research schemas and accepts representative records', () => {
  const ajv = createAjv();
  const validateSample = ajv.compile(sampleSchema);
  const validateObservation = ajv.compile(observationSchema);

  const sample = {
    schema_version: '1.0.0',
    sample_id: 'sog-2026-0001',
    source: {
      provider: 'Tranco',
      list_id: 'example-list',
      download_url: 'https://tranco-list.eu/download/example-list/10000',
      retrieved_at: '2026-09-29T12:00:00Z',
      sha256: hash,
    },
    source_rank: 3,
    stratum: 'rank_1_100',
    source_domain: 'example.com',
    requested_url: 'https://example.com/',
  };

  const textSignal = { present: true, character_length: 7, duplicate_count: 1, value_sha256: hash };
  const urlSignal = { present: true, valid: true, duplicate_count: 1, scheme: 'https', host_relation: 'same_host', host_sha256: hash };
  const observation = {
    schema_version: '1.0.0',
    methodology_version: '1.0.0',
    sample_id: sample.sample_id,
    observed_at: '2026-09-29T12:05:00Z',
    disposition: 'collected',
    requested_url: sample.requested_url,
    final_url: sample.requested_url,
    robots: {
      robots_url: 'https://example.com/robots.txt',
      status: 200,
      allowed: true,
      matched_user_agent: 'LinkGlimpse-Research',
      checked_at: '2026-09-29T12:04:59Z',
    },
    collection: {
      collector_commit: commit,
      node_version: 'v22.20.0',
      linkglimpse_core_version: '0.2.0',
      user_agent: 'LinkGlimpse-Research/1.0 (+https://www.linkglimpse.com/methodology)',
      request_timeout_ms: 12000,
      max_html_bytes: 2000000,
      max_image_header_bytes: 65536,
      global_concurrency: 2,
      minimum_origin_delay_ms: 2000,
    },
    fetch: {
      http_status: 200,
      content_type: 'text/html; charset=utf-8',
      html_bytes_read: 12345,
      redirects: [],
      html_prefix_sha256: hash,
    },
    metadata: {
      title: textSignal,
      description: textSignal,
      canonical: { ...urlSignal, classification: 'self' },
      robots: { present: true, noindex: false, duplicate_count: 1, value_sha256: hash },
      open_graph: {
        title: textSignal,
        description: textSignal,
        url: urlSignal,
        type: textSignal,
        image_count: 1,
      },
      twitter: {
        card: textSignal,
        title: textSignal,
        description: textSignal,
        image: urlSignal,
        uses_open_graph_fallback: false,
      },
      image: {
        present: true,
        url: urlSignal,
        fetched: true,
        http_status: 200,
        content_type: 'image/jpeg',
        width: 1200,
        height: 630,
        aspect_ratio: 1.9048,
        near_1_91_to_1: true,
      },
    },
    diagnostics: {
      score: 100,
      pass_count: 12,
      warning_count: 0,
      fail_count: 0,
      checks: [{ id: 'og-title', status: 'pass' }],
    },
  };

  assert.equal(validateSample(sample), true, JSON.stringify(validateSample.errors));
  assert.equal(validateObservation(observation), true, JSON.stringify(validateObservation.errors));

  const excludedObservation = {
    schema_version: '1.0.0',
    methodology_version: '1.0.0',
    sample_id: 'sog-2026-0002',
    observed_at: '2026-09-29T12:05:00Z',
    disposition: 'excluded',
    exclusion_reason: 'robots_disallowed',
    requested_url: 'https://example.net/',
    robots: {
      robots_url: 'https://example.net/robots.txt',
      status: 200,
      allowed: false,
      matched_user_agent: 'LinkGlimpse-Research',
      checked_at: '2026-09-29T12:04:59Z',
    },
    collection: observation.collection,
  };

  assert.equal(validateObservation(excludedObservation), true, JSON.stringify(validateObservation.errors));
});

test('rejects replacement-prone or incomplete records', () => {
  const ajv = createAjv();
  const validateSample = ajv.compile(sampleSchema);
  const validateObservation = ajv.compile(observationSchema);

  assert.equal(validateSample({
    schema_version: '1.0.0',
    sample_id: 'replacement-1',
    source_domain: 'example.com',
    requested_url: 'http://example.com/path',
  }), false);

  assert.equal(validateSample({
    schema_version: '1.0.0',
    sample_id: 'sog-2026-0003',
    source: {
      provider: 'Tranco',
      list_id: 'example-list',
      download_url: 'https://tranco-list.eu/download/example-list/10000',
      retrieved_at: '2026-09-29T12:00:00Z',
      sha256: hash,
    },
    source_rank: 5000,
    stratum: 'rank_1_100',
    source_domain: 'example.org',
    requested_url: 'https://example.org/',
  }), false);

  assert.equal(validateObservation({
    schema_version: '1.0.0',
    methodology_version: '1.0.0',
    sample_id: 'sog-2026-0002',
    observed_at: '2026-09-29T12:05:00Z',
    disposition: 'collected',
    requested_url: 'https://example.com/',
    robots: {
      robots_url: 'https://example.com/robots.txt',
      status: 200,
      allowed: true,
      checked_at: '2026-09-29T12:04:59Z',
    },
    collection: {
      collector_commit: commit,
      node_version: 'v22.20.0',
      user_agent: 'LinkGlimpse-Research/1.0 (+https://www.linkglimpse.com/methodology)',
      request_timeout_ms: 12000,
      max_html_bytes: 2000000,
      max_image_header_bytes: 65536,
      global_concurrency: 2,
      minimum_origin_delay_ms: 2000,
    },
  }), false);
});
