import assert from "node:assert/strict";
import test from "node:test";

await import("../experiments/time-reference/demo/task-editing-model.js");

const model = globalThis.TimeTaskEditingModel;

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
