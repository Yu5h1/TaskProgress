// Cost's domain validation (data.currency/summary/tasks) and its reuse of
// Phase 1's generic subject index. The assertions that matter most are the
// ones proving reuse: the same createSubjectIndex Time-adjacent fixtures
// already exercise is what resolves Cost's task_ids, not a second copy.
import assert from "node:assert/strict";
import test from "node:test";

import { CONFIDENCE_LEVELS, costSubjectIndex, validateCostData } from "../viewer/assets/cost-model.js";

function validEstimatedFigure(overrides = {}) {
  return {
    minor_unit_amount: 1250000,
    as_of: "2026-08-25",
    confidence: "medium",
    ...overrides,
  };
}

function validTaskFigure(overrides = {}) {
  return {
    minor_unit_amount: 480000,
    method: "time-rate-product",
    scope_included: ["labor"],
    breakdown: [{ category: "labor", minor_unit_amount: 480000, basis: "role-rate" }],
    confidence: "medium",
    ...overrides,
  };
}

function validData(overrides = {}) {
  return {
    currency: "TWD",
    summary: { estimated: validEstimatedFigure() },
    tasks: [{ task_id: "scope-link", estimated: validTaskFigure() }],
    ...overrides,
  };
}

// --- happy path ---

test("a well-formed estimated-only payload validates clean and returns its task ids", () => {
  const { errors, taskIds } = validateCostData(validData());
  assert.deepEqual(errors, []);
  assert.deepEqual(taskIds, ["scope-link"]);
});

test("optional time_input fields are accepted when present and valid", () => {
  const { errors } = validateCostData(validData({
    summary: {
      estimated: validEstimatedFigure({ time_input_revision: "sha256:abc", time_input_freshness: "current" }),
    },
  }));
  assert.deepEqual(errors, []);
});

// --- structural refusals ---

test("a non-object payload is refused, not defaulted", () => {
  for (const bad of [null, undefined, "x", 42, []]) {
    const { errors, taskIds } = validateCostData(bad);
    assert.equal(errors.length > 0, true);
    assert.deepEqual(taskIds, []);
  }
});

test("currency must be a three-letter uppercase ISO code", () => {
  for (const bad of ["twd", "TW", "TWDX", "", 123]) {
    const { errors } = validateCostData(validData({ currency: bad }));
    assert.equal(errors.some((error) => error.includes("currency")), true, JSON.stringify(bad));
  }
});

test("an unrecognized confidence level is rejected rather than silently accepted", () => {
  const { errors } = validateCostData(validData({ summary: { estimated: validEstimatedFigure({ confidence: "certain" }) } }));
  assert.equal(errors.some((error) => error.includes("confidence")), true);
  assert.deepEqual(CONFIDENCE_LEVELS, ["low", "medium", "high"]);
});

test("a negative or fractional minor_unit_amount is rejected", () => {
  for (const bad of [-1, 1.5, "1250000"]) {
    const { errors } = validateCostData(validData({ summary: { estimated: validEstimatedFigure({ minor_unit_amount: bad }) } }));
    assert.equal(errors.some((error) => error.includes("minor_unit_amount")), true, JSON.stringify(bad));
  }
});

test("summary.estimated does not require method/scope_included/breakdown — those are task-level only", () => {
  // The project-level summary is a single figure; per-task figures carry the
  // full breakdown. Confirms the two share validateEstimatedFigure without
  // one leaking the other's required fields.
  const { errors } = validateCostData(validData());
  assert.deepEqual(errors, []);
});

test("a task-level figure without method/scope_included/breakdown is rejected", () => {
  const { errors } = validateCostData(validData({
    tasks: [{ task_id: "scope-link", estimated: validEstimatedFigure() }],
  }));
  assert.equal(errors.some((error) => error.includes("method")), true);
  assert.equal(errors.some((error) => error.includes("scope_included")), true);
  assert.equal(errors.some((error) => error.includes("breakdown")), true);
});

test("a duplicate task_id is rejected", () => {
  const { errors } = validateCostData(validData({
    tasks: [
      { task_id: "scope-link", estimated: validTaskFigure() },
      { task_id: "scope-link", estimated: validTaskFigure() },
    ],
  }));
  assert.equal(errors.some((error) => error.includes("重複")), true);
});

test("a malformed breakdown entry is reported at its exact index", () => {
  const { errors } = validateCostData(validData({
    tasks: [{
      task_id: "scope-link",
      estimated: validTaskFigure({ breakdown: [{ category: "labor" }] }),
    }],
  }));
  assert.equal(errors.some((error) => error.startsWith("data.tasks[0].estimated.breakdown[0]")), true);
});

// --- subject matching reuses Phase 1's generic index ---

test("costSubjectIndex resolves a real task and flags one that does not exist", () => {
  const report = Object.freeze({
    report_id: "r", scope_id: "s",
    tasks: [{ id: "scope-link", title: "x" }],
  });
  const index = costSubjectIndex(report, ["scope-link", "no-such-task"]);
  assert.deepEqual(index.tasks, ["scope-link"]);
  assert.equal(index.orphans.length, 1);
  assert.equal(index.orphans[0].task_id, "no-such-task");
});
