// Time registered as a trusted module. Since the module now builds its own
// runtime controller in attach(), these tests hand it the real example
// projection rather than a stubbed host — which means they exercise the
// actual controller, not a mock of it.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { activateCapsule, attachModules, collectCapsules, disposeModules } from "../viewer/assets/module-composition.js";
import { createTrustedModuleRegistry } from "../viewer/assets/module-registry.js";
import {
  TIME_ITEM_CAPSULE_ID,
  TIME_MODULE_TYPE,
  TIME_PROJECT_CAPSULE_ID,
  createTimeModuleDefinition,
} from "../viewer/assets/time-module-definition.js";

const analysis = JSON.parse(await readFile(
  new URL("../experiments/time-reference/examples/time.analysis.json", import.meta.url),
  "utf8",
));

const TASK_ID = "time-reference-prototype";
const ITEM_ID = "define-draft-schemas";

function attachTime({ data = analysis, onChanged = () => {}, workProgressRatio = 0.5, canEditEstimates = () => true } = {}) {
  const registry = createTrustedModuleRegistry([createTimeModuleDefinition()]);
  return attachModules(registry, [{
    type: TIME_MODULE_TYPE,
    schemaVersion: data.schema_version,
    data,
    host: { getWorkProgressRatio: () => workProgressRatio, onChanged, canEditEstimates },
  }]);
}

test("the definition satisfies the registry contract", () => {
  const definition = createTimeModuleDefinition();
  assert.equal(definition.type, "taskprogress.time");
  assert.deepEqual(definition.supportedSchemaVersions, ["0.2"]);
  assert.deepEqual(definition.slots, ["project-summary", "task-body", "item-inline"]);
  assert.doesNotThrow(() => createTrustedModuleRegistry([definition]));
});

// --- the module owns its controller ---

test("attach builds the controller from the projection it was given", () => {
  const { attached, diagnostics } = attachTime();
  assert.equal(attached.length, 1);
  assert.deepEqual(diagnostics, []);

  const { capsules } = collectCapsules(attached, "project-summary");
  assert.equal(capsules[0].id, TIME_PROJECT_CAPSULE_ID);
  // The example projection carries a real deadline, so the capsule shows a
  // delivery date and a risk dot rather than the undated fallback.
  assert.match(capsules[0].label, /交付/);
  assert.equal(capsules[0].showDot, true);
  assert.equal(capsules[0].showChevron, true);
});

test("a malformed projection is isolated as a module diagnostic, not thrown at the host", () => {
  // Construction happens inside attach(), so a projection the controller
  // cannot read must degrade the module alone.
  const { attached, diagnostics } = attachTime({ data: { ...analysis, tasks: null } });
  assert.equal(attached.length, 0);
  assert.equal(diagnostics[0].code, "attach_failed");
});

// --- slots ---

test("the task label is the sum the projection already carries", () => {
  const { attached } = attachTime();
  const { capsules } = collectCapsules(attached, "task-body", { taskId: TASK_ID });
  assert.equal(capsules.length, 1);
  assert.match(capsules[0].label, /^約需 /);
  assert.equal(capsules[0].interactive, false, "a derived total must not look pressable");
  assert.equal(capsules[0].sortable, false);
});

test("a task the projection does not cover contributes no label", () => {
  const { attached } = attachTime();
  assert.deepEqual(collectCapsules(attached, "task-body", { taskId: "no-such-task" }).capsules, []);
});

test("an item with an estimate gets a capsule carrying its hours", () => {
  const { attached } = attachTime();
  const { capsules } = collectCapsules(attached, "item-inline", {
    taskId: TASK_ID, itemId: ITEM_ID, itemTitle: "定義 Draft Schema",
  });
  assert.equal(capsules.length, 1);
  assert.equal(capsules[0].id, TIME_ITEM_CAPSULE_ID);
  assert.match(capsules[0].label, /hr$/);
  assert.equal(capsules[0].className, "time-item-button");
  assert.match(capsules[0].ariaLabel, /定義 Draft Schema，.*，查看估算依據/);
});

test("an item with no estimate gets no capsule — what leaves an unset row empty", () => {
  const { attached } = attachTime();
  assert.deepEqual(collectCapsules(attached, "item-inline", {
    taskId: TASK_ID, itemId: "not-estimated", itemTitle: "未估算",
  }).capsules, []);
});

test("both slots use the same capsule id, so one saved order applies to both strips", () => {
  const { attached } = attachTime();
  const project = collectCapsules(attached, "project-summary").capsules[0];
  const item = collectCapsules(attached, "item-inline", {
    taskId: TASK_ID, itemId: ITEM_ID, itemTitle: "t",
  }).capsules[0];
  assert.equal(project.id, item.id);
});

// --- activation drives the module's own dialog ---

test("activating a capsule opens that subject's detail and tells the host to repaint", () => {
  let repaints = 0;
  const { attached } = attachTime({ onChanged: () => { repaints += 1; } });
  const editing = { editing: false, timeDraftView: null, hasTimeDraft: false, deliveryPreview: null, callbacks: {} };

  assert.equal(attached[0].instance.detailProps(editing).open ?? false, false);

  activateCapsule(attached, "project-summary", TIME_PROJECT_CAPSULE_ID);
  assert.equal(repaints, 1, "the host has to be told, since it holds the mount");
  assert.equal(attached[0].instance.detailProps(editing).kind, "project");

  activateCapsule(attached, "item-inline", TIME_ITEM_CAPSULE_ID, {
    taskId: TASK_ID, itemId: ITEM_ID, itemTitle: "定義 Draft Schema",
  });
  assert.equal(attached[0].instance.detailProps(editing).kind, "item");
});

test("detail props carry the editing session through untouched", () => {
  const { attached } = attachTime();
  const onManualEstimate = () => {};
  const props = attached[0].instance.detailProps({
    editing: true,
    timeDraftView: null,
    hasTimeDraft: true,
    deliveryPreview: { next: { available: true } },
    callbacks: { onManualEstimate },
  });
  assert.equal(props.editing, true);
  assert.deepEqual(props.deliveryPreview, { next: { available: true } });
  assert.equal(props.onManualEstimate, onManualEstimate);
  // The module supplies its own dialog commands rather than taking them from
  // the host, which no longer holds a controller to build them from.
  assert.equal(typeof props.onClose, "function");
  assert.equal(typeof props.onSetTab, "function");
});

// --- lifecycle ---

test("start schedules the clock refresh and dispose stops it", () => {
  const originalSetInterval = globalThis.setInterval;
  const originalClearInterval = globalThis.clearInterval;
  const scheduled = [];
  const cleared = [];
  globalThis.setInterval = (fn, ms) => { scheduled.push(ms); return `timer-${scheduled.length}`; };
  globalThis.clearInterval = (id) => cleared.push(id);

  try {
    const { attached } = attachTime();
    attached[0].instance.start();
    assert.deepEqual(scheduled, [60_000], "urgency depends on the clock, so it re-runs每分鐘");

    disposeModules(attached);
    assert.deepEqual(cleared, ["timer-1"], "a scope switch must actually stop the timer");
  } finally {
    globalThis.setInterval = originalSetInterval;
    globalThis.clearInterval = originalClearInterval;
  }
});

test("dispose is safe without start, so a module that never ran can still be torn down", () => {
  const { attached } = attachTime();
  assert.deepEqual(disposeModules(attached), []);
});

// --- isolation ---

test("the definition stays off the DOM apart from the listeners it owns and removes", async () => {
  const source = await readFile(new URL("../viewer/assets/time-module-definition.js", import.meta.url), "utf8");
  assert.doesNotMatch(source, /document\.querySelector|createUiView\(/u);
  // Every listener it adds must be removed by dispose, or a scope switch
  // leaks one per load.
  assert.equal((source.match(/addEventListener/gu) ?? []).length, 2);
  assert.equal((source.match(/removeEventListener/gu) ?? []).length, 2);
});

// --- unset estimates ---

test("an unset item shows nothing in preview and an entry point while editing", () => {
  // Every item in this fixture that the analyzer had no estimate for carries
  // mode "default"; the Viewer treats that as unset rather than as 8 hours.
  const unsetAnalysis = {
    ...analysis,
    tasks: [{
      ...analysis.tasks[0],
      items: analysis.tasks[0].items.map((item) => ({ ...item, mode: "default" })),
    }],
  };
  const { attached } = attachTime({ data: unsetAnalysis });
  const subject = { taskId: TASK_ID, itemId: ITEM_ID, itemTitle: "定義 Draft Schema" };

  assert.deepEqual(
    collectCapsules(attached, "item-inline", subject).capsules,
    [],
    "preview must not show a value nobody set",
  );

  const editing = collectCapsules(attached, "item-inline", subject, { editing: true }).capsules;
  assert.equal(editing.length, 1);
  assert.equal(editing[0].label, "-hr");
  assert.match(editing[0].className, /time-item-unset/);
  assert.match(editing[0].ariaLabel, /尚未估算/);
});

test("no entry point is offered when there is nowhere to save the estimate", () => {
  const unsetAnalysis = {
    ...analysis,
    tasks: [{
      ...analysis.tasks[0],
      items: analysis.tasks[0].items.map((item) => ({ ...item, mode: "default" })),
    }],
  };
  const registry = createTrustedModuleRegistry([createTimeModuleDefinition()]);
  const { attached } = attachModules(registry, [{
    type: TIME_MODULE_TYPE,
    schemaVersion: unsetAnalysis.schema_version,
    data: unsetAnalysis,
    host: { getWorkProgressRatio: () => 0, onChanged: () => {}, canEditEstimates: () => false },
  }]);
  assert.deepEqual(
    collectCapsules(attached, "item-inline", {
      taskId: TASK_ID, itemId: ITEM_ID, itemTitle: "t",
    }, { editing: true }).capsules,
    [],
    "a marker that opens a panel which cannot save is worse than none",
  );
});

test("a task whose items are all unset reports no total, and a partial one reports what is set", () => {
  const items = analysis.tasks[0].items;
  const allUnset = {
    ...analysis,
    tasks: [{ ...analysis.tasks[0], items: items.map((i) => ({ ...i, mode: "default" })) }],
  };
  assert.deepEqual(
    collectCapsules(attachTime({ data: allUnset }).attached, "task-body", { taskId: TASK_ID }).capsules,
    [],
    "nothing estimated means nothing to show — not a placeholder",
  );

  const partial = {
    ...analysis,
    tasks: [{
      ...analysis.tasks[0],
      items: items.map((i, index) => (index === 0 ? i : { ...i, mode: "default" })),
    }],
  };
  const { capsules } = collectCapsules(
    attachTime({ data: partial }).attached,
    "task-body",
    { taskId: TASK_ID },
  );
  assert.equal(capsules.length, 1, "a partial total is real data and must still show");
  // Only the one estimated item counts, not the projection's own total, which
  // the analyzer computed with the substituted defaults included.
  assert.match(capsules[0].label, new RegExp(String(items[0].display_hours)));
});

test("a project with nothing estimated shows no summary capsule in preview, and an entry point while editing", () => {
  // The analyzer now withholds the deadline block in this case, so the
  // capsule must not fall through to 交付日未定 — that names a cause the
  // reader would then go and "fix" on a delivery date that is already set.
  const allUnset = {
    ...analysis,
    tasks: analysis.tasks.map((task) => ({
      ...task,
      items: task.items.map((item) => ({ ...item, mode: "default" })),
    })),
    summary: { ...analysis.summary, deadline: undefined },
  };
  const { attached } = attachTime({ data: allUnset });

  assert.deepEqual(
    collectCapsules(attached, "project-summary", {}).capsules,
    [],
    "a project total nobody set must not occupy the row",
  );

  const editing = collectCapsules(attached, "project-summary", {}, { editing: true }).capsules;
  assert.equal(editing.length, 1, "edit mode keeps the way into the panel");
  assert.equal(editing[0].label, "-hr");
  assert.doesNotMatch(editing[0].label, /交付日未定/u);
});
