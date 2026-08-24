// An unspecified Next Step shows nothing rather than a placeholder sentence,
// and the whole Developer overlay disappears when there is truly nothing to
// report (no next step, no blockers/decisions/routes/claim).
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { compile } from "svelte/compiler";

const details = await readFile(
  new URL("../experiments/editor-svelte-spike/src/DeveloperDetails.svelte", import.meta.url),
  "utf8",
);
const styles = await readFile(new URL("../viewer/assets/styles.css", import.meta.url), "utf8");

const script = details.slice(0, details.indexOf("</script>"));
const template = details.slice(details.indexOf("</script>"));

test("the component compiles cleanly", () => {
  const compiled = compile(details, { name: "DeveloperDetails" });
  assert.deepEqual(compiled.warnings.map((warning) => warning.code), []);
});

test("no fallback placeholder text remains", () => {
  assert.doesNotMatch(details, /尚未指定下一步/u, "an unspecified Next Step must render nothing, not a placeholder sentence");
});

test("the whole block is gated on having something to show", () => {
  assert.match(template, /\{#if developer && hasContent\}/u);
  assert.match(script, /\$: hasContent = Boolean\(nextAction\) \|\| hasDiscussion;/u);
});

test("the Next Step line is its own conditional branch, independent of the expand hint", () => {
  assert.match(template, /\{#if nextAction\}\s*<span class="developer-next-label">/u);
  assert.match(script, /\$: nextAction = developer\?\.next_step \?\? legacySteps\[0\] \?\? null;/u);
});

test("the expand hint stays right-aligned even when Next Step is absent", () => {
  const block = styles.slice(
    styles.indexOf(".developer-expand-hint {"),
    styles.indexOf(".developer-body {"),
  );
  assert.match(block, /grid-column: 3;/u, "without this, a lone expand hint falls into the grid's first (left) track");
});
