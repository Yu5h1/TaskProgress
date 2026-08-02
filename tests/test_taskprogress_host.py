from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi.testclient import TestClient

from service.taskprogress_host import (
    LocalFileTransaction,
    TRANSACTION_JOURNAL,
    install_edit_api,
    recover_pending_transaction,
    _load_module,
)


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
LOCAL_WEB_SERVICE = REPOSITORY_ROOT.parent / "LocalWebService" / "localHost.py"
REPORT_SCHEMA = REPOSITORY_ROOT / "schemas" / "report.schema.json"
PORT = 8765
ORIGIN = f"http://127.0.0.1:{PORT}"
HOST = f"127.0.0.1:{PORT}"


def report_payload() -> dict[str, object]:
    return {
        "schema_version": "1.0",
        "report_id": "secure-edit-test",
        "scope_id": "secure-test",
        "title": "Secure edit test",
        "updated_at": "2026-07-29T12:00:00Z",
        "tasks": [
            {
                "id": "first-task",
                "title": "First task",
                "status": "planned",
                "summary": "Original description",
                "priority": 1,
                "completed_items": [],
                "pending_items": [
                    {
                        "id": "first-child",
                        "title": "First child",
                        "priority": 2,
                    }
                ],
            }
        ],
    }


class TaskProgressEditHostTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        (self.root / "index.html").write_text("viewer", encoding="utf-8")
        self.report_path = self.root / "report.json"
        self.report_path.write_text(
            json.dumps(report_payload(), ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        local_web_service = _load_module(LOCAL_WEB_SERVICE)
        application = local_web_service.create_app(
            self.root,
            files={"/reports/secure-test/report.json": self.report_path},
            control_token="a" * 32,
            control_port=PORT,
            cors_origins=(),
        )
        install_edit_api(
            application,
            report_schema=REPORT_SCHEMA,
            control_port=PORT,
        )
        self.client = TestClient(
            application,
            base_url=ORIGIN,
            headers={"host": HOST},
        )

    def tearDown(self) -> None:
        self.client.close()
        self.temporary.cleanup()

    def session(self) -> dict[str, object]:
        response = self.client.post(
            "/__taskprogress/v1/edit-sessions",
            headers={
                "origin": ORIGIN,
                "x-taskprogress-editor": "1",
                "content-type": "application/json",
            },
            json={"scope_id": "secure-test"},
        )
        self.assertEqual(201, response.status_code, response.text)
        return response.json()

    def test_public_capability_is_read_only_until_exact_scope_exists(self) -> None:
        response = self.client.get("/__taskprogress/v1/capabilities/missing")
        self.assertEqual(404, response.status_code)
        capability = self.client.get(
            "/__taskprogress/v1/capabilities/secure-test"
        )
        self.assertEqual(200, capability.status_code)
        self.assertTrue(capability.json()["editable"])

    def test_session_requires_same_origin_and_editor_header(self) -> None:
        missing_origin = self.client.post(
            "/__taskprogress/v1/edit-sessions",
            headers={"x-taskprogress-editor": "1"},
            json={"scope_id": "secure-test"},
        )
        self.assertEqual(403, missing_origin.status_code)
        foreign_origin = self.client.post(
            "/__taskprogress/v1/edit-sessions",
            headers={
                "origin": "https://attacker.example",
                "x-taskprogress-editor": "1",
            },
            json={"scope_id": "secure-test"},
        )
        self.assertEqual(403, foreign_origin.status_code)

    def test_valid_save_rotates_token_and_rejects_reuse(self) -> None:
        session = self.session()
        changed = report_payload()
        changed["tasks"][0]["summary"] = "Safely updated"
        headers = {
            "origin": ORIGIN,
            "x-taskprogress-editor": "1",
            "authorization": f"Bearer {session['token']}",
            "if-match": f"\"{session['revision']}\"",
            "content-type": "application/json",
        }
        response = self.client.put(
            "/__taskprogress/v1/reports/secure-test",
            headers=headers,
            content=json.dumps(changed),
        )
        self.assertEqual(200, response.status_code, response.text)
        self.assertNotEqual(session["token"], response.json()["token"])
        persisted = json.loads(self.report_path.read_text(encoding="utf-8"))
        self.assertEqual("Safely updated", persisted["tasks"][0]["summary"])
        reused = self.client.put(
            "/__taskprogress/v1/reports/secure-test",
            headers=headers,
            content=json.dumps(changed),
        )
        self.assertEqual(401, reused.status_code)

    def test_schema_and_external_revision_conflicts_preserve_source(self) -> None:
        session = self.session()
        original = self.report_path.read_bytes()
        invalid = report_payload()
        invalid["tasks"][0]["summary"] = ""
        response = self.client.put(
            "/__taskprogress/v1/reports/secure-test",
            headers={
                "origin": ORIGIN,
                "x-taskprogress-editor": "1",
                "authorization": f"Bearer {session['token']}",
                "if-match": f"\"{session['revision']}\"",
                "content-type": "application/json",
            },
            content=json.dumps(invalid),
        )
        self.assertEqual(422, response.status_code)
        self.assertEqual(original, self.report_path.read_bytes())

        external = report_payload()
        external["tasks"][0]["summary"] = "External update"
        self.report_path.write_text(
            json.dumps(external, ensure_ascii=False),
            encoding="utf-8",
        )
        response = self.client.put(
            "/__taskprogress/v1/reports/secure-test",
            headers={
                "origin": ORIGIN,
                "x-taskprogress-editor": "1",
                "authorization": f"Bearer {session['token']}",
                "if-match": f"\"{session['revision']}\"",
                "content-type": "application/json",
            },
            content=json.dumps(report_payload()),
        )
        self.assertEqual(409, response.status_code)
        self.assertEqual(
            "External update",
            json.loads(self.report_path.read_text(encoding="utf-8"))["tasks"][0][
                "summary"
            ],
        )

    def test_transaction_rollback_restores_staged_and_derived_files(self) -> None:
        analysis_path = self.root / "time.analysis.json"
        original_report = self.report_path.read_bytes()
        original_analysis = b'{"state":"original"}\n'
        analysis_path.write_bytes(original_analysis)
        changed = report_payload()
        changed["tasks"][0]["summary"] = "Staged change"

        transaction = LocalFileTransaction(self.root)
        transaction.stage_json("report.json", changed)
        transaction.watch("time.analysis.json")
        transaction.prepare()
        transaction.apply()
        analysis_path.write_bytes(b'{"state":"generated"}\n')
        transaction.rollback()

        self.assertEqual(original_report, self.report_path.read_bytes())
        self.assertEqual(original_analysis, analysis_path.read_bytes())
        self.assertFalse((self.root / TRANSACTION_JOURNAL).exists())
        self.assertEqual([], list(self.root.glob(".taskprogress.transaction.*.bak")))

    def test_interrupted_transaction_is_recovered_before_the_next_edit(self) -> None:
        original_report = self.report_path.read_bytes()
        config_path = self.root / "time.config.json"
        analysis_path = self.root / "time.analysis.json"
        changed = report_payload()
        changed["tasks"][0]["summary"] = "Interrupted change"

        transaction = LocalFileTransaction(self.root)
        transaction.stage_json("report.json", changed)
        transaction.stage_json("time.config.json", {"delivery_at": "future"})
        transaction.watch("time.analysis.json")
        transaction.prepare()
        transaction.apply()
        analysis_path.write_text('{"generated":true}\n', encoding="utf-8")

        self.assertTrue(recover_pending_transaction(self.root))
        self.assertEqual(original_report, self.report_path.read_bytes())
        self.assertFalse(config_path.exists())
        self.assertFalse(analysis_path.exists())
        self.assertFalse(recover_pending_transaction(self.root))

    def test_committed_transaction_keeps_all_staged_files(self) -> None:
        changed = report_payload()
        changed["tasks"][0]["summary"] = "Committed change"
        config = {"project": {"delivery_at": None}}

        transaction = LocalFileTransaction(self.root)
        transaction.stage_json("report.json", changed)
        transaction.stage_json("time.config.json", config)
        transaction.prepare()
        transaction.apply()
        transaction.commit()

        self.assertEqual(
            "Committed change",
            json.loads(self.report_path.read_text(encoding="utf-8"))["tasks"][0][
                "summary"
            ],
        )
        self.assertEqual(
            config,
            json.loads((self.root / "time.config.json").read_text(encoding="utf-8")),
        )
        self.assertFalse((self.root / TRANSACTION_JOURNAL).exists())

    def test_transaction_rejects_files_outside_the_owned_set(self) -> None:
        transaction = LocalFileTransaction(self.root)
        with self.assertRaises(ValueError):
            transaction.stage_bytes("../outside.json", b"{}")
        with self.assertRaises(ValueError):
            transaction.watch("time.events.json")

    def test_transaction_validation_runs_before_any_source_changes(self) -> None:
        original = self.report_path.read_bytes()
        transaction = LocalFileTransaction(self.root)
        transaction.stage_json("report.json", report_payload())

        def reject() -> None:
            raise ValueError("validation failed")

        with self.assertRaisesRegex(ValueError, "validation failed"):
            transaction.prepare((reject,))
        self.assertEqual(original, self.report_path.read_bytes())
        self.assertFalse((self.root / TRANSACTION_JOURNAL).exists())

    def test_analysis_failure_restores_report_and_previous_analysis(self) -> None:
        session = self.session()
        original_report = self.report_path.read_bytes()
        analysis_path = self.root / "time.analysis.json"
        original_analysis = b'{"analysis":"original"}\n'
        analysis_path.write_bytes(original_analysis)
        changed = report_payload()
        changed["tasks"][0]["summary"] = "Must roll back"

        def fail_analysis(_command: object, _path: Path) -> tuple[bool, str]:
            analysis_path.write_bytes(b'{"analysis":"partial"}\n')
            return False, "simulated analyzer failure"

        with patch("service.taskprogress_host._run_analysis", side_effect=fail_analysis):
            response = self.client.put(
                "/__taskprogress/v1/reports/secure-test",
                headers={
                    "origin": ORIGIN,
                    "x-taskprogress-editor": "1",
                    "authorization": f"Bearer {session['token']}",
                    "if-match": f"\"{session['revision']}\"",
                    "content-type": "application/json",
                },
                content=json.dumps(changed),
            )

        self.assertEqual(409, response.status_code, response.text)
        self.assertEqual(original_report, self.report_path.read_bytes())
        self.assertEqual(original_analysis, analysis_path.read_bytes())
        self.assertFalse((self.root / TRANSACTION_JOURNAL).exists())


if __name__ == "__main__":
    unittest.main()
