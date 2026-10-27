import test from 'node:test';
import assert from 'node:assert/strict';
import { enabledAction } from '../ui/web-workflow/enabled-action.mjs';

test('capability transitions install once, forward current options and dispose active work', () => {
  const calls = [], node = {};
  const action = enabledAction((host, options) => {
    assert.equal(host, node); calls.push(['create', options.value]);
    return { update: next => calls.push(['update', next.value]), destroy: () => calls.push(['destroy']) };
  })(node, { enabled: false, value: 1 });
  action.update({ enabled: false, value: 2 });
  assert.deepEqual(calls, []);
  action.update({ enabled: true, value: 3 });
  action.update({ enabled: true, value: 4 });
  action.update({ enabled: false });
  action.update({ enabled: false });
  action.update({ enabled: true, value: 5 });
  action.destroy(); action.destroy();
  assert.deepEqual(calls, [['create',3],['update',4],['destroy'],['create',5],['destroy']]);
});

test('default-on reorder and explicit-on hold capabilities keep distinct defaults', () => {
  let active = 0;
  const factory = () => { active++; return { destroy() { active--; } }; };
  const reorder = enabledAction(factory)({}, {});
  const hold = enabledAction(factory, options => !!options.enabled)({}, {});
  assert.equal(active, 1);
  hold.update({ enabled: true }); assert.equal(active, 2);
  reorder.destroy(); hold.destroy(); assert.equal(active, 0);
});
