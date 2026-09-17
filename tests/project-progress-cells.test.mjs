import test from "node:test";
import assert from "node:assert/strict";
import { projectProgressCells } from "../viewer/assets/report-model.js";

test("project cells follow task status and exclude archived tasks and pointers", () => {
  const tasks = ["in_progress", "blocked", "done", "planned", "archive"].map((status, id) => ({ id, status }));
  tasks.push({ id: "pointer", kind: "report_pointer", status: "done" });
  assert.deepEqual(projectProgressCells(tasks), ["active", "failed", "passed", "pending"]);
  assert.equal(tasks.length, 6);
  assert.deepEqual(projectProgressCells([]), []);
});
