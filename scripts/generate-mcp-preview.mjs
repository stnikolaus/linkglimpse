import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { renderPreviewSvg } from 'linkglimpse/core';

const image = await readFile(new URL('../public/images/icon/social-preview-1200x630.jpeg', import.meta.url));
const report = {
  url: 'https://www.linkglimpse.com/',
  finalUrl: 'https://www.linkglimpse.com/',
  pageTitle: 'Social Media Link Preview & Open Graph Checker',
  pageDescription: 'Check how any URL appears across social networks and Google, then fix missing or broken metadata.',
  title: 'Social Media Link Preview & Open Graph Checker',
  description: 'Check how any URL appears across social networks and Google, then fix missing or broken metadata.',
  siteName: 'LinkGlimpse',
  canonical: 'https://www.linkglimpse.com/',
  tags: {
    'og:title': 'Social Media Link Preview & Open Graph Checker',
    'og:description': 'Check how any URL appears across social networks and Google, then fix missing or broken metadata.',
    'og:url': 'https://www.linkglimpse.com/',
    'twitter:title': 'Social Media Link Preview & Open Graph Checker',
    'twitter:description': 'Check how any URL appears across social networks and Google, then fix missing or broken metadata.',
  },
};
const rendered = renderPreviewSvg(report, {
  imageDataUrl: `data:image/jpeg;base64,${image.toString('base64')}`,
});
const png = await sharp(Buffer.from(rendered.svg)).png({ compressionLevel: 9 }).toBuffer();
const outputDirectory = new URL('../public/images/mcp/', import.meta.url);
await mkdir(outputDirectory, { recursive: true });
await writeFile(new URL('visual-preview-sheet.png', outputDirectory), png);
console.log(`Generated ${rendered.width}×${rendered.height} MCP preview sheet (${Math.round(png.byteLength / 1024)} KB)`);
