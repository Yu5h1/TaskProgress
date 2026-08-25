// Time registered as a trusted module. The point of these assertions is the
// boundary: the definition produces a descriptor and dispatches activation,
// and it reads the snapshot *at capsule time* rather than capturing it, so a
// refresh tick actually changes what the capsule says.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { activateCapsule, attachModules, collectCapsules } from "../viewer/assets/module-composition.js";
import { createTrustedModuleRegistry } from "../viewer/assets/module-registry.js";
import {
  TIME_MODULE_TYPE,
  TIME_PROJECT_CAPSULE_ID,
  createTimeModuleDefinition,
} from "../viewer/assets/time-module-definition.js";

function snapshot(overrides = {}) {
  return {
    summary: {
      hidden: false,
      disabled: false,
      className: "time-summary-button no-deadline",
      ariaLabel: "時間參考：交付日未定，查看工程估算",
      label: "交付日未定",
      showDot: false,
      showChevron: true,
      ...overrides,
    },
  };
}

function attachTime(host) {
  const registry = createTrustedModuleRegistry([createTimeModuleDefinition()]);
  return attachModules(registry, [{ type: TIME_MODULE_TYPE, schemaVersion: "0.2", data: {}, host }]);
}

test("the definition satisfies the registry contract", () => {
  const definition = createTimeModuleDefinition();
  assert.equal(definition.type, "taskprogress.time");
  assert.deepEqual(definition.supportedSchemaVersions, ["0.2"]);
  assert.deepEqual(definition.slots, ["project-summary", "item-inline"]);
  assert.doesNotThrow(() => createTrustedModuleRegistry([definition]));
});

test("the capsule carries the render layer's props under the module's own id", () => {
  const { attached } = attachTime({ getSnapshot: () => snapshot(), openProjectDetail: () => {} });
  const { capsules } = collectCapsules(attached, "project-summary");
  assert.equal(capsules.length, 1);
  assert.equal(capsules[0].id, TIME_PROJECT_CAPSULE_ID);
  assert.equal(capsules[0].label, "交付日未定");
  assert.equal(capsules[0].showChevron, true);
  assert.equal(capsules[0].showDot, false);
  assert.match(capsules[0].className, /time-summary-button/);
});

test("no time data means no capsule at all, not a placeholder one", () => {
  const { attached } = attachTime({ getSnapshot: () => null, openProjectDetail: () => {} });
  assert.deepEqual(collectCapsules(attached, "project-summary").capsules, []);
});

test("the snapshot is read when the capsule is built, so a refresh changes what it says", () => {
  // Capturing the snapshot at attach time would freeze the capsule at
  // whatever urgency the page loaded with — the 60-second refresh would then
  // update nothing.
  let current = snapshot({ label: "交付日未定" });
  const { attached } = attachTime({ getSnapshot: () => current, openProjectDetail: () => {} });

  assert.equal(collectCapsules(attached, "project-summary").capsules[0].label, "交付日未定");
  current = snapshot({ label: "8/1 交付", showDot: true, className: "time-summary-button critical" });
  const after = collectCapsules(attached, "project-summary").capsules[0];
  assert.equal(after.label, "8/1 交付");
  assert.equal(after.showDot, true);
  assert.match(after.className, /critical/);
});

test("activation reaches the host's open-detail action, and only for its own capsule", () => {
  let opened = 0;
  const { attached } = attachTime({ getSnapshot: () => snapshot(), openProjectDetail: () => { opened += 1; } });
  const [entry] = attached;

  assert.equal(entry.instance.ownsCapsule("project-summary", TIME_PROJECT_CAPSULE_ID), true);
  assert.equal(entry.instance.ownsCapsule("project-summary", "cost"), false);
  assert.equal(entry.instance.ownsCapsule("task-header", TIME_PROJECT_CAPSULE_ID), false);

  entry.instance.activate("project-summary", TIME_PROJECT_CAPSULE_ID);
  assert.equal(opened, 1);
  entry.instance.activate("project-summary", "cost");
  assert.equal(opened, 1, "a capsule this module does not own must not trigger its action");
});

// --- item-inline slot ---

function itemTime(overrides = {}) {
  return { display_hours: 8, likely_minutes: 480, ...overrides };
}

function attachTimeWithItems(items, extra = {}) {
  return attachTime({
    getSnapshot: () => snapshot(),
    openProjectDetail: () => {},
    getItemTime: (itemId) => items[itemId] ?? null,
    canOpenItemDetail: true,
    openItemDetail: () => {},
    ...extra,
  });
}

test("an item with an estimate gets a capsule carrying its formatted hours", () => {
  const { attached } = attachTimeWithItems({ "item-a": itemTime() });
  const { capsules } = collectCapsules(attached, "item-inline", {
    taskId: "task-a", itemId: "item-a", itemTitle: "做一件事",
  });
  assert.equal(capsules.length, 1);
  assert.equal(capsules[0].label, "8 hr");
  assert.equal(capsules[0].className, "time-item-button");
  assert.equal(capsules[0].sortable, true);
  assert.match(capsules[0].ariaLabel, /做一件事，8 hr，查看估算依據/);
});

test("an item with no estimate gets no capsule — which is what leaves an unset row empty", () => {
  const { attached } = attachTimeWithItems({ "item-a": itemTime() });
  const { capsules } = collectCapsules(attached, "item-inline", {
    taskId: "task-a", itemId: "item-without-estimate", itemTitle: "未估算",
  });
  assert.deepEqual(capsules, []);
});

test("the accessible name says 'view basis' only when a detail panel can actually open", () => {
  const { attached } = attachTimeWithItems({ "item-a": itemTime() }, { canOpenItemDetail: false });
  const { capsules } = collectCapsules(attached, "item-inline", {
    taskId: "task-a", itemId: "item-a", itemTitle: "做一件事",
  });
  assert.match(capsules[0].ariaLabel, /目前分析 8 hr/);
  assert.doesNotMatch(capsules[0].ariaLabel, /查看估算依據/);
});

test("item activation carries the subject through, so the right item's panel opens", () => {
  const opened = [];
  const { attached } = attachTimeWithItems(
    { "item-a": itemTime() },
    { openItemDetail: (itemId, itemTitle, taskId) => opened.push([itemId, itemTitle, taskId]) },
  );
  const subject = { taskId: "task-a", itemId: "item-a", itemTitle: "做一件事" };

  assert.equal(activateCapsule(attached, "item-inline", "time", subject), true);
  assert.deepEqual(opened, [["item-a", "做一件事", "task-a"]]);
});

test("both slots use the same capsule id, so one saved module order applies to both strips", () => {
  const { attached } = attachTimeWithItems({ "item-a": itemTime() });
  const project = collectCapsules(attached, "project-summary").capsules[0];
  const item = collectCapsules(attached, "item-inline", {
    taskId: "task-a", itemId: "item-a", itemTitle: "做一件事",
  }).capsules[0];
  assert.equal(project.id, item.id);
});

test("the definition stays off the DOM and owns no timer yet", async () => {
  const source = await readFile(new URL("../viewer/assets/time-module-definition.js", import.meta.url), "utf8");
  assert.doesNotMatch(source, /document\.|window\.|querySelector\(|createUiView\(/u);
  // Controller/timer ownership has deliberately not moved in this step; the
  // comment in the file says so, and this keeps that honest.
  assert.doesNotMatch(source, /setInterval|createTimeReferenceController/u);
});
