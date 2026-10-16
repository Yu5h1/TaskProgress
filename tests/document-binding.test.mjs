import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeDocumentRef,
  documentBindingKey,
  documentBindingHref,
  evaluateChecklistDocument,
  evaluateDecisionDocument,
  fetchDocumentBinding,
  deriveBoundTaskStatus,
  deriveBoundItemStatus,
  evaluateAllDocumentBindings,
  projectTasksWithBindings,
  createDocumentBindingRefresher,
} from "../viewer/assets/document-binding.js";
import { calculateProjectProgress } from "../viewer/assets/report-model.js";

test("normalizeDocumentRef normalizes task and stem aliases", () => {
  assert.deepEqual(normalizeDocumentRef({ kind: "checklist", scope_id: "alpha", task: "stem-1" }), {
    kind: "checklist",
    scope_id: "alpha",
    task: "stem-1",
  });
  assert.deepEqual(normalizeDocumentRef({ kind: "decision", scope_id: "beta", stem: "stem-2" }), {
    kind: "decision",
    scope_id: "beta",
    task: "stem-2",
  });
  assert.equal(normalizeDocumentRef({ kind: "other", scope_id: "a", task: "b" }), null);
  assert.equal(normalizeDocumentRef({ kind: "checklist", scope_id: "" }), null);
  assert.equal(normalizeDocumentRef(null), null);
});

test("documentBindingKey and documentBindingHref generate distinct routes per scope and stem", () => {
  const refA = { kind: "checklist", scope_id: "scope-a", task: "same-stem" };
  const refB = { kind: "checklist", scope_id: "scope-b", task: "same-stem" };

  assert.notEqual(documentBindingKey(refA), documentBindingKey(refB));
  assert.equal(documentBindingHref(refA), "/checklist/?scope=scope-a&task=same-stem");
  assert.equal(documentBindingHref(refB), "/checklist/?scope=scope-b&task=same-stem");

  const decRef = { kind: "decision", scope_id: "ux", stem: "menu-design" };
  assert.equal(documentBindingHref(decRef), "/decisions/?scope=ux&task=menu-design");
});

test("evaluateChecklistDocument requires at least 1 check and all checks passed", () => {
  // Empty document
  assert.deepEqual(evaluateChecklistDocument({ items: [] }), {
    ok: true,
    completed: false,
    total: 0,
    passed: 0,
  });

  // All passed
  const fullPassed = {
    items: [
      { checks: [{ status: "passed" }, { status: "passed" }] },
      { checks: [{ status: "passed" }] },
    ],
  };
  assert.deepEqual(evaluateChecklistDocument(fullPassed), {
    ok: true,
    completed: true,
    total: 3,
    passed: 3,
  });

  // Partial / unchecked
  const partial = {
    items: [
      { checks: [{ status: "passed" }, { status: "pending" }] },
    ],
  };
  assert.deepEqual(evaluateChecklistDocument(partial), {
    ok: true,
    completed: false,
    total: 2,
    passed: 1,
  });

  // Failure
  const withFailure = {
    items: [
      { checks: [{ status: "passed" }, { status: "failed" }] },
    ],
  };
  assert.deepEqual(evaluateChecklistDocument(withFailure), {
    ok: true,
    completed: false,
    total: 2,
    passed: 1,
  });
});

test("evaluateDecisionDocument requires at least 1 decision and all decided with valid answer", () => {
  // Empty decisions
  assert.deepEqual(evaluateDecisionDocument({ document: { decisions: [] } }), {
    ok: true,
    completed: false,
    total: 0,
    decided: 0,
  });

  // All decided
  const allDecided = {
    document: {
      decisions: [
        { id: "d1", status: "decided", answer: { kind: "option", option_id: "opt-1" } },
        { id: "d2", status: "decided", answer: { kind: "other", text: "My reason" } },
      ],
    },
  };
  assert.deepEqual(evaluateDecisionDocument(allDecided), {
    ok: true,
    completed: true,
    total: 2,
    decided: 2,
  });

  // Partial or reopened (answer null)
  const reopened = {
    document: {
      decisions: [
        { id: "d1", status: "decided", answer: { kind: "option", option_id: "opt-1" } },
        { id: "d2", status: "pending", answer: null },
      ],
    },
  };
  assert.deepEqual(evaluateDecisionDocument(reopened), {
    ok: true,
    completed: false,
    total: 2,
    decided: 1,
  });

  // Error result
  assert.deepEqual(evaluateDecisionDocument({ ok: false, error: { message: "Task mismatch" } }), {
    ok: false,
    completed: false,
    error: "Task mismatch",
  });
});

test("fetchDocumentBinding handles success, transport failures and missing files", async () => {
  const fakeFetchImpl = async () => ({
    ok: true,
    json: async () => ({ type: "result", payload: { items: [{ checks: [{ status: "passed" }] }] } }),
  });

  const passed = await fetchDocumentBinding(
    { kind: "checklist", scope_id: "alpha", task: "stem-1" },
    { fetchImpl: fakeFetchImpl },
  );
  assert.equal(passed.ok, true);
  assert.equal(passed.completed, true);

  // Missing or failing transport
  const failing = await fetchDocumentBinding(
    { kind: "checklist", scope_id: "alpha", task: "bad" },
    {
      fetchImpl: async () => {
        throw new Error("HTTP 404 Not Found");
      },
    },
  );
  assert.equal(failing.ok, false);
  assert.equal(failing.completed, false);
  assert.match(failing.error, /HTTP 404/);
});

test("deriveBoundTaskStatus and deriveBoundItemStatus preserve raw done and archive", () => {
  // Archive stays archive even if document is completed
  assert.equal(deriveBoundTaskStatus("archive", { ok: true, completed: true }), "archive");
  assert.equal(deriveBoundItemStatus("archive", { ok: true, completed: true }), "archive");

  // Raw done stays done even if document is incomplete or failed
  assert.equal(deriveBoundTaskStatus("done", { ok: true, completed: false }), "done");
  assert.equal(deriveBoundTaskStatus("done", { ok: false, completed: false }), "done");
  assert.equal(deriveBoundItemStatus("done", { ok: true, completed: false }), "done");
  assert.equal(deriveBoundItemStatus("done", { ok: false, completed: false }), "done");

  // Planned becomes done when document completed
  assert.equal(deriveBoundTaskStatus("planned", { ok: true, completed: true }), "done");
  assert.equal(deriveBoundItemStatus("planned", { ok: true, completed: true }), "done");

  // Planned stays planned when document is incomplete or error
  assert.equal(deriveBoundTaskStatus("planned", { ok: true, completed: false }), "planned");
  assert.equal(deriveBoundTaskStatus("planned", { ok: false, completed: false }), "planned");
});

test("projectTasksWithBindings partitions completed items and updates progress", () => {
  const tasks = [
    {
      id: "task-1",
      title: "Parent Task",
      status: "planned",
      summary: "Task summary",
      completed_items: [],
      pending_items: [
        {
          id: "item-1",
          title: "Bound Checklist Item",
          document_ref: { kind: "checklist", scope_id: "alpha", task: "chk-1" },
        },
        {
          id: "item-2",
          title: "Regular Unbound Item",
        },
      ],
    },
    {
      id: "task-2",
      title: "Bound Task",
      status: "in_progress",
      summary: "Bound to decision",
      document_ref: { kind: "decision", scope_id: "alpha", task: "dec-1" },
      completed_items: [],
      pending_items: [],
    },
  ];

  const evaluations = new Map([
    ["checklist:alpha:chk-1", { ok: true, completed: true, total: 2, passed: 2 }],
    ["decision:alpha:dec-1", { ok: true, completed: true, total: 1, decided: 1 }],
  ]);

  const projected = projectTasksWithBindings(tasks, evaluations);

  // task-1 parent status remains planned (not automatically rewritten by child completion)
  assert.equal(projected[0].status, "planned");
  // item-1 moved into completed_items because its bound checklist completed!
  assert.equal(projected[0].completed_items.length, 1);
  assert.equal(projected[0].completed_items[0].id, "item-1");
  assert.equal(projected[0].completed_items[0].status, "done");
  assert.equal(projected[0].completed_items[0].sourceRef.completed, true);
  assert.equal(projected[0].completed_items[0].sourceRef.label, "Checklist");
  assert.equal(projected[0].completed_items[0].sourceRef.href, "/checklist/?scope=alpha&task=chk-1");

  // item-2 remained in pending_items
  assert.equal(projected[0].pending_items.length, 1);
  assert.equal(projected[0].pending_items[0].id, "item-2");

  // task-2 status derived to done because its bound decision completed!
  assert.equal(projected[1].status, "done");
  assert.equal(projected[1].sourceRef.completed, true);
  assert.equal(projected[1].sourceRef.label, "Decision");
  assert.equal(projected[1].sourceRef.href, "/decisions/?scope=alpha&task=dec-1");

  // Project progress calculation reflects the derived completions
  const progress = calculateProjectProgress(projected);
  // task-1: 1 of 2 items completed. task-2: 1 of 1 completed task. Total: completed = 2, total = 3.
  assert.equal(progress.completed, 2);
  assert.equal(progress.total, 3);
  assert.equal(progress.percentage, 67);
});

test("projectTasksWithBindings marks unavailable sourceRef on error without halting projection", () => {
  const tasks = [
    {
      id: "task-err",
      title: "Task with broken ref",
      status: "planned",
      document_ref: { kind: "checklist", scope_id: "alpha", task: "missing" },
      completed_items: [],
      pending_items: [],
    },
  ];

  const evaluations = new Map([
    ["checklist:alpha:missing", { ok: false, completed: false, error: "HTTP 404" }],
  ]);

  const projected = projectTasksWithBindings(tasks, evaluations);
  assert.equal(projected[0].status, "planned");
  assert.equal(projected[0].sourceRef.available, false);
  assert.equal(projected[0].sourceRef.error, "HTTP 404");
  assert.equal(projected[0].sourceRef.completed, false);
});

test("evaluateAllDocumentBindings caps active concurrent requests", async () => {
  let active = 0;
  let maxActive = 0;

  const mockCreateChecklist = () => ({
    load: async () => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      await new Promise((resolve) => setTimeout(resolve, 10));
      active -= 1;
      return { items: [] };
    },
  });

  const tasks = Array.from({ length: 12 }, (_, i) => ({
    id: `task-${i}`,
    title: `Task ${i}`,
    status: "planned",
    document_ref: { kind: "checklist", scope_id: "scope-1", task: `doc-${i}` },
  }));

  const evaluations = await evaluateAllDocumentBindings(tasks, {
    concurrency: 3,
    createChecklistTransport: mockCreateChecklist,
  });

  assert.equal(evaluations.size, 12);
  assert.equal(maxActive, 3, "Max active requests must not exceed configured concurrency limit of 3");
});

test("createDocumentBindingRefresher drops stale result when scope changes during fetch", async () => {
  let scope = "scope-a";
  const reportA = { scope_id: "scope-a", report_id: "rep-1", updated_at: "2026-10-17T00:00:00Z", tasks: [] };
  const reportB = { scope_id: "scope-b", report_id: "rep-2", updated_at: "2026-10-17T00:00:00Z", tasks: [] };
  let applied = false;

  const refresher = createDocumentBindingRefresher({
    getReport: () => (scope === "scope-a" ? reportA : reportB),
    evaluateAll: async () => {
      scope = "scope-b";
      return new Map([["checklist:scope-a:task-1", { ok: true, completed: true }]]);
    },
    onApply: () => {
      applied = true;
    },
  });

  const res = await refresher();
  assert.equal(res.applied, false);
  assert.equal(res.reason, "scope_or_report_changed");
  assert.equal(applied, false, "Must not apply binding result to changed scope");
});

test("createDocumentBindingRefresher drops stale result when user starts editing during fetch", async () => {
  const report = { scope_id: "scope-a", report_id: "rep-1", updated_at: "2026-10-17T00:00:00Z", tasks: [] };
  let editor = { editing: false, dirty: false };
  let applied = false;

  const refresher = createDocumentBindingRefresher({
    getReport: () => report,
    getEditorState: () => editor,
    evaluateAll: async () => {
      editor = { editing: true, dirty: true };
      return new Map([["checklist:scope-a:task-1", { ok: true, completed: true }]]);
    },
    onApply: () => {
      applied = true;
    },
  });

  const res = await refresher();
  assert.equal(res.applied, false);
  assert.equal(res.reason, "editor_became_busy");
  assert.equal(applied, false, "Must not apply binding result when user became dirty");
});

test("createDocumentBindingRefresher drops out-of-order stale response", async () => {
  const report = { scope_id: "scope-a", report_id: "rep-1", updated_at: "2026-10-17T00:00:00Z", tasks: [] };
  const appliedCalls = [];

  let resolveFirst = null;
  const firstPromise = new Promise((resolve) => {
    resolveFirst = resolve;
  });

  let callCount = 0;
  const refresher = createDocumentBindingRefresher({
    getReport: () => report,
    evaluateAll: async () => {
      callCount += 1;
      if (callCount === 1) {
        await firstPromise;
        return new Map([["doc-1", { ok: true, version: 1 }]]);
      }
      return new Map([["doc-1", { ok: true, version: 2 }]]);
    },
    onApply: ({ evaluations }) => {
      appliedCalls.push(evaluations.get("doc-1").version);
    },
  });

  const p1 = refresher();
  const p2 = refresher();

  const res2 = await p2;
  assert.equal(res2.applied, true);

  resolveFirst();
  const res1 = await p1;
  assert.equal(res1.applied, false);
  assert.equal(res1.reason, "stale_generation");

  assert.deepEqual(appliedCalls, [2]);
});

