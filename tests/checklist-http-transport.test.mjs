import assert from "node:assert/strict";
import test from "node:test";
import { createChecklistHttpTransport } from "../viewer/assets/checklist-http-transport.js";

test("Browser reset posts the confirmed targets and returns the saved snapshot", async () => {
  const targets = [{ workItemId: 3, checkIndex: 0 }, { workItemId: 8, checkIndex: 2 }];
  const snapshot = { revision: "after-reset", items: [] };
  const requests = [];
  const transport = createChecklistHttpTransport({
    scope: "scope a", task: "task/b",
    fetchImpl: async (url, options) => {
      requests.push({ url, options });
      return { ok: true, json: async () => ({ type: "result", payload: snapshot }) };
    },
  });

  assert.deepEqual(await transport.reset({ targets }), snapshot);
  assert.equal(requests.length, 1);
  const { url, options } = requests[0];
  assert.equal(url, "/__taskprogress/v1/checklists/scope%20a/task%2Fb");
  assert.equal(options.method, "POST");
  assert.equal(options.headers["X-TaskProgress-Editor"], "1");
  assert.equal(options.headers.Authorization, undefined);
  const body = JSON.parse(options.body);
  assert.equal(body.version, 1);
  assert.equal(body.type, "reset");
  assert.deepEqual(body.payload, { targets });
});

test("reset preserves the difference between omitted and empty targets", async () => {
  const payloads = [];
  const transport = createChecklistHttpTransport({
    scope: "scope", task: "task",
    fetchImpl: async (_url, options) => {
      payloads.push(JSON.parse(options.body).payload);
      return { ok: true, json: async () => ({ type: "result", payload: {} }) };
    },
  });
  await transport.reset();
  await transport.reset({ targets: [] });
  assert.deepEqual(payloads, [{}, { targets: [] }]);
});

test("reset propagates bridge rejection without retrying the write", async () => {
  let requests = 0;
  const transport = createChecklistHttpTransport({
    scope: "scope", task: "task",
    fetchImpl: async () => {
      requests += 1;
      return { ok: true, json: async () => ({
        type: "error", error: { code: "invalid_request", message: "Agent check is read-only" },
      }) };
    },
  });
  await assert.rejects(transport.reset({ targets: [{ workItemId: 1, checkIndex: 0 }] }), {
    code: "invalid_request", message: "Agent check is read-only",
  });
  assert.equal(requests, 1);
});
