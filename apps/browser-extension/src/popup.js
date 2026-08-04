const API_ENDPOINT = 'https://www.linkglimpse.com/api/metadata';
const REQUEST_TIMEOUT_MS = 20_000;

const state = {
  activeUrl: '',
  report: null,
  platform: 'facebook',
  showPassed: false,
};

const elements = {
  auditState: document.querySelector('#audit-state'),
  loading: document.querySelector('#loading'),
  errorState: document.querySelector('#error-state'),
  errorMessage: document.querySelector('#error-message'),
  retry: document.querySelector('#retry'),
  results: document.querySelector('#results'),
  scoreRing: document.querySelector('#score-ring'),
  scoreValue: document.querySelector('#score-value'),
  scoreSummary: document.querySelector('#score-summary'),
  copyAllFixes: document.querySelector('#copy-all-fixes'),
  previewCard: document.querySelector('#preview-card'),
  previewMedia: document.querySelector('#preview-media'),
  previewImage: document.querySelector('#preview-image'),
  previewDomain: document.querySelector('#preview-domain'),
  previewTitle: document.querySelector('#preview-title'),
  previewDescription: document.querySelector('#preview-description'),
  serpSiteRow: document.querySelector('#serp-site-row'),
  serpFavicon: document.querySelector('#serp-favicon'),
  serpSiteName: document.querySelector('#serp-site-name'),
  serpUrl: document.querySelector('#serp-url'),
  previewTabs: [...document.querySelectorAll('.preview-tab')],
  factsGrid: document.querySelector('#facts-grid'),
  platformList: document.querySelector('#platform-list'),
  checksList: document.querySelector('#checks-list'),
  togglePassed: document.querySelector('#toggle-passed'),
  tagCount: document.querySelector('#tag-count'),
  tagsList: document.querySelector('#tags-list'),
};

function setAuditState(label, tone = '') {
  elements.auditState.textContent = label;
  elements.auditState.className = `audit-state${tone ? ` is-${tone}` : ''}`;
}

function getActiveTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const runtimeError = chrome.runtime.lastError;
      if (runtimeError) {
        reject(new Error(runtimeError.message));
        return;
      }
      resolve(tabs[0]);
    });
  });
}

function isInspectableUrl(url) {
  return typeof url === 'string' && /^https?:\/\//i.test(url);
}

async function requestReport(url) {
  const endpoint = new URL(API_ENDPOINT);
  endpoint.searchParams.set('url', url);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    });
    const report = await response.json();
    if (!response.ok || report.error) {
      throw new Error(report.error || `LinkGlimpse returned HTTP ${response.status}.`);
    }
    if (!report.diagnostics) {
      throw new Error('The page was fetched, but no diagnostic report was returned.');
    }
    return report;
  } finally {
    clearTimeout(timeout);
  }
}

function showLoading() {
  elements.loading.hidden = false;
  elements.errorState.hidden = true;
  elements.results.hidden = true;
  setAuditState('Checking');
}

function showError(message) {
  elements.loading.hidden = true;
  elements.results.hidden = true;
  elements.errorState.hidden = false;
  elements.errorMessage.textContent = message;
  setAuditState('Unavailable', 'error');
}

function scoreTone(score) {
  if (score >= 80) return 'good';
  if (score >= 55) return 'warning';
  return 'poor';
}

function scoreLabel(score) {
  if (score >= 90) return 'Excellent social metadata';
  if (score >= 80) return 'Good, with minor improvements';
  if (score >= 55) return 'Several items need attention';
  return 'Important metadata is missing';
}

function renderScore(report) {
  const { diagnostics } = report;
  const score = Math.max(0, Math.min(100, Number(diagnostics.score) || 0));
  const tone = scoreTone(score);
  elements.scoreValue.textContent = String(score);
  elements.scoreRing.className = `score-ring is-${tone}`;
  elements.scoreRing.style.setProperty('--score-progress', `${score}%`);
  elements.scoreRing.setAttribute('aria-valuenow', String(score));
  elements.scoreRing.setAttribute('aria-label', `Metadata health score: ${score} out of 100`);
  elements.scoreSummary.textContent = `${scoreLabel(score)} · ${diagnostics.counts.pass} passed, ${diagnostics.counts.warning} to review, ${diagnostics.counts.fail} to fix`;

  const hasIssues = diagnostics.counts.warning + diagnostics.counts.fail > 0;
  elements.copyAllFixes.hidden = !hasIssues;
  setAuditState(hasIssues ? 'Review' : 'Ready', hasIssues ? 'warning' : 'ready');
}

function safeHostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url || 'Unknown site';
  }
}

function formatSerpUrl(url) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, '');
    const breadcrumbs = parsed.pathname.split('/').filter(Boolean).map((part) => decodeURIComponent(part));
    return breadcrumbs.length > 0 ? `${hostname} › ${breadcrumbs.join(' › ')}` : hostname;
  } catch {
    return url;
  }
}

function renderPreview() {
  const report = state.report;
  if (!report) return;

  const platformNames = {
    facebook: 'Facebook',
    linkedin: 'LinkedIn',
    twitter: 'X',
    google: 'Google',
  };
  const url = report.finalUrl || report.url || state.activeUrl;
  const hostname = safeHostname(url);
  const isGoogle = state.platform === 'google';

  elements.previewTabs.forEach((tab) => {
    const active = tab.dataset.platform === state.platform;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  elements.previewCard.className = `preview-card platform-${state.platform}`;
  elements.previewDomain.hidden = isGoogle;
  elements.serpSiteRow.hidden = !isGoogle;
  elements.previewDomain.textContent = state.platform === 'twitter'
    ? `${hostname} · ${platformNames[state.platform]} card`
    : hostname;

  if (isGoogle) {
    const siteName = report.siteName || hostname;
    elements.serpFavicon.textContent = siteName.charAt(0).toUpperCase();
    elements.serpSiteName.textContent = siteName;
    elements.serpUrl.textContent = formatSerpUrl(url);
    elements.previewTitle.textContent = report.pageTitle || report.title || 'No page title detected';
    elements.previewDescription.textContent = report.pageDescription || report.tags?.description || report.description || 'No meta description detected.';
  } else {
    elements.previewTitle.textContent = report.title || 'No social title detected';
    elements.previewDescription.textContent = report.description || 'No social description detected.';
  }

  elements.previewMedia.hidden = isGoogle;
  elements.previewMedia.classList.toggle('is-missing', !report.image);
  elements.previewImage.removeAttribute('src');
  elements.previewImage.alt = !isGoogle && report.image ? `Share image preview for ${report.title || hostname}` : '';
  if (!isGoogle && report.image) elements.previewImage.src = report.image;
}

function appendFact(label, value, tone, title = value) {
  const wrapper = document.createElement('div');
  wrapper.className = 'fact';
  const term = document.createElement('dt');
  term.textContent = label;
  const description = document.createElement('dd');
  description.className = `tone-${tone}`;
  description.textContent = value;
  description.title = title || value;
  wrapper.append(term, description);
  elements.factsGrid.append(wrapper);
}

function renderFacts(report) {
  elements.factsGrid.replaceChildren();
  const successful = report.status >= 200 && report.status < 300;
  const imageInfo = report.imageInfo;
  const imageDetails = imageInfo?.width && imageInfo?.height
    ? `${imageInfo.width}×${imageInfo.height}`
    : report.image
      ? 'Detected'
      : 'Missing';

  appendFact('HTTP response', report.status ? `${report.status} ${report.statusText || ''}`.trim() : 'Unknown', successful ? 'good' : 'error');
  appendFact('Final URL', report.redirected ? 'Redirected' : 'Direct', report.redirected ? 'warning' : 'good', report.finalUrl || report.url);
  appendFact('Canonical', report.canonical ? 'Declared' : 'Missing', report.canonical ? 'good' : 'error', report.canonical || 'No canonical URL detected');
  appendFact('Share image', imageDetails, report.image ? 'good' : 'error', report.image || 'No share image detected');
}

function statusIcon(status) {
  if (status === 'pass' || status === 'ready') return '✓';
  if (status === 'warning' || status === 'needs-work') return '!';
  return '×';
}

function renderPlatforms(report) {
  elements.platformList.replaceChildren();
  report.diagnostics.platforms.forEach((platform) => {
    const ready = platform.status === 'ready';
    const item = document.createElement('article');
    item.className = `platform-item ${ready ? 'is-ready' : 'is-warning'}`;
    const row = document.createElement('div');
    row.className = 'platform-row';
    const icon = document.createElement('span');
    icon.className = 'status-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = statusIcon(platform.status);
    const copy = document.createElement('div');
    copy.className = 'platform-copy';
    const name = document.createElement('strong');
    name.textContent = platform.platform;
    const detail = document.createElement('p');
    detail.textContent = ready ? 'Core tags are ready.' : `Missing: ${platform.missing.join(', ')}`;
    copy.append(name, detail);
    row.append(icon, copy);
    item.append(row);
    elements.platformList.append(item);
  });
}

function buildFixText(check, report) {
  const lines = [
    `Fix the ${check.label} issue for ${report.finalUrl || report.url || state.activeUrl}.`,
    `Status: ${check.status}`,
  ];
  if (check.value) lines.push(`Current value: ${check.value}`);
  lines.push(`Required change: ${check.recommendation}`);
  return lines.join('\n');
}

function buildAllFixesText(report) {
  const issues = report.diagnostics.checks.filter((check) => check.status !== 'pass');
  return [
    `Fix the social metadata issues for ${report.finalUrl || report.url || state.activeUrl}.`,
    `Current LinkGlimpse score: ${report.diagnostics.score}/100.`,
    '',
    ...issues.flatMap((check, index) => [
      `${index + 1}. ${check.label} (${check.status})`,
      check.value ? `Current value: ${check.value}` : 'Current value: missing',
      `Fix: ${check.recommendation}`,
      '',
    ]),
    'Return the exact HTML metadata changes needed and preserve any correct existing tags.',
  ].join('\n').trim();
}

async function copyText(button, text, successLabel) {
  const original = button.textContent;
  await navigator.clipboard.writeText(text);
  button.textContent = successLabel;
  window.setTimeout(() => {
    button.textContent = original;
  }, 1_500);
}

function createCheck(check, report) {
  const item = document.createElement('article');
  item.className = `check-item is-${check.status}`;
  const row = document.createElement('div');
  row.className = 'check-row';
  const icon = document.createElement('span');
  icon.className = 'status-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = statusIcon(check.status);
  const copy = document.createElement('div');
  copy.className = 'check-copy';
  const label = document.createElement('strong');
  label.textContent = check.label;
  copy.append(label);

  if (check.value) {
    const value = document.createElement('p');
    value.className = 'check-value';
    value.textContent = check.value;
    value.title = check.value;
    copy.append(value);
  }

  if (check.status !== 'pass') {
    const recommendation = document.createElement('p');
    recommendation.className = 'check-recommendation';
    recommendation.textContent = check.recommendation;
    const copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.className = 'copy-fix';
    copyButton.textContent = 'Copy fix';
    copyButton.addEventListener('click', () => copyText(copyButton, buildFixText(check, report), 'Copied'));
    copy.append(recommendation, copyButton);
  }

  row.append(icon, copy);
  item.append(row);
  return item;
}

function renderChecks(report) {
  elements.checksList.replaceChildren();
  const checks = state.showPassed
    ? report.diagnostics.checks
    : report.diagnostics.checks.filter((check) => check.status !== 'pass');
  elements.togglePassed.textContent = state.showPassed ? 'Hide passed' : 'Show passed';

  if (checks.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-checks';
    empty.textContent = 'No issues detected. Show passed checks to inspect every signal.';
    elements.checksList.append(empty);
    return;
  }

  checks.forEach((check) => elements.checksList.append(createCheck(check, report)));
}

function renderTags(report) {
  const tags = Object.entries(report.tags || {}).sort(([left], [right]) => left.localeCompare(right));
  elements.tagCount.textContent = `(${tags.length})`;
  elements.tagsList.replaceChildren();

  if (tags.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'tag-row';
    const description = document.createElement('dd');
    description.textContent = 'No metadata tags were extracted.';
    empty.append(description);
    elements.tagsList.append(empty);
    return;
  }

  tags.forEach(([name, value]) => {
    const row = document.createElement('div');
    row.className = 'tag-row';
    const term = document.createElement('dt');
    term.textContent = name;
    const description = document.createElement('dd');
    description.textContent = value;
    row.append(term, description);
    elements.tagsList.append(row);
  });
}

function renderReport(report) {
  state.report = report;
  renderScore(report);
  renderPreview();
  renderFacts(report);
  renderPlatforms(report);
  renderChecks(report);
  renderTags(report);
  elements.loading.hidden = true;
  elements.errorState.hidden = true;
  elements.results.hidden = false;
}

async function startAudit() {
  showLoading();
  state.report = null;
  state.showPassed = false;

  try {
    const tab = await getActiveTab();
    state.activeUrl = tab?.url || '';

    if (!isInspectableUrl(state.activeUrl)) {
      throw new Error('Open a public HTTP or HTTPS page, then open LinkGlimpse again. Browser settings and internal pages cannot be checked.');
    }

    const report = await requestReport(state.activeUrl);
    renderReport(report);
  } catch (error) {
    const message = error?.name === 'AbortError'
      ? 'The audit took longer than 20 seconds. Check the page availability and try again.'
      : error?.message || 'An unexpected error prevented this page from being checked.';
    showError(message);
  }
}

elements.previewImage.addEventListener('error', () => {
  elements.previewMedia.classList.add('is-missing');
});

elements.previewTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    state.platform = tab.dataset.platform;
    renderPreview();
  });
});

elements.togglePassed.addEventListener('click', () => {
  if (!state.report) return;
  state.showPassed = !state.showPassed;
  renderChecks(state.report);
});

elements.copyAllFixes.addEventListener('click', () => {
  if (!state.report) return;
  copyText(elements.copyAllFixes, buildAllFixesText(state.report), 'Copied');
});

elements.retry.addEventListener('click', startAudit);

startAudit();
