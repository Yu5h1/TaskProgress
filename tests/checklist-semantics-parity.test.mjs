// Runs the browser-side Checklist semantics against the same language-neutral
// cases copied into the C# contract test output.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createChecklistEditorSession } from "../viewer/assets/checklist-editor.js";

const cases = JSON.parse(await readFile(
  new URL("./fixtures/checklist-semantics.json", import.meta.url),
  "utf8",
));

function documentFor(checks) {
  return {
    fileName: "semantics.checklist",
    revision: "fixture",
    roundIdentity: "plan.md#semantics",
    items: [{
      id: 1,
      status: "pending",
      title: "Semantics",
      dependsOn: [],
      outcome: "Both runtimes agree.",
      checks: checks.map((check, index) => ({
        index,
        title: `Check ${index + 1}`,
        isManual: check.manual ?? false,
        action: "Apply the fixture case.",
        expect: "The canonical result matches.",
        reason: check.manual ? "Shared semantics fixture." : null,
        status: check.status,
        observed: check.observed ?? null,
        resolved: check.resolved ?? null,
      })),
    }],
  };
}

for (const fixture of cases.status_cases) {
  test(`Checklist status parity: ${fixture.name}`, () => {
    const session = createChecklistEditorSession(documentFor(
      fixture.checks.map((status) => ({ status })),
    ));
    assert.equal(session.snapshot().document.items[0].status, fixture.expected);
  });
}

for (const fixture of cases.transition_cases) {
  test(`Checklist transition parity: ${fixture.name}`, () => {
    const session = createChecklistEditorSession(documentFor([{
      ...fixture.initial,
      manual: fixture.manual,
    }]));
    let failed = false;
    try {
      if (fixture.target.status !== fixture.initial.status) {
        session.dispatch({
          type: "set-result",
          workItemId: 1,
          checkIndex: 0,
          status: fixture.target.status,
        });
      }
      if (fixture.target.status === "failed" && fixture.target.observed !== null) {
        session.dispatch({
          type: "set-observed",
          workItemId: 1,
          checkIndex: 0,
          value: fixture.target.observed,
        });
      }
      failed = session.prepareSave().errors.length > 0;
    } catch {
      failed = true;
    }

    assert.equal(failed, fixture.expected.error, fixture.name);
    if (failed) return;
    const item = session.snapshot().document.items[0];
    const check = item.checks[0];
    assert.equal(check.status, fixture.expected.status);
    assert.equal(check.observed, fixture.expected.observed);
    assert.equal(check.resolved, fixture.expected.resolved);
    assert.equal(item.status, fixture.expected.item_status);
  });
}
