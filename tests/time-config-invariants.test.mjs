import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const config = JSON.parse(
  await readFile(
    new URL("../experiments/time-reference/examples/time.config.json", import.meta.url),
    "utf8",
  ),
);
const analysis = JSON.parse(
  await readFile(
    new URL("../experiments/time-reference/examples/time.analysis.json", import.meta.url),
    "utf8",
  ),
);

test("the default 8/8/8 allocation consumes exactly one day", () => {
  const allocation = config.standard_allocation;
  const allocatedMinutes =
    allocation.sleep_minutes_per_day
    + allocation.life_minutes_per_day
    + allocation.other_unavailable_minutes_per_day
    + allocation.capacity_minutes_per_executor_day;

  assert.equal(allocatedMinutes, allocation.total_minutes_per_day);
  assert.equal(allocation.total_minutes_per_day, 24 * 60);
  assert.equal(allocation.capacity_minutes_per_executor_day, 8 * 60);
});

test("daily capacity and the unplanned-item estimate remain independent parameters", () => {
  assert.equal(
    config.standard_allocation.capacity_minutes_per_executor_day,
    480,
  );
  assert.equal(config.estimate_defaults.unplanned_item_likely_minutes, 480);
  assert.notEqual(
    "unplanned_item_likely_minutes" in config.standard_allocation,
    true,
  );
});

test("published capacity profile preserves allocation and calendar exceptions", () => {
  const deadline = analysis.summary.deadline;
  const profile = deadline.schedule.capacity_profile;
  const allocatedMinutes =
    profile.sleep_minutes_per_day
    + profile.life_minutes_per_day
    + profile.other_unavailable_minutes_per_day
    + profile.capacity_minutes_per_executor_day;
  const timelineTotal = deadline.schedule.capacity_timeline.reduce(
    (total, day) => total + day.capacity_minutes,
    0,
  );

  assert.equal(allocatedMinutes, profile.total_minutes_per_day);
  assert.deepEqual(profile.working_weekdays, [1, 2, 3, 4, 5]);
  assert.deepEqual(profile.capacity_exceptions, [
    {
      date: "2026-07-29",
      available_minutes: 0,
      public_label: "休假",
    },
  ]);
  assert.equal(
    deadline.schedule.capacity_timeline.find((day) => day.date === "2026-07-29")
      ?.capacity_minutes,
    0,
  );
  assert.equal(timelineTotal, deadline.total_capacity_minutes);
});
