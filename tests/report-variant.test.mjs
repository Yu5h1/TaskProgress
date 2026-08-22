// A task card is one of two kinds, and the tag says which. The rules worth
// asserting here are the ones a reader cannot see: that the variant comes from
// `kind` rather than from whichever field happens to be present, that a 1.0
// report stays readable without one, and that a pointer card keeps no field
// the target report already owns.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  SUPPORTED_SCHEMA_VERSIONS,
  isSupportedSchemaVersion,
  taskKind,
  validateReport,
} from "../viewer/assets/report-model.js";

async function readJson(relativePath) {
  return JSON.parse(await readFile(new URL(`../${relativePath}`, import.meta.url), "utf8"));
}

const schema = await readJson("schemas/report.schema.json");
const untagged = await readJson("tests/fixtures/report-1.0-untagged.json");
const tagged = await readJson("tests/fixtures/report-1.1-tagged.json");

function pointerReport(pointerOverrides = {}, reportOverrides = {}) {
  return {
    schema_version: "1.1",
    report_id: "upper",
    scope_id: "upper",
    title: "Upper",
    updated_at: "2026-08-21T00:00:00Z",
    tasks: [
      {
        id: "winform",
        title: "Yu5h1Lib.WinForm",
        kind: "report_pointer",
        report_ref: { scope_id: "winform" },
        ...pointerOverrides,
      },
    ],
    ...reportOverrides,
  };
}

function codesAt(errors, path) {
  return errors.filter((error) => error.path === path).map((error) => error.code);
}

test("the schema accepts both live versions and splits the two variants", () => {
  assert.deepEqual(schema.properties.schema_version.enum, ["1.0", "1.1"]);
  assert.deepEqual(schema.$defs.task, {
    oneOf: [
      { $ref: "#/$defs/standardTask" },
      { $ref: "#/$defs/reportPointerTask" },
    ],
  });
  assert.equal(schema.$defs.standardTask.properties.kind.const, "standard");
  assert.equal(schema.$defs.reportPointerTask.properties.kind.const, "report_pointer");
});

test("the pointer branch carries a route and nothing else", () => {
  const pointer = schema.$defs.reportPointerTask;
  assert.equal(pointer.additionalProperties, false);
  assert.deepEqual(Object.keys(pointer.properties), ["id", "title", "kind", "report_ref"]);
  assert.deepEqual(pointer.required, ["id", "title", "kind", "report_ref"]);
  assert.deepEqual(schema.$defs.reportRef.required, ["scope_id"]);
  assert.equal(schema.$defs.reportRef.additionalProperties, false);
});

test("both fixtures pass the shared reader", () => {
  assert.deepEqual(validateReport(untagged), []);
  assert.deepEqual(validateReport(tagged), []);
});

test("a 1.0 task without a tag is a standard card", () => {
  assert.equal(untagged.tasks.every((task) => task.kind === undefined), true);
  assert.equal(untagged.tasks.every((task) => taskKind(task) === "standard"), true);
  assert.equal(taskKind(tagged.tasks[1]), "report_pointer");
});

test("the variant comes from the tag, never from a field that happens to be there", () => {
  const errors = validateReport({
    ...untagged,
    tasks: [
      {
        id: "winform",
        title: "Yu5h1Lib.WinForm",
        status: "planned",
        summary: "看起來像指路卡，但沒有標記。",
        report_ref: { scope_id: "winform" },
      },
    ],
  });
  assert.deepEqual(codesAt(errors, "tasks[0].report_ref"), ["unexpected_report_ref"]);
});

test("an unknown kind is rejected instead of guessed", () => {
  const errors = validateReport(pointerReport({ kind: "shortcut" }));
  assert.deepEqual(codesAt(errors, "tasks[0].kind"), ["invalid_kind"]);
});

test("a pointer card may not keep what the target report owns", () => {
  const errors = validateReport(pointerReport({
    status: "in_progress",
    summary: "複製過來的摘要。",
    completed_items: [],
    pending_items: [],
    progress: { completed: 1, total: 2 },
    priority: 1,
  }));
  assert.deepEqual(
    errors.map((error) => error.path),
    [
      "tasks[0].status",
      "tasks[0].summary",
      "tasks[0].completed_items",
      "tasks[0].pending_items",
      "tasks[0].progress",
      "tasks[0].priority",
    ],
  );
  assert.equal(errors.every((error) => error.code === "unexpected_pointer_field"), true);
});

test("a pointer needs a resolvable reference that is not this scope", () => {
  assert.deepEqual(
    codesAt(validateReport(pointerReport({ report_ref: {} })), "tasks[0].report_ref.scope_id"),
    ["invalid_string"],
  );
  assert.deepEqual(
    codesAt(validateReport(pointerReport({ report_ref: "winform" })), "tasks[0].report_ref"),
    ["invalid_report_ref"],
  );
  assert.deepEqual(
    codesAt(
      validateReport(pointerReport({ report_ref: { scope_id: "upper" } })),
      "tasks[0].report_ref.scope_id",
    ),
    ["self_reference"],
  );
});

test("one bad card does not stop the rest of the report being validated", () => {
  const errors = validateReport(pointerReport({}, {
    tasks: [
      { id: "winform", title: "A", kind: "report_pointer", report_ref: { scope_id: "upper" } },
      { id: "winform", title: "B", kind: "standard", status: "nonsense", summary: "S" },
    ],
  }));
  assert.deepEqual(codesAt(errors, "tasks[0].report_ref.scope_id"), ["self_reference"]);
  assert.deepEqual(codesAt(errors, "tasks[1].id"), ["duplicate_task"]);
  assert.deepEqual(codesAt(errors, "tasks[1].status"), ["invalid_status"]);
});

test("every reader asks the same list which versions are live", async () => {
  assert.deepEqual(SUPPORTED_SCHEMA_VERSIONS, ["1.0", "1.1"]);
  assert.equal(isSupportedSchemaVersion("1.0"), true);
  assert.equal(isSupportedSchemaVersion("1.1"), true);
  assert.equal(isSupportedSchemaVersion("2.0"), false);
  assert.equal(isSupportedSchemaVersion(undefined), false);

  for (const source of ["viewer/assets/app.js", "experiments/editor-svelte-spike/src/data-loader.js"]) {
    const text = await readFile(new URL(`../${source}`, import.meta.url), "utf8");
    assert.match(text, /isSupportedSchemaVersion\(report\.schema_version\)/u, source);
    assert.doesNotMatch(text, /schema_version !== /u, source);
  }
});
