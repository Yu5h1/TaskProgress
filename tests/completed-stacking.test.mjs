// Completed decisions and work items stack newest first on screen while the
// file keeps its order. Design: Documentation/CompletedStackingPlan.md.
import test from "node:test";
import assert from "node:assert/strict";

import { latestRecorded, stackChecklistItems, stackDecisions } from "../viewer/assets/completed-stacking.js";

test("pending decisions lead in file order; decided ones follow, latest confirmation first", () => {
  const decisions = [
    { id: "a", status: "decided", answer: { confirmed_at: "2026-10-21T04:00:00Z" } },
    { id: "b", status: "pending", answer: null },
    { id: "c", status: "decided", answer: { confirmed_at: "2026-10-23T03:00:00Z" } },
    { id: "d", status: "pending", answer: null },
    { id: "e", status: "decided", answer: { confirmed_at: "2026-10-22T00:00:00Z" } },
  ];
  assert.deepEqual(stackDecisions(decisions).map((d) => d.id), ["b", "d", "c", "e", "a"]);
  assert.deepEqual(decisions.map((d) => d.id), ["a", "b", "c", "d", "e"], "the source array is untouched");
  assert.deepEqual(stackDecisions([]), []);
});

const item = (id, status, ...checks) => ({ id, status, checks: checks.map((check) => ({ status: "passed", validity: "valid", ...check })) });

test("the latest valid passed recording dates a work item; untagged-only items have no date", () => {
  assert.equal(latestRecorded(item(1, "passed", { recordedAt: "2026-10-20T00:00:00Z" }, { recordedAt: "2026-10-22T00:00:00Z" })), Date.parse("2026-10-22T00:00:00Z"));
  assert.equal(latestRecorded(item(2, "passed", {}, {})), null);
  assert.equal(latestRecorded(item(3, "passed", { recordedAt: "2026-10-22T00:00:00Z", validity: "released" })), null, "a void recording does not count");
  assert.equal(latestRecorded(item(4, "pending", { recordedAt: "2026-10-22T00:00:00Z", status: "failed" })), null);
});

test("as written, passed items move behind unfinished ones: dated newest first, undated after in file order", () => {
  const items = [
    item(1, "passed", { recordedAt: "2026-10-20T00:00:00Z" }),
    item(2, "pending", {}),
    item(3, "passed", {}),
    item(4, "passed", { recordedAt: "2026-10-23T00:00:00Z" }),
    item(5, "failed", {}),
    item(6, "passed", {}),
  ];
  assert.deepEqual(stackChecklistItems(items).map((i) => i.id), [2, 5, 4, 1, 3, 6]);
  assert.deepEqual(items.map((i) => i.id), [1, 2, 3, 4, 5, 6]);
});

test("under an explicit grouping, passed items only reorder among their own slots", () => {
  const grouped = [
    item(1, "passed", { recordedAt: "2026-10-20T00:00:00Z" }),
    item(4, "passed", { recordedAt: "2026-10-23T00:00:00Z" }),
    item(2, "pending", {}),
    item(3, "passed", {}),
  ];
  assert.deepEqual(stackChecklistItems(grouped, { asWritten: false }).map((i) => i.id), [4, 1, 2, 3]);
});
