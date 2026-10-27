import assert from 'node:assert/strict';
import test from 'node:test';
import { loadTemplates, markup, view, handlers } from './helpers/web-ui-template.mjs';
const { historyTools } = await loadTemplates('common');
const history = { undoDepth: 1, redoDepth: 0, entries: [{ id: 1, label: 'Changed title', applied: true }], canUndo: true, canRedo: false, canClear: true };
test('the history trigger names the actual dialog and renders its cursor', () => {
  const current = view(); current.state.history = true;
  const result = markup(historyTools({ history }, current));
  assert.match(result, /aria-controls="history-dialog"/u);
  assert.match(result, /id="history-dialog"/u);
  assert.match(result, /Changed title/u);
  assert.match(result, /aria-current="step"/u);
});
test('clearing history requires a separate confirmation state', () => {
  const current = view(); current.state.history = true;
  const baseline = structuredClone(history);
  let clearCount = 0;
  const render = () => historyTools({ history, onClear: () => { clearCount++; } }, current);
  const click = label => {
    const handler = handlers(render(), 'click').find(item => item.after.includes(`>${label}</button>`));
    assert.ok(handler, `missing ${label} action`);
    handler.callback();
  };
  assert.doesNotMatch(markup(render()), /確認清除歷史/u);
  click('清除歷史…');
  assert.match(markup(render()), /確認清除歷史/u);
  assert.equal(clearCount, 0);
  click('取消');
  assert.equal(clearCount, 0);
  assert.doesNotMatch(markup(render()), /確認清除歷史/u);
  click('清除歷史…');
  click('確認清除歷史');
  assert.equal(clearCount, 1);
  assert.doesNotMatch(markup(render()), /確認清除歷史/u);
  assert.deepEqual(history, baseline, 'the template dispatches the action without editing the host snapshot');
});
