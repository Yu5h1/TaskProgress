// Both renderers use the existing exact-file bridge; no HTTP scope is needed on Desktop.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createDocumentTransport } from '../viewer/assets/document-transport.js';

function bridge() {
  const sent = [];
  let receive;
  return { sent, postMessage: message => sent.push(message), addEventListener: (_, listener) => { receive = listener; }, reply: data => receive({ data }) };
}
test('Desktop Checklist preserves correlation and save-conflict semantics without an HTTP scope', async () => {
  const webview = bridge(), transport = createDocumentTransport('checklist', { webview, params: new URLSearchParams() });
  const loaded = transport.load(), saved = transport.save({ revision: 'old', results: [] });
  webview.reply({ version: 1, id: webview.sent[1].id, type: 'error', error: { code: 'source_conflict', message: 'changed' } });
  await assert.rejects(saved, error => error.code === 'source_conflict');
  webview.reply({ version: 1, id: webview.sent[0].id, type: 'result', payload: { revision: 'new' } });
  assert.deepEqual(await loaded, { revision: 'new' });
  assert.deepEqual(webview.sent.map(x => x.type), ['load', 'save']);
  assert.ok(webview.sent.every(x => !('path' in x)));
});
test('Desktop Decision retains original request identity for ambiguous-save retry', async () => {
  const webview = bridge(), transport = createDocumentTransport('decisions', { webview, params: new URLSearchParams() });
  const body = { operation: 'select', request_id: 'stable-request', expected_revision: 'v1' };
  for (let i = 0; i < 2; i++) {
    const response = transport.request(body);
    webview.reply({ request_id: 'unrelated', ok: true });
    webview.reply({ request_id: body.request_id, ok: true, revision: 'v2' });
    assert.equal((await response).revision, 'v2');
  }
  assert.deepEqual(webview.sent, [body, body]);
});
test('Browser documents keep HTTP scope validation and reject unknown surface kinds', () => {
  for (const kind of ['checklist', 'decisions']) assert.throws(() => createDocumentTransport(kind, { params: new URLSearchParams(), webview: null }));
  assert.throws(() => createDocumentTransport('other'), /Unsupported/);
});
