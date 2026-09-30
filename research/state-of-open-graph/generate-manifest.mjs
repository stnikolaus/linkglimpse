import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const directory = new URL('./', import.meta.url);
const sampleSchema = JSON.parse(await readFile(new URL('sample.schema.json', directory), 'utf8'));
const manifestSchema = JSON.parse(await readFile(new URL('manifest.schema.json', directory), 'utf8'));

export const STRATA = Object.freeze([
  Object.freeze({ name: 'rank_1_100', lower: 1, upper: 100, count: 20 }),
  Object.freeze({ name: 'rank_101_1000', lower: 101, upper: 1000, count: 40 }),
  Object.freeze({ name: 'rank_1001_10000', lower: 1001, upper: 10000, count: 140 }),
]);

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
ajv.addSchema(sampleSchema);
const validateManifestSchema = ajv.compile(manifestSchema);

export function selectedRanks() {
  return STRATA.flatMap(({ lower, upper, count }) => (
    Array.from({ length: count }, (_, index) => lower + Math.floor((index + 0.5) * (upper - lower + 1) / count))
  ));
}

export function parseTrancoCsv(csv) {
  const lines = csv.trimEnd().split(/\r?\n/);
  if (lines.length !== 10_000) {
    throw new Error(`Expected exactly 10,000 Tranco rows, received ${lines.length}`);
  }

  const domains = new Set();
  return lines.map((line, index) => {
    const comma = line.indexOf(',');
    if (comma <= 0 || line.indexOf(',', comma + 1) !== -1) {
      throw new Error(`Invalid Tranco CSV row ${index + 1}`);
    }

    const rank = Number.parseInt(line.slice(0, comma), 10);
    const domain = line.slice(comma + 1).trim().toLowerCase();
    if (rank !== index + 1) {
      throw new Error(`Expected Tranco rank ${index + 1}, received ${Number.isNaN(rank) ? 'an invalid rank' : rank}`);
    }
    if (!isValidDomain(domain)) {
      throw new Error(`Invalid Tranco domain at rank ${rank}: ${domain || '(empty)'}`);
    }
    if (domains.has(domain)) throw new Error(`Duplicate Tranco domain at rank ${rank}: ${domain}`);
    domains.add(domain);
    return { rank, domain };
  });
}

export function buildManifest({ csvBytes, listId, downloadUrl, retrievedAt }) {
  const csv = Buffer.isBuffer(csvBytes) ? csvBytes.toString('utf8') : String(csvBytes);
  const rows = parseTrancoCsv(csv);
  const source = normalizeSource({ csvBytes: Buffer.from(csv), listId, downloadUrl, retrievedAt });
  const rankMap = new Map(rows.map((row) => [row.rank, row]));

  const manifest = selectedRanks().map((rank, index) => {
    const row = rankMap.get(rank);
    const stratum = STRATA.find(({ lower, upper }) => rank >= lower && rank <= upper);
    return {
      schema_version: '1.0.0',
      sample_id: `sog-2026-${String(index + 1).padStart(4, '0')}`,
      source,
      source_rank: rank,
      stratum: stratum.name,
      source_domain: row.domain,
      requested_url: `https://${row.domain}/`,
    };
  });

  assertManifest(manifest, rows);
  return manifest;
}

export function assertManifest(manifest, sourceRows) {
  if (!validateManifestSchema(manifest)) {
    throw new Error(`Manifest schema validation failed: ${ajv.errorsText(validateManifestSchema.errors, { separator: '; ' })}`);
  }

  const expectedRanks = selectedRanks();
  const sourceByRank = sourceRows ? new Map(sourceRows.map((row) => [row.rank, row.domain])) : undefined;
  const firstSource = JSON.stringify(manifest[0].source);
  const ids = new Set();
  const ranks = new Set();
  const domains = new Set();

  manifest.forEach((record, index) => {
    const expectedId = `sog-2026-${String(index + 1).padStart(4, '0')}`;
    if (record.sample_id !== expectedId) throw new Error(`Manifest is not sorted by sequential sample_id at ${expectedId}`);
    if (record.source_rank !== expectedRanks[index]) throw new Error(`Unexpected systematic rank for ${record.sample_id}`);
    if (JSON.stringify(record.source) !== firstSource) throw new Error(`Source metadata differs for ${record.sample_id}`);
    if (record.requested_url !== `https://${record.source_domain}/`) throw new Error(`Requested URL does not match source domain for ${record.sample_id}`);
    if (sourceByRank && sourceByRank.get(record.source_rank) !== record.source_domain) {
      throw new Error(`Source domain does not match the Tranco snapshot for ${record.sample_id}`);
    }
    if (ids.has(record.sample_id)) throw new Error(`Duplicate sample ID: ${record.sample_id}`);
    if (ranks.has(record.source_rank)) throw new Error(`Duplicate source rank: ${record.source_rank}`);
    if (domains.has(record.source_domain)) throw new Error(`Duplicate source domain: ${record.source_domain}`);
    ids.add(record.sample_id);
    ranks.add(record.source_rank);
    domains.add(record.source_domain);
  });

  return true;
}

function normalizeSource({ csvBytes, listId, downloadUrl, retrievedAt }) {
  if (!/^[A-Za-z0-9]{4,12}$/.test(listId ?? '')) throw new Error('Tranco list ID must be 4 to 12 letters or digits');
  const expectedUrl = `https://tranco-list.eu/download/${listId}/10000`;
  if (downloadUrl !== expectedUrl) throw new Error(`Download URL must be ${expectedUrl}`);
  const retrieved = new Date(retrievedAt);
  if (Number.isNaN(retrieved.getTime())) throw new Error('Retrieved timestamp must be a valid ISO date-time');

  return Object.freeze({
    provider: 'Tranco',
    list_id: listId,
    download_url: downloadUrl,
    retrieved_at: retrieved.toISOString(),
    sha256: createHash('sha256').update(csvBytes).digest('hex'),
  });
}

function isValidDomain(domain) {
  if (domain.length < 1 || domain.length > 253 || domain.includes('..')) return false;
  return domain.split('.').length >= 2 && domain.split('.').every((label) => (
    label.length >= 1
    && label.length <= 63
    && /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label)
  ));
}

async function main() {
  const { values } = parseArgs({
    options: {
      input: { type: 'string' },
      'list-id': { type: 'string' },
      'download-url': { type: 'string' },
      'retrieved-at': { type: 'string' },
      output: { type: 'string' },
    },
    strict: true,
  });
  const missing = ['input', 'list-id', 'download-url', 'retrieved-at', 'output'].filter((key) => !values[key]);
  if (missing.length) throw new Error(`Missing required option(s): ${missing.map((key) => `--${key}`).join(', ')}`);

  const inputPath = resolve(values.input);
  const outputPath = resolve(values.output);
  const csvBytes = await readFile(inputPath);
  const manifest = buildManifest({
    csvBytes,
    listId: values['list-id'],
    downloadUrl: values['download-url'],
    retrievedAt: values['retrieved-at'],
  });
  await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
  process.stdout.write(`Wrote ${manifest.length} records to ${basename(outputPath)}\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
