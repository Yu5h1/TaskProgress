import assert from 'node:assert/strict';
import test from 'node:test';
import { loadTemplates, markup, view } from './helpers/web-ui-template.mjs';
const { pointer } = await loadTemplates('viewer');
const task = { id: 'child', title: 'Child report', kind: 'report_pointer' };
const card = { summary: 'Child summary', status: 'in_progress', progress: { completed: 1, total: 2, percentage: 50 }, rows: [{ title: 'Nested pointer' }, { title: 'Ready', status: 'done' }] };
const render = state => markup(pointer({ editing: true, pointerCards: { child: state } }, task, {}));
test('pointer loading and error states never display stale ready projections', () => {
  assert.match(render({ status: 'loading', card }), /role="status"/u);
  assert.doesNotMatch(render({ status: 'loading', card }), /Child summary/u);
  const failed = render({ status: 'error', card, message: 'Unavailable' });
  assert.match(failed, /Unavailable/u);
  assert.doesNotMatch(failed, /Child summary/u);
});
test('ready pointers preserve links, projected status and accessible progress', () => {
  const result = render({ status: 'ready', card, openHref: '?scope=child' });
  assert.match(result, /href="\?scope=child"/u);
  assert.match(result, /Child summary/u);
  assert.match(result, /aria-label="子任務完成 1，共 2"/u);
  assert.match(result, /指路/u);
  assert.match(result, /aria-labelledby="task-child-title"/u);
});
test('pointer cards remain read-only even when the surrounding report is editable', () => {
  assert.doesNotMatch(render({ status: 'ready', card }), /<input|<textarea|<select|spike-add-button|inline-delete/u);
});
