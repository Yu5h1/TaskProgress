// Explicit, hash-checked upgrade of the public Web payload; no sibling runtime imports.
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root = fileURLToPath(new URL('../', import.meta.url));
const source = process.argv[2];
if (!source) throw Error('Usage: node scripts/import-web-ui.mjs <Web/dist> [--apply]');
const dist = resolve(source), target = resolve(root, 'vendor/web-ui');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const deliveryBytes = await readFile(resolve(dist, 'contracts/delivery.json'));
const delivery = JSON.parse(deliveryBytes);
const old = JSON.parse(await readFile(resolve(target, 'manifest.json'), 'utf8'));
const payload = new Map();
for (const name of Object.keys(old.files)) {
  // NOTICE is the consumer's preserved licensing notice; the package notice stays pinned.
  const bytes = await readFile(resolve(name === 'NOTICE.txt' ? target : dist, name));
  if (delivery.artifacts[name] && sha(bytes) !== delivery.artifacts[name]) throw Error('Stale Web artifact: ' + name);
  payload.set(name, bytes);
}
for (const name of ['ui/index.js', 'theme/index.js', 'theme/theme.css']) {
  if (!delivery.artifacts[name]) throw Error('Missing public delivery fingerprint: ' + name);
}
const manifest = { version:1, web_revision:delivery.source.commit, source_dirty:delivery.source.dirty,
  source_delivery:sha(deliveryBytes), source_files:delivery.source.sha256,
  files:Object.fromEntries([...payload].map(([name, bytes])=>[name,sha(bytes)])) };
console.log(JSON.stringify({ source:dist, revision:manifest.web_revision, dirty:manifest.source_dirty,
  changed:Object.keys(manifest.files).filter(name=>manifest.files[name]!==old.files[name]) },null,2));
if (process.argv.includes('--apply')) {
  const backup=resolve(root,'bin/Migration/OptionPicker',sha(await readFile(resolve(target,'manifest.json'))));
  for (const name of [...payload.keys(), 'manifest.json']) {
    await mkdir(dirname(resolve(backup,name)),{recursive:true}); await copyFile(resolve(target,name),resolve(backup,name));
  }
  for (const [name,bytes] of payload) await writeFile(resolve(target,name),bytes);
  await writeFile(resolve(target,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
}
