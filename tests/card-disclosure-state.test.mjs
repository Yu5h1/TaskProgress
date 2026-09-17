import test from 'node:test';
import assert from 'node:assert/strict';
import { loadDisclosure, saveDisclosure } from '../viewer/assets/card-disclosure-state.js';
test('restore mixed disclosure after reload, isolate documents, reset overrides on global toggle', () => {
  const data = new Map();
  const storage = { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
  saveDisclosure('a', false, { one: true, two: false }, storage);
  assert.deepEqual(loadDisclosure('a', storage), { expanded: false, overrides: { one: true, two: false } });
  assert.deepEqual(loadDisclosure('b', storage), { expanded: true, overrides: {} });
  saveDisclosure('a', true, {}, storage);
  assert.deepEqual(loadDisclosure('a', storage), { expanded: true, overrides: {} });
});
test('blocked or corrupt storage safely defaults', () => {
  assert.deepEqual(loadDisclosure('a', { getItem: () => '{broken' }), { expanded: true, overrides: {} });
  assert.doesNotThrow(() => saveDisclosure('a', false, {}, { setItem: () => { throw Error('blocked'); } }));
});
