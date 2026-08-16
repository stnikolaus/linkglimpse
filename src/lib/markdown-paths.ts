const MARKDOWN_SUFFIX = '.md';

export function markdownPathForPage(path: string): string {
  const normalized = normalizePagePath(path);
  return normalized === '/' ? '/index.md' : `${normalized}${MARKDOWN_SUFFIX}`;
}

export function pagePathFromMarkdown(path: string): string | null {
  const normalized = normalizePathname(path);

  if (normalized === '/index.md') {
    return '/';
  }

  if (!normalized.endsWith(MARKDOWN_SUFFIX)) {
    return null;
  }

  const pagePath = normalized.slice(0, -MARKDOWN_SUFFIX.length);
  return pagePath || '/';
}

export function normalizePagePath(path: string): string {
  const [pathname] = path.split(/[?#]/, 1);
  return normalizePathname(pathname || '/');
}

function normalizePathname(pathname: string): string {
  const withLeadingSlash = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (withLeadingSlash === '/') return '/';
  return withLeadingSlash.replace(/\/+$/, '');
}
