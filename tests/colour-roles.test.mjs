// Component colours come from named roles that resolve to the Viewer's own
// theme tokens. The categories matter: a text token tuned to be read against
// the page is not a fill, and using one as a fill is what washes dark mode out.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const styles = await readFile(new URL("../viewer/assets/styles.css", import.meta.url), "utf8");

const ROLES = [
  "--role-fill-progress-start",
  "--role-fill-progress-end",
  "--role-fill-track",
  "--role-fill-danger",
  "--role-state-passed-text",
  "--role-state-passed-surface",
  "--role-state-failed-text",
  "--role-state-failed-surface",
  "--role-state-pending-text",
  "--role-state-pending-surface",
  "--role-state-neutral-text",
  "--role-state-neutral-surface",
];

function ruleBlock(selector) {
  const start = styles.indexOf(`${selector} {`);
  assert.notEqual(start, -1, `missing rule: ${selector}`);
  return styles.slice(start, styles.indexOf("}", start));
}

test("every role is defined once, from an existing token", () => {
  for (const role of ROLES) {
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

test("a filled indicator never takes a text or surface token", () => {
  for (const selector of [
    ".progress-cell",
    ".progress-cell.progress-tone-passed",
    ".progress-cell.progress-tone-failed",
    ".progress-cell.progress-tone-pending",
    ".progress-meter",
  ]) {
    const rule = ruleBlock(selector);
    assert.doesNotMatch(
      rule,
      /--color-success-text|--color-warning-bg|--color-danger-bg|--color-success-bg/u,
      `${selector} uses a text or surface token as a fill`,
    );
    assert.match(rule, /var\(--role-fill-/u, `${selector} must use a fill role`);
  }
});

test("the segmented cell and the continuous meter share one fill source", () => {
  const cell = ruleBlock(".progress-cell.progress-tone-passed");
  const webkit = ruleBlock(".progress-meter::-webkit-progress-value");
  const moz = ruleBlock(".progress-meter::-moz-progress-bar");
  const gradient = /var\(--role-fill-progress-start\),\s*var\(--role-fill-progress-end\)/u;
  for (const [name, rule] of [["cell", cell], ["webkit", webkit], ["moz", moz]]) {
    assert.match(rule, gradient, `${name} must use the shared progress fill`);
  }
});

test("state tiles follow the Viewer's status-card pattern", () => {
  // The Viewer pairs a semantic text colour with its matching soft surface.
  const overview = ruleBlock(".overview-success");
  assert.match(overview, /color: var\(--moss\); background: var\(--moss-soft\)/u);

  for (const [tone, text, surface] of [
    ["passed", "--role-state-passed-text", "--role-state-passed-surface"],
    ["failed", "--role-state-failed-text", "--role-state-failed-surface"],
    ["pending", "--role-state-pending-text", "--role-state-pending-surface"],
  ]) {
    const rule = ruleBlock(`.progress-stat.progress-tone-${tone}`);
    assert.match(rule, new RegExp(`color: var\\(${text}\\)`, "u"));
    assert.match(rule, new RegExp(`background: var\\(${surface}\\)`, "u"));
  }
});

test("the marker box uses the same state roles as the tiles", () => {
  for (const [state, text, surface] of [
    ["passed", "--role-state-passed-text", "--role-state-passed-surface"],
    ["failed", "--role-state-failed-text", "--role-state-failed-surface"],
  ]) {
    const rule = ruleBlock(`.marker-box.marker-${state}`);
    assert.match(rule, new RegExp(`color: var\\(${text}\\)`, "u"));
    assert.match(rule, new RegExp(`background: var\\(${surface}\\)`, "u"));
  }
});
