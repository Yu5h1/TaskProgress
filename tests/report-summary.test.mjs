// A report describes itself the way a task card does: title plus summary.
// The field is optional, so reports written before it existed stay valid.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { reportSummaryText, validateReport } from "../viewer/assets/report-model.js";

const schema = JSON.parse(
  await readFile(new URL("../schemas/report.schema.json", import.meta.url), "utf8"),
);
const app = await readFile(new URL("../viewer/assets/app.js", import.meta.url), "utf8");
const editorCoreRuntime = await readFile(
  new URL("../viewer/assets/editor-core-runtime.js", import.meta.url),
  "utf8",
);

function report(overrides = {}) {
  return {
    schema_version: "1.0",
    report_id: "demo",
    scope_id: "demo",
    title: "Demo",
    updated_at: "2026-08-19T00:00:00Z",
    tasks: [
      { id: "a", title: "A", status: "done", summary: "Done." },
      { id: "b", title: "B", status: "planned", summary: "Waiting." },
    ],
    ...overrides,
  };
}

test("the schema carries an optional report-level summary", () => {
  assert.deepEqual(schema.properties.summary, {
    type: "string",
    minLength: 1,
    maxLength: 1000,
  });
  assert.equal(schema.required.includes("summary"), false, "writing one is optional");
  // Same shape as the task field it mirrors, so both levels read alike.
  assert.deepEqual(schema.$defs.standardTask.properties.summary, schema.properties.summary);
});

test("a report without a summary stays valid", () => {
  assert.deepEqual(validateReport(report()), []);
});

test("a summary is validated only when it is there", () => {
  assert.deepEqual(validateReport(report({ summary: "本機編輯流程已可使用。" })), []);

  const blank = validateReport(report({ summary: "   " }));
  assert.equal(blank.length, 1);
  assert.equal(blank[0].path, "summary");

  const wrongType = validateReport(report({ summary: 42 }));
  assert.equal(wrongType.length, 1);
  assert.equal(wrongType[0].path, "summary");
});

test("the Viewer shows the written summary and falls back when there is none", () => {
  assert.equal(reportSummaryText(report({ summary: "自己寫的摘要" })), "自己寫的摘要");
  assert.equal(
    reportSummaryText(report()),
    "2 個可追溯任務；狀態由報告資料提供。",
    "the generated line is what every report showed before the field existed",
  );
  assert.equal(reportSummaryText(report({ summary: "  " })), "2 個可追溯任務；狀態由報告資料提供。");
});

test("every screen renders that line through the one shared region", async () => {
  assert.doesNotMatch(app, /elements\.summary\.textContent/u, "the host must not write the node");
  assert.match(app, /createUiView\("report-summary", elements\.summary, props\)/u);
  // The start screen, the scope directory, a fatal error and the report itself.
  assert.equal(app.match(/renderReportSummary\(/gu).length, 6);

  const component = await readFile(
    new URL("../experiments/editor-svelte-spike/src/ReportSummary.svelte", import.meta.url),
    "utf8",
  );
  assert.match(component, /<p class="hero-summary">\{text\}<\/p>/u);
  assert.match(component, /<textarea/u);
  assert.doesNotMatch(component, /import /u, "a presentation component owns no data path");
});

test("editing the summary reuses the task-summary command path", () => {
  assert.match(app, /type: "set-report-field", field: "summary", value/u);
  assert.match(app, /applyEditorCommand\(/u);

  const core = editorCoreRuntime;
  assert.match(core, /const REPORT_FIELDS = new Set\(\["summary"\]\);/u);
  // One command whitelist, one draft, one save. A second write path for one
  // field is how two of everything starts.
  assert.equal(core.match(/case "set-report-field"/gu).length, 1);
});
