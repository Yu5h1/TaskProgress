import assert from 'node:assert/strict';
import test from 'node:test';
import { loadTemplates, markup, view } from './helpers/web-ui-template.mjs';
const { marker } = await loadTemplates('common');
test('markers expose the supplied status with an accessible name', () => {
  for (const status of ['pending', 'passed', 'failed']) {
    const result = markup(marker(status, 'Check'));
    assert.ok(result.includes(`marker-${status}`));
    assert.match(result, /role="img"/u);
    assert.match(result, /Check/u);
    assert.doesNotMatch(result, /<button/u);
  }
});
test('only a supplied cycle action creates an interactive marker', () => {
  assert.equal((markup(marker('pending', 'Manual', () => {})).match(/<button/gu) ?? []).length, 1);
  assert.doesNotMatch(markup(marker('pending', 'Agent')), /<button/u);
});
test('invalid recorded results remain distinguishable from a fresh result', () => {
  assert.match(markup(marker('pending', 'Check', null, true)), /marker-stale/u);
  assert.doesNotMatch(markup(marker('pending', 'Check')), /marker-stale/u);
});

const { Checklist } = await loadTemplates('checklist');
function renderCheck(check, preceding = [], busy = false) {
  const item = { id: 1, checks: [...preceding, check] };
  const app = Object.assign(Object.create(Checklist.prototype), { data: { document: { items: [item] } }, editable: true, resetBusy: busy });
  return markup(app.check(item, { index: 0, title: 'Check', action: '', expect: '', ...check }));
}
test('Checklist permits manual results only after prerequisites and blocks changes during reset', () => {
  const manual = { isManual: true, status: 'pending' };
  assert.match(renderCheck(manual), /marker-box-button/u);
  assert.doesNotMatch(renderCheck(manual, [{ status: 'pending' }]), /marker-box-button/u);
  assert.doesNotMatch(renderCheck(manual, [], true), /marker-box-button/u);
  assert.doesNotMatch(renderCheck({ status: 'pending' }), /marker-box-button/u);
});
test('failed tagged checks expose one Observed editor while agent checks remain read-only', () => {
  for (const tag of ['isManual', 'isAcceptance']) {
    assert.equal((renderCheck({ [tag]: true, status: 'failed' }).match(/<textarea/gu) ?? []).length, 1);
  }
  assert.doesNotMatch(renderCheck({ status: 'failed', observed: 'Diagnostic' }), /<textarea/u);
});
