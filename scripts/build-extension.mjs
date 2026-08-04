import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'apps/browser-extension/src');
const outputRoot = path.join(root, 'dist/extension');
const targets = ['chrome', 'firefox'];
const sourceFiles = ['popup.css', 'popup.html', 'popup.js'];
const iconSources = {
  'icon-16.png': 'public/images/icon/favicon-16x16.png',
  'icon-32.png': 'public/images/icon/favicon-32x32.png',
  'icon-48.png': 'apps/browser-extension/src/icons/icon-48.png',
  'icon-128.png': 'apps/browser-extension/src/icons/icon-128-store.png',
};

await rm(outputRoot, { recursive: true, force: true });
const baseManifest = JSON.parse(await readFile(path.join(source, 'manifest.base.json'), 'utf8'));

for (const target of targets) {
  const output = path.join(outputRoot, target);
  await mkdir(path.join(output, 'icons'), { recursive: true });

  for (const file of sourceFiles) {
    await cp(path.join(source, file), path.join(output, file));
  }
  for (const [name, relativeSource] of Object.entries(iconSources)) {
    await cp(path.join(root, relativeSource), path.join(output, 'icons', name));
  }

  const manifest = structuredClone(baseManifest);
  if (target === 'chrome') {
    manifest.minimum_chrome_version = '120';
  } else {
    manifest.browser_specific_settings = {
      gecko: {
        id: 'linkglimpse@linkglimpse.com',
        data_collection_permissions: {
          required: ['browsingActivity'],
        },
        strict_min_version: '140.0',
      },
      gecko_android: {
        strict_min_version: '142.0',
      },
    };
  }

  await writeFile(path.join(output, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
}

console.log(`Built Chrome and Firefox extensions in ${path.relative(root, outputRoot)}`);
