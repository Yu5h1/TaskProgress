// The shared next-step card shows exactly one outstanding item, in words its
// caller supplies, marked with the theme's existing warning colour.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { compile } from "svelte/compiler";

const card = await readFile(
  new URL("../experiments/editor-svelte-spike/src/NextStepCard.svelte", import.meta.url),
  "utf8",
);
const styles = await readFile(new URL("../viewer/assets/styles.css", import.meta.url), "utf8");

const script = card.slice(0, card.indexOf("</script>"));
const template = card.slice(card.indexOf("</script>"));

test("the component compiles cleanly", () => {
  const compiled = compile(card, { name: "NextStepCard" });
  assert.deepEqual(compiled.warnings.map((warning) => warning.code), []);
});

test("the card renders one item, never a list", () => {
  assert.doesNotMatch(template, /\{#each/u, "a next step is one item, not a list");
  assert.equal((template.match(/<section/gu) ?? []).length, 1);
  assert.match(template, /\{title\}/u);
});

test("every string comes from the caller", () => {
  for (const prop of ["heading", "title", "action", "expect", "command", "actionLabel", "expectLabel"]) {
    assert.match(script, new RegExp(`export let ${prop}`, "u"), `${prop} is not a prop`);
  }
  assert.doesNotMatch(script, /^\s*import /mu);
  assert.doesNotMatch(card, /\.items\b|\.checks\b|\.tasks\b|report|workItem/u);
});

test("the command is an optional block, not prose", () => {
  assert.match(template, /\{#if command\}<pre class="next-step-command">\{command\}<\/pre>\{\/if\}/u);
  assert.match(styles, /\.next-step-command \{[^}]*overflow-x: auto;/u);
});

test("the outstanding state uses the theme's warning colour", () => {
  const block = styles.slice(
    styles.indexOf(".next-step-card {"),
    styles.indexOf(".next-step-command {"),
  );
  assert.match(block, /border-left: 3px solid var\(--role-status-pending\)/u);
  assert.match(block, /color: var\(--role-status-pending\)/u);
  assert.doesNotMatch(block, /#[0-9a-f]{3,8}\b/iu, "semantic colour must not be a literal");
});
