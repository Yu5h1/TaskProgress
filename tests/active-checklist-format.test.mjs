/*
 * The active checklist must stay parseable by the strict C# document core.
 *
 * `task-progress.exe checklist <file>` parses before it opens a window, so a
 * malformed file is not a rendering glitch — the App exits with no window at
 * all. That happened: work-item markers were left at `[ ]` while their checks
 * were marked `[x]`, and the derived-marker rule rejected the file.
 *
 * The C# tests already cover this, but they are not what runs after every edit.
 * These assertions are the cheap guard on the file this project edits daily.
 */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../implementation-checklist.md", import.meta.url), "utf8");
const lines = source.split(/\r?\n/);

const WORK_ITEM = /^- \[([ x!])\] \*\*(\d+)\. (.+)\*\*$/u;
const CHECK = /^ {4}- \[([ x!])\] \*\*(.+?)\*\*( `\[manual\]`)?$/u;
const FIELD = /^ {6}- (Action|Expect|Reason|Observed|Resolved): .+$/u;

function parseItems() {
  const items = [];
  lines.forEach((line, index) => {
    const item = WORK_ITEM.exec(line);
    if (item) {
      items.push({ line: index + 1, marker: item[1], id: Number(item[2]), checks: [] });
      return;
    }
    const check = CHECK.exec(line);
    if (check && items.length > 0) {
      items.at(-1).checks.push({ line: index + 1, marker: check[1], title: check[2] });
    }
  });
  return items;
}

function derive(checks) {
  if (checks.some((check) => check.marker === "!")) return "!";
  if (checks.length > 0 && checks.every((check) => check.marker === "x")) return "x";
  return " ";
}

const items = parseItems();

test("the round has work items and every one carries checks", () => {
  assert.ok(items.length > 0, "no work item parsed — the shape has drifted");
  for (const item of items) {
    assert.ok(item.checks.length > 0, `item ${item.id} (line ${item.line}) has no checks`);
  }
});

test("every work-item marker equals what its checks derive", () => {
  for (const item of items) {
    const expected = derive(item.checks);
    assert.equal(
      item.marker,
      expected,
      `item ${item.id} on line ${item.line} is [${item.marker}] but its checks derive [${expected}]`,
    );
  }
});

test("work item ids are unique inside the round", () => {
  const seen = new Set();
  for (const item of items) {
    assert.equal(seen.has(item.id), false, `duplicate work item id ${item.id} on line ${item.line}`);
    seen.add(item.id);
  }
});

test("a failed check states what was observed", () => {
  items.forEach((item) => item.checks.forEach((check) => {
    if (check.marker !== "!") return;
    const body = lines.slice(check.line, check.line + 8).join("\n");
    assert.match(body, /^ {6}- Observed: /mu, `check on line ${check.line} is [!] without Observed`);
  }));
});

test("check fields use the nested bullet syntax the parser accepts", () => {
  lines.forEach((line, index) => {
    if (!/^ {6}- /u.test(line)) return;
    assert.match(
      line,
      FIELD,
      `line ${index + 1} is not a recognised check field: ${line.trim()}`,
    );
  });
  // Legacy unbulleted fields are what the migration removed; they must not return.
  for (const [index, line] of lines.entries()) {
    assert.doesNotMatch(line, /^ {6}(Action|Expect|Reason|Observed|Resolved): /u, `line ${index + 1}`);
  }
});

test("the round identity points at a plan anchor", () => {
  assert.match(lines[2] ?? "", /^Current round: `plan\.md#.+`\.$/u);
});
