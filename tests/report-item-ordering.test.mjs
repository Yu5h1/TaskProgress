// Render the real shared card so an unconnected sorting helper cannot pass these checks.
import assert from "node:assert/strict";
import test, { before, after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { createReportEditorAdapter } from "../viewer/assets/report-editor-adapter.js";
import "../viewer/assets/priority-policy.js";

let server;
let TaskCard;
let render;
before(async () => {
  server = await createServer({
    configFile: false, plugins: [svelte()],
    resolve: { alias: { "@editor": fileURLToPath(new URL("../viewer/assets", import.meta.url)) } },
    server: { middlewareMode: true, watch: null },
  });
  TaskCard = (await server.ssrLoadModule("/experiments/editor-svelte-spike/src/TaskCard.svelte")).default;
  ({ render } = await server.ssrLoadModule("svelte/server"));
});
after(async () => { await server?.close(); });

function fixture() {
  return {
    schema_version: "1.0", report_id: "ordering", scope_id: "ordering",
    title: "Ordering", updated_at: "2026-10-13T00:00:00Z",
    tasks: [{ id: "work", title: "Work", summary: "Summary", status: "in_progress",
      pending_items: [
        { id: "alpha", title: "PendingAlpha" },
        { id: "beta", title: "PendingBeta", priority: 1 },
        { id: "gamma", title: "PendingGamma", priority: 4, status: "in_progress" },
      ],
      completed_items: [
        { id: "new", title: "CompletedNewest", status: "done", priority: 4 },
        { id: "old", title: "CompletedOldest", status: "done", priority: 0 },
      ],
    }],
  };
}

function card(task, editing = true) {
  return render(TaskCard, { props: {
    task, editing, progress: { completed: 2, total: 5 },
    policy: globalThis.TaskProgressPriorityPolicy, onCommand() {}, onAddItem() {},
  } }).body;
}

function assertOrder(html, titles) {
  let previous = -1;
  for (const title of titles) {
    const index = html.indexOf(title);
    assert.ok(index > previous, `${title} must follow previous item`);
    previous = index;
  }
}

test("TaskCard sorts pending only, preserves same-priority source order and completed stack", () => {
  const task = fixture().tasks[0];
  const original = structuredClone(task);
  const html = card(task);
  assertOrder(html, ["PendingBeta", "PendingAlpha", "PendingGamma"]);
  assert.ok(html.includes("CompletedNewest"));
  assert.ok(!html.includes("CompletedOldest"));
  assert.deepEqual(task, original);
  task.pending_items[1].priority = 4;
  assertOrder(card(task), ["PendingAlpha", "PendingBeta", "PendingGamma"]);
  task.pending_items = [task.pending_items[2], ...task.pending_items.slice(0, 2)];
  assertOrder(card(task), ["PendingGamma", "PendingAlpha", "PendingBeta"]);
});

test("priority edit, undo, redo and save/reload project the same stable IDs without rewriting array order", () => {
  const adapter = createReportEditorAdapter(fixture());
  const current = () => adapter.snapshot().report.tasks[0];
  adapter.dispatch({ type: "set-item-field", taskId: "work", field: "pending_items",
    itemId: "gamma", property: "priority", value: 0 });
  assertOrder(card(current(), true), ["PendingGamma", "PendingBeta", "PendingAlpha"]);
  assert.deepEqual(current().pending_items.map(item => item.id), ["alpha", "beta", "gamma"]);
  adapter.undo();
  assertOrder(card(current()), ["PendingBeta", "PendingAlpha", "PendingGamma"]);
  adapter.redo();
  const saved = adapter.prepareSave();
  assert.deepEqual(saved.errors, []);
  adapter.commit(saved.report);
  const reloaded = createReportEditorAdapter(JSON.parse(JSON.stringify(saved.report)));
  assertOrder(card(reloaded.snapshot().report.tasks[0]), ["PendingGamma", "PendingBeta", "PendingAlpha"]);
});
