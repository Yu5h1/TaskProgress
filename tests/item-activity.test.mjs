import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { ACTIVITY_RECENT_LIMIT, appendActivity, formatActivity, recordUserActivity, validateActivity } from "../viewer/assets/item-activity.js";
import { validateReport } from "../viewer/assets/report-model.js";

const at = "2026-10-21T08:00:00.000Z";
const report = (items) => ({
  schema_version: "1.1",
  report_id: "r",
  scope_id: "s",
  title: "R",
  updated_at: at,
  tasks: [{ id: "t", title: "T", summary: "S", status: "in_progress", pending_items: items, completed_items: [] }],
});

test("the created entry stays and only the three most recent others remain", () => {
  let activity = [];
  activity = appendActivity(activity, { event: "created", actor: "codex", at });
  for (const event of ["updated", "started", "updated", "done"]) activity = appendActivity(activity, { event, actor: "codex", at });
  assert.deepEqual(activity.map(entry => entry.event), ["created", "started", "updated", "done"]);
  assert.equal(activity.length, ACTIVITY_RECENT_LIMIT + 1);
});

test("the Viewer records user entries only for created, changed and moved items", () => {
  const before = report([
    { id: "a", title: "A", activity: [{ event: "created", actor: "codex", at }] },
    { id: "b", title: "B" },
    { id: "c", title: "C" },
  ]);
  const after = report([
    { id: "c", title: "C" },
    { id: "a", title: "A", status: "in_progress", activity: [] },
    { id: "b", title: "B" },
    { id: "d", title: "D" },
  ]);
  const saved = recordUserActivity(before, after, at);
  const byId = Object.fromEntries(saved.tasks[0].pending_items.map(item => [item.id, item.activity]));
  assert.deepEqual(byId.a.map(entry => [entry.event, entry.actor]), [["created", "codex"], ["started", "user"]], "activity continues from the saved file, not the draft");
  assert.equal(byId.b, undefined, "an item that only shifted because another moved is unchanged");
  assert.deepEqual(byId.c.map(entry => entry.event), ["updated"], "the moved item");
  assert.deepEqual(byId.d.map(entry => entry.event), ["created"]);
  assert.deepEqual(validateReport(saved), []);
});

test("validation rejects malformed or overlong activity", () => {
  const issue = (code, path) => ({ code, path });
  const errors = [];
  validateActivity([{ event: "created", actor: "Codex", at }], "x", errors, issue);
  validateActivity([{ event: "created", actor: "codex", at, extra: 1 }], "y", errors, issue);
  validateActivity(Array.from({ length: 5 }, () => ({ event: "updated", actor: "codex", at })), "z", errors, issue);
  assert.deepEqual(errors.map(error => error.path), ["x[0]", "y[0]", "z"]);
});

test("the tooltip names each entry with its actor, session name and age, never the session ID", () => {
  const text = formatActivity([
    { event: "created", actor: "antigravity", at: "2026-10-21T05:00:00.000Z" },
    { event: "started", actor: "codex", session: "Web 驗收", session_id: "01a15c8a", at: "2026-10-21T07:30:00.000Z" },
    { event: "updated", actor: "claude", session_id: "5ef525bc", at: "2026-10-21T07:59:30.000Z" },
  ], Date.parse(at));
  assert.equal(text, "建立：antigravity · 3 小時前\n開始：codex (Web 驗收) · 30 分鐘前\n修改：claude · 剛剛");
  assert.equal(formatActivity(undefined), "");
});

test("JS, Python and the schema keep the same retention", async () => {
  const python = await readFile(new URL("../service/report_operations.py", import.meta.url), "utf8");
  const schema = JSON.parse(await readFile(new URL("../schemas/report.schema.json", import.meta.url), "utf8"));
  assert.match(python, new RegExp(`^ACTIVITY_RECENT_LIMIT = ${ACTIVITY_RECENT_LIMIT}$`, "mu"));
  assert.equal(schema.$defs.item.properties.activity.maxItems, ACTIVITY_RECENT_LIMIT + 1);
});
