/*
 * Every project checklist must stay parseable by the strict C# document core.
 *
 * `task-progress.exe checklist <file>` parses before it opens a window, so a
 * malformed file is not a rendering glitch — the App exits with no window at
 * all. The C# tests cover the parser too; these assertions are the cheap guard
 * on every direct `checklists/*.checklist` file this project edits daily.
 */
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const checklistDirectory = new URL("../checklists/", import.meta.url);
const checklistNames = (await readdir(checklistDirectory))
  .filter((name) => name.endsWith(".checklist"))
  .sort((left, right) => left.localeCompare(right));
const documents = await Promise.all(checklistNames.map(async (name) => ({
  name,
  lines: (await readFile(new URL(name, checklistDirectory), "utf8")).split(/\r?\n/),
})));

const WORK_ITEM = /^- \[([ x!])\] \*\*(\d+)\. (.+)\*\*$/u;
const CHECK = /^ {4}- \[([ x!])\] \*\*(.+?)\*\*( `\[manual\]`)?$/u;
const FIELD = /^ {6}- (Action|Expect|Reason|Observed|Resolved): .+$/u;

function parseItems(lines) {
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

test("the project has at least one per-task checklist", () => {
  assert.ok(documents.length > 0, "checklists/ contains no .checklist file");
});

test("every round has work items and every item carries checks", () => {
  for (const { name, lines } of documents) {
    const items = parseItems(lines);
    assert.ok(items.length > 0, `${name}: no work item parsed — the shape has drifted`);
    for (const item of items) {
      assert.ok(item.checks.length > 0, `${name}: item ${item.id} (line ${item.line}) has no checks`);
    }
  }
});

test("every work-item marker equals what its checks derive", () => {
  for (const { name, lines } of documents) {
    for (const item of parseItems(lines)) {
      const expected = derive(item.checks);
      assert.equal(
        item.marker,
        expected,
        `${name}: item ${item.id} on line ${item.line} is [${item.marker}] but its checks derive [${expected}]`,
      );
    }
  }
});

test("work items are separated by a blank line", () => {
  for (const { name, lines } of documents) {
    for (const item of parseItems(lines).slice(1)) {
      assert.equal(
        lines[item.line - 2],
        "",
        `${name}: item ${item.id} on line ${item.line} does not start after a blank line`,
      );
    }
  }
});

test("work item ids are unique inside each round", () => {
  for (const { name, lines } of documents) {
    const seen = new Set();
    for (const item of parseItems(lines)) {
      assert.equal(seen.has(item.id), false, `${name}: duplicate work item id ${item.id} on line ${item.line}`);
      seen.add(item.id);
    }
  }
});

test("a failed check states what was observed", () => {
  for (const { name, lines } of documents) {
    for (const item of parseItems(lines)) {
      for (const check of item.checks) {
        if (check.marker !== "!") continue;
        const body = lines.slice(check.line, check.line + 8).join("\n");
        assert.match(body, /^ {6}- Observed: /mu, `${name}: check on line ${check.line} is [!] without Observed`);
      }
    }
  }
});

test("check fields use the nested bullet syntax the parser accepts", () => {
  for (const { name, lines } of documents) {
    lines.forEach((line, index) => {
      if (!/^ {6}- /u.test(line)) return;
      assert.match(
        line,
        FIELD,
        `${name}: line ${index + 1} is not a recognised check field: ${line.trim()}`,
      );
    });
    for (const [index, line] of lines.entries()) {
      assert.doesNotMatch(
        line,
        /^ {6}(Action|Expect|Reason|Observed|Resolved): /u,
        `${name}: line ${index + 1}`,
      );
    }
  }
});

test("every round identity points at a project plan anchor", () => {
  for (const { name, lines } of documents) {
    assert.match(
      lines[2] ?? "",
      /^Current round: `(?:plan\.md|Documentation\/(?:[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+\.md)#[^`]+`\.$/u,
      name,
    );
  }
});
