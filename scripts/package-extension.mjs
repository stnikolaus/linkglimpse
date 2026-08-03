import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const release = path.join(root, 'release');

const build = spawnSync(process.execPath, [path.join(root, 'scripts/build-extension.mjs')], { stdio: 'inherit' });
if (build.status !== 0) process.exit(build.status ?? 1);

await rm(release, { recursive: true, force: true });
await mkdir(release, { recursive: true });

for (const target of ['chrome', 'firefox']) {
  const archive = path.join(release, `linkglimpse-${target}-0.1.0.zip`);
  const result = spawnSync('zip', ['-qr', archive, '.'], {
    cwd: path.join(root, 'dist/extension', target),
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    console.error('The zip command is required to package the browser extension.');
    process.exit(result.status ?? 1);
  }
  console.log(`Created ${path.relative(root, archive)}`);
}
