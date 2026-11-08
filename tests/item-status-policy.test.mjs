import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { ITEM_STATUS_META, STATUS_META } from '../viewer/assets/report-model.js';
import { createReportEditorSession } from '../viewer/assets/editor-core.js';

test('editor status catalogs match the Agent report schema and exclude derived states',async()=>{
  const schema=JSON.parse(await readFile(new URL('../schemas/report.schema.json',import.meta.url),'utf8'));
  assert.deepEqual(Object.keys(ITEM_STATUS_META),schema.$defs.item.properties.status.enum);
  assert.equal(Object.keys(STATUS_META).length,5);
  assert.equal(Object.keys(ITEM_STATUS_META).length,7);
  assert.equal(ITEM_STATUS_META.waiting,undefined);
  assert.notEqual(ITEM_STATUS_META.obsolete.tone,ITEM_STATUS_META.discontinued.tone);
});

test('retirement status and metadata form one undoable edit and clear together on reopening',()=>{
  const report={schema_version:'1.0',scope_id:'scope',report_id:'status',title:'Status',updated_at:'2026-11-09T00:00:00Z',tasks:[{id:'card',title:'Card',summary:'Summary',status:'planned',completed_items:[],pending_items:[{id:'work',title:'Work'}]}]};
  const session=createReportEditorSession(report);
  const command={type:'set-item-status',taskId:'card',field:'pending_items',itemId:'work'};
  assert.throws(()=>session.dispatch({...command,status:'obsolete'}));
  assert.equal(session.dirty,false);
  session.dispatch({...command,status:'obsolete',retirement:{replaced_by:{document:'Documentation/Plan.md#replacement'},reason:'Context'}});
  assert.equal(session.task('card').pending_items[0].retirement.reason,'Context');
  session.undo();assert.equal(session.task('card').pending_items[0].retirement,undefined);
  session.redo();assert.equal(session.task('card').pending_items[0].status,'obsolete');
  session.dispatch({...command,status:'discontinued',retirement:{reason:'  No longer needed  '}});
  assert.deepEqual(session.task('card').pending_items[0].retirement,{reason:'No longer needed'});
  session.dispatch({...command,status:'planned'});
  assert.equal(session.task('card').pending_items[0].retirement,undefined);
  assert.deepEqual(session.validate(),[]);
  assert.equal(report.tasks[0].pending_items[0].status,undefined);
});

test('replacement document is relative and retirement reasons are required',()=>{
  const policy=globalThis.TaskProgressItemStatusPolicy;
  for(const document of ['../outside.md','C:\\outside.md','/outside.md','#section'])assert.throws(()=>policy.prepare('obsolete',{replaced_by:{document}}));
  assert.throws(()=>policy.prepare('discontinued',{reason:'   '}));
  assert.throws(()=>policy.prepare('waiting'));
});
