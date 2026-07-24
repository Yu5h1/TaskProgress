import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

import { remainingWorkload } from "../viewer/assets/time-view.js";

const timeViewSource = await readFile(
  new URL("../viewer/assets/time-view.js", import.meta.url),
  "utf8",
);
const appSource = await readFile(
  new URL("../viewer/assets/app.js", import.meta.url),
  "utf8",
);

test("unfinished work is independent from deadline data", () => {
  assert.equal(remainingWorkload({
    total_estimated_minutes: 2400,
    calibrated_total_minutes: 3000,
    execution_calibration: { factor: 1.25 },
  }, 0.4), 1800);
});

test("production Viewer exposes a neutral undated estimate surface", () => {
  assert.match(timeViewSource, /交付日未定/);
  assert.match(timeViewSource, /time-summary-button no-deadline/);
  assert.match(timeViewSource, /if \(deadlineAvailable\) updateDeadline/);
  assert.doesNotMatch(
    timeViewSource.match(/className = "time-summary-button no-deadline";[\s\S]*?return;/)?.[0] ?? "",
    /time-risk-dot/,
  );
});

test("production loading isolates deadline diagnostics from estimate diagnostics", () => {
  assert.match(appSource, /inspectTimeAnalysis/);
  assert.match(appSource, /期限分析已忽略/);
  assert.match(appSource, /delete state\.timeAnalysis\.summary\.deadline/);
});
