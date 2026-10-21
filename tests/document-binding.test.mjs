import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeDocumentRef,
  documentBindingKey,
  documentBindingLabel,
  documentBindingTitle,
  documentBindingHref,
  evaluateChecklistDocument,
  evaluateDecisionDocument,
  fetchDocumentBinding,
  deriveBoundTaskStatus,
  deriveBoundItemStatus,
  deriveCardStatusFromItems,
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
    failed: 0,
    manual: false,
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
    failed: 0,
    manual: false,
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
    failed: 0,
    manual: false,
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
    failed: 1,
    manual: false,
  });
});

test("evaluateChecklistDocument flags a checklist holding any manual check", () => {
  const agentOnly = { items: [{ checks: [{ status: "passed", isManual: false }] }] };
  const manual = { items: [{ checks: [{ status: "passed" }, { status: "pending", isManual: true }] }] };
  assert.equal(evaluateChecklistDocument(agentOnly).manual, false);
  assert.equal(evaluateChecklistDocument(manual).manual, true);
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

test("deriveCardStatusFromItems aggregates task status from items", () => {
  // Archive always stays archive
  assert.equal(deriveCardStatusFromItems("archive", 2, 2, true), "archive");
  assert.equal(deriveCardStatusFromItems("archive", 0, 2, true), "archive");

  // No non-archived items -> retains original status
  assert.equal(deriveCardStatusFromItems("planned", 0, 0, false), "planned");
  assert.equal(deriveCardStatusFromItems("in_progress", 0, 0, false), "in_progress");

  // All items done -> derives to done
  assert.equal(deriveCardStatusFromItems("planned", 3, 3, true), "done");
  assert.equal(deriveCardStatusFromItems("in_progress", 3, 3, true), "done");

  // Incomplete items when original was done -> reverts to in_progress
  assert.equal(deriveCardStatusFromItems("done", 2, 3, true), "in_progress");

  // Incomplete items retain non-done original status
  assert.equal(deriveCardStatusFromItems("planned", 1, 3, true), "planned");
  assert.equal(deriveCardStatusFromItems("in_progress", 1, 3, true), "in_progress");
  assert.equal(deriveCardStatusFromItems("blocked", 1, 3, true), "blocked");
});

test("deriveBoundItemStatus reflects source document completion and reopening", () => {
  // Archive always stays archive regardless of source
  assert.equal(deriveBoundItemStatus("archive", { ok: true, completed: true }), "archive");
  assert.equal(deriveBoundItemStatus("archive", { ok: true, completed: false }), "archive");
  assert.equal(deriveBoundItemStatus("archive", { ok: false, completed: false }), "archive");

  // Source completed -> derives to done
  assert.equal(deriveBoundItemStatus("planned", { ok: true, completed: true }), "done");
  assert.equal(deriveBoundItemStatus("in_progress", { ok: true, completed: true }), "done");
  assert.equal(deriveBoundItemStatus("blocked", { ok: true, completed: true }), "done");
  assert.equal(deriveBoundItemStatus("done", { ok: true, completed: true }), "done");

  // Source incomplete / reopened / unselected:
  // - Raw planned, in_progress, blocked retain their unfinished status
  assert.equal(deriveBoundItemStatus("planned", { ok: true, completed: false }), "planned");
  assert.equal(deriveBoundItemStatus("in_progress", { ok: true, completed: false }), "in_progress");
  assert.equal(deriveBoundItemStatus("blocked", { ok: true, completed: false }), "blocked");

  // - Raw done or implicit done reverts to in_progress when source is incomplete, empty, or failed
  assert.equal(deriveBoundItemStatus("done", { ok: true, completed: false }), "in_progress");
  assert.equal(deriveBoundItemStatus("done", { ok: true, completed: false, total: 0 }), "in_progress");
  assert.equal(deriveBoundItemStatus("done", { ok: false, completed: false, error: "File not found" }), "in_progress");
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
      completed_items: [],
      pending_items: [
        {
          id: "item-3",
          title: "Bound Decision Item",
          document_ref: { kind: "decision", scope_id: "alpha", task: "dec-1" },
        },
      ],
    },
  ];

  const evaluations = new Map([
    ["checklist:alpha:chk-1", { ok: true, completed: true, total: 2, passed: 2 }],
    ["decision:alpha:dec-1", { ok: true, completed: true, total: 1, decided: 1 }],
  ]);

  const projected = projectTasksWithBindings(tasks, evaluations);

  // task-1 parent status remains planned (1 of 2 completed)
  assert.equal(projected[0].status, "planned");
  assert.equal(projected[0].sourceRef, undefined);
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

  // task-2 status derived to done because all its items (item-3) completed!
  assert.equal(projected[1].status, "done");
  assert.equal(projected[1].sourceRef, undefined);
  assert.equal(projected[1].completed_items.length, 1);
  assert.equal(projected[1].completed_items[0].id, "item-3");
  assert.equal(projected[1].completed_items[0].sourceRef.completed, true);
  assert.equal(projected[1].completed_items[0].sourceRef.label, "Decision");
  assert.equal(projected[1].completed_items[0].sourceRef.href, "/decisions/?scope=alpha&task=dec-1");

  // Project progress calculation reflects the derived completions
  const progress = calculateProjectProgress(projected);
  // task-1: 1 of 2 items completed. task-2: 1 of 1 completed items. Total: completed = 2, total = 3.
  assert.equal(progress.completed, 2);
  assert.equal(progress.total, 3);
  assert.equal(progress.percentage, 67);
});

test("projectTasksWithBindings marks unavailable sourceRef on item error without halting projection", () => {
  const tasks = [
    {
      id: "task-err",
      title: "Task with broken item ref",
      status: "planned",
      completed_items: [],
      pending_items: [
        {
          id: "item-err",
          title: "Item with broken ref",
          document_ref: { kind: "checklist", scope_id: "alpha", task: "missing" },
        },
      ],
    },
  ];

  const evaluations = new Map([
    ["checklist:alpha:missing", { ok: false, completed: false, error: "HTTP 404" }],
  ]);

  const projected = projectTasksWithBindings(tasks, evaluations);
  assert.equal(projected[0].status, "planned");
  assert.equal(projected[0].sourceRef, undefined);
  assert.equal(projected[0].pending_items[0].sourceRef.available, false);
  assert.equal(projected[0].pending_items[0].sourceRef.error, "HTTP 404");
  assert.equal(projected[0].pending_items[0].sourceRef.completed, false);
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
    completed_items: [],
    pending_items: [
      {
        id: `item-${i}`,
        title: `Item ${i}`,
        document_ref: { kind: "checklist", scope_id: "scope-1", task: `doc-${i}` },
      },
    ],
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



test("projectTasksWithBindings reflects source reopening on bound items and preserves raw report", () => {
  const tasks = [
    {
      id: "task-reopened-chk",
      title: "Task with checklist",
      status: "in_progress",
      completed_items: [
        {
          id: "item-explicit-done",
          title: "Explicit done item",
          status: "done",
          document_ref: { kind: "checklist", scope_id: "test", task: "chk-reopened" },
        },
        {
          id: "item-implicit-done",
          title: "Implicit done item without status field",
          document_ref: { kind: "checklist", scope_id: "test", task: "chk-empty" },
        },
      ],
      pending_items: [
        {
          id: "item-planned",
          title: "Planned item",
          status: "planned",
          document_ref: { kind: "decision", scope_id: "test", task: "dec-reopened" },
        },
      ],
    },
    {
      id: "task-missing-source",
      title: "Task with missing and failed sources",
      status: "in_progress",
      completed_items: [
        {
          id: "item-done-missing",
          title: "Item with missing file",
          status: "done",
          document_ref: { kind: "checklist", scope_id: "test", task: "chk-missing" },
        },
        {
          id: "item-archived-bound",
          title: "Archived item",
          status: "archive",
          document_ref: { kind: "checklist", scope_id: "test", task: "chk-missing" },
        },
      ],
      pending_items: [],
    },
  ];

  const evaluations = new Map([
    // Checklist unchecked / partial
    ["checklist:test:chk-reopened", { ok: true, completed: false, total: 3, passed: 2 }],
    // Checklist empty
    ["checklist:test:chk-empty", { ok: true, completed: false, total: 0, passed: 0 }],
    // Decision reopened
    ["decision:test:dec-reopened", { ok: true, completed: false, total: 2, decided: 1 }],
    // Missing file
    ["checklist:test:chk-missing", { ok: false, completed: false, error: "HTTP 404" }],
  ]);

  const rawTasksSnapshot = JSON.stringify(tasks);
  const projected = projectTasksWithBindings(tasks, evaluations);

  // Raw data unmutated
  assert.equal(JSON.stringify(tasks), rawTasksSnapshot);

  const t1 = projected.find((t) => t.id === "task-reopened-chk");
  // All 3 items are unfinished:
  // - item-explicit-done (was done) -> derived status: in_progress, moved to pending_items
  // - item-implicit-done (was implicit done) -> derived status: in_progress, moved to pending_items
  // - item-planned (was planned) -> derived status: planned, in pending_items
  assert.equal(t1.completed_items.length, 0);
  assert.equal(t1.pending_items.length, 3);
  const itExplicit = t1.pending_items.find((i) => i.id === "item-explicit-done");
  assert.equal(itExplicit.status, "in_progress");
  assert.equal(itExplicit.sourceRef.completed, false);
  assert.equal(itExplicit.sourceRef.available, true);

  const itImplicit = t1.pending_items.find((i) => i.id === "item-implicit-done");
  assert.equal(itImplicit.status, "in_progress");
  assert.equal(itImplicit.sourceRef.completed, false);
  assert.equal(itImplicit.sourceRef.available, true);

  const itPlanned = t1.pending_items.find((i) => i.id === "item-planned");
  assert.equal(itPlanned.status, "planned");
  assert.equal(itPlanned.sourceRef.completed, false);

  // Card progress: 0 / 3
  const p1 = calculateProjectProgress([t1]);
  assert.equal(p1.completed, 0);
  assert.equal(p1.total, 3);
  assert.equal(t1.status, "in_progress");

  const t2 = projected.find((t) => t.id === "task-missing-source");
  // item-done-missing had missing file -> status reverts to in_progress, available = false
  const itMissing = t2.pending_items.find((i) => i.id === "item-done-missing");
  assert.equal(itMissing.status, "in_progress");
  assert.equal(itMissing.sourceRef.available, false);
  assert.equal(itMissing.sourceRef.completed, false);
  assert.match(itMissing.sourceRef.error, /HTTP 404/);

  // item-archived-bound stays archive in completed_items
  const itArchive = t2.pending_items.find((i) => i.id === "item-archived-bound");
  assert.equal(itArchive.status, "archive");
});

test("projectTasksWithBindings leaves completely unbound task cards completely untouched", () => {
  const tasks = [
    {
      id: "unbound-blocked",
      title: "Blocked card with all completed items",
      status: "blocked",
      summary: "Manual roadblock",
      completed_items: [
        { id: "item-b1", title: "Item 1", status: "done" },
        { id: "item-b2", title: "Item 2", status: "done" },
      ],
      pending_items: [],
    },
    {
      id: "unbound-done-with-pending",
      title: "Done card with pending item",
      status: "done",
      summary: "Done by manual override",
      completed_items: [
        { id: "item-d1", title: "Item 1", status: "done" },
      ],
      pending_items: [
        { id: "item-d2", title: "Item 2", status: "planned" },
      ],
    },
    {
      id: "mixed-card",
      title: "Card with mixed bound and unbound items",
      status: "in_progress",
      summary: "Has both",
      completed_items: [],
      pending_items: [
        {
          id: "item-bound-pass",
          title: "Bound item",
          document_ref: { kind: "checklist", scope_id: "s", task: "chk-pass" },
        },
        {
          id: "item-unbound-pending",
          title: "Unbound pending item",
          status: "planned",
        },
      ],
    },
  ];

  const evaluations = new Map([
    ["checklist:s:chk-pass", { ok: true, completed: true, total: 1, passed: 1 }],
  ]);

  const rawTasksSnapshot = JSON.stringify(tasks);
  const projected = projectTasksWithBindings(tasks, evaluations);

  // 1. Unbound blocked card must retain status: blocked even though all items are done!
  const blockedCard = projected.find((t) => t.id === "unbound-blocked");
  assert.equal(blockedCard.status, "blocked");
  assert.equal(blockedCard.completed_items.length, 2);

  // 2. Unbound done card must retain status: done even though it has pending items!
  const doneCard = projected.find((t) => t.id === "unbound-done-with-pending");
  assert.equal(doneCard.status, "done");
  assert.equal(doneCard.completed_items.length, 1);
  assert.equal(doneCard.pending_items.length, 1);

  // 3. Mixed card has bound items, so it aggregates:
  // - item-bound-pass completed -> moved to completed_items
  // - item-unbound-pending is planned -> stays in pending_items
  // - 1 of 2 done -> card status remains in_progress
  const mixedCard = projected.find((t) => t.id === "mixed-card");
  assert.equal(mixedCard.completed_items.length, 1);
  assert.equal(mixedCard.completed_items[0].id, "item-bound-pass");
  assert.equal(mixedCard.pending_items.length, 1);
  assert.equal(mixedCard.pending_items[0].id, "item-unbound-pending");
  assert.equal(mixedCard.status, "in_progress");

  // Raw data unmutated
  assert.equal(JSON.stringify(tasks), rawTasksSnapshot);
});

test("items completed by their bound document stack on top of stored completed items", () => {
  const tasks = [{
    id: "work",
    title: "Work",
    status: "in_progress",
    completed_items: [{ id: "old-done", title: "Old", status: "done" }],
    pending_items: [
      { id: "bound-a", title: "A", status: "in_progress", document_ref: { kind: "checklist", scope_id: "alpha", task: "a" } },
      { id: "open", title: "Open", status: "planned" },
      { id: "bound-b", title: "B", status: "planned", document_ref: { kind: "checklist", scope_id: "alpha", task: "b" } },
    ],
  }];
  const done = { ok: true, completed: true };
  const evaluations = new Map([
    [documentBindingKey(tasks[0].pending_items[0].document_ref), done],
    [documentBindingKey(tasks[0].pending_items[2].document_ref), done],
  ]);
  const [projected] = projectTasksWithBindings(tasks, evaluations);
  assert.deepEqual(projected.completed_items.map(item => item.id), ["bound-a", "bound-b", "old-done"]);
  assert.deepEqual(projected.pending_items.map(item => item.id), ["open"]);
  assert.deepEqual(tasks[0].completed_items.map(item => item.id), ["old-done"]);
});

test("documentBindingLabel names the bound kind and ignores invalid refs", () => {
  assert.equal(documentBindingLabel({ kind: "checklist", scope_id: "s", task: "c" }), "Checklist");
  assert.equal(documentBindingLabel({ kind: "decision", scope_id: "s", task: "d" }), "Decision");
  assert.equal(documentBindingLabel(undefined), null);
});

test("the binding tooltip states what opens and the document progress", () => {
  const evaluations = new Map([
    ["checklist:s:c", { ok: true, completed: false, total: 5, passed: 3, failed: 1, manual: true }],
    ["decision:s:d", { ok: true, completed: false, total: 4, decided: 2 }],
  ]);
  const [task] = projectTasksWithBindings([{
    id: "t",
    status: "in_progress",
    pending_items: [
      { id: "a", title: "A", document_ref: { kind: "checklist", scope_id: "s", task: "c" } },
      { id: "b", title: "B", document_ref: { kind: "decision", scope_id: "s", task: "d" } },
    ],
    completed_items: [],
  }], evaluations);
  assert.equal(task.pending_items[0].sourceRef.title, "開啟 人工驗收 checklist: c\n進度：3/5 通過，1 失敗");
  assert.equal(task.pending_items[1].sourceRef.title, "開啟 decision: d\n進度：2/4 已決定");
  assert.equal(documentBindingTitle({ kind: "checklist", task: "e", manual: false, progress: { total: 0, done: 0, failed: 0 } }), "開啟 agent checklist: e\n進度：沒有檢查項");
  assert.equal(documentBindingTitle({ kind: "decision", task: "f", progress: null }), "開啟 decision: f");
});
