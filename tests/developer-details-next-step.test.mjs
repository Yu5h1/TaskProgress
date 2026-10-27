import assert from 'node:assert/strict';
import test from 'node:test';
import { loadTemplates, markup, view } from './helpers/web-ui-template.mjs';
const { developer } = await loadTemplates('viewer');
test('an empty developer overlay renders nothing', () => {
  for (const data of [null, {}, { next_steps: [], blockers: [], decisions: [], routes: [] }]) assert.equal(markup(developer(data)), '');
});
test('the next step prefers the current field and accepts legacy first steps', () => {
  assert.match(markup(developer({ next_step: 'Current', next_steps: ['Later'] })), /Current/u);
  assert.match(markup(developer({ next_steps: ['Legacy'] })), /Legacy/u);
});
test('blockers render without inventing a next-step placeholder', () => {
  const result = markup(developer({ blockers: ['Waiting for approval'] }));
  assert.match(result, /Waiting for approval/u);
  assert.doesNotMatch(result, /developer-next-action|尚未指定下一步/u);
});
