import { build } from 'vite';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, readdir, copyFile } from 'node:fs/promises';
import { resolve, relative, dirname, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = resolve(root, 'ui/web-workflow');
const vendor = resolve(root, 'vendor/web-ui');
const migration = resolve(root, 'bin/Migration/WebUiWorkflow');
const sha = value => createHash('sha256').update(value).digest('hex');
const json = value => JSON.stringify(value, null, 2) + '\n';
async function files(folder) {
  const result = [];
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const path = resolve(folder, entry.name);
    if (entry.isSymbolicLink()) throw new Error('Symlink is not a delivery input: ' + path);
    if (entry.isDirectory()) result.push(...await files(path));
    else if (entry.isFile()) result.push(path);
  }
  return result.sort();
}
export async function verifyVendor(folder = vendor) {
  const manifest = JSON.parse(await readFile(resolve(folder, 'manifest.json'), 'utf8'));
  const actual = {};
  for (const path of await files(folder)) {
    const name = relative(folder, path).replaceAll('\\', '/');
    if (name !== 'manifest.json') actual[name] = sha(await readFile(path));
  }
  if (json(Object.fromEntries(Object.entries(actual).sort())) !== json(Object.fromEntries(Object.entries(manifest.files).sort()))) throw new Error('Web public delivery drift');
  if (!actual['ui/index.js.LEGAL.txt'] || !actual['NOTICE.txt']) throw new Error('Missing delivery notices');
  return manifest;
}

// Until the old renderer retires, its component-local styles remain the owner.
// Preserve the scopes from the accepted replica, including naked button/SVG rules.
async function componentStyles(paths) {
  let styles = await readFile(resolve(root, 'experiments/editor-svelte-spike/src/checklist-styles.css'), 'utf8');
  for (const path of paths.filter(p => p.endsWith('.svelte'))) {
    const name = path.split(/[\\/]/).at(-1).replace('.svelte', '');
    for (const match of (await readFile(path, 'utf8')).matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
      let css = match[1].replace(/:global\(([^)]+)\)/g, '$1');
      if (name === 'DecisionApp') {
        css = css.replace(/(^|})(\s*)button\s*\{/g, '$1$2button[data-decision-control] {');
        css = css.replace(/(^|})(\s*)([^{}]+)\{/g, (_, end, space, selectors) => end + space + selectors.split(',').map(s => s.trim().startsWith('.decisions-shell') || s.trim() === 'button[data-decision-control]' ? s.trim() : '.decisions-shell ' + s.trim()).join(', ') + '{');
      } else if (name === 'HistoryTools') css = css.replace(/(^|})(\s*)([^{}]+)\{/g, (_, end, space, selectors) => end + space + selectors.split(',').flatMap(s => s.trim().startsWith('.history-') ? [s.trim()] : ['.history-capsule ' + s.trim(), '.history-panel ' + s.trim()]).join(', ') + '{');
      if (name !== 'DialogShell') styles += `\n/* ${name}: product component styles */\n${css}\n`;
    }
  }
  return styles;
}

export async function buildCandidate() {
  const publicDelivery = await verifyVendor();
  const host = await files(resolve(root, 'viewer'));
  const components = await files(resolve(root, 'experiments/editor-svelte-spike/src'));
  const inputs = [...await files(source), ...host, ...components.filter(p => p.endsWith('.svelte') || p.endsWith('checklist-styles.css')), resolve(root, 'package-lock.json'), fileURLToPath(import.meta.url)];
  const sourceHashes = {};
  for (const path of inputs) sourceHashes[relative(root, path).replaceAll('\\', '/')] = sha(await readFile(path));
  const identity = sha(json({ sourceHashes, publicDelivery }));
  const site = resolve(migration, 'candidates', identity, 'site');
  const output = resolve(site, 'demo/taskprogress');
  const put = async (name, bytes) => { const target = resolve(site, name); await mkdir(dirname(target), { recursive: true }); await writeFile(target, bytes); };
  // Copy the current product host and a visibly separate old renderer for rollback comparison.
  for (const path of host) {
    const name = relative(resolve(root, 'viewer'), path).replaceAll('\\', '/');
    await put('demo/taskprogress/' + name, await readFile(path));
    const bytes = await readFile(path);
    await put('demo/taskprogress/reference/' + name, ['index.html', 'checklist/index.html', 'decisions/index.html'].includes(name)
      ? bytes.toString('utf8').replace('<body>', '<body><aside>原版比較（Svelte）· 候選測試資料副本</aside>') : bytes);
  }
  for (const name of Object.keys(publicDelivery.files)) await put(name, await readFile(resolve(vendor, name)));
  await put('demo/taskprogress/component-styles.css', await componentStyles(components));
  await put('demo/taskprogress/product.css', await readFile(resolve(source, 'product.css')));
  await put('demo/taskprogress/assets/theme-control.js', await readFile(resolve(source, 'theme-control.mjs')));
  const entries = { 'demo.js': 'viewer-entry.mjs', 'checklist/checklist-ui.js': 'checklist.mjs', 'decisions/decisions-ui.js': 'decisions.mjs', 'theme-start.js': 'theme-start.js' };
  const graphs = {};
  async function compile(file, entry, destination, webRoot, assetRoot) {
    await build({ configFile: false, root, logLevel: 'error',
      plugins: [{ name: 'product-runtime-boundaries',
        resolveId(id) {
          if (id.startsWith('@taskprogress/')) return { id: assetRoot + id.slice('@taskprogress/'.length), external: true };
          if (id === '@web/ui' || id === '@web/theme') return { id: webRoot + id.slice('@web/'.length) + '/index.js', external: true };
        },
        generateBundle(_, bundle) {
          const modules = Object.values(bundle).flatMap(chunk => chunk.type === 'chunk' ? Object.keys(chunk.modules) : []);
          for (const name of modules) {
            if (/\.svelte(?:\.|$)|[/\\]node_modules[/\\]svelte[/\\]/i.test(name)) throw new Error('Svelte in product renderer: ' + name);
            const path = relative(root, name);
            if (path.startsWith('..') || isAbsolute(path)) throw new Error('Build dependency outside TaskProgress: ' + name);
          }
          graphs[file] = modules.map(p => relative(root, p).replaceAll('\\', '/'));
        } }],
      build: { outDir: dirname(destination), emptyOutDir: false, minify: true, target: 'es2022',
        lib: { entry: resolve(source, entry), name: 'TaskProgressThemeBootstrap', formats: [entry === 'theme-start.js' ? 'iife' : 'es'], fileName: () => destination.split(/[\\/]/).at(-1) } }
    });
  }
  for (const [file, entry] of Object.entries(entries)) await compile(file, entry, resolve(output, file), '../'.repeat(file.split('/').length + 1), file.includes('/') ? '../assets/' : './assets/');
  for (const page of ['', 'checklist/', 'decisions/']) {
    const depth = page ? '../../../' : '../../', local = page ? '../' : './';
    let html = await readFile(resolve(root, 'viewer', page, 'index.html'), 'utf8');
    html = html.replace(/\s*<script[^>]+src="(?:assets\/(?:theme-bootstrap|viewer-ui|app)\.js|\.\/(?:checklist|decisions)-ui\.js)"[^>]*><\/script>/g, '');
    html = html.replace(/\s*<link[^>]+href="\.\/(?:checklist|decisions)-ui\.css"[^>]*>/g, '');
    html = html.replace('</head>', `<link rel="stylesheet" href="${depth}theme/theme.css">\n<link rel="stylesheet" href="${local}assets/styles.css">\n<link rel="stylesheet" href="${local}component-styles.css">\n<link rel="stylesheet" href="${local}product.css">\n<script src="${depth}theme/bootstrap.js"></script>\n<script src="${local}theme-start.js"></script>\n<script type="module" src="${page ? './' + page.slice(0, -1) + '-ui.js' : './demo.js'}"></script>\n</head>`);
    html = html.replace('<body>', '<body><aside class="replica-notice" aria-label="TaskProgress 來源建置候選">TaskProgress 來源建置候選 · 獨立測試資料 · <a href="http://127.0.0.1:8001/?scope=task-progress">正式 Svelte 版</a></aside>');
    await put('demo/taskprogress/' + page + 'index.html', html);
  }
  // Stage the exact production layout separately; activation belongs to release acceptance.
  const release = 'release/viewer/';
  for (const path of await files(output)) {
    const name = relative(output, path).replaceAll('\\', '/');
    if (name.startsWith('reference/') || /^(assets\/viewer-ui\.|(?:checklist|decisions)\/.*-ui\.css)/.test(name)) continue;
    let bytes = await readFile(path);
    if (['index.html', 'checklist/index.html', 'decisions/index.html'].includes(name)) {
      bytes = bytes.toString('utf8').replace(/(?:\.\.\/){2,3}theme\//g, (name.includes('/') ? '../' : './') + 'web/theme/');
    }
    await put(release + name, bytes);
  }
  for (const name of Object.keys(publicDelivery.files)) await put(release + 'web/' + name, await readFile(resolve(vendor, name)));
  for (const [file, entry] of Object.entries(entries)) await compile(release + file, entry, resolve(site, release, file), (file.includes('/') ? '../' : './') + 'web/', file.includes('/') ? '../assets/' : './assets/');

  // Each existing WebView2 virtual host gets a self-contained asset root. Both
  // hosts compile the same screens and reuse the existing exact-file bridges.
  for (const kind of ['checklist', 'decisions']) {
    const prefix = `desktop/${kind}-ui/`;
    for (const path of host) {
      const name = relative(resolve(root, 'viewer'), path).replaceAll('\\', '/');
      if (name.startsWith('assets/') && !name.startsWith('assets/viewer-ui.')) await put(prefix + name, await readFile(path));
    }
    for (const name of Object.keys(publicDelivery.files)) await put(prefix + name, await readFile(resolve(vendor, name)));
    for (const name of ['component-styles.css', 'product.css']) await put(prefix + name, await readFile(resolve(output, name)));
    await compile(prefix + kind + '-ui.js', kind + '.mjs', resolve(site, prefix, kind + '-ui.js'), './', './assets/');
    await compile(prefix + 'theme-start.js', 'theme-start.js', resolve(site, prefix, 'theme-start.js'), './', './assets/');
    let html = await readFile(resolve(root, 'viewer', kind, 'index.html'), 'utf8');
    html = html.replace(/<link[^>]+href="\.\/(?:checklist|decisions)-ui\.css"[^>]*>/g, '');
    html = html.replace('</head>', '<link rel="stylesheet" href="./theme/theme.css"><link rel="stylesheet" href="./assets/styles.css"><link rel="stylesheet" href="./component-styles.css"><link rel="stylesheet" href="./product.css"><script src="./theme/bootstrap.js"></script><script src="./theme-start.js"></script></head>');
    html = html.replace('<body>', '<body><aside class="replica-notice">TaskProgress Web UI Desktop 候選 · 請使用測試副本</aside>');
    await put(prefix + 'index.html', html);
  }
  // No implicit report. The source host's root route may show its scope directory.
  await put('index.html', '<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><title>TaskProgress UI 候選</title><h1>TaskProgress Web UI Workflow 候選</h1><p>產品來源建置；原 Svelte 正式版保留。</p><a href="/demo/taskprogress/">開啟 Viewer／Scope 入口</a></html>');
  const assets = {};
  for (const path of await files(site)) assets[relative(site, path).replaceAll('\\', '/')] = sha(await readFile(path));
  const result = { version: 1, identity, publicDelivery, sourceHashes, entries: graphs, files: assets };
  await mkdir(migration, { recursive: true });
  await writeFile(resolve(site, '../manifest.json'), json(result));
  await writeFile(resolve(migration, 'candidate.json'), json({ version: 1, identity }));
  console.log('TaskProgress candidate: ' + site);
  return { site, manifest: result };
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) await buildCandidate();
