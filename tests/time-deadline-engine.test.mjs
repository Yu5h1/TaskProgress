import assert from "node:assert/strict";
import test from "node:test";

await import("../experiments/time-reference/demo/deadline-engine.js");

const engine = globalThis.TimeDeadlineEngine;
const deadline = {
  started_at: "2026-07-20T09:00:00+08:00",
  delivery_at: "2026-08-01T00:00:00+08:00",
  work_progress_ratio: 0.2,
  schedule: {
    timezone: "Asia/Taipei",
    workday_start_local: "09:00",
    workday_end_local: "17:00",
    risk_thresholds: {
      on_track_max: 1.1,
      at_risk_max: 1.5,
    },
    capacity_timeline: [
      "2026-07-20",
      "2026-07-21",
      "2026-07-22",
      "2026-07-23",
      "2026-07-24",
      "2026-07-27",
      "2026-07-28",
      "2026-07-29",
      "2026-07-30",
      "2026-07-31",
    ].map((date) => ({ date, capacity_minutes: 480 })),
  },
};

test("viewer-time calculation reproduces the published snapshot", () => {
  const result = engine.calculate(deadline, "2026-07-22T17:00:00+08:00");

  assert.equal(result.elapsed_capacity_minutes, 1440);
  assert.equal(result.total_capacity_minutes, 4800);
  assert.equal(result.time_progress_ratio, 0.3);
  assert.ok(Math.abs(result.progress_pressure_ratio - 1.142857) < 0.000001);
  assert.equal(result.urgency, "at_risk");
});

test("risk advances with preview time while work progress stays static", () => {
  const beforeWork = engine.calculate(deadline, "2026-07-20T08:00:00+08:00");
  const afterFiveDays = engine.calculate(deadline, "2026-07-24T17:00:00+08:00");

  assert.equal(beforeWork.urgency, "on_track");
  assert.equal(afterFiveDays.time_progress_ratio, 0.5);
  assert.equal(afterFiveDays.progress_pressure_ratio, 1.6);
  assert.equal(afterFiveDays.urgency, "critical");
});

test("delivery and completion use explicit boundary states", () => {
  const delivered = engine.calculate(deadline, "2026-08-01T00:00:00+08:00");
  const completed = engine.calculate(
    { ...deadline, work_progress_ratio: 1 },
    "2026-08-01T00:00:00+08:00",
  );

  assert.equal(delivered.boundary_state, "delivery_reached");
  assert.equal(delivered.urgency, "critical");
  assert.equal("progress_pressure_ratio" in delivered, false);
  assert.equal(completed.boundary_state, "complete");
  assert.equal(completed.urgency, "complete");
});

test("invalid runtime schedules are rejected before rendering", () => {
  assert.throws(
    () => engine.calculate({
      ...deadline,
      schedule: {
        ...deadline.schedule,
        capacity_timeline: [
          { date: "2026-07-20", capacity_minutes: 480 },
          { date: "2026-07-20", capacity_minutes: 480 },
        ],
      },
    }),
    /容量日期重複/,
  );
});
