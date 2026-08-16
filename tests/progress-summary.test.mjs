// The shared progress summary must stay a presentation component: two bar
// forms, caller-supplied words, and no knowledge of any screen's data.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { compile } from "svelte/compiler";

const summary = await readFile(
  new URL("../experiments/editor-svelte-spike/src/ProgressSummary.svelte", import.meta.url),
  "utf8",
);
const styles = await readFile(new URL("../viewer/assets/styles.css", import.meta.url), "utf8");
const bar = await readFile(
  new URL("../experiments/editor-svelte-spike/src/ProgressBar.svelte", import.meta.url),
  "utf8",
);

const script = summary.slice(0, summary.indexOf("</script>"));
const template = summary.slice(summary.indexOf("</script>"));

test("the component compiles cleanly", () => {
  // Source assertions cannot see a syntax error, and nothing imports this
  // component yet, so no build would catch one either.
  const compiled = compile(summary, { name: "ProgressSummary" });
  assert.deepEqual(compiled.warnings.map((warning) => warning.code), []);
});

test("every value the summary shows comes from its caller", () => {
  for (const prop of ["stats", "bar", "caption", "note", "label"]) {
    assert.match(script, new RegExp(`export let ${prop}`, "u"), `${prop} is not a prop`);
  }
  // No literal counts, labels, or units are baked into the markup.
  assert.doesNotMatch(template, /工作項目|已完成|待驗證|checks/u);
  assert.match(template, /\{stat\.value\}/u);
  assert.match(template, /\{stat\.label\}/u);
  assert.match(template, /\{caption\}/u);
});

test("the summary reads no screen's data structure", () => {
  // Sibling presentation components are fine; a model or data module is not.
  assert.doesNotMatch(script, /import .* from "\.\.\//u, "no model or data module");
  for (const line of script.match(/^\s*import .*$/gmu) ?? []) {
    assert.match(line, /from "\.\/[A-Z][A-Za-z]*\.svelte"/u, `unexpected import: ${line.trim()}`);
  }
  assert.doesNotMatch(summary, /\.items\b|\.checks\b|\.tasks\b|report|workItem/u);
});

test("the count row renders one tile per supplied stat", () => {
  assert.match(template, /\{#each stats as stat \(stat\.key \?\? stat\.label\)\}/u);
  assert.match(template, /class=\{`progress-stat\$\{toneClass\(stat\.tone\)\}`\}/u);
  assert.match(styles, /\.progress-stat \{/u);
});

test("the summary delegates to the shared bar rather than drawing one", () => {
  assert.match(script, /import ProgressBar from "\.\/ProgressBar\.svelte"/u);
  assert.match(template, /<ProgressBar[\s\S]*form=\{bar\.form\}/u);
  assert.doesNotMatch(template, /<progress|progress-cell/u, "the bar is not redrawn here");
});

test("the continuous ratio is clamped to a real percentage", () => {
  const percent = new Function(`
    function percent(value) {
      const ratio = Number(value);
      if (!Number.isFinite(ratio)) return 0;
      return Math.min(100, Math.max(0, Math.round(ratio * 1000) / 10));
    }
    return percent;
  `)();
  // Mirrors the bar's own helper; keep both in step.
  assert.match(bar, /Math\.min\(100, Math\.max\(0, Math\.round\(parsed \* 1000\) \/ 10\)\)/u);
  assert.equal(percent(0.9286), 92.9);
  assert.equal(percent(0), 0);
  assert.equal(percent(1), 100);
  assert.equal(percent(1.4), 100);
  assert.equal(percent(-0.2), 0);
  assert.equal(percent("nope"), 0);
});

test("tones reuse the marker vocabulary and the theme's semantic colours", () => {
  assert.match(script, /new Set\(\["passed", "failed", "pending"\]\)/u);
  for (const tone of ["passed", "failed", "pending"]) {
    assert.match(styles, new RegExp(`\\.progress-stat\\.progress-tone-${tone} \\{`, "u"));
    assert.match(styles, new RegExp(`\\.progress-cell\\.progress-tone-${tone} \\{`, "u"));
  }
  // Semantic colours come from the theme, never as literals.
  const block = styles.slice(styles.indexOf(".progress-summary {"), styles.indexOf(".marker-box {"));
  assert.doesNotMatch(block, /#[0-9a-f]{3,8}\b/iu);
});
