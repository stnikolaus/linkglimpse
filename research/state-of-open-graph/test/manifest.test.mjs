import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { assertManifest, buildManifest, parseTrancoCsv, selectedRanks, STRATA } from '../generate-manifest.mjs';

const execFileAsync = promisify(execFile);
const generatorPath = fileURLToPath(new URL('../generate-manifest.mjs', import.meta.url));
const csv = `${Array.from({ length: 10_000 }, (_, index) => `${index + 1},site-${index + 1}.example`).join('\n')}\n`;
const options = {
  csvBytes: Buffer.from(csv),
  listId: 'ABCDE',
  downloadUrl: 'https://tranco-list.eu/download/ABCDE/10000',
  retrievedAt: '2026-09-30T08:00:00+02:00',
};

test('selects the documented deterministic ranks and exact stratum counts', () => {
  const ranks = selectedRanks();
  assert.equal(ranks.length, 200);
  assert.equal(new Set(ranks).size, 200);
  for (const stratum of STRATA) {
    assert.equal(ranks.filter((rank) => rank >= stratum.lower && rank <= stratum.upper).length, stratum.count);
  }
  assert.deepEqual(ranks.slice(0, 3), [3, 8, 13]);
  assert.deepEqual(ranks.slice(-3), [9840, 9904, 9968]);
});

test('builds a schema-valid manifest tied to the exact source bytes', () => {
  const manifest = buildManifest(options);
  assert.equal(manifest.length, 200);
  assert.equal(manifest[0].sample_id, 'sog-2026-0001');
  assert.equal(manifest[0].source_rank, 3);
  assert.equal(manifest[0].source_domain, 'site-3.example');
  assert.equal(manifest[0].requested_url, 'https://site-3.example/');
  assert.equal(manifest[0].source.retrieved_at, '2026-09-30T06:00:00.000Z');
  assert.match(manifest[0].source.sha256, /^[a-f0-9]{64}$/);
  assert.equal(assertManifest(manifest, parseTrancoCsv(csv)), true);
});

test('rejects incomplete, out-of-order, duplicated, or mismatched source data', () => {
  assert.throws(() => parseTrancoCsv('1,example.com\n'), /exactly 10,000/);
  assert.throws(() => parseTrancoCsv(csv.replace('2,site-2.example', '4,site-2.example')), /Expected Tranco rank 2/);
  assert.throws(() => parseTrancoCsv(csv.replace('2,site-2.example', '2,site-1.example')), /Duplicate Tranco domain/);
  assert.throws(() => buildManifest({ ...options, downloadUrl: 'https://tranco-list.eu/download/OTHER/10000' }), /Download URL must be/);

  const manifest = buildManifest(options);
  const wrongRank = structuredClone(manifest);
  wrongRank[0].source_rank = 4;
  assert.throws(() => assertManifest(wrongRank), /Unexpected systematic rank/);

  const wrongUrl = structuredClone(manifest);
  wrongUrl[0].requested_url = 'https://different.example/';
  assert.throws(() => assertManifest(wrongUrl), /Requested URL does not match/);

  const wrongSource = structuredClone(manifest);
  wrongSource[1].source = { ...wrongSource[1].source, sha256: 'b'.repeat(64) };
  assert.throws(() => assertManifest(wrongSource), /Source metadata differs/);
});

test('runs the offline CLI end to end and refuses to overwrite its output', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'linkglimpse-research-'));
  const input = join(directory, 'tranco_ABCDE-top-10000.csv');
  const output = join(directory, 'sample-manifest.json');
  const args = [
    generatorPath,
    '--input', input,
    '--list-id', 'ABCDE',
    '--download-url', 'https://tranco-list.eu/download/ABCDE/10000',
    '--retrieved-at', '2026-09-30T06:00:00Z',
    '--output', output,
  ];

  try {
    await writeFile(input, csv, 'utf8');
    const firstRun = await execFileAsync(process.execPath, args);
    assert.match(firstRun.stdout, /Wrote 200 records/);
    const manifest = JSON.parse(await readFile(output, 'utf8'));
    assert.equal(assertManifest(manifest, parseTrancoCsv(csv)), true);
    await assert.rejects(execFileAsync(process.execPath, args), /EEXIST|file already exists/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
