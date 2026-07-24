import assert from "node:assert/strict";
import test from "node:test";

await import("../experiments/time-reference/demo/capacity-engine.js");

const engine = globalThis.TimeCapacityEngine;
const deadline = {
  started_at: "2026-07-20T09:00:00+08:00",
  delivery_at: "2026-08-01T00:00:00+08:00",
};
const profile = {
  total_minutes_per_day: 1440,
  sleep_minutes_per_day: 480,
  life_minutes_per_day: 480,
  other_unavailable_minutes_per_day: 0,
  capacity_minutes_per_executor_day: 480,
  working_weekdays: [1, 2, 3, 4, 5],
  capacity_exceptions: [
    {
      date: "2026-07-29",
      available_minutes: 0,
      public_label: "休假",
    },
  ],
};

test("capacity timeline excludes weekends and applies leave exceptions", () => {
  const timeline = engine.buildTimeline(deadline, profile);

  assert.equal(timeline.length, 10);
  assert.equal(
    timeline.reduce((total, day) => total + day.capacity_minutes, 0),
    4320,
  );
  assert.equal(
    timeline.find((day) => day.date === "2026-07-29")?.capacity_minutes,
    0,
  );
  assert.equal(timeline.some((day) => day.date === "2026-07-25"), false);
});

test("capacity exception editor format preserves date, hours, and public label", () => {
  assert.deepEqual(
    engine.parseExceptions("2026-07-29 | 0 | 休假\n2026-07-30 | 4.5 | 就醫"),
    [
      {
        date: "2026-07-29",
        available_minutes: 0,
        public_label: "休假",
      },
      {
        date: "2026-07-30",
        available_minutes: 270,
        public_label: "就醫",
      },
    ],
  );
});

test("capacity profile rejects contradictory daily allocation", () => {
  assert.throws(
    () => engine.buildTimeline(deadline, {
      ...profile,
      capacity_minutes_per_executor_day: 600,
    }),
    /每日工作容量/,
  );
});
