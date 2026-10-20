import test from "node:test";
import assert from "node:assert/strict";
import { parseReference, referenceTask, searchTask, searchTerms } from "../viewer/assets/task-search.js";

const task = {
  id: "ui-workflow",
  title: "UI 組合與更新工作流",
  summary: "Web 共用 UI 與獨立 demo",
  pending_items: [
    { id: "ux-toggle-goal-1", title: "Toggle 目標 1：[animation demo](http://127.0.0.1:8015/animation-lab/) 播放列" },
    { id: "playback-platform", title: "PlaybackControls PB01 真實動畫" },
    "驗收｜依 checklist 完成操作體驗",
  ],
  completed_items: [{ id: "ux-web-6", title: "清單與屬性面板改讀 ListEdit" }],
};

test("terms split on whitespace and ignore case", () => {
  assert.deepEqual(searchTerms("  Toggle   播放 "), ["toggle", "播放"]);
  assert.deepEqual(searchTerms(""), []);
});

test("a matching card keeps every item; otherwise only matching items remain", () => {
  assert.equal(searchTask(task, []), task);
  assert.equal(searchTask(task, searchTerms("工作流")), task);
  assert.equal(searchTask(task, searchTerms("獨立 demo")), task);
  const items = searchTask(task, searchTerms("播放"));
  assert.deepEqual(items.pending_items.map(item => item.id), ["ux-toggle-goal-1"]);
  assert.deepEqual(items.completed_items, []);
  assert.deepEqual(searchTask(task, searchTerms("listedit")).completed_items.map(item => item.id), ["ux-web-6"]);
  assert.deepEqual(searchTask(task, searchTerms("驗收")).pending_items, ["驗收｜依 checklist 完成操作體驗"]);
});

test("terms may span the card and one item, link labels match but URLs do not", () => {
  assert.deepEqual(searchTask(task, searchTerms("工作流 pb01")).pending_items.map(item => item.id), ["playback-platform"]);
  assert.deepEqual(searchTask(task, searchTerms("animation demo")).pending_items.map(item => item.id), ["ux-toggle-goal-1"]);
  assert.equal(searchTask(task, searchTerms("8015")), null);
  assert.equal(searchTask(task, searchTerms("不存在")), null);
});

test("IDs match only when enabled", () => {
  assert.equal(searchTask(task, searchTerms("ux-toggle-goal-1")), null);
  assert.deepEqual(searchTask(task, searchTerms("ux-toggle-goal-1"), { ids: true }).pending_items.map(item => item.id), ["ux-toggle-goal-1"]);
  assert.equal(searchTask(task, searchTerms("ui-workflow"), { ids: true }), task);
});

test("a pasted reference selects one card and item by ID", () => {
  assert.deepEqual(parseReference("yu5h1lib-web › ui-workflow › ux-toggle-goal-1「Toggle 目標 1…」"), { scopeId: "yu5h1lib-web", taskId: "ui-workflow", itemId: "ux-toggle-goal-1" });
  assert.deepEqual(parseReference(" s › t "), { scopeId: "s", taskId: "t", itemId: null });
  assert.equal(parseReference("播放 toggle"), null);
  assert.equal(parseReference("› t"), null);
  const one = referenceTask(task, parseReference("s › ui-workflow › ux-web-6"));
  assert.deepEqual(one.pending_items, []);
  assert.deepEqual(one.completed_items.map(item => item.id), ["ux-web-6"]);
  assert.equal(referenceTask(task, parseReference("s › ui-workflow")), task);
  assert.equal(referenceTask(task, parseReference("s › other › ux-web-6")), null);
  assert.equal(referenceTask(task, parseReference("s › ui-workflow › missing")), null);
});
