// Build the existing native host with candidate assets in an isolated output directory.
import { execFileSync } from 'node:child_process';
import { mkdir, copyFile, readdir, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCandidate } from './build-web-ui.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const { site, manifest } = await buildCandidate();
const output = resolve(root, 'bin/Migration/WebUiWorkflow/desktop-host', manifest.identity);
execFileSync('dotnet', ['build', 'src/TaskProgress.Cli/TaskProgress.Cli.csproj', '--no-restore', '-c', 'Release',
  '-p:OutputPath=' + output + '/', '-p:AppendTargetFrameworkToOutputPath=false',
  '-p:WebUiCandidateAssets=' + resolve(site, 'desktop')], { cwd: root, stdio: 'inherit' });
const data = resolve(root, 'bin/Migration/WebUiWorkflow/desktop-data');
async function seed(source, destination) {
  await mkdir(destination, { recursive: true });
  for (const entry of await readdir(source, { withFileTypes: true })) {
    if (entry.isDirectory()) await seed(resolve(source, entry.name), resolve(destination, entry.name));
    else if (entry.isFile()) {
      try { await copyFile(resolve(source, entry.name), resolve(destination, entry.name), constants.COPYFILE_EXCL); }
      catch (error) { if (error.code !== 'EEXIST') throw error; }
    }
  }
}
await seed(resolve(root, 'tests/fixtures/web-ui-pilot'), data);
await writeFile(resolve(root, 'bin/Migration/WebUiWorkflow/desktop-candidate.json'), JSON.stringify({ identity: manifest.identity, executable: resolve(output, 'task-progress.exe'), data }, null, 2) + '\n');
console.log('Desktop candidate ready: ' + output);
console.log('Test copies (preserved on subsequent prepares): ' + data);
