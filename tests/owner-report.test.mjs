import assert from "node:assert/strict";
import test from "node:test";
import { loadOwnerReport } from "../viewer/assets/owner-report.js";
import { createChecklistHttpTransport } from "../viewer/assets/checklist-http-transport.js";
import { createDecisionHttpTransport, createDecisionDesktopTransport } from "../viewer/assets/decision-transport.js";

const report = { scope_id: "task-progress", title: "TaskProgress", tasks: [] };
const response = value => ({ ok: true, json: async () => value });

test("owner links return to the Report root and read fresh matching scope metadata", async () => {
  const fetchImpl = async (url, options) => {
    assert.equal(url, "../reports/task-progress/report.json");
    assert.equal(options.cache, "no-store");
    assert.ok(options.signal instanceof AbortSignal);
    return response(report);
  };
  assert.deepEqual(await loadOwnerReport("task-progress", fetchImpl), {
    title: "TaskProgress", href: "/?scope=task-progress",
  });
  const transport = createChecklistHttpTransport({ scope: "task-progress", task: "history-tools", fetchImpl });
  assert.deepEqual(await transport.loadOwnerReport(), await loadOwnerReport("task-progress", fetchImpl));
});

test("missing, mismatched, malformed and unavailable reports omit optional navigation", async () => {
  for (const value of [null, {}, {...report, scope_id: "other"}, {...report, title: " "}, {...report, tasks: null}]) {
    assert.equal(await loadOwnerReport("task-progress", async () => response(value)), null);
  }
  assert.equal(await loadOwnerReport("task-progress", async () => ({ok: false})), null);
  assert.equal(await loadOwnerReport("task-progress", async () => { throw new Error("offline"); }), null);
  assert.equal(await loadOwnerReport("task-progress", async () => ({ok: true, json: async () => { throw new Error("invalid JSON"); }})), null);
  assert.equal(await loadOwnerReport("../other", () => { assert.fail("invalid scope must not fetch"); }), null);
});

test("Decision HTTP transport resolves its scope; Desktop has no inferred owner", async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => response(report);
    assert.deepEqual(await createDecisionHttpTransport("task-progress", "history-tools").loadOwnerReport(), {
      title: "TaskProgress", href: "/?scope=task-progress",
    });
    assert.equal(createDecisionDesktopTransport({addEventListener() {}}).loadOwnerReport, undefined);
  } finally { globalThis.fetch = original; }
});
