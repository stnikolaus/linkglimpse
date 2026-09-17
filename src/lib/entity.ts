export const LINKGLIMPSE_ENTITY_DESCRIPTION =
  'LinkGlimpse is a free, open-source link preview and metadata diagnostic tool that shows how a URL may appear across social platforms and explains how to fix missing or incorrect metadata.';

export const LINKGLIMPSE_ORGANIZATION_ID = 'https://www.linkglimpse.com/#organization';

export const LINKGLIMPSE_PUBLIC_LINKS = {
  website: 'https://www.linkglimpse.com',
  about: 'https://www.linkglimpse.com/about',
  github: 'https://github.com/stnikolaus/linkglimpse',
  npm: 'https://www.npmjs.com/package/linkglimpse',
  chrome: 'https://chromewebstore.google.com/detail/alhheglnjpjfiaehoekkndaogkfdhdga',
  firefox: 'https://addons.mozilla.org/en-GB/firefox/addon/linkglimpse/',
  apify: 'https://apify.com/changetheway/linkglimpse-apify-actor',
  mcpSource: 'https://github.com/stnikolaus/linkglimpse/tree/main/packages/mcp',
  maintainer: 'https://www.tetriz.io/',
} as const;

export const LINKGLIMPSE_SAME_AS = [
  LINKGLIMPSE_PUBLIC_LINKS.github,
  LINKGLIMPSE_PUBLIC_LINKS.npm,
  LINKGLIMPSE_PUBLIC_LINKS.chrome,
  LINKGLIMPSE_PUBLIC_LINKS.firefox,
  LINKGLIMPSE_PUBLIC_LINKS.apify,
];
