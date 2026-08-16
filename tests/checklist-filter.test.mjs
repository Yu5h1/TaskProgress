// Checklist filtering is view state: two independent groups, no reordering, and
// no effect on the summary, on dependency blocking, or on what gets saved.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  CHECKLIST_FILTERS,
  checklistFilterCategories,
  createChecklistEditorSession,
  filterChecklistBySelection,
  orderChecklistItems,
  summarizeChecklist,
} from "../viewer/assets/checklist-editor.js";
import { DEFAULT_CAPSULE_ID } from "../viewer/assets/filter-selection.js";

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

test("the filter vocabulary is the check statuses", () => {
  assert.deepEqual([...CHECKLIST_FILTERS.status], ["pending", "passed", "failed"]);
  assert.equal("owner" in CHECKLIST_FILTERS, false, "owner is not a filter");
});

test("every check is matched, not the work item's derived marker", () => {
  // Item 2's derived status is failed, but it also holds an unexecuted check.
  const document = {
    ...fixture(),
    items: [
      { id: 1, title: "One", dependsOn: [], outcome: "", checks: [check(0, "passed")] },
      {
        id: 2,
        title: "Mixed",
        dependsOn: [],
        outcome: "",
        checks: [check(0, "failed"), check(1, "pending")],
      },
    ],
  };
  const pending = filterChecklistBySelection(document, new Set(["pending"]));
  assert.deepEqual(pending.items.map((item) => item.id), [2], "the unexecuted check is findable");
  assert.deepEqual(pending.items[0].checks.map((c) => c.index), [1], "only the matching check");
});

test("a card survives when any check matches and keeps only those checks", () => {
  const byStatus = filterChecklistBySelection(fixture(), new Set(["pending"]));
  assert.deepEqual(byStatus.items.map((item) => item.id), [1, 3]);
  assert.deepEqual(byStatus.items[0].checks.map((c) => c.index), [1]);

  const all = filterChecklistBySelection(fixture(), new Set(["pending", "passed", "failed"]));
  assert.deepEqual(all.items.map((item) => item.id), [1, 2, 3], "everything selected shows all");

  const none = filterChecklistBySelection(fixture(), new Set());
  assert.deepEqual(none.items, [], "an empty selection shows nothing");
});

test("ordering follows the capsule order, and 預設 first means as written", () => {
  const document = {
    ...fixture(),
    items: [
      { id: 1, title: "Pending", dependsOn: [], outcome: "", checks: [check(0, "pending")] },
      { id: 2, title: "Failed", dependsOn: [], outcome: "", checks: [check(0, "failed")] },
      { id: 3, title: "Passed", dependsOn: [], outcome: "", checks: [check(0, "passed")] },
    ],
  };
  const asWritten = orderChecklistItems(document, [DEFAULT_CAPSULE_ID, "failed", "passed", "pending"]);
  assert.deepEqual(asWritten.items.map((i) => i.id), [1, 2, 3], "the document's own order");

  // Only what sits left of 預設 is grouped; the rest keeps the document order.
  const partial = orderChecklistItems(document, ["failed", DEFAULT_CAPSULE_ID, "passed", "pending"]);
  assert.deepEqual(partial.items.map((i) => i.id), [2, 1, 3], "failures lead, the rest as written");

  const grouped = orderChecklistItems(document, ["failed", "passed", "pending", DEFAULT_CAPSULE_ID]);
  assert.deepEqual(grouped.items.map((i) => i.id), [2, 3, 1], "everything left of 預設 groups");
});

test("counts stay whole-document under an active filter", () => {
  const document = fixture();
  const whole = summarizeChecklist(document);
  assert.deepEqual(whole.checks, { total: 4, passed: 1, failed: 1, pending: 2 });
  const filtered = summarizeChecklist(filterChecklistBySelection(document, new Set(["pending"])));
  assert.notDeepEqual(filtered.checks, whole.checks, "which is why the screen summarises the document");
});

test("category counts describe the whole document and include empty tags", () => {
  const categories = checklistFilterCategories({
    ...fixture(),
    items: [{ id: 1, title: "One", dependsOn: [], outcome: "", checks: [check(0, "pending")] }],
  });
  assert.deepEqual(
    categories.map((entry) => [entry.id, entry.count]),
    [["pending", 1], ["passed", 0], ["failed", 0]],
    "a tag with no matches still renders",
  );
});

test("filtering never reaches a save", () => {
  const session = createChecklistEditorSession(fixture());
  session.dispatch({ type: "cycle-result", workItemId: 1, checkIndex: 1 });
  assert.deepEqual(session.prepareSave().results, [
    { workItemId: 1, checkIndex: 1, status: "passed", observed: null },
  ]);
  assert.equal(typeof session.setFilter, "undefined");
});

test("the Checklist screen wires one strip with no owner capsules", async () => {
  const app = await readFile(
    new URL("../experiments/editor-svelte-spike/src/ChecklistApp.svelte", import.meta.url),
    "utf8",
  );
  assert.equal((app.match(/<FilterStrip/gu) ?? []).length, 1);
  // Owner is still shown on each check; it is simply not a filter capsule.
  assert.match(app, /const FILTER_TAGS = \["pending", "passed", "failed"\];/u);
  assert.doesNotMatch(app, /owner:|OWNER_FILTER/u, "owner is not a filter");
  assert.match(app, /filterChecklistBySelection\(orderChecklistItems\(/u);
  assert.match(app, /defaultLit=\{isDefaultLit\(selection\)\}/u);
});
