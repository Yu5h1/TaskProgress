import assert from "node:assert/strict";
import test from "node:test";

await import("../experiments/time-reference/demo/estimate-engine.js");

const engine = globalThis.TimeEstimateEngine;

test("registered engineering decomposition recalculates without AI execution", () => {
  const result = engine.calculate(
    "engineering-decomposition",
    {
      base_implementation_hours: 18,
      exploration_routes: 4,
    },
    "人工調整探索路線。",
  );

  assert.equal(result.likelyHours, 34);
  assert.equal(result.lowHours, 52 / 3);
  assert.equal(result.highHours, 68);
  assert.match(result.explanation, /34 hr/);
  assert.match(result.rationale, /人工調整探索路線/);
});

test("direct manual estimate returns a deterministic range", () => {
  const result = engine.calculate("direct-human-estimate", { likely_hours: 9 });

  assert.equal(result.lowHours, 6);
  assert.equal(result.likelyHours, 9);
  assert.equal(result.highHours, 18);
});

test("the registry rejects unknown algorithms and invalid parameters", () => {
  assert.throws(
    () => engine.calculate("untrusted-ai-expression", { value: 1 }),
    /尚未登錄估算算法/,
  );
  assert.throws(
    () => engine.calculate("direct-human-estimate", { likely_hours: 0 }),
    /大於零/,
  );
});
