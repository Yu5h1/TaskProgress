import assert from 'node:assert/strict';
import test from 'node:test';
import { loadTemplates, markup, view } from './helpers/web-ui-template.mjs';
const { progressSummary } = await loadTemplates('common');
test('summary displays supplied counts without deriving domain state', () => {
  const result = markup(progressSummary({ bar: { form: 'continuous', ratio: 0.4 }, caption: '2 / 5 checks', note: 'One failed' }));
  assert.match(result, /2 \/ 5 checks/u);
  assert.match(result, /One failed/u);
  assert.match(result, /\.value="40"/u);
});
test('summary omits absent notes and delegates segmented cells to the shared bar', () => {
  const result = markup(progressSummary({ bar: { cells: ['passed'] }, caption: 'Complete' }));
  assert.match(result, /progress-tone-passed/u);
  assert.doesNotMatch(result, /progress-note/u);
});
