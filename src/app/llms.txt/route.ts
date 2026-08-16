import { getAllBlogPosts } from '@/lib/blog';
import { markdownPathForPage } from '@/lib/markdown-paths';
import { SITE_URL } from '@/lib/seo';

const corePages = [
  ['/open-graph-checker', 'Open Graph Checker', 'Inspect Open Graph, Twitter Card, canonical, robots, redirect, and share-image signals.'],
  ['/compare', 'Compare URLs', 'Compare metadata between two public URLs.'],
  ['/bulk', 'Bulk URL Checker', 'Check and export metadata for up to 100 public URLs.'],
  ['/examples', 'Example Reports', 'Review representative metadata audits and remediation output.'],
] as const;

const platformPages = [
  ['/facebook-open-graph-debugger', 'Facebook Open Graph Debugger'],
  ['/twitter-card-validator', 'Twitter Card Validator'],
  ['/linkedin-post-preview', 'LinkedIn Post Preview'],
  ['/google-search-preview', 'Google Search Preview'],
  ['/instagram-social-preview', 'Instagram Social Preview'],
  ['/bluesky-social-preview', 'Bluesky Social Preview'],
  ['/mastodon-social-preview', 'Mastodon Social Preview'],
  ['/nextdoor-social-preview', 'Nextdoor Social Preview'],
  ['/tumblr-social-preview', 'Tumblr Social Preview'],
] as const;

const developerPages = [
  ['/api', 'REST API'],
  ['/cli', 'CLI'],
  ['/mcp', 'MCP Server'],
  ['/apify', 'Apify Actor'],
  ['/browser-extension', 'Browser Extensions'],
] as const;

export async function GET() {
  const blogs = getAllBlogPosts();
  const body = [
    '# LinkGlimpse',
    '',
    '> LinkGlimpse checks how public URLs appear across social networks and search, then reports metadata, image, redirect, canonical, and indexing issues.',
    '',
    `Canonical site: ${SITE_URL}`,
    `Markdown home: ${SITE_URL}${markdownPathForPage('/')}`,
    '',
    '## Core tools',
    '',
    ...corePages.map(([path, title, description]) => pageEntry(path, title, description)),
    '',
    '## Platform preview tools',
    '',
    ...platformPages.map(([path, title]) => pageEntry(path, title)),
    '',
    '## Developer access',
    '',
    ...developerPages.map(([path, title]) => pageEntry(path, title)),
    '',
    '## Guides',
    '',
    ...blogs.map((post) => pageEntry(`/blog/${post.slug}`, post.title, post.description)),
    '',
    '## Machine-readable endpoints',
    '',
    `- [Sitemap](${SITE_URL}/sitemap.xml): Complete crawlable URL inventory.`,
    `- [Robots rules](${SITE_URL}/robots.txt): Crawler access rules.`,
    `- [Metadata API documentation](${SITE_URL}/api): JSON API usage and examples.`,
    '',
    'Every public HTML page advertises an exact Markdown alternate. Clients may also request a page URL with `Accept: text/markdown`.',
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
      'Content-Type': 'text/markdown; charset=utf-8',
      'Link': '</llms.txt>; rel="describedby"; type="text/markdown"',
    },
  });
}

function pageEntry(path: string, title: string, description?: string): string {
  const htmlUrl = `${SITE_URL}${path}`;
  const markdownUrl = `${SITE_URL}${markdownPathForPage(path)}`;
  const suffix = description ? `: ${description}` : '';
  return `- [${title}](${htmlUrl}) ([Markdown](${markdownUrl}))${suffix}`;
}
