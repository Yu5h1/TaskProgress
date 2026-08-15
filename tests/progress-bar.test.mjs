// One progress bar serves both screens: the Checklist's segmented form and the
// task-progress meter. The meter keeps its native semantics and its gradient,
// and the status overview is deliberately not part of this.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { compile } from "svelte/compiler";

const read = (path) =>
  readFile(new URL(`../experiments/editor-svelte-spike/src/${path}`, import.meta.url), "utf8");

const bar = await read("ProgressBar.svelte");
const projectProgress = await read("ProjectProgress.svelte");
const statusOverview = await read("StatusOverview.svelte");
const styles = await readFile(new URL("../viewer/assets/styles.css", import.meta.url), "utf8");

test("both components compile cleanly", () => {
  for (const [name, source] of [["ProgressBar", bar], ["ProjectProgress", projectProgress]]) {
    const compiled = compile(source, { name });
    assert.deepEqual(compiled.warnings.map((warning) => warning.code), [], `${name} warns`);
  }
});

test("the continuous form is a native progress element", () => {
  assert.match(bar, /<progress class=\{`progress-meter \$\{extraClass\}`\} max="100" value=\{filled\}/u);
  assert.match(styles, /\.progress-meter \{[^}]*appearance: none;/u);
  // The gradient the Viewer already had, now on the shared class.
  assert.match(
    styles,
    /\.progress-meter::-webkit-progress-value \{[^}]*linear-gradient\(90deg, var\(--color-accent\), var\(--color-progress-end\)\)/u,
  );
  assert.match(
    styles,
    /\.progress-meter::-moz-progress-bar \{[^}]*linear-gradient\(90deg, var\(--color-accent\), var\(--color-progress-end\)\)/u,
  );
});

test("both forms reach the same component without a host-specific option", () => {
  assert.match(bar, /\{#if form === "segmented"\}/u);
  assert.match(bar, /progress-bar progress-bar-segmented/u);
  // `extraClass` is placement, and the one caller that uses it says so.
  assert.match(bar, /\* `extraClass` exists for placement only/u);
  assert.match(projectProgress, /extraClass="project-progress-meter"/u);
});

test("the task-progress screen keeps no meter of its own", () => {
  assert.match(projectProgress, /import ProgressBar from "\.\/ProgressBar\.svelte"/u);
  assert.doesNotMatch(projectProgress, /<progress/u);
  assert.match(projectProgress, /<ProgressBar[\s\S]*ratio=\{percentage \/ 100\}/u);
  // Placement stayed behind; appearance moved to the shared class.
  const placement = styles.slice(styles.indexOf(".project-progress-meter {"));
  const rule = placement.slice(0, placement.indexOf("}"));
  assert.match(rule, /grid-row: 2;/u);
  assert.doesNotMatch(rule, /appearance|background|border-radius/u);
});

test("the status overview is untouched by the shared bar", () => {
  // Four status tones and the data-status hook are this screen's own; folding
  // them into the shared bar would make host difference a configuration knob.
  assert.doesNotMatch(statusOverview, /ProgressBar|progress-meter/u);
  assert.match(statusOverview, /data-status=\{card\.status\}/u);
  for (const tone of ["active", "success", "danger", "muted"]) {
    assert.match(statusOverview, new RegExp(`tone: "${tone}"`, "u"));
  }
});
