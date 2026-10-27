import test from 'node:test';
import assert from 'node:assert/strict';
import { createActionQueue } from '../ui/web-workflow/action-queue.mjs';

test('coalesces a render batch and reads the latest options', () => {
  const jobs = [], seen = [], queue = createActionQueue(job => jobs.push(job));
  const action = { value: 1, flush() { seen.push(this.value); } };
  queue.add(action); action.value = 2; queue.add(action);
  assert.equal(jobs.length, 1); jobs.shift()(); assert.deepEqual(seen, [2]);
});
test('cancels disconnected work, including cancellation during a batch', () => {
  const jobs = [], queue = createActionQueue(job => jobs.push(job));
  const cancelled = { flush() { assert.fail('cancelled action ran'); } };
  queue.add(cancelled); queue.delete(cancelled); jobs.shift()();
  queue.add({ flush() { queue.delete(cancelled); } }); queue.add(cancelled);
  jobs.shift()();
});
test('new reentrant work runs in a subsequent microtask and failures do not skip peers', () => {
  const jobs = [], seen = [], queue = createActionQueue(job => jobs.push(job));
  const later = { flush() { seen.push('later'); } };
  queue.add({ flush() { queue.add(later); throw new Error('factory'); } });
  queue.add({ flush() { seen.push('peer'); } });
  jobs.shift()(); assert.deepEqual(seen, ['peer']);
  jobs.shift()(); assert.deepEqual(seen, ['peer', 'later']);
  assert.throws(jobs.shift(), /factory/);
});
test('a peer requeued before its turn consumes its latest state once', () => {
  const jobs = [], seen = [], queue = createActionQueue(job => jobs.push(job));
  const peer = { value: 1, flush() { seen.push(this.value); } };
  queue.add({ flush() { queue.delete(peer); peer.value = 2; queue.add(peer); } }); queue.add(peer);
  while (jobs.length) jobs.shift()();
  assert.deepEqual(seen, [2]);
});
