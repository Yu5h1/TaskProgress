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
  for (const entry of ['demo/taskprogress/demo.js', 'demo/taskprogress/checklist/checklist-ui.js', 'demo/taskprogress/decisions/decisions-ui.js', 'desktop/checklist-ui/checklist-ui.js', 'desktop/decisions-ui/decisions-ui.js', 'release/viewer/demo.js', 'release/viewer/checklist/checklist-ui.js', 'release/viewer/decisions/decisions-ui.js']) {
    let modules;
    await build({ configFile: false, root: site, logLevel: 'error',
      plugins: [{ name: 'inspect-runtime-graph', generateBundle(_, bundle) {
        modules = Object.values(bundle).flatMap(c => c.type === 'chunk' ? Object.keys(c.modules) : []);
      } }],
      build: { write: false, minify: false, target: 'es2022', lib: { entry: resolve(site, entry), formats: ['es'] } }
    });
    assert.ok(modules.some(p => p.replaceAll('\\', '/').endsWith('/ui/index.js')), 'must use public Web UI');
    for (const path of modules) {
      const local = relative(site, path);
      assert.ok(!local.startsWith('..') && !isAbsolute(local), 'runtime dependency outside candidate: ' + path);
      assert.doesNotMatch(local, /\.svelte(?:\.|$)|[/\\]reference[/\\]|node_modules[/\\]svelte/i);
    }
    if (entry.endsWith('/demo.js')) assert.equal(modules.filter(p => p.replaceAll('\\', '/').endsWith('/assets/ui-host.js')).length, 1);
  }
});

test('all five candidate shells keep local scripts, styles and WebView assets inside their host root', async () => {
  for (const prefix of ['demo/taskprogress/', 'demo/taskprogress/checklist/', 'demo/taskprogress/decisions/', 'desktop/checklist-ui/', 'desktop/decisions-ui/', 'release/viewer/', 'release/viewer/checklist/', 'release/viewer/decisions/']) {
    const html = await readFile(resolve(site, prefix, 'index.html'), 'utf8');
    const hostRoot = prefix.startsWith('desktop/') ? resolve(site, prefix) : prefix.startsWith('release/') ? resolve(site, 'release/viewer') : site;
    for (const match of html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="([^"]+)"/g)) {
      const path = resolve(site, prefix, match[1]);
      assert.ok(!relative(hostRoot, path).startsWith('..'), `${prefix} escapes virtual host: ${match[1]}`);
      assert.ok((await readFile(path)).length, `missing ${path}`);
    }
    assert.doesNotMatch(html, /assets\/viewer-ui\.js/);
    assert.match(html, /theme-start\.js/);
  }
});
