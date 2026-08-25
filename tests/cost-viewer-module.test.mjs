// Cost's pure render layer: capsule and detail prop computation. No DOM.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  buildCostDetailProps,
  buildCostSummaryProps,
  formatCostAmount,
} from "../viewer/assets/cost-viewer-module.js";

function costData(overrides = {}) {
  return {
    currency: "TWD",
    summary: { estimated: { minor_unit_amount: 1250000, as_of: "2026-08-25", confidence: "medium" } },
    tasks: [
      {
        task_id: "scope-link",
        estimated: {
          minor_unit_amount: 480000,
          method: "time-rate-product",
          scope_included: ["labor"],
          breakdown: [{ category: "labor", minor_unit_amount: 480000, basis: "role-rate" }],
          confidence: "medium",
        },
      },
    ],
    ...overrides,
  };
}

test("formatCostAmount renders a whole-unit currency string from minor units", () => {
  const formatted = formatCostAmount("TWD", 1250000);
  assert.match(formatted, /12,500|12500/);
});

test("formatCostAmount falls back to a plain label for an unrecognized currency rather than throwing", () => {
  assert.doesNotThrow(() => formatCostAmount("ZZZ", 100));
});

test("the summary capsule always shows a chevron and never a dot — v0.1 has no risk lamp", () => {
  const onOpenDetail = () => {};
  const props = buildCostSummaryProps({ data: costData(), onOpenDetail });
  assert.equal(props.showChevron, true);
  assert.equal(props.showDot, false);
  assert.equal(props.onClick, onOpenDetail);
  assert.match(props.label, /預估成本/);
  assert.match(props.ariaLabel, /medium/);
});

test("the detail panel exposes the total, per-task breakdown, and time-input freshness when recorded", () => {
  const onClose = () => {};
  const data = costData({
    summary: {
      estimated: {
        minor_unit_amount: 1250000, as_of: "2026-08-25", confidence: "medium", time_input_freshness: "stale",
      },
    },
  });
  const props = buildCostDetailProps({ data, open: true, onClose });
  assert.equal(props.open, true);
  assert.equal(props.onClose, onClose);
  assert.equal(props.currency, "TWD");
  assert.equal(props.timeInputFreshness, "stale");
  assert.equal(props.tasks.length, 1);
  assert.equal(props.tasks[0].taskId, "scope-link");
  assert.equal(props.tasks[0].breakdown[0].category, "labor");
});

test("timeInputFreshness is null when the source never recorded one, not fabricated", () => {
  const props = buildCostDetailProps({ data: costData(), open: true, onClose: () => {} });
  assert.equal(props.timeInputFreshness, null);
});

test("stays off the DOM", async () => {
  const source = await readFile(new URL("../viewer/assets/cost-viewer-module.js", import.meta.url), "utf8");
  assert.doesNotMatch(source, /document\.|window\.|querySelector\(|createUiView\(/u);
});
