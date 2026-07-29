import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

await import("../viewer/assets/priority-policy.js");
await import("../experiments/time-reference/demo/task-editing-model.js");

const model = globalThis.TimeTaskEditingModel;

test("classic demo scripts do not leak the priority policy binding", async () => {
  const policySource = await readFile(
    new URL("../viewer/assets/priority-policy.js", import.meta.url),
    "utf8",
  );
  const editingSource = await readFile(
    new URL("../experiments/time-reference/demo/task-editing-model.js", import.meta.url),
    "utf8",
  );
  const context = vm.createContext({});

  new vm.Script(policySource).runInContext(context);
  new vm.Script(editingSource).runInContext(context);

  assert.doesNotThrow(() => {
    new vm.Script("const priorityPolicy = globalThis.TaskProgressPriorityPolicy;")
      .runInContext(context);
  });
});

test("task descriptions trim surrounding whitespace and accept Unicode text", () => {
  assert.deepEqual(
    model.normalizeTaskDescription("  新增 API 驗證！  ", 300),
    {
      ok: true,
      cancelled: false,
      value: "新增 API 驗證！",
      error: "",
    },
  );
});

test("empty and whitespace-only descriptions cancel creation", () => {
  assert.equal(model.normalizeTaskDescription(" \n\t ", 300).cancelled, true);
  assert.equal(model.normalizeTaskDescription("", 300).cancelled, true);
});

test("symbol-only descriptions are rejected without treating them as empty", () => {
  const result = model.normalizeTaskDescription("✨…!!!", 300);
  assert.equal(result.ok, false);
  assert.equal(result.cancelled, false);
  assert.match(result.error, /文字或數字/);
});

test("description length respects the caller's schema limit", () => {
  const result = model.normalizeTaskDescription("abcd", 3);
  assert.equal(result.ok, false);
  assert.match(result.error, /3/);
});

test("generated item IDs satisfy the report ID shape and avoid collisions", () => {
  const first = model.createStableItemId([], "fixed-seed");
  const second = model.createStableItemId([first], "fixed-seed");
  assert.equal(first, "demo-item-fixed-seed");
  assert.equal(second, "demo-item-fixed-seed-2");
  assert.match(second, /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/);
});

test("generated task IDs are independent from titles and avoid collisions", () => {
  const first = model.createStableTaskId([], "fixed-seed");
  const second = model.createStableTaskId([first], "fixed-seed");
  assert.equal(first, "demo-task-fixed-seed");
  assert.equal(second, "demo-task-fixed-seed-2");
  assert.match(second, /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/);
});

test("project progress recalculates from task fractions and excludes archives", () => {
  assert.deepEqual(
    model.calculateProgressUnits([
      { status: "in_progress", completed: 1, total: 4 },
      { status: "done", completed: 3, total: 3 },
      { status: "planned", completed: 0, total: 0 },
      { status: "archive", completed: 8, total: 8 },
    ]),
    { completed: 4, total: 8, ratio: 0.5, percentage: 50 },
  );
});

test("status order accepts only an exact permutation", () => {
  const defaults = ["in_progress", "done", "blocked", "archive"];

  assert.deepEqual(
    model.normalizeStatusOrder(["blocked", "in_progress", "done", "archive"], defaults),
    ["blocked", "in_progress", "done", "archive"],
  );
  assert.deepEqual(
    model.normalizeStatusOrder(["blocked", "blocked", "done", "archive"], defaults),
    defaults,
  );
});

test("drag ordering moves a status before or after its target", () => {
  const order = ["in_progress", "done", "blocked", "archive"];

  assert.deepEqual(
    model.moveStatusOrder(order, "blocked", "in_progress"),
    ["blocked", "in_progress", "done", "archive"],
  );
  assert.deepEqual(
    model.moveStatusOrder(order, "in_progress", "blocked", true),
    ["done", "blocked", "in_progress", "archive"],
  );
  assert.deepEqual(order, ["in_progress", "done", "blocked", "archive"]);
});

test("status sorting is stable within each card and child-item group", () => {
  const cards = [
    { id: "done-1", status: "done" },
    { id: "active-1", status: "in_progress" },
    { id: "done-2", status: "done" },
    { id: "blocked-1", status: "blocked" },
  ];

  assert.deepEqual(
    model
      .stableSortByStatus(cards, ["blocked", "in_progress", "done", "archive"])
      .map((card) => card.id),
    ["blocked-1", "active-1", "done-1", "done-2"],
  );
});

test("priority normalization accepts the five named levels", () => {
  assert.equal(model.normalizePriority(0), 0);
  assert.equal(model.normalizePriority("1"), 1);
  assert.equal(model.normalizePriority(2), 2);
  assert.equal(model.normalizePriority(3), 3);
  assert.equal(model.normalizePriority(4), 4);
  assert.equal(model.normalizePriority(5, 2), 2);
  assert.equal(model.normalizePriority("P0", null), null);
});
