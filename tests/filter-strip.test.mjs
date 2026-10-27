import assert from 'node:assert/strict';
import test from 'node:test';
import { loadTemplates, markup, view } from './helpers/web-ui-template.mjs';
const { filters } = await loadTemplates('common');
const categories = [{ id: 'a', label: 'First', count: 2 }, { id: 'b', label: 'Second', count: 0 }];
test('filters render the callers vocabulary and counts including zero', () => {
  const result = markup(filters({ categories, order: ['__default__', 'b', 'a'], selected: new Set(['a']) }));
  assert.match(result, /Second 0/u);
  assert.match(result, /First 2/u);
  assert.ok(result.indexOf('Second 0') < result.indexOf('First 2'));
});
test('selection updates even when the category objects are unchanged', () => {
  const render = selected => markup(filters({ categories, order: ['__default__', 'a', 'b'], selected, defaultLit: false }));
  const first = render(new Set(['a'])), second = render(new Set(['b']));
  assert.notEqual(first, second);
  assert.match(first, /aria-pressed="true"/u);
  assert.match(second, /aria-pressed="true"/u);
});
test('reordering remains opt-in and unknown order ids do not become categories', () => {
  const plain = markup(filters({ categories, order: ['__default__', 'a', 'b', 'gone'] }));
  assert.doesNotMatch(plain, /status-sortable|gone/u);
  assert.match(markup(filters({ categories, reorderable: true })), /status-sortable/u);
});
