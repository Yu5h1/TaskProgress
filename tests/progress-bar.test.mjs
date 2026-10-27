import assert from 'node:assert/strict';
import test from 'node:test';
import { loadTemplates, markup, view } from './helpers/web-ui-template.mjs';
const { progressBar } = await loadTemplates('common');
test('continuous progress clamps input to an accessible native meter', () => {
  for (const [ratio, percent] of [[-1, 0], [0.25, 25], [2, 100]]) {
    const result = markup(progressBar({ form: 'continuous', ratio, label: 'Completion' }));
    assert.match(result, /<progress/u);
    assert.ok(result.includes(`.value="${percent}"`));
    assert.match(result, /aria-label="Completion"/u);
  }
});
test('segmented progress preserves each supplied cell and its status', () => {
  const result = markup(progressBar({ cells: ['passed', 'failed'] }));
  assert.match(result, /progress-tone-passed/u);
  assert.match(result, /progress-tone-failed/u);
  assert.ok(result.indexOf('progress-tone-passed') < result.indexOf('progress-tone-failed'));
  assert.doesNotMatch(result, /<progress/u);
});
