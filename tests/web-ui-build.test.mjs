import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { verifyVendor, buildCandidate } from '../scripts/build-web-ui.mjs';
import { loadThemePreference as loadProduct, DEFAULT_CUSTOM_PALETTES } from '../viewer/assets/theme-model.js';
import { loadThemePreference as loadShared } from '../vendor/web-ui/theme/index.js';
import { THEME_STORAGE_KEY, THEME_OPTIONS } from '../ui/web-workflow/theme-options.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
// A clean checkout has no ignored candidate; exercise its own build first.
const { site } = await buildCandidate();
test('Theme fallback and saved v1 preferences retain the product contract', () => {
  const preferences = [null, 'broken json', JSON.stringify({ version: 2, mode: 'dark' }),
    ...['system', 'light', 'dark', 'custom'].map(mode => JSON.stringify({ version: 1, mode, custom: { base: 'dark', ...DEFAULT_CUSTOM_PALETTES.dark } }))];
  for (const value of preferences) {
    const storage = { getItem: () => value };
    const before = loadProduct(storage), after = loadShared(() => storage, THEME_STORAGE_KEY, THEME_OPTIONS);
    assert.deepEqual(after, before, 'preference mismatch: ' + value);
  }
  assert.equal(loadShared(() => { throw new Error('storage denied'); }, THEME_STORAGE_KEY, THEME_OPTIONS).mode, 'system');
});
test('public Web payload drift is rejected before building product source', async () => {
  await verifyVendor();
  const temp = await mkdtemp(resolve(tmpdir(), 'taskprogress-web-payload-'));
  await mkdir(resolve(temp, 'ui'));
  await writeFile(resolve(temp, 'manifest.json'), JSON.stringify({ files: { 'ui/index.js': 'original-hash' } }));
  await writeFile(resolve(temp, 'ui/index.js'), 'changed');
  await assert.rejects(verifyVendor(temp), /delivery drift/);
});
test('candidate entry graphs use only local assets and one host registry, without Svelte', async () => {
  for (const entry of ['demo.js', 'checklist/checklist-ui.js', 'decisions/decisions-ui.js']) {
    let modules;
    await build({ configFile: false, root: site, logLevel: 'error',
      plugins: [{ name: 'inspect-runtime-graph', generateBundle(_, bundle) {
        modules = Object.values(bundle).flatMap(c => c.type === 'chunk' ? Object.keys(c.modules) : []);
      } }],
      build: { write: false, minify: false, target: 'es2022', lib: { entry: resolve(site, 'demo/taskprogress', entry), formats: ['es'] } }
    });
    assert.ok(modules.some(p => p.replaceAll('\\', '/').endsWith('/ui/index.js')), 'must use public Web UI');
    for (const path of modules) {
      const local = relative(site, path);
      assert.ok(!local.startsWith('..') && !isAbsolute(local), 'runtime dependency outside candidate: ' + path);
      assert.doesNotMatch(local, /\.svelte(?:\.|$)|[/\\]reference[/\\]|node_modules[/\\]svelte/i);
    }
    if (entry === 'demo.js') assert.equal(modules.filter(p => p.replaceAll('\\', '/').endsWith('/assets/ui-host.js')).length, 1);
  }
});
