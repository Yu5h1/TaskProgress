import assert from 'node:assert/strict';
import test from 'node:test';
import { loadTemplates, handlers } from './helpers/web-ui-template.mjs';
const { historyTools } = await loadTemplates('common');
const history = { undoDepth: 1, redoDepth: 0, entries: [{ id: 1, label: 'Changed title', applied: true }], canUndo: true, canRedo: false, canClear: true };
test('shared history routes available actions without modifying the host snapshot', () => {
  const snapshot = structuredClone(history), calls = [];
  const result = historyTools({ history, onUndo: () => calls.push('undo'), onRedo: () => calls.push('redo'), onClear: () => calls.push('clear') });
  const request = handlers(result, 'history-request')[0].callback;
  for (const action of ['undo', 'redo', 'clearHistory', 'unknown']) request({ detail: { action } });
  assert.deepEqual(calls, ['undo', 'clear']);
  assert.deepEqual(history, snapshot);
});
test('disabled history blocks callbacks; panel state reaches the refresh guard', () => {
  const calls = [], open = [];
  const result = historyTools({ history, disabled: true, onUndo: () => calls.push('undo'), onClear: () => calls.push('clear'), onOpenChange: value => open.push(value) });
  const request = handlers(result, 'history-request')[0].callback;
  request({ detail: { action: 'undo' } }); request({ detail: { action: 'clearHistory' } });
  const change = handlers(result, 'history-open-change')[0].callback;
  change({ detail: { open: true } }); change({ detail: { open: false } });
  assert.deepEqual(calls, []);
  assert.deepEqual(open, [true, false]);
});
