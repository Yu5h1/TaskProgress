from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi.testclient import TestClient
from jsonschema import Draft202012Validator, FormatChecker

from service.taskprogress_host import (
    LocalFileTransaction,
    TRANSACTION_JOURNAL,
    _atomic_replace,
    install_edit_api,
    recover_pending_transaction,
    _load_module,
)


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
LOCAL_WEB_SERVICE = REPOSITORY_ROOT.parent / "LocalWebService" / "localHost.py"
REPORT_SCHEMA = REPOSITORY_ROOT / "schemas" / "report.schema.json"
FIXTURES = REPOSITORY_ROOT / "tests" / "fixtures"
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


def time_config_payload() -> dict[str, object]:
    return {
        "schema_version": "0.2",
        "scope_id": "secure-test",
        "updated_at": "2026-08-02T12:00:00Z",
        "timezone": "Asia/Taipei",
        "standard_allocation": {
            "total_minutes_per_day": 1440,
            "sleep_minutes_per_day": 480,
            "life_minutes_per_day": 480,
            "other_unavailable_minutes_per_day": 0,
            "capacity_minutes_per_executor_day": 480,
            "working_weekdays": [1, 2, 3, 4, 5],
            "workday_start_local": "09:00",
            "workday_end_local": "17:00",
        },
        "project": {"executor_count": 1},
        "estimate_defaults": {
            "unplanned_item_likely_minutes": 480,
            "unplanned_item_confidence": "low",
            "allow_range": True,
        },
        "estimate_resolution": {
            "automatic_source_order": ["historical", "ai", "default"],
            "manual_resolution": "final_override",
            "preserve_history": True,
        },
        "execution_calibration": {
            "initial_factor": 1.0,
            "prior_equivalent_samples": 10,
            "automatic_adjustment": False,
        },
        "urgency_thresholds": {
            "on_track_max_pressure_ratio": 1.1,
            "at_risk_max_pressure_ratio": 1.5,
        },
        "display": {"project_day_rounding": "ceiling", "item_unit": "hour"},
    }


def time_estimates_payload() -> dict[str, object]:
    return {
        "schema_version": "0.2",
        "scope_id": "secure-test",
        "updated_at": "2026-08-02T12:00:00Z",
        "estimates": [
            {
                "estimate_id": "estimate-first-child-v1",
                "task_id": "first-task",
                "item_id": "first-child",
                "likely_minutes": 120,
                "contributors": [
                    {"kind": "human_estimate", "summary": "人工直接估算。"}
                ],
                "human_confirmed": True,
                "confidence": "medium",
                "estimated_at": "2026-08-02T12:00:00Z",
                "active": True,
                "human_note": "已知範圍約兩小時。",
            }
        ],
    }


class ReportSchemaVersionTests(unittest.TestCase):
    """The edit host validates against the shared schema file, so it inherits
    both live versions instead of keeping a version list of its own."""

    @staticmethod
    def _validator() -> Draft202012Validator:
        schema = json.loads(REPORT_SCHEMA.read_text(encoding="utf-8"))
        return Draft202012Validator(schema, format_checker=FormatChecker())

    def test_both_live_versions_validate(self) -> None:
        validator = self._validator()
        for name in ("report-1.0-untagged.json", "report-1.1-tagged.json"):
            with self.subTest(fixture=name):
                fixture = json.loads((FIXTURES / name).read_text(encoding="utf-8"))
                self.assertEqual(list(validator.iter_errors(fixture)), [])

    def test_a_pointer_card_may_not_keep_derived_fields(self) -> None:
        fixture = json.loads((FIXTURES / "report-1.1-tagged.json").read_text(encoding="utf-8"))
        fixture["tasks"][1]["status"] = "done"
        self.assertNotEqual(list(self._validator().iter_errors(fixture)), [])

    def test_an_unsupported_version_is_rejected(self) -> None:
        fixture = json.loads((FIXTURES / "report-1.0-untagged.json").read_text(encoding="utf-8"))
        fixture["schema_version"] = "2.0"
        self.assertNotEqual(list(self._validator().iter_errors(fixture)), [])


class SchemaSourceWiringTests(unittest.TestCase):
    """One reader of the schema file, one annotation, no frozen copy."""

    SOURCE = (REPOSITORY_ROOT / "service" / "taskprogress_host.py").read_text(
        encoding="utf-8"
    )

    def test_no_report_validation_uses_a_startup_copy(self) -> None:
        self.assertEqual(
            0,
            self.SOURCE.count("_schema_errors(validator, report)"),
            "a report is still validated against a validator frozen at startup",
        )
        self.assertEqual(
            5, self.SOURCE.count("_schema_errors(schema_source.validator(), report)")
        )

    def test_every_report_schema_failure_is_annotated_the_same_way(self) -> None:
        self.assertEqual(5, self.SOURCE.count("schema_source.annotate("))


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
        self.schema_path = self.root / "schema" / "report.schema.json"
        self.schema_path.parent.mkdir()
        self.schema_path.write_bytes(REPORT_SCHEMA.read_bytes())
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
            report_schema=self.schema_path,
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

    def session(self, timezone: str | None = None) -> dict[str, object]:
        payload = {"scope_id": "secure-test"}
        if timezone is not None:
            payload["timezone"] = timezone
        response = self.client.post(
            "/__taskprogress/v1/edit-sessions",
            headers={
                "origin": ORIGIN,
                "x-taskprogress-editor": "1",
                "content-type": "application/json",
            },
            json=payload,
        )
        self.assertEqual(201, response.status_code, response.text)
        return response.json()

    def edit_headers(self, session: dict[str, object]) -> dict[str, str]:
        return {
            "origin": ORIGIN,
            "x-taskprogress-editor": "1",
            "authorization": f"Bearer {session['token']}",
            "if-match": f'"{session["revision"]}"',
            "content-type": "application/json",
        }

    def edit_payload(
        self,
        session: dict[str, object],
        *,
        report: dict[str, object] | None = None,
        inputs: dict[str, dict[str, object]] | None = None,
        changes: list[dict[str, str]] | None = None,
    ) -> dict[str, object]:
        return {
            "report": report or report_payload(),
            "inputs_revision": session["inputs_revision"],
            "local_revision": session["local_revision"],
            "inputs": inputs or {},
            "changes": changes or [],
        }

    def delivery_change(self, reason: str = "配合里程碑調整") -> dict[str, str]:
        return {
            "field_path": "time.config.project.delivery_at",
            "reason": reason,
            "actor": "human",
        }

    def test_public_capability_is_read_only_until_exact_scope_exists(self) -> None:
        response = self.client.get("/__taskprogress/v1/capabilities/missing")
        self.assertEqual(404, response.status_code)
        capability = self.client.get(
            "/__taskprogress/v1/capabilities/secure-test"
        )
        self.assertEqual(200, capability.status_code)
        self.assertTrue(capability.json()["editable"])
        self.assertNotIn("editor_surface_url", capability.json())
        editor = self.client.get("/__taskprogress/v1/editor/editor.html")
        self.assertEqual(404, editor.status_code)

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

    def test_session_returns_validated_private_time_inputs_only_after_origin_check(self) -> None:
        config = time_config_payload()
        estimates = time_estimates_payload()
        (self.root / "time.config.json").write_text(
            json.dumps(config, ensure_ascii=False),
            encoding="utf-8",
        )
        (self.root / "time.estimates.json").write_text(
            json.dumps(estimates, ensure_ascii=False),
            encoding="utf-8",
        )

        capability = self.client.get(
            "/__taskprogress/v1/capabilities/secure-test"
        ).json()
        self.assertNotIn("inputs", capability)

        session = self.session()
        self.assertEqual(config, session["inputs"]["config"])
        self.assertEqual(estimates, session["inputs"]["estimates"])
        self.assertIsNone(session["input_defaults"]["config"])
        self.assertEqual(64, len(session["inputs_revision"]))

    def test_missing_config_gets_validated_default_only_inside_the_session(self) -> None:
        session = self.session("Asia/Taipei")
        self.assertIsNone(session["inputs"]["config"])
        config = session["input_defaults"]["config"]
        self.assertEqual("secure-test", config["scope_id"])
        self.assertEqual("Asia/Taipei", config["timezone"])
        self.assertEqual(480, config["standard_allocation"]["sleep_minutes_per_day"])
        self.assertEqual(480, config["standard_allocation"]["life_minutes_per_day"])
        self.assertEqual(
            480,
            config["standard_allocation"]["capacity_minutes_per_executor_day"],
        )
        self.assertFalse((self.root / "time.config.json").exists())

        config["project"]["delivery_at"] = "2026-08-20T17:00:00+08:00"
        with patch(
            "service.taskprogress_host._run_analysis",
            return_value=(True, ""),
        ):
            response = self.client.put(
                "/__taskprogress/v1/edit-sessions/secure-test",
                headers=self.edit_headers(session),
                content=json.dumps(
                    self.edit_payload(
                        session,
                        inputs={"config": config},
                        changes=[self.delivery_change("設定第一版交付界線")],
                    )
                ),
            )

        self.assertEqual(200, response.status_code, response.text)
        persisted = json.loads(
            (self.root / "time.config.json").read_text(encoding="utf-8")
        )
        self.assertEqual("Asia/Taipei", persisted["timezone"])
        self.assertEqual(
            "2026-08-20T17:00:00+08:00",
            persisted["project"]["delivery_at"],
        )
        local_source = (self.root / "taskprogress.local.json").read_text(
            encoding="utf-8"
        )
        local_state = json.loads(local_source)
        event = local_state["history"][0]
        self.assertEqual("time.config.project.delivery_at", event["field_path"])
        self.assertEqual("設定第一版交付界線", event["reason"])
        self.assertEqual("set", event["operation"])
        self.assertTrue(event["redacted"])
        self.assertFalse(event["before_present"])
        self.assertTrue(event["after_present"])
        self.assertEqual(64, len(event["before_fingerprint"]))
        self.assertEqual(64, len(event["after_fingerprint"]))
        self.assertNotIn("2026-08-20", local_source)
        self.assertNotEqual(session["local_revision"], response.json()["local_revision"])

    def test_delivery_preview_runs_in_isolation_and_keeps_the_session(self) -> None:
        original = time_config_payload()
        (self.root / "time.config.json").write_text(
            json.dumps(original, ensure_ascii=False),
            encoding="utf-8",
        )
        session = self.session()
        candidate = json.loads(json.dumps(original))
        candidate["project"]["delivery_at"] = "2026-08-20T17:00:00+08:00"
        candidate["updated_at"] = "2026-08-03T09:30:00Z"
        preview_folders: list[Path] = []

        def fake_analysis(_command: object, report_path: Path) -> tuple[bool, str]:
            preview_folders.append(report_path.parent)
            preview_config = json.loads(
                (report_path.parent / "time.config.json").read_text(encoding="utf-8")
            )
            analysis = {
                "schema_version": "0.2",
                "scope_id": "secure-test",
                "summary": {
                    "deadline": {
                        "delivery_at": preview_config["project"]["delivery_at"],
                        "urgency": "on_track",
                        "remaining_capacity_minutes": 960,
                        "capacity_balance_minutes": 480,
                    }
                },
            }
            (report_path.parent / "time.analysis.json").write_text(
                json.dumps(analysis),
                encoding="utf-8",
            )
            return True, ""

        payload = {
            "report": report_payload(),
            "inputs_revision": session["inputs_revision"],
            "local_revision": session["local_revision"],
            "inputs": {"config": candidate},
        }
        with patch(
            "service.taskprogress_host._run_analysis",
            side_effect=fake_analysis,
        ):
            response = self.client.post(
                "/__taskprogress/v1/edit-sessions/secure-test/preview",
                headers=self.edit_headers(session),
                json=payload,
            )

        self.assertEqual(200, response.status_code, response.text)
        self.assertEqual(
            "2026-08-20T17:00:00+08:00",
            response.json()["analysis"]["summary"]["deadline"]["delivery_at"],
        )
        self.assertEqual(
            original,
            json.loads((self.root / "time.config.json").read_text(encoding="utf-8")),
        )
        self.assertFalse((self.root / "time.analysis.json").exists())
        self.assertEqual(1, len(preview_folders))
        self.assertNotEqual(self.root, preview_folders[0])
        self.assertFalse(preview_folders[0].exists())
        close = self.client.delete(
            "/__taskprogress/v1/edit-sessions/secure-test",
            headers=self.edit_headers(session),
        )
        self.assertEqual(204, close.status_code, close.text)

    def test_delivery_change_requires_reason_before_any_file_is_written(self) -> None:
        session = self.session("Asia/Taipei")
        config = session["input_defaults"]["config"]
        config["project"]["delivery_at"] = "2026-08-20T17:00:00+08:00"

        response = self.client.put(
            "/__taskprogress/v1/edit-sessions/secure-test",
            headers=self.edit_headers(session),
            content=json.dumps(
                self.edit_payload(session, inputs={"config": config})
            ),
        )

        self.assertEqual(422, response.status_code, response.text)
        self.assertEqual("change_reason_required", response.json()["code"])
        self.assertFalse((self.root / "time.config.json").exists())
        self.assertFalse((self.root / "taskprogress.local.json").exists())

    def test_private_history_write_failure_rolls_back_delivery_and_report(self) -> None:
        session = self.session("Asia/Taipei")
        config = session["input_defaults"]["config"]
        config["project"]["delivery_at"] = "2026-08-20T17:00:00+08:00"
        changed_report = report_payload()
        changed_report["tasks"][0]["summary"] = "Must roll back with history"
        original_report = self.report_path.read_bytes()

        def fail_local_history(path: Path, source: bytes) -> None:
            if path.name == "taskprogress.local.json":
                raise OSError("simulated private history write failure")
            _atomic_replace(path, source)

        with patch(
            "service.taskprogress_host._atomic_replace",
            side_effect=fail_local_history,
        ), patch(
            "service.taskprogress_host._run_analysis",
            return_value=(True, ""),
        ):
            response = self.client.put(
                "/__taskprogress/v1/edit-sessions/secure-test",
                headers=self.edit_headers(session),
                content=json.dumps(
                    self.edit_payload(
                        session,
                        report=changed_report,
                        inputs={"config": config},
                        changes=[self.delivery_change()],
                    )
                ),
            )

        self.assertEqual(500, response.status_code, response.text)
        self.assertEqual("transaction_failed", response.json()["code"])
        self.assertEqual(original_report, self.report_path.read_bytes())
        self.assertFalse((self.root / "time.config.json").exists())
        self.assertFalse((self.root / "taskprogress.local.json").exists())
        self.assertFalse((self.root / TRANSACTION_JOURNAL).exists())

    def test_external_private_history_change_rejects_multi_file_save(self) -> None:
        session = self.session()
        local_path = self.root / "taskprogress.local.json"
        local_path.write_text(
            json.dumps(
                {
                    "schema_version": "1.0",
                    "scope_id": "secure-test",
                    "updated_at": "2026-08-03T00:00:00Z",
                    "history": [],
                }
            ),
            encoding="utf-8",
        )

        response = self.client.put(
            "/__taskprogress/v1/edit-sessions/secure-test",
            headers=self.edit_headers(session),
            content=json.dumps(self.edit_payload(session)),
        )

        self.assertEqual(409, response.status_code, response.text)
        self.assertEqual("source_changed", response.json()["code"])
        self.assertEqual([], json.loads(local_path.read_text(encoding="utf-8"))["history"])

    def test_invalid_private_history_prevents_edit_session(self) -> None:
        (self.root / "taskprogress.local.json").write_text(
            json.dumps(
                {
                    "schema_version": "1.0",
                    "scope_id": "another-scope",
                    "updated_at": "2026-08-03T00:00:00Z",
                    "history": [],
                }
            ),
            encoding="utf-8",
        )

        response = self.client.post(
            "/__taskprogress/v1/edit-sessions",
            headers={
                "origin": ORIGIN,
                "x-taskprogress-editor": "1",
                "content-type": "application/json",
            },
            json={"scope_id": "secure-test"},
        )

        self.assertEqual(409, response.status_code)
        self.assertEqual("source_local_state_invalid", response.json()["code"])

    def test_default_config_rejects_unsafe_timezone_identifiers(self) -> None:
        response = self.client.post(
            "/__taskprogress/v1/edit-sessions",
            headers={
                "origin": ORIGIN,
                "x-taskprogress-editor": "1",
                "content-type": "application/json",
            },
            json={"scope_id": "secure-test", "timezone": "<script>"},
        )
        self.assertEqual(422, response.status_code)
        self.assertEqual("invalid_request", response.json()["code"])
        self.assertFalse((self.root / "time.config.json").exists())

    def test_invalid_private_time_input_prevents_edit_session(self) -> None:
        invalid = time_config_payload()
        invalid["scope_id"] = "another-scope"
        (self.root / "time.config.json").write_text(
            json.dumps(invalid),
            encoding="utf-8",
        )
        response = self.client.post(
            "/__taskprogress/v1/edit-sessions",
            headers={
                "origin": ORIGIN,
                "x-taskprogress-editor": "1",
                "content-type": "application/json",
            },
            json={"scope_id": "secure-test"},
        )
        self.assertEqual(409, response.status_code)
        self.assertEqual("source_time_inputs_invalid", response.json()["code"])

    def test_time_input_revision_change_rejects_report_save(self) -> None:
        config = time_config_payload()
        config_path = self.root / "time.config.json"
        config_path.write_text(json.dumps(config), encoding="utf-8")
        session = self.session()

        config["project"]["delivery_at"] = "2026-08-10T00:00:00+08:00"
        config_path.write_text(json.dumps(config), encoding="utf-8")
        response = self.client.put(
            "/__taskprogress/v1/reports/secure-test",
            headers={
                "origin": ORIGIN,
                "x-taskprogress-editor": "1",
                "authorization": f"Bearer {session['token']}",
                "if-match": f'"{session["revision"]}"',
                "content-type": "application/json",
            },
            content=json.dumps(report_payload()),
        )
        self.assertEqual(409, response.status_code)
        self.assertEqual("source_changed", response.json()["code"])

    def test_the_schema_is_read_from_disk_instead_of_frozen_at_startup(self) -> None:
        """A schema edit reaches the running host without a restart.

        The frozen validator this replaces produced the worst kind of failure:
        the save was rejected as invalid data, ten minutes after the schema
        that would have accepted it was written.
        """
        session = self.session()
        extended = report_payload()
        extended["note"] = "a field the schema does not know yet"
        headers = {
            "origin": ORIGIN,
            "x-taskprogress-editor": "1",
            "authorization": f"Bearer {session['token']}",
            "if-match": f"\"{session['revision']}\"",
            "content-type": "application/json",
        }

        rejected = self.client.put(
            "/__taskprogress/v1/reports/secure-test",
            headers=headers,
            content=json.dumps(extended),
        )
        self.assertEqual(422, rejected.status_code, rejected.text)
        self.assertIn("'note' was unexpected", rejected.json()["detail"])

        schema = json.loads(self.schema_path.read_text(encoding="utf-8"))
        schema["properties"]["note"] = {"type": "string", "minLength": 1}
        self.schema_path.write_text(
            json.dumps(schema, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )

        accepted = self.client.put(
            "/__taskprogress/v1/reports/secure-test",
            headers=headers,
            content=json.dumps(extended),
        )
        self.assertEqual(200, accepted.status_code, accepted.text)
        persisted = json.loads(self.report_path.read_text(encoding="utf-8"))
        self.assertEqual("a field the schema does not know yet", persisted["note"])

    def test_a_rejected_report_names_the_schema_that_rejected_it(self) -> None:
        """Which schema said no, and when it was read.

        Without this the message points at the data and never at itself, which
        is exactly how a stale validator hides.
        """
        session = self.session()
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
        self.assertEqual(422, response.status_code, response.text)
        detail = response.json()["detail"]
        self.assertRegex(detail, r"\[report\.schema\.json@[0-9a-f]{12} loaded .+\]$")

    def test_an_unreadable_schema_keeps_the_last_good_one(self) -> None:
        session = self.session()
        self.schema_path.write_text("{ not json", encoding="utf-8")
        changed = report_payload()
        changed["tasks"][0]["summary"] = "Saved while the schema file was broken"
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
        # The half-written file does not break the editor; the previous schema
        # still validates and its unchanged fingerprint is what shows up in the
        # next rejection.
        self.assertEqual(200, response.status_code, response.text)

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

    def test_multi_file_save_replaces_inputs_and_rotates_both_revisions(self) -> None:
        session = self.session()
        changed = report_payload()
        changed["tasks"][0]["summary"] = "Report and time inputs updated"
        config = time_config_payload()
        config["project"]["delivery_at"] = "2026-08-10T00:00:00+08:00"
        estimates = time_estimates_payload()

        def write_analysis(_command: object, report_path: Path) -> tuple[bool, str]:
            (report_path.parent / "time.analysis.json").write_text(
                json.dumps(
                    {
                        "schema_version": "0.2",
                        "scope_id": "secure-test",
                        "summary": {"deadline": {"delivery_at": config["project"]["delivery_at"]}},
                    }
                ),
                encoding="utf-8",
            )
            return True, ""

        with patch(
            "service.taskprogress_host._run_analysis",
            side_effect=write_analysis,
        ):
            response = self.client.put(
                "/__taskprogress/v1/edit-sessions/secure-test",
                headers=self.edit_headers(session),
                content=json.dumps(
                    self.edit_payload(
                        session,
                        report=changed,
                        inputs={"config": config, "estimates": estimates},
                        changes=[self.delivery_change()],
                    )
                ),
            )

        self.assertEqual(200, response.status_code, response.text)
        body = response.json()
        self.assertNotEqual(session["token"], body["token"])
        self.assertNotEqual(session["revision"], body["revision"])
        self.assertNotEqual(session["inputs_revision"], body["inputs_revision"])
        self.assertEqual(config, body["inputs"]["config"])
        self.assertEqual(estimates, body["inputs"]["estimates"])
        self.assertEqual(
            "Report and time inputs updated",
            json.loads(self.report_path.read_text(encoding="utf-8"))["tasks"][0][
                "summary"
            ],
        )
        self.assertEqual(
            config,
            json.loads((self.root / "time.config.json").read_text(encoding="utf-8")),
        )
        self.assertEqual(
            estimates,
            json.loads(
                (self.root / "time.estimates.json").read_text(encoding="utf-8")
            ),
        )
        analysis = self.client.get(
            "/reports/secure-test/time.analysis.json"
        )
        self.assertEqual(200, analysis.status_code, analysis.text)
        self.assertEqual(
            config["project"]["delivery_at"],
            analysis.json()["summary"]["deadline"]["delivery_at"],
        )

    def test_multi_file_save_keeps_omitted_input_file(self) -> None:
        original_config = time_config_payload()
        original_estimates = time_estimates_payload()
        (self.root / "time.config.json").write_text(
            json.dumps(original_config),
            encoding="utf-8",
        )
        estimates_path = self.root / "time.estimates.json"
        estimates_path.write_text(json.dumps(original_estimates), encoding="utf-8")
        original_estimates_source = estimates_path.read_bytes()
        session = self.session()
        changed_config = time_config_payload()
        changed_config["project"]["delivery_at"] = "2026-08-12T17:00:00+08:00"

        with patch(
            "service.taskprogress_host._run_analysis",
            return_value=(True, ""),
        ):
            response = self.client.put(
                "/__taskprogress/v1/edit-sessions/secure-test",
                headers=self.edit_headers(session),
                content=json.dumps(
                    self.edit_payload(
                        session,
                        inputs={"config": changed_config},
                        changes=[self.delivery_change()],
                    )
                ),
            )

        self.assertEqual(200, response.status_code, response.text)
        self.assertEqual(original_estimates_source, estimates_path.read_bytes())
        self.assertEqual(changed_config, response.json()["inputs"]["config"])
        self.assertEqual(original_estimates, response.json()["inputs"]["estimates"])

    def test_multi_file_save_requires_matching_inputs_revision(self) -> None:
        session = self.session()
        original_report = self.report_path.read_bytes()
        payload = self.edit_payload(
            session,
            inputs={"config": time_config_payload()},
        )
        payload["inputs_revision"] = "0" * 64

        response = self.client.put(
            "/__taskprogress/v1/edit-sessions/secure-test",
            headers=self.edit_headers(session),
            content=json.dumps(payload),
        )

        self.assertEqual(409, response.status_code, response.text)
        self.assertEqual("stale_inputs_revision", response.json()["code"])
        self.assertEqual(original_report, self.report_path.read_bytes())
        self.assertFalse((self.root / "time.config.json").exists())

    def test_multi_file_save_rejects_invalid_input_before_transaction(self) -> None:
        session = self.session()
        original_report = self.report_path.read_bytes()
        invalid_config = {
            "schema_version": "0.2",
            "scope_id": "secure-test",
        }

        response = self.client.put(
            "/__taskprogress/v1/edit-sessions/secure-test",
            headers=self.edit_headers(session),
            content=json.dumps(
                self.edit_payload(
                    session,
                    inputs={"config": invalid_config},
                )
            ),
        )

        self.assertEqual(422, response.status_code, response.text)
        self.assertEqual("invalid_time_inputs", response.json()["code"])
        self.assertEqual(original_report, self.report_path.read_bytes())
        self.assertFalse((self.root / TRANSACTION_JOURNAL).exists())
        self.assertFalse((self.root / "time.config.json").exists())

    def test_multi_file_analysis_failure_restores_all_canonical_inputs(self) -> None:
        config_path = self.root / "time.config.json"
        estimates_path = self.root / "time.estimates.json"
        analysis_path = self.root / "time.analysis.json"
        config_path.write_text(json.dumps(time_config_payload()), encoding="utf-8")
        estimates_path.write_text(json.dumps(time_estimates_payload()), encoding="utf-8")
        analysis_path.write_bytes(b'{"analysis":"original"}\n')
        originals = {
            "report": self.report_path.read_bytes(),
            "config": config_path.read_bytes(),
            "estimates": estimates_path.read_bytes(),
            "analysis": analysis_path.read_bytes(),
        }
        session = self.session()
        changed_report = report_payload()
        changed_report["tasks"][0]["summary"] = "Must all roll back"
        changed_config = time_config_payload()
        changed_config["project"]["delivery_at"] = "2026-08-15T00:00:00+08:00"
        changed_estimates = time_estimates_payload()
        changed_estimates["estimates"][0]["likely_minutes"] = 300

        def fail_analysis(_command: object, _path: Path) -> tuple[bool, str]:
            analysis_path.write_bytes(b'{"analysis":"partial"}\n')
            return False, "simulated analyzer failure"

        with patch("service.taskprogress_host._run_analysis", side_effect=fail_analysis):
            response = self.client.put(
                "/__taskprogress/v1/edit-sessions/secure-test",
                headers=self.edit_headers(session),
                content=json.dumps(
                    self.edit_payload(
                        session,
                        report=changed_report,
                        inputs={
                            "config": changed_config,
                            "estimates": changed_estimates,
                        },
                        changes=[self.delivery_change("驗證整批回滾")],
                    )
                ),
            )

        self.assertEqual(409, response.status_code, response.text)
        self.assertEqual("analysis_failed", response.json()["code"])
        self.assertEqual(originals["report"], self.report_path.read_bytes())
        self.assertEqual(originals["config"], config_path.read_bytes())
        self.assertEqual(originals["estimates"], estimates_path.read_bytes())
        self.assertEqual(originals["analysis"], analysis_path.read_bytes())
        self.assertFalse((self.root / "taskprogress.local.json").exists())
        self.assertFalse((self.root / TRANSACTION_JOURNAL).exists())

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


def _cli_dll_path() -> Path | None:
    """The Debug build of the CLI, if this environment has built it.

    checklist request is exact-file and stdin/stdout only -- it never
    touches WPF or WebView2 -- so `dotnet <dll>` runs it without a desktop
    session even though the project's TFM is net9.0-windows.
    """

    candidate = (
        REPOSITORY_ROOT
        / "src"
        / "TaskProgress.Cli"
        / "bin"
        / "Debug"
        / "net9.0-windows"
        / "task-progress.dll"
    )
    return candidate if candidate.is_file() else None


class ChecklistRequestRouteTests(unittest.TestCase):
    """The scope+task-id addressed route, plan.md#階段-3-的傳輸設計.

    Exercises the route's own responsibilities -- auth, scope/task-id
    validation, path derivation, and response passthrough -- against the
    real built CLI, so a change to either side that breaks the seam shows
    up here rather than only in a live browser session.
    """

    def setUp(self) -> None:
        cli_dll = _cli_dll_path()
        if cli_dll is None:
            self.skipTest("CLI Debug build not found; run `dotnet build` under src/TaskProgress.Cli first")
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        (self.root / "index.html").write_text("viewer", encoding="utf-8")
        self.report_path = self.root / "report.json"
        self.report_path.write_text(
            json.dumps(report_payload(), ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        self.schema_path = self.root / "schema" / "report.schema.json"
        self.schema_path.parent.mkdir()
        self.schema_path.write_bytes(REPORT_SCHEMA.read_bytes())
        checklists = self.root / "checklists"
        checklists.mkdir()
        self.checklist_path = checklists / "first-task.checklist"
        self.checklist_path.write_text(
            "# Probe Checklist\n"
            "\n"
            "Current round: `plan.md#round`.\n"
            "\n"
            "- [ ] **1. Test item**\n"
            "  Outcome: n/a\n"
            "  Checks:\n"
            "    - [ ] **Manual check** `[manual]`\n"
            "      - Action: do the thing\n"
            "      - Expect: it works\n"
            "      - Reason: exercises the HTTP transport, not a real work item\n",
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
            report_schema=self.schema_path,
            control_port=PORT,
            analyzer_command=["dotnet", str(cli_dll)],
        )
        self.client = TestClient(
            application,
            base_url=ORIGIN,
            headers={"host": HOST},
        )

    def tearDown(self) -> None:
        self.client.close()
        self.temporary.cleanup()

    def request_headers(self) -> dict[str, str]:
        return {
            "origin": ORIGIN,
            "x-taskprogress-editor": "1",
            "content-type": "application/json",
        }

    def test_load_reaches_the_real_document_through_scope_and_task_id(self) -> None:
        response = self.client.post(
            "/__taskprogress/v1/checklists/secure-test/first-task",
            headers=self.request_headers(),
            json={"version": 1, "id": "t1", "type": "load"},
        )
        self.assertEqual(200, response.status_code, response.text)
        body = response.json()
        self.assertEqual("result", body["type"])
        self.assertEqual("first-task.checklist", body["payload"]["fileName"])
        self.assertEqual(1, len(body["payload"]["items"]))

    def test_a_business_error_from_the_bridge_still_returns_200(self) -> None:
        # The bridge's own {type: "error"} is a produced JSON response, not an
        # HTTP-level failure -- the route passes it through unchanged.
        response = self.client.post(
            "/__taskprogress/v1/checklists/secure-test/first-task",
            headers=self.request_headers(),
            json={"version": 1, "id": "t2", "type": "openPath", "payload": {"path": "x"}},
        )
        self.assertEqual(200, response.status_code, response.text)
        self.assertEqual("error", response.json()["type"])

    def test_write_requires_the_same_origin_editor_header(self) -> None:
        response = self.client.post(
            "/__taskprogress/v1/checklists/secure-test/first-task",
            headers={"content-type": "application/json"},
            json={"version": 1, "id": "t3", "type": "load"},
        )
        self.assertEqual(403, response.status_code)

    def test_unregistered_scope_is_not_found(self) -> None:
        response = self.client.post(
            "/__taskprogress/v1/checklists/no-such-scope/first-task",
            headers=self.request_headers(),
            json={"version": 1, "id": "t4", "type": "load"},
        )
        self.assertEqual(404, response.status_code)

    def test_task_id_cannot_carry_a_path(self) -> None:
        # Rejected before any file access is attempted -- there is no path
        # to escape with, by construction. A raw `/` (literal or via `..`
        # normalization) turns the URL into an extra segment this route
        # cannot match by shape at all; that either lands on no route (404)
        # or on this app's static GET mount for the resulting path, which
        # then rejects the wrong method (405) -- POST never reaches this
        # handler either way. `a\b` has no segment to split on, so it does
        # reach the handler, and TASK_ID_PATTERN is this route's own 422.
        # Every outcome proves the same thing: nothing outside checklists/
        # was ever named.
        for task in ("../report", "a/b", "a\\b", ".."):
            with self.subTest(task=task):
                response = self.client.post(
                    f"/__taskprogress/v1/checklists/secure-test/{task}",
                    headers=self.request_headers(),
                    json={"version": 1, "id": "t5", "type": "load"},
                )
                self.assertIn(response.status_code, (404, 405, 422), response.text)

    def test_a_task_id_with_no_matching_file_is_the_bridges_own_not_found(self) -> None:
        # Scope and task-id format are both valid; the file simply is not
        # there. That is ChecklistDocumentStore's "not found" (a business
        # error the bridge reports), not a route-level 404 -- the route
        # cannot distinguish a wrong task id from a task with no checklist
        # yet without running the parser, and must not guess.
        response = self.client.post(
            "/__taskprogress/v1/checklists/secure-test/no-such-task",
            headers=self.request_headers(),
            json={"version": 1, "id": "t6", "type": "load"},
        )
        self.assertEqual(502, response.status_code, response.text)

    def test_non_json_content_type_is_rejected(self) -> None:
        response = self.client.post(
            "/__taskprogress/v1/checklists/secure-test/first-task",
            headers={"origin": ORIGIN, "x-taskprogress-editor": "1", "content-type": "text/plain"},
            content=b"{}",
        )
        self.assertEqual(415, response.status_code)

    def test_save_persists_through_the_real_parser_and_writer(self) -> None:
        loaded = self.client.post(
            "/__taskprogress/v1/checklists/secure-test/first-task",
            headers=self.request_headers(),
            json={"version": 1, "id": "t7", "type": "load"},
        ).json()
        revision = loaded["payload"]["revision"]
        saved = self.client.post(
            "/__taskprogress/v1/checklists/secure-test/first-task",
            headers=self.request_headers(),
            json={
                "version": 1,
                "id": "t8",
                "type": "save",
                "payload": {
                    "revision": revision,
                    "results": [
                        {"workItemId": 1, "checkIndex": 0, "status": "passed", "observed": None},
                    ],
                },
            },
        )
        self.assertEqual(200, saved.status_code, saved.text)
        self.assertEqual("result", saved.json()["type"])
        self.assertIn("[x]", self.checklist_path.read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
