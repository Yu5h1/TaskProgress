import test from 'node:test';
import assert from 'node:assert/strict';
import { cardPriorityGroup, moveReportCard } from '../viewer/assets/card-reorder.js';
import { createReportEditorSession } from '../viewer/assets/editor-core.js';
import { stableSortTasksByPriority } from '../viewer/assets/report-model.js';

const card = (id, priority = 2, lead = 2) => ({ id, title:id, status:'planned', priority, completed_items:[], pending_items:[{id:'work',title:'Work',priority:lead}] });
const report = () => ({schema_version:'1.0',scope_id:'card-order',report_id:'card-order',title:'Order',updated_at:'2026-11-08T00:00:00Z',tasks:[card('a'),card('hidden'),card('urgent',0),card('b'),card('c')]});
const ids = report => report.tasks.map(task => task.id);

test('forward source move preserves hidden and other-priority slots, card contents and original input', () => {
  const original = report(), before = structuredClone(original);
  const moved = moveReportCard(original, {taskId:'c',position:{before:'a'},visibleIds:['a','b','c']});
  assert.deepEqual(ids(moved), ['c','hidden','urgent','a','b']);
  for (const task of moved.tasks) assert.deepEqual(task, original.tasks.find(source => source.id===task.id));
  assert.deepEqual(original,before);
  assert.deepEqual(stableSortTasksByPriority(moved.tasks).map(task=>task.id), ['urgent','c','hidden','a','b']);
});

test('source moves respect card priority but ignore differences in child priority', () => {
  const original=report(); original.tasks.push(card('urgent-child',2,0));
  assert.throws(()=>moveReportCard(original,{taskId:'a',position:{before:'urgent'}}), /相同優先級/);
  assert.equal(cardPriorityGroup(card('a')),cardPriorityGroup(card('a',2,0)));
  const moved=moveReportCard(original,{taskId:'urgent-child',position:{before:'a'}});
  assert.equal(stableSortTasksByPriority(moved.tasks).findIndex(task=>task.id==='urgent-child'),1);
  assert.equal(moved.tasks.find(task=>task.id==='urgent-child').pending_items[0].priority,0);
  assert.deepEqual(original.tasks.at(-1),card('urgent-child',2,0));
  assert.equal(cardPriorityGroup({id:'legacy'}),cardPriorityGroup(card('explicit',4,4)));
});

test('invalid or stale source reorder requests are rejected without changing the report', () => {
  const original=report(), before=structuredClone(original);
  for (const command of [
    {taskId:'a',position:{}}, {taskId:'a',position:{before:'b',after:'c'}},
    {taskId:'a',position:{before:'a'}}, {taskId:'missing',position:{before:'b'}},
    {taskId:'a',position:{after:'missing'}}, {taskId:'a',position:{before:'b'},visibleIds:['a']},
    {taskId:'a',position:{before:'b'},visibleIds:['a','b','a']},
    {taskId:'a',position:{before:'b'},visibleIds:['a','b','urgent']},
  ]) assert.throws(()=>moveReportCard(original,command));
  assert.deepEqual(original,before);
  assert.deepEqual(moveReportCard(original,{taskId:'a',position:{before:'hidden'}}),original);
});

test('draft source reorder is one undoable edit and does not affect priority or time estimates', () => {
  const original=report(), session=createReportEditorSession(original);
  session.dispatch({type:'reorder-task',taskId:'c',position:{before:'a'},visibleIds:['a','b','c']});
  assert.deepEqual(ids(session.draft), ['c','hidden','urgent','a','b']);
  assert.equal(session.dirty,true);
  assert.equal(session.derived.timeInvalidation.stale,false);
  session.undo(); assert.deepEqual(ids(session.draft),ids(original)); assert.equal(session.dirty,false);
  session.redo(); assert.deepEqual(ids(session.draft),['c','hidden','urgent','a','b']);
  const saved=session.prepareSave('2026-11-08T01:00:00Z');
  assert.deepEqual(ids(saved),ids(session.draft));
  session.discard(); assert.deepEqual(ids(session.draft),ids(original));
});
