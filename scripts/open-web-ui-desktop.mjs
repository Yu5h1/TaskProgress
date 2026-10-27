// Open only the prepared Desktop candidate's disposable fixture, never a registered report.
import { readFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const kind = process.argv[2];
if (!['checklist', 'decisions'].includes(kind)) throw new Error('Choose checklist or decisions.');
const folder = resolve(root, 'bin/Migration/WebUiWorkflow');
const pointer = JSON.parse(await readFile(resolve(folder, 'desktop-candidate.json'), 'utf8'));
if (!/^[a-f0-9]{64}$/.test(pointer.identity)) throw new Error('Invalid Desktop candidate identity.');
const current = JSON.parse(await readFile(resolve(folder, 'candidate.json'), 'utf8'));
if (current.identity !== pointer.identity) throw new Error('Desktop candidate is stale; run node scripts/prepare-web-ui-desktop.mjs.');
const executable = resolve(folder, 'desktop-host', pointer.identity, 'task-progress.exe');
const fixture = resolve(folder, 'desktop-data', kind === 'checklist' ? 'checklists/pilot.checklist' : 'decisions/pilot.decisions');
await access(executable); await access(fixture);
console.log('Candidate: ' + pointer.identity);
console.log('Test copy: ' + fixture);
execFileSync(executable, [kind, fixture], { cwd: root, stdio: 'inherit' });
