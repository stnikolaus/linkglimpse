const ANSI = {
  green: '\u001b[32m',
  yellow: '\u001b[33m',
  red: '\u001b[31m',
  bold: '\u001b[1m',
  dim: '\u001b[2m',
  reset: '\u001b[0m',
};

export function normalizeUrl(input) {
  const value = input.trim();
  if (!value) throw new Error('A URL is required.');

  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  const parsed = new URL(candidate);
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Only HTTP and HTTPS URLs are supported.');
  }
  return parsed.toString();
}

export function buildApiUrl(baseUrl, targetUrl) {
  const base = new URL(baseUrl);
  const endpoint = new URL('/api/metadata', `${base.origin}/`);
  endpoint.searchParams.set('url', targetUrl);
  return endpoint.toString();
}

export function buildReportUrl(targetUrl, source = 'cli') {
  const report = new URL('/report', 'https://www.linkglimpse.com');
  report.searchParams.set('url', targetUrl);
  report.searchParams.set('utm_source', source);
  report.searchParams.set('utm_medium', 'developer_tool');
  report.searchParams.set('utm_campaign', 'open_source_distribution');
  return report.toString();
}

export function getExitCode(report, failOn = 'none') {
  const counts = report.diagnostics?.counts;
  if (!counts || failOn === 'none') return 0;
  if (failOn === 'warning') return counts.warning > 0 || counts.fail > 0 ? 1 : 0;
  return counts.fail > 0 ? 1 : 0;
}

export function formatReport(report, options = {}) {
  const color = options.color ?? false;
  const paint = (value, tone) => color ? `${ANSI[tone]}${value}${ANSI.reset}` : value;
  const diagnostics = report.diagnostics;
  const lines = [];

  lines.push(paint('LinkGlimpse metadata audit', 'bold'));
  lines.push(`${paint('URL', 'dim')}: ${report.finalUrl || report.url}`);
  lines.push(`${paint('HTTP', 'dim')}: ${report.status ?? 'unknown'} ${report.statusText || ''}`.trim());

  if (!diagnostics) {
    lines.push('No diagnostic report was returned.');
    return lines.join('\n');
  }

  const scoreTone = diagnostics.score >= 90 ? 'green' : diagnostics.score >= 70 ? 'yellow' : 'red';
  lines.push(`${paint('Score', 'dim')}: ${paint(`${diagnostics.score}/100`, scoreTone)} (${diagnostics.counts.pass} passed, ${diagnostics.counts.warning} warnings, ${diagnostics.counts.fail} failed)`);
  lines.push('');

  for (const check of diagnostics.checks) {
    const marker = check.status === 'pass' ? paint('✓', 'green') : check.status === 'warning' ? paint('!', 'yellow') : paint('✗', 'red');
    lines.push(`${marker} ${check.label}: ${check.value || 'missing'}`);
    if (check.status !== 'pass') lines.push(`  ${check.recommendation}`);
  }

  lines.push('');
  lines.push(`${paint('Live report', 'dim')}: ${buildReportUrl(report.requestedUrl || report.finalUrl || report.url)}`);
  return lines.join('\n');
}
