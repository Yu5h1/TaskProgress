// A Report pointer card is read-only end to end: no `editing`, no `onCommand`,
// no edit affordance to leave read-only. It shows one layer of another
// report's own tasks, projected by `projectPointerCard` and handed down as
// plain data — this file only asserts the presentation contract.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { compile } from "svelte/compiler";

const card = await readFile(
  new URL("../experiments/editor-svelte-spike/src/ReportPointerCard.svelte", import.meta.url),
  "utf8",
);
const taskList = await readFile(
  new URL("../experiments/editor-svelte-spike/src/TaskList.svelte", import.meta.url),
  "utf8",
);
const styles = await readFile(new URL("../viewer/assets/styles.css", import.meta.url), "utf8");

const script = card.slice(0, card.indexOf("</script>"));
const template = card.slice(card.indexOf("</script>"));

test("the component compiles cleanly", () => {
  const compiled = compile(card, { name: "ReportPointerCard" });
  assert.deepEqual(compiled.warnings.map((warning) => warning.code), []);
});

test("no prop can mutate anything", () => {
  for (const prop of ["editing", "onCommand", "onAddItem", "onModuleReorder", "onTimeClick"]) {
    assert.doesNotMatch(script, new RegExp(`export let ${prop}\\b`, "u"), `${prop} is a write affordance`);
  }
  assert.doesNotMatch(template, /<(input|textarea|select|button)\b/iu, "a pointer card renders no editable control");
});

test("the card takes only the pointer task and its projected state", () => {
  assert.match(script, /export let task;/u);
  assert.match(script, /export let state = \{ status: "loading" \};/u);
  assert.doesNotMatch(script, /^\s*import /mu);
});

test("every status the card can show comes from the report-model status table", () => {
  const labels = Object.fromEntries(
    [...script.matchAll(/(\w+): \{ label: "([^"]+)", tone: "(\w+)" \}/gu)]
      .map(([, status, label, tone]) => [status, { label, tone }]),
  );
  assert.deepEqual(labels, {
    planned: { label: "待處理", tone: "neutral" },
    in_progress: { label: "進行中", tone: "active" },
    blocked: { label: "受阻", tone: "danger" },
    done: { label: "已完成", tone: "success" },
    archive: { label: "已封存", tone: "muted" },
  }, "must match report-model.js's STATUS_META exactly, or the two Viewer surfaces would disagree");
});

test("loading, error and ready are three distinct, exhaustive branches", () => {
  assert.match(template, /\{#if state\.status === "loading"\}/u);
  assert.match(template, /\{:else if state\.status === "error"\}/u);
  assert.match(template, /\{:else if card\}/u);
  assert.match(template, /role="alert"/u, "an error state must be announced");
});

test("opening the target is a plain link, the same mechanism every other scope switch already uses", () => {
  assert.match(template, /<a class="pointer-card-title-link" href=\{state\.openHref\}>\{task\.title\}<\/a>/u);
  assert.match(template, /<a class="pointer-card-badge" href=\{state\.openHref\}>/u, "the badge itself is the open action, not a separate label");
  assert.doesNotMatch(script, /preventDefault|pushState|history\./u, "no in-page navigation mechanism is introduced");
});

test("the badge is the one open action — no second, redundant link", () => {
  assert.doesNotMatch(template, /指路卡/u, "the badge reads as an action, not a category label");
  assert.equal((template.match(/href=\{state\.openHref\}/gu) ?? []).length, 2, "title link + badge, nothing else opens the target");
});

test("TaskList dispatches by kind and never passes a pointer card a write prop", () => {
  assert.match(taskList, /\{#if task\.kind === "report_pointer"\}/u);
  assert.match(
    taskList,
    /<ReportPointerCard \{task\} state=\{pointerCards\[task\.id\] \?\? \{ status: "loading" \}\} \/>/u,
  );
});

test("the pointer badge and error text use theme tokens, not literals", () => {
  const block = styles.slice(
    styles.indexOf(".pointer-card-badge {"),
    styles.indexOf(".developer-details {"),
  );
  assert.doesNotMatch(block, /#[0-9a-f]{3,8}\b/iu, "colour must come from a variable, not a literal");
  assert.match(block, /color: var\(--color-danger-text\);/u);
});
