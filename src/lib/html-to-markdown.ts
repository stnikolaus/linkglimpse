import 'server-only';

import TurndownService from 'turndown';

const removableElements = new Set([
  'script',
  'style',
  'svg',
  'noscript',
  'template',
  'canvas',
]);

export function htmlToMarkdown(html: string, sourceUrl: string): string {
  const service = new TurndownService({
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
    headingStyle: 'atx',
    strongDelimiter: '**',
  });

  service.remove((node) => removableElements.has(node.nodeName.toLowerCase()));
  service.addRule('interactive-controls', {
    filter: ['button', 'input', 'select', 'textarea'],
    replacement: (content, node) => {
      const element = node as HTMLElement;
      const label = content.trim()
        || element.getAttribute?.('aria-label')
        || element.getAttribute?.('placeholder')
        || element.getAttribute?.('value')
        || '';
      return label ? ` ${label} ` : '';
    },
  });

  const title = extractTitle(html);
  const mainHtml = extractMain(html);
  let markdown = service.turndown(mainHtml)
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (title && !/^#\s+/m.test(markdown)) {
    markdown = `# ${title}\n\n${markdown}`;
  }

  return `${markdown}\n\n---\n\nSource: ${sourceUrl}\n`;
}

function extractMain(html: string): string {
  return html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html;
}

function extractTitle(html: string): string {
  const rawTitle = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '';
  return rawTitle
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .trim();
}
