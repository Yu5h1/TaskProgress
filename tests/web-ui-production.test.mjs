import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCandidate } from '../scripts/build-web-ui.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const { site, manifest } = await buildCandidate({ production: true });
test('production CSS is owned by the product and no build input needs Svelte', async () => {
  assert.ok(Object.keys(manifest.sourceHashes).includes('ui/web-workflow/component-styles.css'));
  assert.ok(Object.keys(manifest.sourceHashes).every(p => !/\.svelte$|editor-svelte-spike/.test(p)));
  const lock = JSON.parse(await readFile(resolve(root, 'package-lock.json'), 'utf8'));
  assert.ok(Object.keys(lock.packages).every(p => !/svelte/i.test(p)));
  for (const graph of Object.values(manifest.entries)) assert.ok(graph.every(p => !/svelte/i.test(p)));
});
test('the five production scenes are banner-free and deploy byte-identical bundles', async () => {
  for (const [delivery, deployed, bundle] of [
    ['release/viewer', 'viewer', 'assets/viewer-ui.js'],
    ['release/viewer/checklist', 'viewer/checklist', 'checklist-ui.js'],
    ['release/viewer/decisions', 'viewer/decisions', 'decisions-ui.js'],
    ['desktop/checklist-ui', 'src/TaskProgress.Cli/checklist-ui', 'checklist-ui.js'],
    ['desktop/decisions-ui', 'src/TaskProgress.Cli/decisions-ui', 'decisions-ui.js'],
  ]) {
    const html = await readFile(resolve(site, delivery, 'index.html'), 'utf8');
    assert.doesNotMatch(html, /replica-notice|獨立測試資料|正式 Svelte/);
    assert.equal(await readFile(resolve(root, deployed, 'index.html'), 'utf8'), html);
    assert.deepEqual(await readFile(resolve(root, deployed, bundle)), await readFile(resolve(site, delivery, bundle)));
    for (const match of html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="([^"]+)"/g)) await access(resolve(root, deployed, match[1]));
  }
  // Existing Pages consumers copy index.html and assets recursively.
  const rootHtml = await readFile(resolve(root, 'viewer/index.html'), 'utf8');
  for (const match of rootHtml.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="([^"]+)"/g)) assert.match(match[1], /^(?:\.\/)?assets\//);
});
