import test from 'node:test';
import assert from 'node:assert/strict';
import { taskItemStack } from '../viewer/assets/item-stack.js';
import { recordTerminalTransitions, recordUserActivity, terminalActivityTime, appendActivity } from '../viewer/assets/item-activity.js';
import { createReportEditorSession } from '../viewer/assets/editor-core.js';

const at='2026-11-09T00:00:00.000Z';
const item=(id,status,priority=2)=>({id,title:id,status,priority,...(status==='discontinued'?{retirement:{reason:'Dropped'}}:{})});
const report=()=>({schema_version:'1.0',scope_id:'test',report_id:'test',title:'Test',updated_at:at,tasks:[{id:'card',title:'Card',summary:'Test',status:'planned',pending_items:[item('live','planned'),item('drop','planned'),item('done','planned')],completed_items:[]}]});
const ids=task=>taskItemStack(task).closed.map(row=>row.item.id);

test('terminal rows are projected together, with raw source fields and priority-independent order',()=>{
  const task={pending_items:[item('retired','discontinued',0),item('live','planned',3),item('replaced','obsolete',0)],completed_items:[item('done','done',3)]};
  const snapshot=structuredClone(task), stack=taskItemStack(task);
  assert.deepEqual(stack.pending.map(i=>i.id),['live']);
  assert.deepEqual(stack.closed.map(row=>[row.item.id,row.field]),[['done','completed_items'],['retired','pending_items'],['replaced','pending_items']]);
  assert.deepEqual(task,snapshot,'displaying never migrates or mutates source data');
});

test('mixed terminal transitions within a cautious draft keep sequence through Undo, Redo and Save',()=>{
  const before=report(), session=createReportEditorSession(before);
  session.dispatch({type:'set-item-status',taskId:'card',field:'pending_items',itemId:'done',status:'done'});
  session.dispatch({type:'set-item-status',taskId:'card',field:'pending_items',itemId:'drop',status:'discontinued',retirement:{reason:'Dropped'}});
  assert.deepEqual(ids(session.draft.tasks[0]),['drop','done']);
  session.undo();assert.deepEqual(ids(session.draft.tasks[0]),['done']);
  session.redo();assert.deepEqual(ids(session.draft.tasks[0]),['drop','done']);
  const saved=recordUserActivity(before,session.draft,'2030-01-01T00:00:00Z');
  assert.deepEqual(ids(saved.tasks[0]),['drop','done']);
  assert.equal(terminalActivityTime(saved.tasks[0].pending_items.find(i=>i.id==='drop')),terminalActivityTime(session.draft.tasks[0].pending_items.find(i=>i.id==='drop')),'save preserves transition time instead of assigning save time');
  assert.deepEqual(before,report());
});

test('same-clock transitions stay ordered; ordinary edits cannot advance the terminal timestamp or prune it',()=>{
  const before=report();
  let next=structuredClone(before);next.tasks[0].pending_items[1]={...item('drop','discontinued')};
  next=recordTerminalTransitions(before,next,at);
  let newer=structuredClone(next);const done=newer.tasks[0].pending_items.pop();done.status='done';newer.tasks[0].completed_items.unshift(done);
  newer=recordTerminalTransitions(next,newer,at);
  assert.deepEqual(ids(newer.tasks[0]),['done','drop']);
  const drop=newer.tasks[0].pending_items.find(i=>i.id==='drop'), stamp=terminalActivityTime(drop);
  for(let i=0;i<8;i++) drop.activity=appendActivity(drop.activity,{event:'updated',actor:'user',at:`2030-01-01T00:00:0${i}Z`});
  drop.priority=0;drop.title='Renamed';drop.retirement.reason='Edited reason';
  assert.equal(terminalActivityTime(drop),stamp);assert.deepEqual(ids(newer.tasks[0]),['done','drop']);
  const oldDone=newer.tasks[0].completed_items[0], doneStamp=terminalActivityTime(oldDone);
  for(let i=0;i<8;i++)oldDone.activity=appendActivity(oldDone.activity,{event:'updated',actor:'user',at:`2030-01-01T00:00:0${i}Z`});
  assert.equal(terminalActivityTime(oldDone),doneStamp);
});

test('reopening returns to live rows; re-retiring gets a fresh position while legacy rows stay stable',()=>{
  const session=createReportEditorSession(report());
  const change=status=>session.dispatch({type:'set-item-status',taskId:'card',field:'pending_items',itemId:'drop',status,...(status==='discontinued'?{retirement:{reason:'Dropped'}}:{})});
  change('discontinued');const first=terminalActivityTime(session.draft.tasks[0].pending_items[1]);
  change('planned');assert.equal(taskItemStack(session.draft.tasks[0]).closed.length,0);
  change('discontinued');assert.ok(terminalActivityTime(session.draft.tasks[0].pending_items[1])>=first);
  const legacy={pending_items:[item('a','discontinued'),item('b','obsolete')],completed_items:[item('c','done'),item('d','done')]};
  assert.deepEqual(ids(legacy),['c','d','a','b']);
});

test('reopening cannot reuse a terminal timestamp even at the same clock value',()=>{
  const before=report(), changed=structuredClone(before);
  changed.tasks[0].pending_items[1]=item('drop','discontinued');
  const first=recordTerminalTransitions(before,changed,at);
  const reopened=structuredClone(first);reopened.tasks[0].pending_items[1].status='planned';delete reopened.tasks[0].pending_items[1].retirement;
  const second=structuredClone(reopened);second.tasks[0].pending_items[1]= {...second.tasks[0].pending_items[1],status:'discontinued',retirement:{reason:'Again'}};
  const restamped=recordTerminalTransitions(reopened,second,at);
  assert.ok(terminalActivityTime(restamped.tasks[0].pending_items[1])>terminalActivityTime(first.tasks[0].pending_items[1]));
  assert.equal(terminalActivityTime(recordUserActivity(first,restamped,at).tasks[0].pending_items[1]),terminalActivityTime(restamped.tasks[0].pending_items[1]));
  const unstamped=recordUserActivity(reopened,second,at);
  assert.ok(terminalActivityTime(unstamped.tasks[0].pending_items[1])>terminalActivityTime(first.tasks[0].pending_items[1]),'save without a core marker must not reuse a prior cycle');
});

test('implicit completed field status does not create a new transition on repeated done',()=>{
  const before=report();before.tasks[0].completed_items=[{id:'implicit',title:'Implicit',activity:[{event:'done',actor:'codex',at}]}];
  const next=structuredClone(before);next.tasks[0].completed_items[0].status='done';
  const staged=recordTerminalTransitions(before,next,at);
  assert.equal(terminalActivityTime(staged.tasks[0].completed_items[0]),Date.parse(at));
  assert.equal(staged.tasks[0].completed_items[0].activity.length,1);
  const saved=recordUserActivity(before,staged,'2030-01-01T00:00:00Z');
  assert.equal(saved.tasks[0].completed_items[0].activity.at(-1).event,'updated');
  assert.equal(terminalActivityTime(saved.tasks[0].completed_items[0]),Date.parse(at));
  const unchanged=recordUserActivity(before,before,'2030-01-01T00:00:00Z');
  assert.deepEqual(unchanged,before);
});
