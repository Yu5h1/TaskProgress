// The Checklist screen's own counts and next-step selection. The numbers are
// derived in the framework-neutral session; the screen only labels them.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createChecklistEditorSession, summarizeChecklist } from "../viewer/assets/checklist-editor.js";

function check(index, status, overrides = {}) {
  return {
    index,
    status,
    title: `Check ${index}`,
    isManual: false,
    action: `Do ${index}.`,
    expect: `Sees ${index}.`,
    reason: null,
    observed: status === "failed" ? "It broke." : null,
    resolved: null,
    ...overrides,
  };
}

function documentFixture(items) {
  return { fileName: "task-a.checklist", revision: "abc", roundIdentity: "plan.md#round", items };
}

test("counts cover every work item and every check in the document", () => {
  const summary = summarizeChecklist(documentFixture([
    { id: 1, title: "Done", dependsOn: [], outcome: "", checks: [check(0, "passed"), check(1, "passed")] },
    { id: 2, title: "Broken", dependsOn: [], outcome: "", checks: [check(0, "failed")] },
    { id: 3, title: "Waiting", dependsOn: [], outcome: "", checks: [check(0, "pending"), check(1, "passed")] },
  ]));

  assert.deepEqual(summary.items, { total: 3, passed: 1, failed: 1, pending: 1 });
  assert.deepEqual(summary.checks, { total: 5, passed: 3, failed: 1, pending: 1 });
  assert.deepEqual([...summary.cells], ["passed", "passed", "failed", "pending", "passed"]);
});

test("the next step prefers a failure over a pending check", () => {
  const summary = summarizeChecklist(documentFixture([
    { id: 1, title: "Waiting", dependsOn: [], outcome: "", checks: [check(0, "pending")] },
    { id: 2, title: "Broken", dependsOn: [], outcome: "", checks: [check(0, "failed")] },
  ]));

  assert.equal(summary.nextStep.workItemId, 2, "a failure is the stop condition to answer first");
  assert.equal(summary.nextStep.title, "Check 0");
});

test("the next step skips a check blocked by an unfinished dependency", () => {
  const summary = summarizeChecklist(documentFixture([
    { id: 1, title: "Blocker", dependsOn: [], outcome: "", checks: [check(0, "pending")] },
    { id: 2, title: "Blocked", dependsOn: [1], outcome: "", checks: [check(0, "pending")] },
  ]));
  assert.equal(summary.nextStep.workItemId, 1);

  const unblocked = summarizeChecklist(documentFixture([
    { id: 1, title: "Blocker", dependsOn: [], outcome: "", checks: [check(0, "passed")] },
    { id: 2, title: "Blocked", dependsOn: [1], outcome: "", checks: [check(0, "pending")] },
  ]));
  assert.equal(unblocked.nextStep.workItemId, 2, "a satisfied dependency stops blocking");

  // Every remaining item waits on something unfinished, so there is nothing to
  // start rather than a wrong suggestion.
  const stalled = summarizeChecklist(documentFixture([
    { id: 1, title: "Blocker", dependsOn: [], outcome: "", checks: [check(0, "passed"), check(1, "pending")] },
    { id: 2, title: "Blocked", dependsOn: [1], outcome: "", checks: [check(0, "pending")] },
  ]));
  assert.equal(stalled.nextStep.workItemId, 1, "the blocker's own pending check is the next step");
});

test("a finished document has no next step", () => {
  const summary = summarizeChecklist(documentFixture([
    { id: 1, title: "Done", dependsOn: [], outcome: "", checks: [check(0, "passed")] },
  ]));
  assert.equal(summary.nextStep, null);
  assert.deepEqual(summary.items, { total: 1, passed: 1, failed: 0, pending: 0 });
});

test("the session snapshot carries the summary and keeps it whole-document", () => {
  const session = createChecklistEditorSession(documentFixture([
    {
      id: 1,
      title: "Verify",
      dependsOn: [],
      outcome: "",
      checks: [check(0, "passed"), check(1, "pending", { isManual: true })],
    },
  ]));

  let view = session.snapshot();
  assert.deepEqual(view.summary.checks, { total: 2, passed: 1, failed: 0, pending: 1 });
  assert.equal(view.summary.nextStep.isManual, true);

  view = session.dispatch({ type: "cycle-result", workItemId: 1, checkIndex: 1 });
  assert.deepEqual(view.summary.checks, { total: 2, passed: 2, failed: 0, pending: 0 });
  assert.equal(view.summary.nextStep, null);
  assert.equal(view.summary.items.passed, 1, "the derived work item follows its checks");
});

test("the screen labels the shared summary instead of drawing its own", async () => {
  const app = await readFile(
    new URL("../experiments/editor-svelte-spike/src/ChecklistApp.svelte", import.meta.url),
    "utf8",
  );
  assert.match(app, /import NextStepCard from "\.\/NextStepCard\.svelte"/u);
  assert.match(app, /import ProgressSummary from "\.\/ProgressSummary\.svelte"/u);
  assert.match(app, /bar=\{\{ form: "segmented", cells: view\.summary\.cells \}\}/u);
  assert.match(app, /\{#if view\.summary\.nextStep\}/u);
  // No second count anywhere: the screen reads the derived summary only. It
  // may filter its own capsule list, but never recount the document.
  assert.doesNotMatch(app, /summary\.[a-z]+\.filter\(|\.reduce\(/u, "counting belongs to the session");
  assert.doesNotMatch(app, /document\.items\.filter\(|checks\.length/u);
});
