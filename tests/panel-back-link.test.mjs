import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

// Bootstrap's UI/theme imports are not used by the native link factory.
const source = (await readFile(new URL('../ui/web-workflow/bootstrap.mjs', import.meta.url), 'utf8'))
  .replace(/^import .*;\r?\n/gm, '');
const { createBackLink } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

test('headers use fixed owner or Scopes destinations even with same-origin history', () => {
  const previous = Object.fromEntries(['document', 'location', 'history'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  let backCalls = 0;
  const element = () => ({ attributes: {}, children: [], listeners: {}, setAttribute(key, value) { this.attributes[key] = value; }, append(child) { this.children.push(child); }, addEventListener(key, handler) { this.listeners[key] = handler; } });
  try {
    globalThis.document = { createElement: element, createElementNS: element, referrer: 'http://localhost/decisions/?scope=other' };
    globalThis.location = { origin: 'http://localhost' };
    globalThis.history = { length: 4, back() { backCalls++; } };
    const owner = { href: '/?scope=ux', title: 'Yu5h1Lib.UX' };
    const link = createBackLink(owner);
    assert.equal(link.href, owner.href);
    assert.equal(link.attributes['aria-label'], '回到 Yu5h1Lib.UX');
    assert.equal(link.listeners.click, undefined, 'ordinary link navigation must not be replaced by history.back');
    assert.equal(backCalls, 0);

    const report = createBackLink();
    assert.equal(report.href, '/');
    assert.equal(report.attributes['aria-label'], '回到 Scopes 入口');
    assert.equal(report.listeners.click, undefined, 'Report must not return to browser history');
    assert.equal(backCalls, 0);
    assert.equal(report.children[0].attributes['aria-hidden'], 'true');
  } finally {
    for (const [key, descriptor] of Object.entries(previous)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
});
