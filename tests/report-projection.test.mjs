// What a Report pointer card shows is derived, never stored. These assertions
// cover the parts nobody can see on screen: which tasks the status derivation
// counts, how deep the projection reads, and that nothing is kept between
// calls — a cached copy would still look right while quietly going stale.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  calculateProjectProgress,
  deriveReportStatus,
  projectPointerCard,
  reportSummaryText,
} from "../viewer/assets/report-model.js";

const pointer = { id: "winform", title: "Yu5h1Lib.WinForm", report_ref: { scope_id: "winform" } };

function targetReport(tasks, overrides = {}) {
  return {
    schema_version: "1.1",
    report_id: "winform",
    scope_id: "winform",
    title: "WinForm",
    updated_at: "2026-08-21T00:00:00Z",
    tasks,
    ...overrides,
  };
}

// The plan requires the card to reuse the one project-progress rule, and that
// rule counts item fractions — so the projection does read the item arrays of
// the report it was handed. What it must never reach for is data outside that
// base report, and what it must never carry out is any of it.
const FORBIDDEN_TASK_KEYS = ["developer", "time", "time_analysis", "report_ref"];

// A recording proxy is the only way to prove a boundary that leaves no trace
// in the output: the projection could read the deep fields and simply not
// print them, and every assertion on the result would still pass.
function watchReads(report) {
  const touched = new Set();
  const wrapTask = (task) => new Proxy(task, {
    get(source, key) {
      if (typeof key === "string") touched.add(key);
      return source[key];
    },
  });
  const watched = new Proxy(report, {
    get(source, key) {
      if (key === "tasks") return source.tasks.map(wrapTask);
      return source[key];
    },
  });
  return { watched, touched };
}

test("a report is finished only when every task that counts is finished", () => {
  assert.equal(deriveReportStatus([{ status: "done" }, { status: "done" }]), "done");
  assert.equal(deriveReportStatus([{ status: "done" }, { status: "archive" }]), "done");
  assert.equal(deriveReportStatus([{ status: "planned" }, { status: "done" }]), "planned");
  assert.equal(
    deriveReportStatus([{ status: "in_progress" }, { status: "blocked" }]),
    "in_progress",
    "work in flight outranks an obstacle elsewhere",
  );
});

test("blocked is only for a report that cannot move at all", () => {
  assert.equal(deriveReportStatus([{ status: "blocked" }, { status: "done" }]), "blocked");
  assert.equal(deriveReportStatus([{ status: "blocked" }, { status: "planned" }]), "planned");
});

test("archive marks archived work and never stands in for finished work", () => {
  assert.equal(deriveReportStatus([{ status: "archive" }, { status: "planned" }]), "planned");
  assert.equal(deriveReportStatus([{ status: "archive" }]), "archive");
  assert.equal(deriveReportStatus([]), "planned");
  assert.equal(deriveReportStatus(undefined), "planned");
});

test("a task holding no status of its own cannot be counted as finished", () => {
  assert.equal(
    deriveReportStatus([{ status: "done" }, { id: "nested", kind: "report_pointer" }]),
    "planned",
  );
});

test("a pointer card projects one row per top-level task, keeping the real status", () => {
  const report = targetReport([
    { id: "a", title: "A", status: "done", summary: "s", completed_items: [{ id: "a1", title: "A1" }] },
    { id: "b", title: "B", status: "blocked", summary: "s", pending_items: [{ id: "b1", title: "B1" }] },
    { id: "c", title: "C", status: "archive", summary: "s" },
  ]);
  const card = projectPointerCard(pointer, report);

  assert.equal(card.rows.length, report.tasks.length);
  assert.deepEqual(card.rows.map((row) => row.status), ["done", "blocked", "archive"]);
  assert.deepEqual(card.rows.map((row) => Object.keys(row)), [
    ["id", "title", "status"],
    ["id", "title", "status"],
    ["id", "title", "status"],
  ]);
  assert.equal(card.id, pointer.id, "the card keeps its own stable identity");
  assert.equal(card.title, pointer.title);
  assert.equal(card.scopeId, "winform");
});

test("the projection stops at the top level of the target report", () => {
  const { watched, touched } = watchReads(targetReport([
    {
      id: "a",
      title: "A",
      status: "in_progress",
      summary: "s",
      completed_items: [{ id: "a1", title: "A1" }],
      pending_items: [{ id: "a2", title: "A2" }],
      developer: { next_step: "should not be read" },
      progress: { completed: 1, total: 4 },
    },
  ]));
  const card = projectPointerCard(pointer, watched);

  for (const key of FORBIDDEN_TASK_KEYS) {
    assert.equal(touched.has(key), false, `projection read ${key}`);
  }

  const projected = JSON.stringify(card);
  assert.equal(projected.includes("A1"), false, "an item of the target task was carried out");
  assert.equal(projected.includes("A2"), false, "an item of the target task was carried out");
  assert.equal(projected.includes("should not be read"), false, "developer data was carried out");
});

test("a pointer inside the target is listed, not followed", () => {
  const card = projectPointerCard(pointer, targetReport([
    { id: "a", title: "A", status: "done", summary: "s" },
    { id: "nested", title: "Nested", kind: "report_pointer", report_ref: { scope_id: "other" } },
  ]));

  assert.deepEqual(card.rows[1], { id: "nested", title: "Nested", status: null });
  assert.equal(Object.hasOwn(card.rows[1], "report_ref"), false);
});

test("progress and summary come from the implementations that already own them", () => {
  const tasks = [
    { id: "a", title: "A", status: "done", summary: "s" },
    { id: "b", title: "B", status: "planned", summary: "s" },
  ];
  const written = targetReport(tasks, { summary: "目標專案自己寫的摘要。" });
  const unwritten = targetReport(tasks);

  assert.deepEqual(projectPointerCard(pointer, written).progress, calculateProjectProgress(tasks));
  assert.equal(projectPointerCard(pointer, written).summary, "目標專案自己寫的摘要。");
  assert.equal(projectPointerCard(pointer, unwritten).summary, reportSummaryText(unwritten));
});

test("nothing is remembered between projections", () => {
  const first = projectPointerCard(pointer, targetReport([
    { id: "a", title: "A", status: "planned", summary: "s" },
  ]));
  const second = projectPointerCard(pointer, targetReport([
    { id: "a", title: "A", status: "done", summary: "s" },
    { id: "b", title: "B", status: "planned", summary: "s" },
  ]));

  assert.equal(first.status, "planned");
  assert.equal(second.status, "planned");
  assert.equal(first.rows.length, 1);
  assert.equal(second.rows.length, 2);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(Object.isFrozen(first.rows), true);
  assert.equal(Object.isFrozen(first.rows[0]), true);
});

test("the fallback summary line has one implementation", async () => {
  const app = await readFile(new URL("../viewer/assets/app.js", import.meta.url), "utf8");
  assert.doesNotMatch(app, /個可追溯任務/u, "app.js must not keep a second fallback sentence");
  assert.match(app, /reportSummaryText,/u);
});
