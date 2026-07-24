import assert from "node:assert/strict";
import test from "node:test";

await import("../experiments/time-reference/demo/time-data-policy.js");

const policy = globalThis.TimeDataPolicy;
const validDeadline = {
  started_at: "2026-07-20T09:00:00+08:00",
  delivery_at: "2026-08-01T00:00:00+08:00",
  evaluated_at: "2026-07-22T17:00:00+08:00",
  elapsed_capacity_minutes: 1440,
  total_capacity_minutes: 4320,
  time_progress_ratio: 0.3333,
  work_progress_ratio: 0.2,
  boundary_state: "active",
  urgency: "at_risk",
  schedule: {
    timezone: "Asia/Taipei",
    risk_thresholds: {
      on_track_max: 1.1,
      at_risk_max: 1.5,
    },
    capacity_timeline: [],
  },
};

test("missing optional time analysis is a normal state", () => {
  assert.deepEqual(policy.inspectTimeAnalysis(null), {
    state: "missing",
    errors: [],
    deadlineAvailable: false,
    deadlineErrors: [],
  });
});

test("a minimally usable time analysis is available", () => {
  assert.deepEqual(
    policy.inspectTimeAnalysis({
      method: {},
      summary: {
        display_total_days: 6,
        deadline: validDeadline,
      },
      tasks: [],
    }),
    {
      state: "available",
      errors: [],
      deadlineAvailable: true,
      deadlineErrors: [],
    },
  );
});

test("estimate-only time analysis remains available without a deadline", () => {
  assert.deepEqual(
    policy.inspectTimeAnalysis({
      method: {},
      summary: {
        display_total_days: 6,
      },
      tasks: [],
    }),
    {
      state: "available",
      errors: [],
      deadlineAvailable: false,
      deadlineErrors: [],
    },
  );
});

test("partial time analysis is invalid instead of crashing the report", () => {
  const result = policy.inspectTimeAnalysis({ summary: {} });

  assert.equal(result.state, "invalid");
  assert.ok(result.errors.length > 0);
});

test("malformed deadline is isolated while engineering estimates stay available", () => {
  const result = policy.inspectTimeAnalysis({
    method: {},
    summary: {
      display_total_days: 6,
      deadline: {
        schedule: {
          capacity_profile: {
            working_weekdays: "Monday",
            capacity_exceptions: [],
          },
        },
      },
    },
    tasks: [],
  });

  assert.equal(result.state, "available");
  assert.equal(result.deadlineAvailable, false);
  assert.match(result.deadlineErrors.join("；"), /working_weekdays/);
});
