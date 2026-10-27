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

export async function buildCandidate({ production = false } = {}) {
  const publicDelivery = await verifyVendor();
  const host = (await files(resolve(root, 'viewer/assets'))).filter(p => {
    const name = relative(resolve(root, 'viewer/assets'), p).replaceAll('\\', '/');
    return !name.startsWith('web/') && !['viewer-ui.js', 'viewer-ui.css', 'theme-start.js', 'component-styles.css', 'product.css'].includes(name);
  });
  const inputs = [...await files(source), ...host, resolve(root, 'package-lock.json'), fileURLToPath(import.meta.url)];
  const sourceHashes = {};
  for (const path of inputs) sourceHashes[relative(root, path).replaceAll('\\', '/')] = sha(await readFile(path));
  const identity = sha(json({ sourceHashes, publicDelivery, production }));
  const site = resolve(migration, 'candidates', identity, 'site');
  const output = resolve(site, 'demo/taskprogress');
  const put = async (name, bytes) => { const target = resolve(site, name); await mkdir(dirname(target), { recursive: true }); await writeFile(target, bytes); };
  // Product controllers remain shared by Browser and Desktop. Historical Svelte
  // comparison artifacts stay in the pinned rollback, never in a new delivery.
  for (const path of host) {
    const name = relative(resolve(root, 'viewer'), path).replaceAll('\\', '/');
    await put('demo/taskprogress/' + name, await readFile(path));
  }
  for (const name of Object.keys(publicDelivery.files)) await put(name, await readFile(resolve(vendor, name)));
  await put('demo/taskprogress/component-styles.css', await readFile(resolve(source, 'component-styles.css')));
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
    let html = await readFile(resolve(source, 'shells', (page ? page.slice(0, -1) : 'viewer') + '.html'), 'utf8');
    html = html.replace(/\s*<script[^>]+src="(?:assets\/(?:theme-bootstrap|viewer-ui|app)\.js|\.\/(?:checklist|decisions)-ui\.js)"[^>]*><\/script>/g, '');
    html = html.replace(/\s*<link[^>]+href="\.\/(?:checklist|decisions)-ui\.css"[^>]*>/g, '');
    html = html.replace('</head>', `<link rel="stylesheet" href="${depth}theme/theme.css">\n<link rel="stylesheet" href="${local}assets/styles.css">\n<link rel="stylesheet" href="${local}component-styles.css">\n<link rel="stylesheet" href="${local}product.css">\n<script src="${depth}theme/bootstrap.js"></script>\n<script src="${local}theme-start.js"></script>\n<script type="module" src="${page ? './' + page.slice(0, -1) + '-ui.js' : './demo.js'}"></script>\n</head>`);
    if (!production) html = html.replace('<body>', '<body><aside class="replica-notice" aria-label="TaskProgress 來源建置候選">TaskProgress 來源建置候選 · 獨立測試資料 · <a href="http://127.0.0.1:8001/?scope=task-progress">正式版</a></aside>');
    await put('demo/taskprogress/' + page + 'index.html', html);
  }
  // Stage the exact production layout separately; activation belongs to release acceptance.
  const release = 'release/viewer/';
  for (const path of await files(output)) {
    const name = relative(output, path).replaceAll('\\', '/');
    if (name.startsWith('reference/') || /^(assets\/viewer-ui\.|(?:checklist|decisions)\/.*-ui\.css)/.test(name)) continue;
    let bytes = await readFile(path);
    if (['index.html', 'checklist/index.html', 'decisions/index.html'].includes(name)) {
      const local = name.includes('/') ? '../' : './';
      bytes = bytes.toString('utf8').replace(/(?:\.\.\/){2,3}theme\//g, local + 'assets/web/theme/')
        .replace(/((?:\.\/|\.\.\/))(component-styles\.css|product\.css|theme-start\.js)/g, '$1assets/$2')
        .replace('./demo.js', './assets/viewer-ui.js');
    }
    const target = name === 'demo.js' ? 'assets/viewer-ui.js' : ['theme-start.js', 'component-styles.css', 'product.css'].includes(name) ? 'assets/' + name : name;
    await put(release + target, bytes);
  }
  for (const name of Object.keys(publicDelivery.files)) await put(release + 'assets/web/' + name, await readFile(resolve(vendor, name)));
  for (const [file, entry] of Object.entries(entries)) {
    const child = file.includes('/');
    const target = child ? file : 'assets/' + (file === 'demo.js' ? 'viewer-ui.js' : file);
    await compile(release + target, entry, resolve(site, release, target), child ? '../assets/web/' : './web/', child ? '../assets/' : './');
  }

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
    let html = await readFile(resolve(source, 'shells', kind + '.html'), 'utf8');
    html = html.replace(/\s*<link[^>]+href="\.\/(?:checklist|decisions)-ui\.css"[^>]*>/g, '');
    html = html.replace('</head>', '<link rel="stylesheet" href="./theme/theme.css"><link rel="stylesheet" href="./assets/styles.css"><link rel="stylesheet" href="./component-styles.css"><link rel="stylesheet" href="./product.css"><script src="./theme/bootstrap.js"></script><script src="./theme-start.js"></script></head>');
    if (!production) html = html.replace('<body>', '<body><aside class="replica-notice">TaskProgress Web UI Desktop 候選 · 請使用測試副本</aside>');
    await put(prefix + 'index.html', html);
  }
  // No implicit report. The source host's root route may show its scope directory.
  await put('index.html', '<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><title>TaskProgress UI 候選</title><h1>TaskProgress Web UI Workflow 候選</h1><p>獨立測試資料。</p><a href="/demo/taskprogress/">開啟 Viewer／Scope 入口</a></html>');
  const assets = {};
  for (const path of await files(site)) assets[relative(site, path).replaceAll('\\', '/')] = sha(await readFile(path));
  const result = { version: 1, identity, publicDelivery, sourceHashes, entries: graphs, files: assets };
  await mkdir(migration, { recursive: true });
  await writeFile(resolve(site, '../manifest.json'), json(result));
  if (!production) await writeFile(resolve(migration, 'candidate.json'), json({ version: 1, identity }));
  console.log('TaskProgress candidate: ' + site);
  return { site, manifest: result };
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) await buildCandidate();
