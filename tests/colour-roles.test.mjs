// Component colours come from named roles that resolve to the Viewer's own
// theme tokens.
//
// Two categories, and the split is the point. A *status* colour says what state
// one thing is in — a card border, a marker, a per-item progress cell, a count
// tile all show the same state and must agree. A *proportion* fill says how much
// of a whole is done, and its source is the task-progress meter. An earlier
// version of this file put per-item cells in the second category, which made a
// cell disagree with the card above it.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const styles = await readFile(new URL("../viewer/assets/styles.css", import.meta.url), "utf8");
const checklistStyles = await readFile(
  new URL("../experiments/editor-svelte-spike/src/checklist-styles.css", import.meta.url),
  "utf8",
);

const STATUS_ROLES = [
  "--role-status-passed",
  "--role-status-passed-surface",
  "--role-status-failed",
  "--role-status-failed-surface",
  "--role-status-pending",
  "--role-status-pending-surface",
  "--role-status-neutral",
  "--role-status-neutral-surface",
];
const FILL_ROLES = [
  "--role-fill-progress-start",
  "--role-fill-progress-end",
  "--role-fill-track",
];

function ruleBlock(source, selector) {
  const start = source.indexOf(`${selector} {`);
  assert.notEqual(start, -1, `missing rule: ${selector}`);
  return source.slice(start, source.indexOf("}", start));
}

test("every role is defined once, from an existing token", () => {
  for (const role of [...STATUS_ROLES, ...FILL_ROLES]) {
    const definitions = styles.match(new RegExp(`^\\s*${role}:`, "gmu")) ?? [];
    assert.equal(definitions.length, 1, `${role} must be defined exactly once`);
    const value = styles.match(new RegExp(`${role}:\\s*([^;]+);`, "u"))[1].trim();
    assert.match(value, /^var\(--[a-z-]+\)$/u, `${role} must resolve to a token, got ${value}`);
  }
});

test("roles introduce no new literal colour", () => {
  const block = styles.slice(styles.indexOf("--role-fill-progress-start"));
  const roles = block.slice(0, block.indexOf("}"));
  assert.doesNotMatch(roles, /#[0-9a-f]{3,8}\b|rgb|hsl/iu);
});

test("everything showing a state uses the one status source", () => {
  const cases = [
    [styles, ".progress-cell.progress-tone-passed", "--role-status-passed"],
    [styles, ".progress-cell.progress-tone-failed", "--role-status-failed"],
    [styles, ".progress-cell.progress-tone-pending", "--role-status-pending"],
    [styles, ".progress-stat.progress-tone-passed", "--role-status-passed"],
    [styles, ".progress-stat.progress-tone-failed", "--role-status-failed"],
    [styles, ".progress-stat.progress-tone-pending", "--role-status-pending"],
    [styles, ".marker-box.marker-passed", "--role-status-passed"],
    [styles, ".marker-box.marker-failed", "--role-status-failed"],
    [checklistStyles, ".checklist-item.checklist-pending", "--role-status-pending"],
    [checklistStyles, ".checklist-item.checklist-failed", "--role-status-failed"],
    [checklistStyles, ".checklist-check.checklist-manual.checklist-pending", "--role-status-pending"],
    [checklistStyles, ".checklist-check.checklist-manual.checklist-passed", "--role-status-passed"],
    [checklistStyles, ".checklist-check.checklist-manual.checklist-failed", "--role-status-failed"],
  ];
  for (const [source, selector, role] of cases) {
    assert.match(ruleBlock(source, selector), new RegExp(role, "u"), `${selector} must use ${role}`);
  }
});

test("a per-item cell carries status, not the proportion fill", () => {
  const cell = ruleBlock(styles, ".progress-cell.progress-tone-passed");
  assert.doesNotMatch(cell, /--role-fill-progress/u, "a cell is one item's state");
});

test("proportion bars share the task-progress meter's fill source", () => {
  const gradient = /var\(--role-fill-progress-start\),\s*var\(--role-fill-progress-end\)/u;
  for (const selector of [
    ".progress-meter::-webkit-progress-value",
    ".progress-meter::-moz-progress-bar",
  ]) {
    assert.match(ruleBlock(styles, selector), gradient, `${selector} must use the shared fill`);
  }
  assert.match(ruleBlock(styles, ".progress-meter"), /var\(--role-fill-track\)/u);
});

test("components reference roles, never a raw theme token", () => {
  const owned = [
    ".progress-stat.progress-tone-passed",
    ".progress-stat.progress-tone-failed",
    ".progress-stat.progress-tone-pending",
    ".progress-cell.progress-tone-passed",
    ".progress-cell.progress-tone-failed",
    ".progress-cell.progress-tone-pending",
    ".marker-box.marker-passed",
    ".marker-box.marker-failed",
  ];
  for (const selector of owned) {
    const rule = ruleBlock(styles, selector);
    assert.doesNotMatch(
      rule,
      /--color-(success|danger|warning)-|--moss|--amber|--red\b/u,
      `${selector} must go through a role`,
    );
  }
});

test("a completed card carries no status border", () => {
  // The card is large; a green edge on finished work draws the eye to the one
  // thing that needs none.
  assert.doesNotMatch(styles, /\.task-card\.status-success \{/u);
  assert.match(styles, /\.task-card\.status-active \{/u);
  assert.match(styles, /\.task-card\.status-danger \{/u);
  assert.doesNotMatch(checklistStyles, /\.checklist-item\.checklist-passed \{/u);
});

test("state surfaces reuse the theme's designed soft pairs", () => {
  for (const [role, token] of [
    ["--role-status-passed-surface", "--moss-soft"],
    ["--role-status-failed-surface", "--red-soft"],
    ["--role-status-pending-surface", "--amber-soft"],
  ]) {
    assert.match(styles, new RegExp(`${role}: var\\(${token}\\);`, "u"));
  }
});
