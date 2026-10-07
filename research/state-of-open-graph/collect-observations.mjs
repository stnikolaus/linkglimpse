import { readFile, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { collectManifest } from './collector.mjs';
import { assertManifest } from './generate-manifest.mjs';

const directory = new URL('./', import.meta.url);
const sampleSchema = JSON.parse(await readFile(new URL('sample.schema.json', directory), 'utf8'));
const observationSchema = JSON.parse(await readFile(new URL('observation.schema.json', directory), 'utf8'));
const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
ajv.addSchema(sampleSchema);
const validateObservation = ajv.compile(observationSchema);

export function assertObservations(manifest, observations) {
  if (observations.length !== manifest.length) {
    throw new Error(`Expected ${manifest.length} observations, received ${observations.length}`);
  }
  const ids = new Set();
  observations.forEach((observation, index) => {
    if (!validateObservation(observation)) {
      throw new Error(`Observation ${observation.sample_id ?? index + 1} failed schema validation: ${ajv.errorsText(validateObservation.errors, { separator: '; ' })}`);
    }
    if (observation.sample_id !== manifest[index].sample_id) {
      throw new Error(`Observation order differs from the manifest at index ${index}`);
    }
    if (ids.has(observation.sample_id)) throw new Error(`Duplicate observation ID: ${observation.sample_id}`);
    ids.add(observation.sample_id);
  });
  return true;
}

async function main() {
  const commandArguments = process.argv[2] === '--' ? process.argv.slice(3) : process.argv.slice(2);
  const { values } = parseArgs({
    args: commandArguments,
    options: {
      input: { type: 'string' },
      output: { type: 'string' },
      'collector-commit': { type: 'string' },
      'core-version': { type: 'string' },
      concurrency: { type: 'string', default: '2' },
      'acknowledge-reviewed-gates': { type: 'boolean', default: false },
    },
    strict: true,
  });
  const missing = ['input', 'output', 'collector-commit', 'core-version'].filter((key) => !values[key]);
  if (missing.length) throw new Error(`Missing required option(s): ${missing.map((key) => `--${key}`).join(', ')}`);
  if (!values['acknowledge-reviewed-gates']) {
    throw new Error('Collection is locked until an operator passes --acknowledge-reviewed-gates after reviewing every publication gate');
  }
  const concurrency = Number.parseInt(values.concurrency, 10);
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 2) {
    throw new Error('Concurrency must be 1 or 2');
  }

  const inputPath = resolve(values.input);
  const outputPath = resolve(values.output);
  const manifest = JSON.parse(await readFile(inputPath, 'utf8'));
  assertManifest(manifest);
  const observations = await collectManifest(manifest, {
    collectorCommit: values['collector-commit'],
    coreVersion: values['core-version'],
    concurrency,
  });
  assertObservations(manifest, observations);
  await writeFile(outputPath, `${JSON.stringify(observations, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
  process.stdout.write(`Wrote ${observations.length} schema-valid observations to ${basename(outputPath)}\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
