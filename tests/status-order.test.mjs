import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  STATUS_ORDER_STORAGE_KEY,
  loadStatusOrder,
  moveStatusOrder,
  normalizeStatusOrder,
  saveStatusOrder,
  stableSortByStatus,
  taskHasSelectedItem,
  taskMatchesSelection,
  filterTaskItems,
} from "../viewer/assets/status-order.js";
import {
  MODULE_ORDER_STORAGE_KEY,
  loadModuleOrder,
  moveModuleOrder,
  saveModuleOrder,
} from "../viewer/assets/module-order.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STATUSES = ["planned", "in_progress", "blocked", "done", "archive"];

function createStorage(initialValue = null) {
  const values = new Map();
  if (initialValue !== null) values.set(STATUS_ORDER_STORAGE_KEY, initialValue);
  return {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, value); },
    values,
  };
}

test("status order keeps valid saved choices and appends newly supported statuses", () => {
  assert.deepEqual(
    normalizeStatusOrder(["done", "done", "unknown", "in_progress"], STATUSES),
    ["done", "in_progress", "planned", "blocked", "archive"],
  );
  assert.deepEqual(normalizeStatusOrder(null, STATUSES), STATUSES);
});

test("status order moves before or after a target without mutating the source", () => {
  const source = ["planned", "in_progress", "blocked", "done", "archive"];
  assert.deepEqual(
    moveStatusOrder(source, "done", "in_progress"),
    ["planned", "done", "in_progress", "blocked", "archive"],
  );
  assert.deepEqual(
    moveStatusOrder(source, "planned", "done", true),
    ["in_progress", "blocked", "done", "planned", "archive"],
  );
  assert.deepEqual(source, STATUSES);
});

test("task sorting follows status order and stays stable inside each status", () => {
  const tasks = [
    { id: "a", status: "in_progress" },
    { id: "b", status: "done" },
    { id: "c", status: "in_progress" },
    { id: "d", status: "custom" },
  ];
  assert.deepEqual(
    stableSortByStatus(tasks, ["done", "in_progress"]).map((task) => task.id),
    ["b", "a", "c", "d"],
  );
  assert.deepEqual(tasks.map((task) => task.id), ["a", "b", "c", "d"]);
});

test("a task with unfinished work is found by its items, not by an overload", () => {
  // `planned` used to match any task holding a pending item. That made the task
  // status ambiguous and, because only cards were filtered, left completed
  // items on screen. The guarantee it protected — unfinished work stays
  // findable and is never mistaken for archived — now comes from matching the
  // items themselves, which also hides the finished ones.
  const pendingTask = {
    status: "in_progress",
    pending_items: ["still needs work"],
    completed_items: ["already done"],
  };
  const planned = new Set(["planned"]);
  assert.equal(taskMatchesSelection(pendingTask, planned), false, "no longer overloaded");
  assert.equal(taskMatchesSelection(pendingTask, new Set(["in_progress"])), true);
  assert.equal(taskMatchesSelection({ status: "archive" }, planned), false);

  assert.equal(taskHasSelectedItem(pendingTask, planned), true, "still findable");
  assert.deepEqual(filterTaskItems(pendingTask, planned).completed_items, []);
});

test("pending and completed child panels follow the shared status order", () => {
  const groups = [
    { status: "done", title: "已完成" },
    { status: "planned", title: "待處理" },
  ];
  assert.deepEqual(
    stableSortByStatus(groups, ["planned", "done"]).map((group) => group.title),
    ["待處理", "已完成"],
  );
  assert.deepEqual(
    stableSortByStatus(groups, ["done", "planned"]).map((group) => group.title),
    ["已完成", "待處理"],
  );
});

test("status order storage is isolated and safely falls back when unavailable", () => {
  const storage = createStorage();
  assert.equal(saveStatusOrder(storage, ["done", "planned"]), true);
  assert.equal(storage.values.get(STATUS_ORDER_STORAGE_KEY), '["done","planned"]');
  assert.deepEqual(loadStatusOrder(storage, STATUSES), [
    "done",
    "planned",
    "in_progress",
    "blocked",
    "archive",
  ]);

  const unavailable = {
    getItem() { throw new Error("blocked"); },
    setItem() { throw new Error("blocked"); },
  };
  assert.deepEqual(loadStatusOrder(unavailable, STATUSES), STATUSES);
  assert.equal(saveStatusOrder(unavailable, STATUSES), false);
});

const taskCard = await readFile(
  new URL("../experiments/editor-svelte-spike/src/TaskCard.svelte", import.meta.url),
  "utf8",
);
const filterStrip = await readFile(
  new URL("../experiments/editor-svelte-spike/src/FilterStrip.svelte", import.meta.url),
  "utf8",
);
const horizontalCapsules = await readFile(
  new URL("../experiments/editor-svelte-spike/src/HorizontalCapsuleStrip.svelte", import.meta.url),
  "utf8",
);

test("status and module order use the same capsule-order behavior", () => {
  const storage = createStorage();
  const modules = ["time", "cost", "quality"];
  assert.deepEqual(moveModuleOrder(modules, "quality", "time"), ["quality", "time", "cost"]);
  assert.equal(saveModuleOrder(storage, ["cost", "time", "quality"]), true);
  assert.equal(storage.values.get(MODULE_ORDER_STORAGE_KEY), '["cost","time","quality"]');
  assert.deepEqual(loadModuleOrder(storage, modules), ["cost", "time", "quality"]);
});

test("production Viewer exposes mouse, touch, and keyboard status ordering", async () => {
  const [app, css, html] = await Promise.all([
    readFile(path.join(ROOT, "viewer/assets/app.js"), "utf8"),
    readFile(path.join(ROOT, "viewer/assets/styles.css"), "utf8"),
    readFile(path.join(ROOT, "viewer/index.html"), "utf8"),
  ]);
  // Ordering interaction moved into the filter component; the host keeps
  // persistence and re-render. Mouse drag, touch drag and keyboard must all
  // survive the move. The path is now StatusFilters → FilterStrip →
  // HorizontalCapsuleStrip, and ordering only happens because this screen opts
  // in — the shared strip is selection-only by default.
  assert.match(filterStrip, /HorizontalCapsuleStrip/);
  assert.match(app, /reorderable: true,/);
  assert.match(horizontalCapsules, /ondragstart=/);
  assert.match(horizontalCapsules, /onpointerdown=/);
  assert.match(horizontalCapsules, /Alt\+ArrowLeft Alt\+ArrowRight/);
  assert.match(horizontalCapsules, /Math\.hypot\(deltaX, deltaY\) < 8/);
  assert.match(horizontalCapsules, /Math\.abs\(deltaY\) > Math\.abs\(deltaX\)/);
  assert.match(horizontalCapsules, /capsule-drop-after/);
  assert.match(horizontalCapsules, /capsule-drop-before/);
  assert.match(horizontalCapsules, /capsule-dragging/);
  assert.match(app, /applyStatusOrder\(id, targetId, placeAfter\)/);
  assert.match(app, /saveStatusOrder\(statusOrderStorage, state\.statusOrder\)/);
  assert.match(
    app,
    /stableSortByStatus\(stableSortTasksByPriority\(state\.tasks\), state\.statusOrder\)/,
  );
  assert.match(app, /taskMatchesSelection\(task, selected\)/);
  // Panel titles and their ordering moved into the card component; the host
  // still supplies the reader's status order.
  assert.match(app, /statusOrder: state\.statusOrder/);
  assert.match(taskCard, /title: "待處理"/);
  assert.match(taskCard, /statusOrder\.indexOf/);
  assert.match(css, /\.filter-button\.status-sortable/);
  assert.match(css, /touch-action: pan-y/);
  assert.match(css, /content: "待處理"/);
  assert.match(html, /拖曳狀態標籤可調整卡片排序/);
});
