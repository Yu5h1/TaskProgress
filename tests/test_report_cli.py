"""Focused in-process checks for Report operations and recoverable CLI transactions."""
import json
import io
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from unittest.mock import patch

from service.report_cli import execute, main, ReportError
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

    def request(self, operations, actor="codex", session=None, name=None):
        request = {"version": "1", "expected_revision": execute(self.root, "get")["revision"],
                   "operations": operations, "actor": actor}
        if session is not None:
            request["session_id"] = session
        if name is not None:
            request["session"] = name
        return request

    def item(self, identity="item"):
        task = execute(self.root, "get", task="one")["task"]
        return next(i for key in ("pending_items", "completed_items") for i in task.get(key, [])
                    if isinstance(i, dict) and i["id"] == identity)

    def test_release_frees_the_claim_and_dispute_needs_a_note(self):
        op = lambda **kw: {"op": "item.event", "task_id": "one", "item_id": "item", **kw}
        execute(self.root, "apply", self.request([{"op": "item.update", "task_id": "one", "item_id": "item", "set": {"status": "in_progress"}}], session="s1"))
        execute(self.root, "apply", self.request([op(event="released")], session="s1"))
        self.assertEqual(self.item()["status"], "planned")
        execute(self.root, "apply", self.request([{"op": "item.update", "task_id": "one", "item_id": "item", "set": {"status": "in_progress"}}], actor="claude", session="s2"))
        self.assertEqual([(e["event"], e.get("session_id")) for e in self.item()["activity"]],
                         [("started", "s1"), ("released", "s1"), ("started", "s2")])
        with self.assertRaises(ReportError):
            execute(self.root, "apply", self.request([op(event="disputed")], session="s3"))
        with self.assertRaises(ReportError):
            execute(self.root, "apply", self.request([op(event="done")], session="s3"))
        execute(self.root, "apply", self.request([op(event="disputed", note="條件與規格 3.2 一致，不需修改")], session="s3"))
        self.assertEqual(self.item()["activity"][-1]["note"], "條件與規格 3.2 一致，不需修改")

    def test_release_frees_only_the_writers_claim_unless_recovered(self):
        op = lambda **kw: {"op": "item.event", "task_id": "one", "item_id": "item", "event": "released", **kw}
        execute(self.root, "apply", self.request([{"op": "item.update", "task_id": "one", "item_id": "item", "set": {"status": "in_progress"}}], session="s1"))
        for actor, session, code in (("codex", "s2", "claim_conflict"), ("claude", None, "claim_conflict"), ("codex", None, "claim_unverified")):
            with self.assertRaises(ReportError) as raised:
                execute(self.root, "apply", self.request([op()], actor=actor, session=session))
            self.assertEqual(raised.exception.code, code)
        self.assertEqual(self.item()["status"], "in_progress")
        for claim in ("takeover", "bogus"):
            with self.assertRaises(ReportError):
                execute(self.root, "apply", self.request([op(claim=claim)], session="s2"))
        with self.assertRaises(ReportError):
            execute(self.root, "apply", self.request([{"op": "item.update", "task_id": "one", "item_id": "item", "set": {"title": "X"}, "claim": "recover"}], session="s1"))
        with self.assertRaises(ReportError):
            execute(self.root, "apply", self.request([op(event="disputed", note="理由", claim="recover")], session="s2"))
        execute(self.root, "apply", self.request([op(claim="recover")], session="s2"))
        self.assertEqual(self.item()["status"], "planned")
        self.assertEqual([(e["event"], e.get("session_id")) for e in self.item()["activity"]], [("started", "s1"), ("released", "s2")],
                         "a recovery release records no takeover, so the recovering session is not an executor")

    def test_next_marker_points_at_one_unfinished_item(self):
        execute(self.root, "apply", self.request([{"op": "item.add", "task_id": "one", "value": {"id": "b", "title": "B"}}]))
        execute(self.root, "apply", self.request([{"op": "next.set", "task_id": "one", "item_id": "item"}], session="s1"))
        report = execute(self.root, "get")["report"]
        self.assertEqual(report["next"], {"task_id": "one", "item_id": "item"})
        self.assertEqual(self.item()["activity"][-1]["event"], "updated", "setting Next is recorded on the item")
        result = execute(self.root, "apply", self.request([{"op": "next.set", "task_id": "one", "item_id": "item"}]))
        self.assertFalse(result["changed"], "the same Next twice is a no-op")
        execute(self.root, "apply", self.request([{"op": "next.set", "task_id": "one", "item_id": "b"}]))
        self.assertEqual(execute(self.root, "get")["report"]["next"]["item_id"], "b", "a new Next replaces the old one")
        for operation in ({"op": "next.set", "task_id": "one", "item_id": "missing"},
                          {"op": "next.set", "task_id": "two", "item_id": "item"},
                          {"op": "next.set", "task_id": "one", "item_id": "item", "set": {}},
                          {"op": "next.clear", "task_id": "one"}):
            with self.assertRaises(ReportError):
                execute(self.root, "apply", self.request([operation]))
        execute(self.root, "apply", self.request([{"op": "item.update", "task_id": "one", "item_id": "b", "set": {"status": "done"}}]))
        self.assertEqual(execute(self.root, "get")["report"]["next"]["item_id"], "b", "completion leaves the marker; readers derive its validity")
        with self.assertRaises(ReportError):
            execute(self.root, "apply", self.request([{"op": "next.set", "task_id": "one", "item_id": "b"}]))
        execute(self.root, "apply", self.request([{"op": "next.clear"}]))
        self.assertNotIn("next", execute(self.root, "get")["report"])
        self.assertFalse(execute(self.root, "apply", self.request([{"op": "next.clear"}]))["changed"])

    def test_waits_reject_self_unknown_and_loops(self):
        wait = lambda item: [{"scope_id": "sample", "task_id": "one", "item_id": item}]
        execute(self.root, "apply", self.request([{"op": "item.add", "task_id": "one", "value": {"id": "b", "title": "B"}}]))
        for waits in (wait("item"), wait("missing"), [{"scope_id": "nowhere", "task_id": "one", "item_id": "b"}]):
            with self.assertRaises(ReportError):
                execute(self.root, "apply", self.request([{"op": "item.update", "task_id": "one", "item_id": "item", "set": {"waits_for": waits}}]))
        execute(self.root, "apply", self.request([{"op": "item.update", "task_id": "one", "item_id": "item", "set": {"waits_for": wait("b")}}]))
        self.assertEqual(self.item()["waits_for"], wait("b"))
        with self.assertRaises(ReportError):
            execute(self.root, "apply", self.request([{"op": "item.update", "task_id": "one", "item_id": "b", "set": {"waits_for": wait("item")}}]))
        execute(self.root, "apply", self.request([{"op": "item.update", "task_id": "one", "item_id": "item", "unset": ["waits_for"]}]))
        self.assertNotIn("waits_for", self.item())

    def test_a_wait_may_be_strict_and_nothing_else(self):
        wait = lambda **kw: [{"scope_id": "sample", "task_id": "one", "item_id": "b", **kw}]
        execute(self.root, "apply", self.request([{"op": "item.add", "task_id": "one", "value": {"id": "b", "title": "B"}}]))
        for waits in (wait(strict=False), wait(strict="yes"), wait(until="user")):
            with self.assertRaises(ReportError):
                execute(self.root, "apply", self.request([{"op": "item.update", "task_id": "one", "item_id": "item", "set": {"waits_for": waits}}]))
        execute(self.root, "apply", self.request([{"op": "item.update", "task_id": "one", "item_id": "item", "set": {"waits_for": wait(strict=True)}}]))
        self.assertEqual(self.item()["waits_for"], wait(strict=True))

    def test_retirement_names_a_replacement_or_a_reason(self):
        op = lambda item, **values: {"op": "item.update", "task_id": "one", "item_id": item, "set": values}
        replaced_by = {"scope_id": "sample", "task_id": "one", "item_id": "b"}
        execute(self.root, "apply", self.request([{"op": "item.add", "task_id": "one", "value": {"id": "b", "title": "B"}},
                                                  {"op": "item.add", "task_id": "one", "value": {"id": "c", "title": "C"}}]))
        for operation in (op("item", status="obsolete"),
                          op("item", status="obsolete", retirement={"reason": "已由 B 達成"}),
                          op("item", status="obsolete", retirement={"replaced_by": {**replaced_by, "item_id": "missing"}}),
                          op("item", status="obsolete", retirement={"replaced_by": {**replaced_by, "item_id": "item"}}),
                          op("item", status="discontinued"),
                          op("item", status="discontinued", retirement={"reason": "  "}),
                          op("item", status="discontinued", retirement={"reason": "前提不成立", "replaced_by": replaced_by}),
                          op("item", retirement={"reason": "未退場"})):
            with self.assertRaises(ReportError):
                execute(self.root, "apply", self.request([operation]))
        execute(self.root, "apply", self.request([op("item", status="obsolete", retirement={"replaced_by": replaced_by})]))
        self.assertEqual((self.item()["status"], self.item()["retirement"]), ("obsolete", {"replaced_by": replaced_by}))
        with self.assertRaises(ReportError):
            execute(self.root, "apply", self.request([op("c", waits_for=[{"scope_id": "sample", "task_id": "one", "item_id": "item"}])]))
        execute(self.root, "apply", self.request([op("b", waits_for=[{"scope_id": "sample", "task_id": "one", "item_id": "c"}])]))
        with self.assertRaises(ReportError):
            execute(self.root, "apply", self.request([op("c", status="discontinued", retirement={"reason": "前提不成立"})]))
        execute(self.root, "apply", self.request([{"op": "item.update", "task_id": "one", "item_id": "b", "unset": ["waits_for"]}]))
        execute(self.root, "apply", self.request([op("c", status="discontinued", retirement={"reason": "前提不成立"})]))
        execute(self.root, "apply", self.request([{"op": "item.update", "task_id": "one", "item_id": "item",
                                                   "set": {"status": "planned"}, "unset": ["retirement"]}]))
        self.assertNotIn("retirement", self.item())
        (self.root / "design.md").write_text("# 設計\n", encoding="utf-8")
        for document in ("missing.md", "../design.md", "/design.md"):
            with self.assertRaises(ReportError):
                execute(self.root, "apply", self.request([op("item", status="obsolete", retirement={"replaced_by": {"document": document}})]))
        execute(self.root, "apply", self.request([op("item", status="obsolete", retirement={"replaced_by": {"document": "design.md#設計"}})]))
        self.assertEqual(self.item()["retirement"], {"replaced_by": {"document": "design.md#設計"}})

    def test_a_card_binds_only_its_own_existing_experience_record(self):
        ref = lambda **kw: {"kind": "experience", "scope_id": "sample", "task": "one", **kw}
        update = lambda value: self.request([{"op": "task.update", "task_id": "one", "set": {"document_ref": value}}])
        with self.assertRaises(ReportError):
            execute(self.root, "apply", update(ref()))
        (self.root / "experience").mkdir()
        (self.root / "experience" / "one.md").write_text("- [open] 2026-10-25 codex › item › missing：例\n", encoding="utf-8")
        for value in (ref(kind="checklist"), ref(scope_id="other"), ref(task="../one"), ref(stem="one")):
            with self.assertRaises(ReportError):
                execute(self.root, "apply", update(value))
        execute(self.root, "apply", update(ref()))
        self.assertEqual(execute(self.root, "get", task="one")["task"]["document_ref"], ref())
        execute(self.root, "apply", self.request([{"op": "task.update", "task_id": "one", "unset": ["document_ref"]}]))
        self.assertNotIn("document_ref", execute(self.root, "get", task="one")["task"])

    def test_waits_on_a_checklist_work_item_need_the_file_and_the_work_item(self):
        (self.root / "checklists").mkdir()
        (self.root / "checklists" / "manual.checklist").write_text(
            "# Manual\n\n- [x] **1. A**\n  Checks:\n    - [x] **a**\n\n- [ ] **2. B**\n", encoding="utf-8")
        wait = lambda **kw: [{"scope_id": "sample", "checklist": "manual", "work_item": 2, **kw}]
        for waits in (wait(work_item=3), wait(checklist="missing"), wait(work_item=0), wait(task_id="one"),
                      [{"scope_id": "nowhere", "checklist": "manual", "work_item": 1}], wait() + wait()):
            with self.assertRaises(ReportError):
                execute(self.root, "apply", self.request([{"op": "item.update", "task_id": "one", "item_id": "item", "set": {"waits_for": waits}}]))
        execute(self.root, "apply", self.request([{"op": "item.update", "task_id": "one", "item_id": "item", "set": {"waits_for": wait()}}]))
        self.assertEqual(self.item()["waits_for"], wait())

    def test_activity_records_created_started_done_and_keeps_three_recent(self):
        execute(self.root, "apply", self.request([{"op": "item.add", "task_id": "one", "value": {"id": "log", "title": "Log"}}], session="s1", name="Report 修正"))
        self.assertEqual([(e["event"], e["actor"], e.get("session"), e.get("session_id")) for e in self.item("log")["activity"]],
                         [("created", "codex", "Report 修正", "s1")])
        for title in ("A", "B", "C"):
            execute(self.root, "apply", self.request([{"op": "item.update", "task_id": "one", "item_id": "log", "set": {"title": title}}], session="s1"))
        execute(self.root, "apply", self.request([{"op": "item.update", "task_id": "one", "item_id": "log", "set": {"status": "in_progress"}}], session="s1"))
        execute(self.root, "apply", self.request([{"op": "item.update", "task_id": "one", "item_id": "log", "set": {"status": "done"}}], session="s1"))
        self.assertEqual([e["event"] for e in self.item("log")["activity"]], ["created", "updated", "updated", "started", "done"])

    def test_activity_noop_stays_noop_and_actor_is_required(self):
        execute(self.root, "apply", self.request([{"op": "item.add", "task_id": "one", "value": {"id": "log", "title": "Log"}}]))
        before = self.snapshot()
        result = execute(self.root, "apply", self.request([{"op": "item.update", "task_id": "one", "item_id": "log", "set": {"title": "Log"}}]))
        self.assertFalse(result["changed"])
        self.assertEqual(before, self.snapshot())
        request = self.request([{"op": "item.update", "task_id": "one", "item_id": "log", "set": {"title": "X"}}])
        del request["actor"]
        with self.assertRaises(ReportError):
            execute(self.root, "apply", request)
        with self.assertRaises(ReportError):
            execute(self.root, "apply", self.request([{"op": "item.add", "task_id": "one", "value": {"id": "forged", "title": "F", "activity": []}}]))

    def test_claim_conflict_unverified_own_and_takeover(self):
        execute(self.root, "apply", self.request([{"op": "item.add", "task_id": "one", "value": {"id": "log", "title": "Log", "status": "in_progress"}}], session="s1"))
        execute(self.root, "apply", self.request([{"op": "item.update", "task_id": "one", "item_id": "log", "set": {"title": "Same session"}}], session="s1"))
        rename = [{"op": "item.update", "task_id": "one", "item_id": "log", "set": {"title": "Other"}}]
        with self.assertRaises(ReportError) as named:
            execute(self.root, "apply", self.request(rename, actor="codex", name="same name, no id"))
        self.assertEqual(named.exception.code, "claim_unverified", "a session name never proves identity")
        for actor, session, code in (("claude", None, "claim_conflict"), ("codex", "s2", "claim_conflict"), ("codex", None, "claim_unverified")):
            with self.assertRaises(ReportError) as raised:
                execute(self.root, "apply", self.request(rename, actor=actor, session=session))
            self.assertEqual(raised.exception.code, code)
        with self.assertRaises(ReportError):
            execute(self.root, "apply", self.request([{**rename[0], "claim": "own"}], actor="claude"))
        execute(self.root, "apply", self.request([{**rename[0], "claim": "own"}], actor="codex"))
        execute(self.root, "apply", self.request([{**rename[0], "set": {"title": "Taken"}, "claim": "takeover"}], actor="claude", session="c1"))
        self.assertEqual([(e["event"], e["actor"]) for e in self.item("log")["activity"]][-2:], [("takeover", "claude"), ("updated", "claude")])
        execute(self.root, "apply", self.request([{**rename[0], "set": {"title": "Mine now"}}], actor="claude", session="c1"))
        self.assertEqual(execute(self.root, "get", task="one")["revision"], execute(self.root, "get")["revision"])

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

    def test_position_add_move_dry_run_noop_and_lifecycle(self):
        def apply(operations, **options):
            return execute(self.root, "apply", self.request(operations, session="lifecycle"), **options)
        def move(identity, position):
            return {"op": "item.move", "task_id": "one", "item_id": identity, "position": position}
        def ids():
            return [i if isinstance(i, str) else i["id"]
                    for i in execute(self.root, "get", task="one")["task"]["pending_items"]]
        operations = [
            {"op": "item.add", "task_id": "one", "value": {"id": "a", "title": "A", "priority": 4}, "position": {"before": "item"}},
            {"op": "item.add", "task_id": "one", "value": {"id": "b", "title": "B", "priority": 1}, "position": {"after": "a"}},
            move("item", {"before": "a"}),
        ]
        before = self.snapshot()
        self.assertTrue(apply(operations, dry_run=True)["changed"])
        self.assertEqual(before, self.snapshot())
        result = apply(operations)
        self.assertEqual(ids(), ["legacy", "item", "a", "b"])
        self.assertEqual(result["changes"][-1], {"op": "item.move", "task_id": "one", "item_id": "item", "fields": ["position"]})
        before = self.snapshot()
        self.assertFalse(apply([move("item", {"before": "a"})])["changed"])
        self.assertEqual(before, self.snapshot())
        apply([move("item", {"after": "b"})])
        self.assertEqual(ids(), ["legacy", "a", "b", "item"])
        for status in ("in_progress", "done"):
            apply([{"op": "item.update", "task_id": "one", "item_id": "item", "set": {"status": status}}])
        apply([{"op": "item.update", "task_id": "one", "item_id": "item", "set": {"status": "in_progress"}},
               move("item", {"before": "a"})])
        task = execute(self.root, "get", task="one")["task"]
        self.assertEqual(ids(), ["legacy", "item", "a", "b"])
        self.assertEqual(task["completed_items"], [])
        self.assertEqual({k: v for k, v in task["pending_items"][1].items() if k != "activity"}, {"id": "item", "title": "項目", "status": "in_progress"})
        self.assertEqual(task["pending_items"][3]["priority"], 1)

    def test_invalid_positions_and_priority_reject_entire_batch(self):
        execute(self.root, "apply", self.request([
            {"op": "item.add", "task_id": "one", "value": {"id": "done", "title": "Done", "status": "done"}},
            {"op": "item.add", "task_id": "two", "value": {"id": "elsewhere", "title": "Other"}},
        ]))
        positions = [None, 0, "item", {}, {"before": "item", "after": "item"},
                     {"index": 0}, {"before": 0}, {"before": ""}, {"before": "missing"},
                     {"after": "elsewhere"}, {"after": "done"}, {"before": "legacy"}, {"before": "項目"}]
        invalid = [{"op": "item.add", "task_id": "one", "value": {"id": "new", "title": "New"}, "position": p} for p in positions]
        invalid += [
            {"op": "item.move", "task_id": "one", "item_id": "item", "position": {"before": "item"}},
            {"op": "item.move", "task_id": "one", "item_id": "item"},
            {"op": "item.move", "task_id": "one", "item_id": "done", "position": {"before": "item"}},
            {"op": "item.add", "task_id": "one", "value": {"id": "new", "title": "New", "status": "done"}, "position": {"before": "item"}},
            {"op": "item.update", "task_id": "one", "item_id": "item", "set": {"priority": 5}},
        ]
        before = self.snapshot()
        for operation in invalid:
            with self.subTest(operation=operation):
                with self.assertRaises(ReportError) as caught:
                    execute(self.root, "apply", self.request([
                        {"op": "report.update", "set": {"title": "Must roll back"}}, operation]))
                self.assertEqual(caught.exception.operation_index, 1)
                self.assertEqual(before, self.snapshot())

    def test_move_rejects_stale_revision(self):
        request = self.request([{"op": "item.move", "task_id": "one", "item_id": "item", "position": {"after": "other"}}])
        execute(self.root, "apply", self.request([{"op": "item.add", "task_id": "one", "value": {"id": "other", "title": "Other"}}]))
        before = self.snapshot()
        with self.assertRaises(ReportError) as caught:
            execute(self.root, "apply", request)
        self.assertEqual(caught.exception.exit_code, 3)
        self.assertEqual(before, self.snapshot())

    def test_command_entry_get_dry_run_apply_and_readback(self):
        def command(action, request=None, dry_run=False):
            output = io.StringIO()
            source = io.TextIOWrapper(io.BytesIO(json.dumps(request).encode("utf-8")), encoding="utf-8")
            with patch("sys.stdin", source), redirect_stdout(output):
                code = main([action, "--folder", str(self.root), *(["--dry-run"] if dry_run else [])])
            return code, json.loads(output.getvalue())
        code, current = command("get")
        self.assertEqual(code, 0)
        request = {"version": "1", "expected_revision": current["revision"], "operations": [
            {"op": "item.add", "task_id": "one", "value": {"id": "first", "title": "第一項"}, "position": {"before": "item"}},
            {"op": "item.move", "task_id": "one", "item_id": "item", "position": {"after": "first"}},
        ], "actor": "codex"}
        before = self.snapshot()
        code, preview = command("apply", request, dry_run=True)
        self.assertEqual(code, 0)
        self.assertTrue(preview["ok"])
        self.assertEqual(before, self.snapshot())
        code, saved = command("apply", request)
        self.assertEqual(code, 0)
        self.assertTrue(saved["changed"])
        code, current = command("get")
        self.assertEqual(current["revision"], saved["revision"])
        self.assertEqual([i["id"] for i in current["report"]["tasks"][0]["pending_items"] if isinstance(i, dict)], ["first", "item"])


if __name__ == "__main__":
    unittest.main()
