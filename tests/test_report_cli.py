"""Focused in-process checks for Report operations and recoverable CLI transactions."""
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from service.report_cli import execute, ReportError
from service.report_store import LocalFileTransaction, TRANSACTION_JOURNAL, strict_json


class ReportCliTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="report 中文 ")
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.report = {"schema_version": "1.0", "report_id": "sample", "scope_id": "sample", "title": "測試",
                       "updated_at": "2026-09-25T00:00:00Z", "tasks": [
                           {"id": "one", "title": "一", "status": "planned", "summary": "例",
                            "pending_items": ["legacy", {"id": "item", "title": "項目"}]},
                           {"id": "two", "title": "二", "status": "planned", "summary": "保留"}]}
        self.write("report.json", self.report)

    def write(self, name, value):
        (self.root / name).write_text(json.dumps(value, ensure_ascii=False), encoding="utf-8")

    def request(self, operations):
        return {"version": "1", "expected_revision": execute(self.root, "get")["revision"], "operations": operations}

    def snapshot(self):
        return {p.name: p.read_bytes() for p in self.root.iterdir()}

    def test_batch_preserves_others_moves_item_and_creates_overlay(self):
        request = self.request([
            {"op": "task.update", "task_id": "one", "set": {"summary": "中文\n多行"}},
            {"op": "item.update", "task_id": "one", "item_id": "item", "set": {"status": "done"}},
            {"op": "dev.update", "task_id": "one", "set": {"next_step": "下一步"}},
        ])
        result = execute(self.root, "apply", request)
        self.assertTrue(result["changed"])
        data = execute(self.root, "get")
        self.assertEqual(data["report"]["tasks"][1], self.report["tasks"][1])
        self.assertEqual(data["report"]["tasks"][0]["pending_items"], ["legacy"])
        self.assertEqual(data["report"]["tasks"][0]["completed_items"][0]["id"], "item")
        self.assertEqual(data["developer"]["tasks"][0]["next_step"], "下一步")
        request = self.request([{"op": "item.update", "task_id": "one", "item_id": "item", "set": {"status": "planned"}}])
        execute(self.root, "apply", request)
        self.assertEqual(execute(self.root, "get", task="one")["task"]["pending_items"][1]["id"], "item")

    def test_completed_items_stack_and_recompletion_moves_to_top(self):
        def apply(operations):
            execute(self.root, "apply", self.request(operations))
        def status(value):
            return {"op": "item.update", "task_id": "one", "item_id": "item", "set": {"status": value}}
        def ids():
            return [i["id"] for i in execute(self.root, "get", task="one")["task"]["completed_items"]]
        apply([status("done"), {"op": "item.add", "task_id": "one", "value": {"id": "new", "title": "New", "status": "done", "priority": 4}}])
        self.assertEqual(ids(), ["new", "item"])
        apply([status("done")])
        self.assertEqual(ids(), ["new", "item"])
        apply([status("planned"), status("done")])
        self.assertEqual(ids(), ["item", "new"])

    def test_noop_and_dry_run_preserve_all_bytes(self):
        before = self.snapshot()
        result = execute(self.root, "apply", self.request([{"op": "dev.update", "task_id": "one", "unset": ["next_step"]}]))
        self.assertFalse(result["changed"])
        execute(self.root, "apply", self.request([{"op": "report.update", "set": {"title": "預覽"}}]), dry_run=True)
        result = execute(self.root, "apply", self.request([{"op": "report.update", "set": {"title": "測試"}}]))
        self.assertFalse(result["changed"])
        self.assertEqual(before, self.snapshot())

    def test_task_completion_stack(self):
        def change(identity, status):
            execute(self.root, "apply", self.request([{"op": "task.update", "task_id": identity, "set": {"status": status}}]))
        def ids():
            return [t["id"] for t in execute(self.root, "get")["report"]["tasks"]]
        change("one", "done")
        change("two", "done")
        self.assertEqual(ids(), ["two", "one"])
        change("one", "done")
        self.assertEqual(ids(), ["two", "one"])
        change("one", "planned")
        change("one", "done")
        self.assertEqual(ids(), ["one", "two"])

    def test_invalid_later_operation_rejects_whole_batch(self):
        before = self.snapshot()
        with self.assertRaises(ReportError) as caught:
            execute(self.root, "apply", self.request([
                {"op": "report.update", "set": {"title": "no"}},
                {"op": "task.update", "task_id": "one", "set": {"id": "changed"}}]))
        self.assertEqual(caught.exception.operation_index, 1)
        self.assertEqual(before, self.snapshot())

    def test_add_then_update_and_unset(self):
        execute(self.root, "apply", self.request([
            {"op": "task.add", "value": {"id": "three", "title": "新增", "summary": "例", "status": "planned"}},
            {"op": "item.add", "task_id": "three", "value": {"id": "new", "title": "新增項目", "status": "done"}},
            {"op": "task.update", "task_id": "three", "set": {"priority": 2}},
            {"op": "task.update", "task_id": "three", "unset": ["priority"]},
        ]))
        task = execute(self.root, "get", task="three")["task"]
        self.assertNotIn("priority", task)
        self.assertEqual(task["completed_items"][0]["id"], "new")

    def test_overlay_external_edit_conflicts(self):
        request = self.request([{"op": "report.update", "set": {"title": "new"}}])
        self.write("report.dev.json", {"schema_version": "1.0", "report_id": "sample", "updated_at": self.report["updated_at"], "tasks": []})
        with self.assertRaises(ReportError) as caught:
            execute(self.root, "apply", request)
        self.assertEqual(caught.exception.exit_code, 3)

    def test_analysis_failure_rolls_back_both_files_and_projection(self):
        self.write("time.analysis.json", {"original": True})
        request = self.request([{"op": "report.update", "set": {"title": "new"}}, {"op": "dev.update", "task_id": "one", "set": {"blockers": []}}])
        before = self.snapshot()
        def fail(folder, command):
            self.write("time.analysis.json", {"partial": True})
            raise RuntimeError("injected failure")
        with self.assertRaises(ReportError) as caught:
            execute(self.root, "apply", request, analyze=fail)
        self.assertEqual(caught.exception.exit_code, 4)
        self.assertEqual(before, self.snapshot())

    def test_pending_transaction_requires_explicit_write_recovery(self):
        request = self.request([{"op": "report.update", "set": {"title": "new"}}])
        tx = LocalFileTransaction(self.root)
        tx.stage_json("report.json", {**self.report, "title": "interrupted"})
        tx.apply()
        before = self.snapshot()
        for action, dry in (("get", False), ("apply", True)):
            with self.assertRaises(ReportError):
                execute(self.root, action, request, dry_run=dry)
            self.assertEqual(before, self.snapshot())
        execute(self.root, "apply", request)
        self.assertFalse((self.root / TRANSACTION_JOURNAL).exists())
        self.assertEqual(execute(self.root, "get")["report"]["title"], "new")

    def test_bad_shapes_and_float_progress_rejected(self):
        for tasks in (None, 4, [{**self.report["tasks"][0], "pending_items": None}], [{**self.report["tasks"][0], "progress": {"completed": 2.0, "total": 1.0}}]):
            self.write("report.json", {**self.report, "tasks": tasks})
            with self.assertRaises(ValueError):
                execute(self.root, "validate")
        with self.assertRaises(ValueError):
            strict_json('{"x":1,"x":2}')

    def test_existing_null_overlay_is_invalid(self):
        self.write("report.dev.json", None)
        before = self.snapshot()
        with self.assertRaises(ValueError):
            execute(self.root, "validate")
        self.assertEqual(before, self.snapshot())


if __name__ == "__main__":
    unittest.main()
