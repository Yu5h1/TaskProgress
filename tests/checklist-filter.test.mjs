// Checklist filtering is view state: two independent groups, no reordering, and
// no effect on the summary, on dependency blocking, or on what gets saved.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  CHECKLIST_FILTERS,
  checklistFilterCategories,
  createChecklistEditorSession,
  filterChecklist,
  summarizeChecklist,
} from "../viewer/assets/checklist-editor.js";

function check(index, status, isManual = false) {
  return {
    index,
    status,
    title: `Check ${index}`,
    isManual,
    action: "Do it.",
    expect: "It works.",
    reason: null,
    observed: status === "failed" ? "It broke." : null,
    resolved: null,
  };
}

function fixture() {
  return {
    fileName: "implementation-checklist.md",
    revision: "abc",
    roundIdentity: "plan.md#round",
    items: [
      {
        id: 1,
        title: "First",
        dependsOn: [],
        outcome: "",
        checks: [check(0, "passed"), check(1, "pending", true)],
      },
      { id: 2, title: "Second", dependsOn: [1], outcome: "", checks: [check(0, "failed")] },
      { id: 3, title: "Third", dependsOn: [], outcome: "", checks: [check(0, "pending")] },
    ],
  };
}

test("the two filter groups are status and owner", () => {
  assert.deepEqual([...CHECKLIST_FILTERS.status], ["pending", "passed", "failed"]);
  assert.deepEqual([...CHECKLIST_FILTERS.owner], ["manual", "agent"]);
});

test("a filter keeps only matching checks and drops emptied work items", () => {
  const byStatus = filterChecklist(fixture(), { status: "pending" });
  assert.deepEqual(byStatus.items.map((item) => item.id), [1, 3]);
  assert.deepEqual(byStatus.items[0].checks.map((c) => c.index), [1], "only the pending check");

  const byOwner = filterChecklist(fixture(), { owner: "manual" });
  assert.deepEqual(byOwner.items.map((item) => item.id), [1]);

  // The groups are independent and combine.
  assert.deepEqual(
    filterChecklist(fixture(), { status: "pending", owner: "agent" }).items.map((item) => item.id),
    [3],
  );
});

test("work item order always follows the document", () => {
  const filtered = filterChecklist(fixture(), { status: "pending" });
  assert.deepEqual(filtered.items.map((item) => item.id), [1, 3], "never resorted");
  const unfiltered = filterChecklist(fixture(), {});
  assert.deepEqual(unfiltered.items.map((item) => item.id), [1, 2, 3]);
});

test("an unknown or empty filter changes nothing", () => {
  const document = fixture();
  assert.equal(filterChecklist(document, {}), document, "no filter is the document itself");
  assert.equal(filterChecklist(document, { status: "bogus" }), document);
});

test("counts stay whole-document under an active filter", () => {
  const document = fixture();
  const whole = summarizeChecklist(document);
  const filtered = summarizeChecklist(filterChecklist(document, { status: "pending" }));

  assert.deepEqual(whole.checks, { total: 4, passed: 1, failed: 1, pending: 2 });
  // Summarising a filtered view would misreport, which is why the screen
  // summarises the document and filters only what it lists.
  assert.notDeepEqual(filtered.checks, whole.checks);
});

test("a filtered-out failure still blocks and is still the next step", () => {
  const document = fixture();
  // Item 2 holds the only failure; hide it behind a "pending" filter.
  const summary = summarizeChecklist(document);
  assert.equal(summary.nextStep.workItemId, 2, "the failure leads");

  const hidden = filterChecklist(document, { status: "pending" });
  assert.equal(hidden.items.some((item) => item.id === 2), false, "hidden from the list");
  assert.equal(
    summarizeChecklist(document).nextStep.workItemId,
    2,
    "still the next step: the summary reads the document",
  );
});

test("category counts describe the whole document, not the filtered view", () => {
  const groups = checklistFilterCategories(fixture(), { status: "pending" });
  assert.deepEqual(
    groups.status.map((entry) => [entry.id, entry.count]),
    [["pending", 2], ["passed", 1], ["failed", 1]],
  );
  assert.deepEqual(
    groups.owner.map((entry) => [entry.id, entry.count]),
    [["manual", 1], ["agent", 3]],
  );
  assert.equal(groups.status.find((entry) => entry.id === "pending").selected, true);
});

test("filtering never reaches a save", () => {
  const session = createChecklistEditorSession(fixture());
  session.dispatch({ type: "cycle-result", workItemId: 1, checkIndex: 1 });
  const prepared = session.prepareSave();
  assert.deepEqual(prepared.results, [
    { workItemId: 1, checkIndex: 1, status: "passed", observed: null },
  ]);
  // The session has no filter to apply: filtering is the screen's view state.
  assert.equal(typeof session.setFilter, "undefined");
});

test("the Checklist screen wires both groups without reordering", async () => {
  const app = await readFile(
    new URL("../experiments/editor-svelte-spike/src/ChecklistApp.svelte", import.meta.url),
    "utf8",
  );
  assert.match(app, /import FilterStrip from "\.\/FilterStrip\.svelte"/u);
  assert.equal((app.match(/<FilterStrip/gu) ?? []).length, 2, "status and owner");
  assert.doesNotMatch(app, /reorderable/u, "the document owns the order");
  assert.match(app, /filterChecklist\(view\.document, filter\)\.items/u);
  // The summary reads the document, never the filtered list.
  assert.match(app, /stats=\{summaryStats\(view\.summary\)\}/u);
  assert.doesNotMatch(app, /summarizeChecklist\(/u);
});
