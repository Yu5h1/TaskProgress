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
  taskMatchesViewStatus,
} from "../viewer/assets/status-order.js";

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

test("pending child items join the planned view status without becoming archived", () => {
  const pendingTask = {
    status: "in_progress",
    pending_items: ["still needs work"],
  };
  assert.equal(taskMatchesViewStatus(pendingTask, "planned"), true);
  assert.equal(taskMatchesViewStatus(pendingTask, "in_progress"), true);
  assert.equal(taskMatchesViewStatus(pendingTask, "archive"), false);
  assert.equal(taskMatchesViewStatus({ status: "planned" }, "planned"), true);
  assert.equal(taskMatchesViewStatus({ status: "archive" }, "planned"), false);
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

test("production Viewer exposes mouse, touch, and keyboard status ordering", async () => {
  const [app, css, html] = await Promise.all([
    readFile(path.join(ROOT, "viewer/assets/app.js"), "utf8"),
    readFile(path.join(ROOT, "viewer/assets/styles.css"), "utf8"),
    readFile(path.join(ROOT, "viewer/index.html"), "utf8"),
  ]);
  assert.match(app, /addEventListener\("dragstart"/);
  assert.match(app, /addEventListener\("pointerdown"/);
  assert.match(app, /Alt\+ArrowLeft Alt\+ArrowRight/);
  assert.match(app, /stableSortByStatus\(state\.tasks, state\.statusOrder\)/);
  assert.match(app, /taskMatchesViewStatus\(task, state\.filter\)/);
  assert.match(app, /title: "待處理"/);
  assert.match(css, /\.filter-button\.status-sortable/);
  assert.match(css, /touch-action: pan-y/);
  assert.match(css, /content: "待處理"/);
  assert.match(html, /拖曳狀態標籤可調整卡片排序/);
});
