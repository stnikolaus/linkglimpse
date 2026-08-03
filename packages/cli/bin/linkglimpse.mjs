#!/usr/bin/env node

import { buildApiUrl, formatReport, getExitCode, normalizeUrl } from '../src/lib.mjs';

const VERSION = '0.1.0';
const DEFAULT_API_BASE = 'https://www.linkglimpse.com';

function printHelp() {
  console.log(`LinkGlimpse ${VERSION}

Audit the social-sharing metadata for a public URL.

Usage:
  linkglimpse <url> [options]
  npx linkglimpse <url> [options]

Options:
  --json                 Print the complete machine-readable API response
  --fail-on <level>      Exit 1 on "error"/"fail" or "warning" findings
  --api-base <url>       Use another LinkGlimpse deployment
  --timeout <seconds>    Request timeout (default: 20)
  --no-color             Disable ANSI colors
  -h, --help             Show this help
  -v, --version          Show the version

Examples:
  npx linkglimpse example.com
  npx linkglimpse https://example.com --fail-on warning
  npx linkglimpse https://example.com --json
  npx linkglimpse https://example.com --api-base http://localhost:3000`);
}

function readOptions(argv) {
  const options = {
    apiBase: process.env.LINKGLIMPSE_API_BASE || DEFAULT_API_BASE,
    color: Boolean(process.stdout.isTTY && !process.env.NO_COLOR),
    failOn: 'none',
    json: false,
    timeoutMs: 20_000,
    url: undefined,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--json') options.json = true;
    else if (argument === '--no-color') options.color = false;
    else if (argument === '--fail-on') options.failOn = argv[++index];
    else if (argument === '--api-base') options.apiBase = argv[++index];
    else if (argument === '--timeout') options.timeoutMs = Number(argv[++index]) * 1000;
    else if (argument === '-h' || argument === '--help') options.help = true;
    else if (argument === '-v' || argument === '--version') options.version = true;
    else if (argument.startsWith('-')) throw new Error(`Unknown option: ${argument}`);
    else if (!options.url) options.url = argument;
    else throw new Error('Only one URL can be audited at a time.');
  }

  if (!['none', 'warning', 'error', 'fail'].includes(options.failOn)) {
    throw new Error('--fail-on must be "warning", "error", or "fail".');
  }
  if (!Number.isFinite(options.timeoutMs) || options.timeoutMs <= 0) {
    throw new Error('--timeout must be a positive number of seconds.');
  }
  return options;
}

async function main() {
  const options = readOptions(process.argv.slice(2));
  if (options.help) return printHelp();
  if (options.version) return console.log(VERSION);
  if (!options.url) {
    printHelp();
    process.exitCode = 2;
    return;
  }

  const targetUrl = normalizeUrl(options.url);
  const response = await fetch(buildApiUrl(options.apiBase, targetUrl), {
    headers: { Accept: 'application/json', 'User-Agent': `linkglimpse-cli/${VERSION}` },
    signal: AbortSignal.timeout(options.timeoutMs),
  });
  const report = await response.json();

  if (!response.ok) {
    throw new Error(report.error || `LinkGlimpse API returned HTTP ${response.status}.`);
  }

  console.log(options.json ? JSON.stringify(report, null, 2) : formatReport(report, { color: options.color }));
  process.exitCode = getExitCode(report, options.failOn === 'error' ? 'fail' : options.failOn);
}

main().catch((error) => {
  console.error(`LinkGlimpse: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 2;
});
