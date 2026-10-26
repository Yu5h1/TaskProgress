import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
// Existing pinned Web build tool only; the delivered service does not use it.
const {build}=createRequire(resolve(root,'../Web/package.json'))('esbuild');
test('three consumer entry graphs resolve inside the staged delivery without Svelte',async()=>{
  const lock=JSON.parse(await readFile(resolve(root,'experiments/web-ui-workflow/delivery.json'),'utf8'));
  const site=resolve(root,'bin/Migration/WebUiWorkflow/deliveries',lock.payload_sha256,'site');
  for(const file of ['demo.js','checklist/checklist-ui.js','decisions/decisions-ui.js']){
    const result=await build({absWorkingDir:root,entryPoints:[resolve(site,'demo/taskprogress',file)],bundle:true,format:'esm',write:false,metafile:true,logLevel:'silent'});
    const paths=Object.keys(result.metafile.inputs);
    assert.ok(paths.some(p=>p.replaceAll('\\','/').endsWith('/ui/index.js')),'uses public Web UI');
    for(const path of paths){
      const local=relative(site,resolve(root,path));
      assert.ok(!local.startsWith('..')&&!isAbsolute(local),'runtime import outside delivery: '+path);
      assert.doesNotMatch(path,/(?:^|[\\/])reference[\\/]|\.svelte(?:\.|$)|node_modules[\\/]svelte[\\/]/i);
    }
  }
});
