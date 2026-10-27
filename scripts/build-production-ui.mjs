import { buildCandidate } from './build-web-ui.mjs';
import { readdir, mkdir, copyFile, unlink, writeFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const { site, manifest } = await buildCandidate({ production: true });
async function copyTree(source, target) {
  await mkdir(target, { recursive: true });
  for (const entry of await readdir(source, { withFileTypes: true })) {
    const from = resolve(source, entry.name), to = resolve(target, entry.name);
    if (entry.isSymbolicLink()) throw new Error('Unexpected delivery symlink: ' + from);
    if (entry.isDirectory()) await copyTree(from, to);
    else if (entry.isFile()) await copyFile(from, to);
  }
}
await copyTree(resolve(site, 'release/viewer'), resolve(root, 'viewer'));
for (const kind of ['checklist', 'decisions']) {
  await copyTree(resolve(site, 'desktop', kind + '-ui'), resolve(root, 'src/TaskProgress.Cli', kind + '-ui'));
}
// Exact obsolete generated files only; no repository-wide cleaning or user data.
for (const name of ['viewer/assets/viewer-ui.css',
  'viewer/assets/icon-choice.js',
  'src/TaskProgress.Cli/checklist-ui/assets/icon-choice.js', 'src/TaskProgress.Cli/decisions-ui/assets/icon-choice.js',
  'viewer/checklist/checklist-ui.css', 'viewer/decisions/decisions-ui.css',
  'src/TaskProgress.Cli/checklist-ui/checklist-ui.css', 'src/TaskProgress.Cli/decisions-ui/decisions-ui.css']) {
  const target = resolve(root, name);
  if (relative(root, target).startsWith('..')) throw new Error('Output escapes repository');
  try { await unlink(target); } catch (error) { if (error.code !== 'ENOENT') throw error; }
}
await writeFile(resolve(root, 'bin/Migration/WebUiWorkflow/production.json'), JSON.stringify({identity: manifest.identity, site}, null, 2) + '\n');
console.log('Production Web UI ready: ' + manifest.identity);
