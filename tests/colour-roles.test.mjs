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

test("an item and a task showing the same status get the same colour", () => {
  // The item capsule switched from its own item-status-* classes to the
  // shared status-<tone> names on 2026-08-25, and the tone rules were not
  // added at the same time — 已完成 silently rendered muted grey while
  // carrying status-success. Pin each tone to the same pair the task badge
  // uses so the two levels cannot drift again.
  for (const [tone, token] of [
    ["active", "blue"],
    ["success", "moss"],
    ["danger", "red"],
  ]) {
    const ruleFor = (selector) => styles.match(
      new RegExp(`\\${selector}\\.status-${tone} \\{[^}]*\\}`, "u"),
    )?.[0] ?? "";
    const badge = ruleFor(".status-badge");
    const capsule = ruleFor(".item-status-capsule");
    assert.ok(capsule, `item status capsule has no rule for ${tone}`);
    for (const value of [`var(--${token})`, `var(--${token}-soft)`]) {
      assert.ok(badge.includes(value), `task badge ${tone} lost ${value}`);
      assert.ok(capsule.includes(value), `item capsule ${tone} does not reuse ${value}`);
    }
  }
});

test("a row's marker and its status capsule are never different colours", () => {
  // The marker and the capsule are two views of one value. The class rename
  // to status values on 2026-08-25 left the marker keyed on the old name, so
  // a done row showed a grey tick beside a green capsule.
  for (const [status, token] of [["done", "moss"], ["in_progress", "blue"], ["blocked", "red"]]) {
    const marker = styles.match(
      new RegExp(`\\.item-row-marker-${status}[^{]*\\{[^}]*\\}`, "u"),
    )?.[0] ?? "";
    assert.ok(marker, `no marker rule for ${status}`);
    assert.ok(marker.includes(`var(--${token})`), `marker ${status} does not use var(--${token})`);
  }
  assert.doesNotMatch(styles, /\.item-row-marker-completed/u);
});

test("the card border carries priority, and finished work gets no loud edge", () => {
  // The border encodes the task's priority as of 2026-08-25 — it is what
  // decides what to pick up next, and it is no longer shown as a badge.
  // Status left this channel rather than sharing it; it stays reachable
  // through the overview counts and the filter strip.
  assert.doesNotMatch(styles, /\.task-card\.status-/u);
  assert.match(styles, /\.task-card\.priority-urgent \{/u);
  assert.match(styles, /\.task-card\.priority-important \{/u);
  // The same reason a completed card never had a green edge: the largest
  // surface on screen should not shout about work that needs nothing.
  assert.doesNotMatch(styles, /\.task-card\.priority-\w+ \{[^}]*--color-success/u);
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
