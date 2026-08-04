export const PREVIEW_PLATFORMS = ['facebook', 'x', 'linkedin', 'slack', 'discord', 'whatsapp', 'google'];
export const PREVIEW_IMAGE_CONTENT_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'];

const LABELS = {
  facebook: 'Facebook', x: 'X / Twitter', linkedin: 'LinkedIn', slack: 'Slack',
  discord: 'Discord', whatsapp: 'WhatsApp', google: 'Google search',
};

const ACCENTS = {
  facebook: '#1877f2', x: '#111827', linkedin: '#0a66c2', slack: '#611f69',
  discord: '#5865f2', whatsapp: '#128c7e', google: '#1a73e8',
};

export function renderPreviewSvg(metadata, options = {}) {
  const requested = options.platform ?? 'all';
  if (requested !== 'all' && !PREVIEW_PLATFORMS.includes(requested)) {
    throw new Error(`Unsupported platform: ${requested}`);
  }
  const platforms = requested === 'all' ? PREVIEW_PLATFORMS : [requested];
  const cardWidth = 720;
  const cardHeight = 470;
  const gap = 32;
  const padding = 40;
  const headerHeight = requested === 'all' ? 126 : 92;
  const columns = requested === 'all' ? 2 : 1;
  const rows = Math.ceil(platforms.length / columns);
  const width = padding * 2 + cardWidth * columns + gap * (columns - 1);
  const height = headerHeight + padding + rows * cardHeight + gap * (rows - 1) + padding + 38;
  const domain = safeDomain(metadata.finalUrl || metadata.url);
  const imageDataUrl = isSafeImageDataUrl(options.imageDataUrl) ? options.imageDataUrl : undefined;
  const defs = platforms.map((platform, index) => {
    const x = padding + (index % columns) * (cardWidth + gap);
    const y = headerHeight + padding + Math.floor(index / columns) * (cardHeight + gap);
    return `<clipPath id="card-${index}"><rect x="${x}" y="${y}" width="${cardWidth}" height="${cardHeight}" rx="20" /></clipPath>
      <clipPath id="image-${index}"><rect x="${x + 24}" y="${y + 102}" width="${cardWidth - 48}" height="230" rx="10" /></clipPath>`;
  }).join('');
  const cards = platforms.map((platform, index) => {
    const x = padding + (index % columns) * (cardWidth + gap);
    const y = headerHeight + padding + Math.floor(index / columns) * (cardHeight + gap);
    return renderCard(platform, metadata, { x, y, width: cardWidth, height: cardHeight, index, imageDataUrl, domain });
  }).join('');
  const subtitle = requested === 'all'
    ? 'Modeled from live metadata · platform cropping and caches may differ'
    : `${LABELS[requested]} preview modeled from live metadata`;

  return {
    width,
    height,
    platforms,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="page-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f8fafc"/><stop offset="1" stop-color="#eef2ff"/></linearGradient>
        <linearGradient id="placeholder" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e5e7eb"/><stop offset="1" stop-color="#c7d2fe"/></linearGradient>
        ${defs}
      </defs>
      <rect width="${width}" height="${height}" fill="url(#page-bg)"/>
      <text x="${padding}" y="52" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#111827">LinkGlimpse preview sheet</text>
      <text x="${padding}" y="82" font-family="Arial, Helvetica, sans-serif" font-size="17" fill="#4b5563">${escapeXml(clip(metadata.finalUrl || metadata.url, 110))}</text>
      <text x="${padding}" y="108" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#6b7280">${escapeXml(subtitle)}</text>
      ${cards}
      <text x="${padding}" y="${height - 18}" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="#6b7280">Generated deterministically by LinkGlimpse · ${escapeXml(domain)}</text>
    </svg>`,
  };
}

function renderCard(platform, metadata, box) {
  const data = getPreviewData(platform, metadata, box.domain);
  const { x, y, width, height, index, imageDataUrl } = box;
  const accent = ACCENTS[platform];
  const image = imageDataUrl
    ? `<image href="${imageDataUrl}" x="${x + 24}" y="${y + 102}" width="${width - 48}" height="230" preserveAspectRatio="xMidYMid slice" clip-path="url(#image-${index})"/>`
    : `<rect x="${x + 24}" y="${y + 102}" width="${width - 48}" height="230" rx="10" fill="url(#placeholder)"/>
       <text x="${x + width / 2}" y="${y + 226}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="17" fill="#6b7280">No share image available</text>`;
  if (platform === 'google') return renderGoogleCard(data, box, accent);
  if (platform === 'slack') return renderSlackCard(data, box, accent, image);
  if (platform === 'discord') return renderDiscordCard(data, box, accent, image);
  if (platform === 'whatsapp') return renderWhatsappCard(data, box, accent, image);

  const descriptionLines = wrap(data.description || 'No description available', 76, 2);
  return `<g clip-path="url(#card-${index})">
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="20" fill="#ffffff" stroke="#d1d5db" stroke-width="2"/>
    <rect x="${x}" y="${y}" width="8" height="${height}" fill="${accent}"/>
    <circle cx="${x + 48}" cy="${y + 47}" r="22" fill="${accent}"/>
    <text x="${x + 48}" y="${y + 54}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#ffffff">${escapeXml(platform === 'x' ? 'X' : platform === 'linkedin' ? 'in' : 'f')}</text>
    <text x="${x + 82}" y="${y + 40}" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#111827">${LABELS[platform]}</text>
    <text x="${x + 82}" y="${y + 65}" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#6b7280">${escapeXml(data.domain)}</text>
    ${image}
    <text x="${x + 24}" y="${y + 363}" font-family="Arial, Helvetica, sans-serif" font-size="13" letter-spacing="1" fill="#6b7280">${escapeXml(data.domain.toUpperCase())}</text>
    ${textLines(data.title || 'No title available', x + 24, y + 393, 22, 650, 2, 25, '#111827', 700)}
    ${textLines(descriptionLines, x + 24, y + 445, 15, 650, 2, 19, '#4b5563', 400)}
  </g>`;
}

function renderGoogleCard(data, box, accent) {
  const { x, y, width, height, index } = box;
  return `<g clip-path="url(#card-${index})">
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="20" fill="#ffffff" stroke="#d1d5db" stroke-width="2"/>
    <rect x="${x}" y="${y}" width="8" height="${height}" fill="${accent}"/>
    <text x="${x + 30}" y="${y + 50}" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#111827">Google search preview</text>
    <circle cx="${x + 47}" cy="${y + 118}" r="22" fill="#f3f4f6"/>
    <text x="${x + 47}" y="${y + 125}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#4285f4">G</text>
    <text x="${x + 82}" y="${y + 109}" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#202124">${escapeXml(data.siteName)}</text>
    <text x="${x + 82}" y="${y + 132}" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#4d5156">${escapeXml(clip(data.url, 78))}</text>
    ${textLines(data.title || 'No title available', x + 28, y + 187, 25, 655, 2, 31, '#1a0dab', 400)}
    ${textLines(data.description || 'No description available', x + 28, y + 270, 17, 655, 4, 25, '#4d5156', 400)}
    <line x1="${x + 28}" y1="${y + height - 54}" x2="${x + width - 28}" y2="${y + height - 54}" stroke="#e5e7eb"/>
    <text x="${x + 28}" y="${y + height - 25}" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="#6b7280">SERP text comes from the HTML title and meta description.</text>
  </g>`;
}

function renderSlackCard(data, box, accent, image) {
  const { x, y, width, height, index } = box;
  return `<g clip-path="url(#card-${index})">
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="20" fill="#ffffff" stroke="#d1d5db" stroke-width="2"/>
    <text x="${x + 28}" y="${y + 48}" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#111827">Slack link unfurl</text>
    <rect x="${x + 24}" y="${y + 78}" width="5" height="${height - 110}" rx="2" fill="${accent}"/>
    <text x="${x + 46}" y="${y + 103}" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" fill="#111827">${escapeXml(data.siteName)}</text>
    ${image.replaceAll(`${x + 24}`, `${x + 46}`).replace(`width="${width - 48}"`, `width="${width - 72}"`)}
    ${textLines(data.title || 'No title available', x + 46, y + 363, 20, 630, 2, 24, '#1264a3', 700)}
    ${textLines(data.description || 'No description available', x + 46, y + 417, 14, 625, 2, 18, '#4b5563', 400)}
  </g>`;
}

function renderDiscordCard(data, box, accent, image) {
  const { x, y, width, height, index } = box;
  return `<g clip-path="url(#card-${index})">
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="20" fill="#313338" stroke="#1e1f22" stroke-width="2"/>
    <rect x="${x}" y="${y}" width="8" height="${height}" fill="${accent}"/>
    <text x="${x + 28}" y="${y + 48}" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#f2f3f5">Discord embed</text>
    <text x="${x + 28}" y="${y + 78}" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#b5bac1">${escapeXml(data.siteName)}</text>
    ${image}
    ${textLines(data.title || 'No title available', x + 28, y + 365, 20, 650, 2, 24, '#00a8fc', 700)}
    ${textLines(data.description || 'No description available', x + 28, y + 418, 14, 650, 2, 18, '#dbdee1', 400)}
  </g>`;
}

function renderWhatsappCard(data, box, accent, image) {
  const { x, y, width, height, index } = box;
  return `<g clip-path="url(#card-${index})">
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="20" fill="#efeae2" stroke="#d1d5db" stroke-width="2"/>
    <rect x="${x}" y="${y}" width="${width}" height="70" fill="${accent}"/>
    <text x="${x + 28}" y="${y + 44}" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#ffffff">WhatsApp link preview</text>
    <rect x="${x + 18}" y="${y + 88}" width="${width - 36}" height="${height - 108}" rx="12" fill="#ffffff"/>
    ${image}
    ${textLines(data.title || 'No title available', x + 30, y + 365, 19, 640, 2, 23, '#111827', 700)}
    ${textLines(data.description || 'No description available', x + 30, y + 417, 14, 640, 2, 18, '#667781', 400)}
    <text x="${x + width - 28}" y="${y + height - 24}" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="#667781">${escapeXml(data.domain)}</text>
  </g>`;
}

function getPreviewData(platform, metadata, domain) {
  const tags = metadata.tags ?? {};
  if (platform === 'google') {
    return {
      title: metadata.pageTitle || metadata.title,
      description: metadata.pageDescription || tags.description || metadata.description,
      url: metadata.canonical || metadata.finalUrl || metadata.url,
      domain,
      siteName: metadata.siteName || domain,
    };
  }
  const twitter = platform === 'x';
  return {
    title: twitter ? tags['twitter:title'] || tags['og:title'] || metadata.pageTitle : tags['og:title'] || metadata.title,
    description: twitter ? tags['twitter:description'] || tags['og:description'] || metadata.pageDescription : tags['og:description'] || metadata.description,
    url: tags['og:url'] || metadata.finalUrl || metadata.url,
    domain,
    siteName: metadata.siteName || domain,
  };
}

function textLines(value, x, y, fontSize, width, maxLines, lineHeight, color, weight) {
  const chars = Math.max(12, Math.floor(width / (fontSize * 0.55)));
  const lines = Array.isArray(value) ? value : wrap(value, chars, maxLines);
  return `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="${weight}" fill="${color}">${lines.map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`).join('')}</text>`;
}

function wrap(value, maxChars, maxLines) {
  const words = String(value).trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [''];
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars || !current) current = candidate;
    else { lines.push(current); current = word; }
    if (lines.length === maxLines) break;
  }
  if (lines.length < maxLines && current) lines.push(current);
  const consumed = lines.join(' ').length;
  if (consumed < String(value).trim().length && lines.length) lines[lines.length - 1] = `${lines[lines.length - 1].replace(/[.…]+$/, '')}…`;
  return lines.slice(0, maxLines);
}

function clip(value, max) { const text = String(value || ''); return text.length > max ? `${text.slice(0, max - 1)}…` : text; }
function safeDomain(value) { try { return new URL(value).hostname.replace(/^www\./, ''); } catch { return 'unknown site'; } }
function isSafeImageDataUrl(value) {
  if (!value) return false;
  const separator = value.indexOf(',');
  if (separator < 0) return false;
  const contentType = value.slice(5, separator).replace(/;base64$/i, '').toLowerCase();
  return value.startsWith('data:image/') && value.slice(5, separator).toLowerCase().endsWith(';base64')
    && PREVIEW_IMAGE_CONTENT_TYPES.includes(contentType) && /^[a-z\d+/=]+$/i.test(value.slice(separator + 1));
}
function escapeXml(value) { return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;'); }
