"""TaskProgress-owned local edit host layered on LocalWebService.

The shared LocalWebService remains generic. This process wraps its public
``create_app``/``serve`` boundary and inserts TaskProgress-only routes before
the static mounts. Checklist clients use a separate, process-owned credential.
"""

from __future__ import annotations

import argparse
import asyncio
import hashlib
import importlib.util
import json
import os
import re
import secrets
import subprocess
import sys
import tempfile
import threading
import time
from dataclasses import dataclass
from contextlib import asynccontextmanager
from datetime import datetime, timezone as datetime_timezone
from pathlib import Path
from types import ModuleType
from typing import Any, Callable, Sequence

from fastapi import APIRouter, FastAPI, Request
from fastapi.responses import JSONResponse, Response
from jsonschema import Draft202012Validator, FormatChecker
from starlette.routing import Mount



if __package__:
    from .report_store import (
        LocalFileTransaction, TransactionRollbackError, recover_pending_transaction,
        _atomic_replace, _revision, _read_report, _SchemaSource, _schema_errors,
        _json_schema_errors, validate_documents, read_overlay, auxiliary_revision, run_time_analysis,
    )
    from .report_lock import scope_lock, async_scope_lock
else:
    from report_store import (
        LocalFileTransaction, TransactionRollbackError, recover_pending_transaction,
        _atomic_replace, _revision, _read_report, _SchemaSource, _schema_errors,
        _json_schema_errors, validate_documents, read_overlay, auxiliary_revision, run_time_analysis,
    )
    from report_lock import scope_lock, async_scope_lock

API_PREFIX = "/__taskprogress/v1"
API_VERSION = 1
MAX_REPORT_BYTES = 1024 * 1024
MAX_TRANSACTION_FILE_BYTES = 4 * 1024 * 1024
MAX_EDIT_PAYLOAD_BYTES = 10 * 1024 * 1024
SESSION_LIFETIME_SECONDS = 10 * 60
TIME_SCHEMA_ROOT = (
    Path(__file__).resolve().parents[1]
    / "experiments"
    / "time-reference"
    / "schemas"
)
LOCAL_STATE_SCHEMA_PATH = Path(__file__).resolve().parents[1] / "schemas" / "taskprogress.local.schema.json"
SCOPE_PATTERN = re.compile(r"^[a-z0-9]+(?:[._-][a-z0-9]+)*$")
# Same shape as report.schema.json's `$defs.id` (what task ids in
# report.json and checklist file stems both already follow), reused rather
# than duplicated. A single safe segment: no `/`, no `..`, no drive letter.
TASK_ID_PATTERN = re.compile(r"^[a-z0-9]+(?:[._-][a-z0-9]+)*$")
TASK_ID_MAX_LENGTH = 100
MAX_CHECKLIST_PAYLOAD_BYTES = 1024 * 1024
TIMEZONE_PATTERN = re.compile(r"^[A-Za-z0-9._+-]+(?:/[A-Za-z0-9._+-]+)*$")


@dataclass(frozen=True)
class EditSession:
    token: str
    scope: str
    revision: str
    inputs_revision: str
    local_revision: str
    report_id: str
    expires_at: float
    auxiliary_revision: str


def _problem(
    status: int,
    code: str,
    title: str,
    detail: str | None = None,
) -> JSONResponse:
    body: dict[str, object] = {
        "type": f"https://task-progress.local/problems/{code}",
        "title": title,
        "status": status,
        "code": code,
    }
    if detail:
        body["detail"] = detail
    return JSONResponse(
        body,
        status_code=status,
        media_type="application/problem+json",
    )


def _load_module(path: os.PathLike[str] | str) -> ModuleType:
    source = Path(path).expanduser().resolve(strict=True)
    spec = importlib.util.spec_from_file_location("taskprogress_localwebservice", source)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Cannot load LocalWebService: {source}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


def _validate_scope(value: object) -> str:
    if not isinstance(value, str) or not SCOPE_PATTERN.fullmatch(value):
        raise ValueError("scope_id is invalid")
    return value


def _read_time_inputs(
    folder: Path,
    scope: str,
    validators: dict[str, Draft202012Validator],
) -> tuple[dict[str, dict[str, Any] | None], str]:
    result: dict[str, dict[str, Any] | None] = {
        "config": None,
        "estimates": None,
    }
    digest = hashlib.sha256()
    for key, filename in (
        ("config", "time.config.json"),
        ("estimates", "time.estimates.json"),
    ):
        path = folder / filename
        digest.update(filename.encode("utf-8") + b"\0")
        if not path.is_file():
            digest.update(b"missing\0")
            continue
        source = path.read_bytes()
        if len(source) > MAX_TRANSACTION_FILE_BYTES:
            raise ValueError(f"{filename} exceeds the 4 MiB edit limit")
        payload = json.loads(source)
        if not isinstance(payload, dict):
            raise ValueError(f"{filename} root must be an object")
        errors = _json_schema_errors(validators[key], payload)
        if errors:
            raise ValueError(f"{filename} failed validation: {'; '.join(errors[:8])}")
        if payload.get("scope_id") != scope:
            raise ValueError(f"{filename} scope_id does not match {scope}")
        result[key] = payload
        digest.update(source)
        digest.update(b"\0")
    return result, digest.hexdigest()


def _default_time_config(
    scope: str,
    timezone_name: str,
    timestamp: float,
) -> dict[str, Any]:
    updated_at = datetime.fromtimestamp(
        timestamp,
        tz=datetime_timezone.utc,
    ).isoformat().replace("+00:00", "Z")
    return {
        "schema_version": "0.2",
        "scope_id": scope,
        "updated_at": updated_at,
        "timezone": timezone_name,
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
        "display": {
            "project_day_rounding": "ceiling",
            "item_unit": "hour",
        },
    }


def _read_local_state(
    folder: Path,
    scope: str,
    validator: Draft202012Validator,
) -> tuple[dict[str, Any] | None, str]:
    path = folder / "taskprogress.local.json"
    if not path.is_file():
        return None, _revision(b"taskprogress.local.json\0missing")
    source = path.read_bytes()
    if len(source) > MAX_TRANSACTION_FILE_BYTES:
        raise ValueError("taskprogress.local.json exceeds the 4 MiB edit limit")
    payload = json.loads(source)
    if not isinstance(payload, dict):
        raise ValueError("taskprogress.local.json root must be an object")
    errors = _json_schema_errors(validator, payload)
    if errors:
        raise ValueError(
            f"taskprogress.local.json failed validation: {'; '.join(errors[:8])}"
        )
    if payload.get("scope_id") != scope:
        raise ValueError(f"taskprogress.local.json scope_id does not match {scope}")
    return payload, _revision(source)


def _fingerprint_sensitive_value(present: bool, value: object) -> str:
    canonical = json.dumps(
        {"present": present, "value": value if present else None},
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
    ).encode("utf-8")
    return _revision(canonical)


def _delivery_value(config: dict[str, Any] | None) -> tuple[bool, object]:
    project = config.get("project") if isinstance(config, dict) else None
    if not isinstance(project, dict) or "delivery_at" not in project:
        return False, None
    return True, project["delivery_at"]


def _report_route(scope: str) -> str:
    return f"/reports/{scope}/report.json"


def _time_analysis_route(scope: str) -> str:
    return f"/reports/{scope}/time.analysis.json"


def _origin_allowed(request: Request, port: int) -> bool:
    return request.headers.get("origin", "").lower() in {
        f"http://127.0.0.1:{port}",
        f"http://localhost:{port}",
    }


def _browser_write_allowed(request: Request, port: int) -> bool:
    return (
        _origin_allowed(request, port)
        and request.headers.get("x-taskprogress-editor") == "1"
    )


def _local_client_allowed(request: Request, client_token: str | None) -> bool:
    """Accept only a non-browser client with the distinct Checklist credential."""
    if not client_token or "origin" in request.headers:
        return False
    values = request.headers.getlist("authorization")
    if len(values) != 1:
        return False
    scheme, separator, supplied = values[0].partition(" ")
    return (
        scheme.lower() == "bearer"
        and separator == " "
        and secrets.compare_digest(supplied.encode("utf-8"), client_token.encode("utf-8"))
    )


def _install_checklist_endpoint(
    application: FastAPI, directory: Path, port: int, client_token: str
) -> None:
    """Publish one process-owned credential during the existing ASGI lifespan.

    The launcher restricts the directory ACL before starting this host. Direct
    host callers must provide an equally private directory outside served roots.
    Abrupt termination may leave a file; clients must verify the health service
    identity, and the next start replaces only this port's stale entry.
    """
    path = directory / f"{port}.json"
    original_lifespan = application.router.lifespan_context

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        async with original_lifespan(app) as state:
            directory.mkdir(parents=True, exist_ok=True, mode=0o700)
            payload = {
                "service": "taskprogress",
                "api_version": API_VERSION,
                "host": "127.0.0.1",
                "port": port,
                "base_url": f"http://127.0.0.1:{port}",
                "api_prefix": API_PREFIX,
                "pid": os.getpid(),
                "client_token": client_token,
                "started_at": datetime.now(datetime_timezone.utc).isoformat(),
            }
            descriptor, temporary_name = tempfile.mkstemp(prefix=f".{port}.", suffix=".tmp", dir=directory)
            temporary = Path(temporary_name)
            try:
                with os.fdopen(descriptor, "w", encoding="utf-8") as stream:
                    json.dump(payload, stream, ensure_ascii=False, indent=2)
                    stream.write("\n")
                os.replace(temporary, path)
            finally:
                temporary.unlink(missing_ok=True)
            try:
                yield state
            finally:
                try:
                    current = json.loads(path.read_text(encoding="utf-8"))
                    if isinstance(current, dict) and current.get("client_token") == client_token:
                        path.unlink(missing_ok=True)
                except (OSError, ValueError):
                    pass

    application.router.lifespan_context = lifespan


def _content_type_is_json(request: Request) -> bool:
    return (
        request.headers.get("content-type", "")
        .partition(";")[0]
        .strip()
        .lower()
        == "application/json"
    )


def _run_analysis(analyzer_command, report_path):
    return run_time_analysis(report_path.parent, analyzer_command, hidden=True)


def _preview_analysis(
    analyzer_command: Sequence[str],
    source_folder: Path,
    report: dict[str, Any],
    inputs: dict[str, dict[str, Any] | None],
) -> dict[str, Any] | None:
    """Run the canonical analyzer against an isolated copy of the current draft."""

    with tempfile.TemporaryDirectory(prefix="taskprogress-preview-") as temporary:
        preview_folder = Path(temporary)
        (preview_folder / "report.json").write_text(
            json.dumps(report, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        for key, filename in (
            ("config", "time.config.json"),
            ("estimates", "time.estimates.json"),
        ):
            value = inputs.get(key)
            if value is not None:
                (preview_folder / filename).write_text(
                    json.dumps(value, ensure_ascii=False, indent=2) + "\n",
                    encoding="utf-8",
                )
        events_path = source_folder / "time.events.json"
        if events_path.exists():
            if events_path.is_symlink() or not events_path.is_file():
                raise ValueError("time.events.json must be a regular file")
            events_source = events_path.read_bytes()
            if len(events_source) > MAX_TRANSACTION_FILE_BYTES:
                raise ValueError("time.events.json exceeds the preview limit")
            (preview_folder / "time.events.json").write_bytes(events_source)

        analysis_ok, analysis_error = _run_analysis(
            analyzer_command,
            preview_folder / "report.json",
        )
        if not analysis_ok:
            raise RuntimeError(analysis_error or "Time analysis preview failed")
        analysis_path = preview_folder / "time.analysis.json"
        if not analysis_path.is_file():
            return None
        source = analysis_path.read_bytes()
        if len(source) > MAX_TRANSACTION_FILE_BYTES:
            raise ValueError("time.analysis.json exceeds the preview limit")
        analysis = json.loads(source)
        if not isinstance(analysis, dict):
            raise ValueError("time.analysis.json root must be an object")
        return analysis


def install_edit_api(
    application: FastAPI,
    *,
    report_schema: os.PathLike[str] | str,
    control_port: int,
    analyzer_command: Sequence[str] = (),
    client_token: str | None = None,
    now: Callable[[], float] = time.time,
) -> None:
    schema_source = _SchemaSource(report_schema)
    schema_source.validator()
    time_validators = {
        "config": Draft202012Validator(
            json.loads(
                (TIME_SCHEMA_ROOT / "time.config.schema.json").read_text(
                    encoding="utf-8"
                )
            ),
            format_checker=FormatChecker(),
        ),
        "estimates": Draft202012Validator(
            json.loads(
                (TIME_SCHEMA_ROOT / "time.estimates.schema.json").read_text(
                    encoding="utf-8"
                )
            ),
            format_checker=FormatChecker(),
        ),
    }
    local_state_validator = Draft202012Validator(
        json.loads(LOCAL_STATE_SCHEMA_PATH.read_text(encoding="utf-8")),
        format_checker=FormatChecker(),
    )
    registry = application.state.exact_files
    sessions: dict[str, EditSession] = {}
    sessions_lock = threading.RLock()
    write_lock = asyncio.Lock()
    router = APIRouter(prefix=API_PREFIX)
    def registered_report(scope: str) -> Path | None:
        registration = registry.get_by_url(_report_route(scope))
        if registration is None or not registration.file_path.is_file():
            return None
        return registration.file_path

    def clear_expired_sessions() -> None:
        current = now()
        with sessions_lock:
            expired = [
                token
                for token, session in sessions.items()
                if session.expires_at <= current
            ]
            for token in expired:
                sessions.pop(token, None)

    def authorize_session(request: Request, scope: str) -> EditSession | None:
        authorization = request.headers.get("authorization", "")
        scheme, separator, token = authorization.partition(" ")
        if not separator or scheme.lower() != "bearer":
            return None
        clear_expired_sessions()
        with sessions_lock:
            session = sessions.get(token)
        if session is None or session.scope != scope:
            return None
        return session

    def issue_session(
        scope: str,
        revision: str,
        inputs_revision: str,
        local_revision: str,
        report_id: str,
        auxiliary: str,
    ) -> EditSession:
        token = secrets.token_urlsafe(32)
        session = EditSession(
            token=token,
            scope=scope,
            revision=revision,
            inputs_revision=inputs_revision,
            local_revision=local_revision,
            report_id=report_id,
            expires_at=now() + SESSION_LIFETIME_SECONDS,
            auxiliary_revision=auxiliary,
        )
        with sessions_lock:
            sessions[token] = session
        return session

    @router.get("/health")
    async def edit_health() -> dict[str, object]:
        return {
            "service": "taskprogress-edit-host",
            "api_version": API_VERSION,
        }

    @router.get("/capabilities/{scope}")
    async def edit_capabilities(scope: str) -> Response:
        try:
            safe_scope = _validate_scope(scope)
        except ValueError as error:
            return _problem(404, "scope_not_found", "Editable scope was not found", str(error))
        path = registered_report(safe_scope)
        if path is None:
            return _problem(404, "scope_not_found", "Editable scope was not found")
        async with write_lock, async_scope_lock(path.parent):
            try:
                recover_pending_transaction(path.parent)
                _, report, revision = _read_report(path)
                validate_documents(report, read_overlay(path.parent), schema_source.validator())
                auxiliary = auxiliary_revision(path.parent)
            except (
                OSError,
                ValueError,
                json.JSONDecodeError,
                TransactionRollbackError,
            ) as error:
                return _problem(
                    409,
                    "report_unavailable",
                    "report.json or its pending transaction is unavailable",
                    str(error),
                )
        if report.get("scope_id") != safe_scope:
            return _problem(409, "scope_mismatch", "Registered report scope does not match")
        capability: dict[str, object] = {
            "editable": True,
            "scope_id": safe_scope,
            "revision": revision,
            "session_lifetime_seconds": SESSION_LIFETIME_SECONDS,
        }
        return JSONResponse(capability)

    @router.post("/checklists/{scope}/{task}")
    async def checklist_request(scope: str, task: str, request: Request) -> Response:
        """Pipe one Checklist bridge message through the one C# parser.

        The request body IS the bridge message verbatim -- the same
        {version, id, type, payload} shape ChecklistBridge.Handle already
        exchanges with the WebView2 host -- and the response body is that
        call's exact JSON output, byte for byte. This route does no
        translation of its own; it only resolves {scope}/{task} to a file
        path the browser never sees or supplies, then hands the body to
        `checklist request --file <path>` on stdin. Python must not parse
        the Markdown itself -- that would be a second parser next to
        ChecklistDocument.cs, the one already proven to drift (the round-
        anchor format bug this project already fixed once).
        """

        if not (
            _browser_write_allowed(request, control_port)
            or _local_client_allowed(request, client_token)
        ):
            return _problem(403, "browser_origin_forbidden", "Trusted same-origin editor required")
        try:
            safe_scope = _validate_scope(scope)
        except ValueError as error:
            return _problem(404, "scope_not_found", "Editable scope was not found", str(error))
        if not TASK_ID_PATTERN.fullmatch(task) or len(task) > TASK_ID_MAX_LENGTH:
            return _problem(422, "invalid_task_id", "task id is invalid")
        if not _content_type_is_json(request):
            return _problem(415, "unsupported_media_type", "Requests must use application/json")
        report_path = registered_report(safe_scope)
        if report_path is None:
            return _problem(404, "scope_not_found", "Editable scope was not found")
        content_length = request.headers.get("content-length")
        if content_length:
            try:
                if int(content_length) > MAX_CHECKLIST_PAYLOAD_BYTES:
                    return _problem(413, "request_too_large", "Checklist request exceeds the edit limit")
            except ValueError:
                return _problem(400, "invalid_content_length", "Content-Length is invalid")
        body = await request.body()
        if len(body) > MAX_CHECKLIST_PAYLOAD_BYTES:
            return _problem(413, "request_too_large", "Checklist request exceeds the edit limit")
        if not analyzer_command:
            return _problem(503, "checklist_cli_unavailable", "No analyzer command is available")
        # Safe by construction, not by escaping: safe_scope and task both passed
        # a single-segment allowlist pattern above, so this can only ever name a
        # file directly under this one registered report's own checklists/
        # folder -- there is no request-supplied path to traverse out of it.
        checklist_path = report_path.parent / "checklists" / f"{task}.checklist"
        try:
            completed = subprocess.run(
                [*analyzer_command, "checklist", "request", "--file", str(checklist_path)],
                input=body,
                capture_output=True,
                timeout=30,
                check=False,
                creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
            )
        except (OSError, subprocess.SubprocessError) as error:
            return _problem(502, "checklist_cli_failed", "Checklist CLI could not run", str(error))
        if completed.returncode != 0:
            detail = (completed.stderr or completed.stdout).decode("utf-8", errors="replace").strip()
            return _problem(502, "checklist_cli_failed", "Checklist CLI reported a fatal error", detail)
        return Response(content=completed.stdout, media_type="application/json")

    def decision_path(scope: str, task: str) -> Path:
        safe_scope = _validate_scope(scope)
        if not TASK_ID_PATTERN.fullmatch(task) or len(task) > TASK_ID_MAX_LENGTH:
            raise ValueError("Invalid task id")
        report = registered_report(safe_scope)
        if report is None:
            raise ValueError("Scope not found")
        folder = report.parent.resolve() / "decisions"
        path = folder / f"{task}.decisions"
        if folder.resolve() != folder or path.resolve().parent != folder or path.resolve() != path:
            raise ValueError("Linked decision paths are forbidden")
        return path

    async def run_decision(path: Path, body: bytes) -> dict[str, Any]:
        if not analyzer_command:
            raise ValueError("Decision CLI unavailable")
        completed = await asyncio.to_thread(
            subprocess.run, [*analyzer_command, "decisions", "request", "--file", str(path), "--task", path.stem],
            input=body, capture_output=True, timeout=30, check=False,
            creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
        )
        if completed.returncode != 0:
            raise ValueError("Decision CLI failed")
        result = json.loads(completed.stdout)
        if not isinstance(result, dict) or not isinstance(result.get("ok"), bool):
            raise ValueError("Invalid Decision CLI response")
        return result

    @router.post("/decisions/{scope}")
    async def decision_summary(scope: str, request: Request) -> Response:
        if not _browser_write_allowed(request, control_port):
            return _problem(403, "browser_origin_forbidden", "Trusted same-origin editor required")
        try:
            report = registered_report(_validate_scope(scope))
            if report is None:
                return _problem(404, "scope_not_found", "Scope not found")
            _, report_data, _ = _read_report(report)
            tasks = {t["id"] for t in report_data["tasks"] if t.get("kind") != "report_pointer"}
            folder = decision_path(scope, "placeholder").parent
            files = []
            for path in sorted(folder.glob("*.decisions")):
                entry: dict[str, Any] = {"task_id": path.stem}
                try:
                    result = await run_decision(decision_path(scope, path.stem), b'{"operation":"load"}')
                    if not result["ok"]:
                        raise ValueError(result.get("error", {}).get("code", "invalid_document"))
                    document = result["document"]
                    if document["task_id"] != path.stem or path.stem not in tasks:
                        raise ValueError("Task link does not match Report")
                    entry.update(pending=sum(d["status"] == "pending" for d in document["decisions"]), total=len(document["decisions"]))
                except (OSError, ValueError, KeyError, subprocess.SubprocessError) as error:
                    entry["error"] = str(error)
                files.append(entry)
            return JSONResponse({"ok": True, "scope_id": scope, "files": files,
                "pending": sum(f.get("pending", 0) for f in files), "incomplete": any("error" in f for f in files)})
        except (OSError, ValueError, KeyError) as error:
            return _problem(422, "invalid_scope", str(error))

    @router.post("/decisions/{scope}/{task}")
    async def decision_request(scope: str, task: str, request: Request) -> Response:
        if not _browser_write_allowed(request, control_port):
            return _problem(403, "browser_origin_forbidden", "Trusted same-origin editor required")
        if not _content_type_is_json(request):
            return _problem(415, "unsupported_media_type", "Use application/json")
        body = await request.body()
        if len(body) > MAX_TRANSACTION_FILE_BYTES:
            return _problem(413, "request_too_large", "Decision request exceeds limit")
        try:
            payload = json.loads(body)
            if not isinstance(payload, dict) or payload.get("operation") not in ("load", "confirm", "reopen", "clear_all"):
                return _problem(422, "invalid_operation", "Browser supports load, confirm, reopen and clear_all")
            path = decision_path(scope, task)
            report = registered_report(scope)
            _, report_data, _ = _read_report(report)
            if not any(t["id"] == task and t.get("kind") != "report_pointer" for t in report_data["tasks"]):
                return _problem(422, "task_not_found", "Task does not exist in Report")
            initial = await run_decision(path, b'{"operation":"load"}')
            if initial["ok"] and initial["document"]["task_id"] != task:
                return _problem(422, "task_mismatch", "Document task id differs from file name")
            if not initial["ok"] or payload["operation"] == "load":
                if payload.get("request_id"):
                    initial["request_id"] = payload["request_id"]
                return JSONResponse(initial)
            return JSONResponse(await run_decision(path, body))
        except (OSError, ValueError, KeyError, subprocess.SubprocessError) as error:
            return _problem(422, "decision_request_failed", str(error))

    @router.post("/edit-sessions")
    async def create_edit_session(request: Request) -> Response:
        if not _browser_write_allowed(request, control_port):
            return _problem(403, "browser_origin_forbidden", "Trusted same-origin editor required")
        if not _content_type_is_json(request):
            return _problem(415, "unsupported_media_type", "Requests must use application/json")
        try:
            payload = await request.json()
            if (
                not isinstance(payload, dict)
                or "scope_id" not in payload
                or not set(payload).issubset({"scope_id", "timezone"})
            ):
                raise ValueError("Request requires scope_id and optional timezone")
            scope = _validate_scope(payload["scope_id"])
            timezone_name = payload.get("timezone", "UTC")
            if (
                not isinstance(timezone_name, str)
                or not timezone_name.strip()
                or len(timezone_name) > 100
                or not TIMEZONE_PATTERN.fullmatch(timezone_name.strip())
            ):
                raise ValueError("timezone is not a safe IANA-style identifier")
            timezone_name = timezone_name.strip()
        except (TypeError, ValueError, json.JSONDecodeError) as error:
            return _problem(422, "invalid_request", "Edit session request is invalid", str(error))
        path = registered_report(scope)
        if path is None:
            return _problem(404, "scope_not_found", "Editable scope was not found")
        async with write_lock, async_scope_lock(path.parent):
            try:
                recover_pending_transaction(path.parent)
                _, report, revision = _read_report(path)
                validate_documents(report, read_overlay(path.parent), schema_source.validator())
                auxiliary = auxiliary_revision(path.parent)
            except (
                OSError,
                ValueError,
                json.JSONDecodeError,
                TransactionRollbackError,
            ) as error:
                return _problem(
                    409,
                    "report_unavailable",
                    "report.json or its pending transaction is unavailable",
                    str(error),
                )
            try:
                inputs, inputs_revision = _read_time_inputs(
                    path.parent,
                    scope,
                    time_validators,
                )
            except (OSError, ValueError, json.JSONDecodeError) as error:
                return _problem(
                    409,
                    "source_time_inputs_invalid",
                    "Time input files are invalid or unavailable",
                    str(error),
                )
            try:
                _, local_revision = _read_local_state(
                    path.parent,
                    scope,
                    local_state_validator,
                )
            except (OSError, ValueError, json.JSONDecodeError) as error:
                return _problem(
                    409,
                    "source_local_state_invalid",
                    "Private local history is invalid or unavailable",
                    str(error),
                )
            default_config = None
            if inputs["config"] is None:
                default_config = _default_time_config(
                    scope,
                    timezone_name,
                    now(),
                )
                default_errors = _json_schema_errors(
                    time_validators["config"],
                    default_config,
                )
                if default_errors:
                    return _problem(
                        500,
                        "default_time_config_invalid",
                        "The service default time configuration is invalid",
                        "; ".join(default_errors[:8]),
                    )
        errors = _schema_errors(schema_source.validator(), report)
        if errors:
            return _problem(
                409,
                "source_report_invalid",
                "Source report is invalid",
                schema_source.annotate(errors),
            )
        if report.get("scope_id") != scope:
            return _problem(409, "scope_mismatch", "Registered report scope does not match")
        session = issue_session(
            scope,
            revision,
            inputs_revision,
            local_revision,
            str(report["report_id"]),
            auxiliary,
        )
        return JSONResponse(
            {
                "token": session.token,
                "scope_id": session.scope,
                "revision": session.revision,
                "inputs_revision": session.inputs_revision,
                "local_revision": session.local_revision,
                "inputs": inputs,
                "input_defaults": {"config": default_config},
                "expires_at": session.expires_at,
            },
            status_code=201,
        )

    @router.delete("/edit-sessions/{scope}")
    async def delete_edit_session(scope: str, request: Request) -> Response:
        if not _browser_write_allowed(request, control_port):
            return _problem(403, "browser_origin_forbidden", "Trusted same-origin editor required")
        session = authorize_session(request, scope)
        if session is None:
            return _problem(401, "invalid_edit_session", "A valid edit session is required")
        with sessions_lock:
            sessions.pop(session.token, None)
        return Response(status_code=204)

    @router.post("/edit-sessions/{scope}/preview")
    async def preview_edit_session(scope: str, request: Request) -> Response:
        """Rebuild time analysis from the current draft without touching source files."""

        if not _browser_write_allowed(request, control_port):
            return _problem(403, "browser_origin_forbidden", "Trusted same-origin editor required")
        if not _content_type_is_json(request):
            return _problem(415, "unsupported_media_type", "Requests must use application/json")
        session = authorize_session(request, scope)
        if session is None:
            return _problem(401, "invalid_edit_session", "A valid edit session is required")
        expected_revision = request.headers.get("if-match", "").strip('"')
        if not expected_revision or expected_revision != session.revision:
            return _problem(409, "stale_revision", "The edit session revision is stale")
        content_length = request.headers.get("content-length")
        if content_length:
            try:
                if int(content_length) > MAX_EDIT_PAYLOAD_BYTES:
                    return _problem(413, "edit_payload_too_large", "Edit payload exceeds the limit")
            except ValueError:
                return _problem(400, "invalid_content_length", "Content-Length is invalid")
        source = await request.body()
        if len(source) > MAX_EDIT_PAYLOAD_BYTES:
            return _problem(413, "edit_payload_too_large", "Edit payload exceeds the limit")
        try:
            payload = json.loads(source)
        except json.JSONDecodeError as error:
            return _problem(422, "invalid_json", "Edit payload is not valid JSON", str(error))
        if not isinstance(payload, dict) or set(payload) != {
            "report",
            "inputs_revision",
            "local_revision",
            "inputs",
        }:
            return _problem(
                422,
                "invalid_preview_payload",
                "Preview requires report, private revisions, and inputs",
            )
        if (
            payload["inputs_revision"] != session.inputs_revision
            or payload["local_revision"] != session.local_revision
        ):
            return _problem(
                409,
                "stale_private_revision",
                "The preview private-source revision is stale",
            )
        report = payload["report"]
        replacement_inputs = payload["inputs"]
        if not isinstance(report, dict):
            return _problem(422, "invalid_report", "report.json root must be an object")
        report_errors = _schema_errors(schema_source.validator(), report)
        if report_errors:
            return _problem(
                422,
                "invalid_report",
                "report.json failed validation",
                schema_source.annotate(report_errors),
            )
        if report.get("scope_id") != scope or report.get("report_id") != session.report_id:
            return _problem(
                422,
                "identity_change_forbidden",
                "scope_id and report_id cannot be changed by this editor",
            )
        if (
            not isinstance(replacement_inputs, dict)
            or not set(replacement_inputs).issubset({"config", "estimates"})
        ):
            return _problem(
                422,
                "invalid_time_inputs",
                "inputs may contain only config and estimates replacements",
            )
        for key, value in replacement_inputs.items():
            if not isinstance(value, dict):
                return _problem(
                    422,
                    "invalid_time_inputs",
                    f"inputs.{key} must be an object",
                )
            errors = _json_schema_errors(time_validators[key], value)
            if errors:
                return _problem(
                    422,
                    "invalid_time_inputs",
                    f"inputs.{key} failed validation",
                    "; ".join(errors[:8]),
                )

        path = registered_report(scope)
        if path is None:
            return _problem(404, "scope_not_found", "Editable scope was not found")
        async with write_lock, async_scope_lock(path.parent):
            try:
                recover_pending_transaction(path.parent)
                _, current_report, current_revision = _read_report(path)
                current_overlay = read_overlay(path.parent)
                validate_documents(current_report, current_overlay, schema_source.validator())
                validate_documents(report, current_overlay, schema_source.validator())
                current_inputs, current_inputs_revision = _read_time_inputs(
                    path.parent,
                    scope,
                    time_validators,
                )
                _, current_local_revision = _read_local_state(
                    path.parent,
                    scope,
                    local_state_validator,
                )
            except (
                OSError,
                ValueError,
                json.JSONDecodeError,
                TransactionRollbackError,
            ) as error:
                return _problem(
                    409,
                    "preview_source_unavailable",
                    "Preview source files are invalid or unavailable",
                    str(error),
                )
            if (
                current_revision != session.revision
                or auxiliary_revision(path.parent) != session.auxiliary_revision
                or current_inputs_revision != session.inputs_revision
                or current_local_revision != session.local_revision
                or current_report.get("report_id") != session.report_id
            ):
                return _problem(
                    409,
                    "source_changed",
                    "Source files changed after the edit session started",
                )
            next_inputs = {
                key: replacement_inputs.get(key, current_inputs[key])
                for key in ("config", "estimates")
            }
            try:
                analysis = await asyncio.to_thread(
                    _preview_analysis,
                    analyzer_command,
                    path.parent,
                    report,
                    next_inputs,
                )
            except (OSError, ValueError, RuntimeError, json.JSONDecodeError) as error:
                return _problem(
                    422,
                    "preview_analysis_failed",
                    "Time analysis preview could not be generated",
                    str(error),
                )
        return JSONResponse(
            {
                "analysis": analysis,
                "revision": session.revision,
                "inputs_revision": session.inputs_revision,
                "local_revision": session.local_revision,
            }
        )

    async def commit_edit(
        *,
        scope: str,
        path: Path,
        session: EditSession,
        report: dict[str, Any],
        formatted_report: bytes,
        replacement_inputs: dict[str, dict[str, Any]],
        audit_requests: list[dict[str, str]],
    ) -> Response:
        """Atomically persist canonical inputs, regenerate analysis, and rotate the session."""

        async with write_lock, async_scope_lock(path.parent):
            try:
                recover_pending_transaction(path.parent)
                _, current_report, current_revision = _read_report(path)
                current_overlay = read_overlay(path.parent)
                validate_documents(current_report, current_overlay, schema_source.validator())
                validate_documents(report, current_overlay, schema_source.validator())
                current_inputs, current_inputs_revision = _read_time_inputs(
                    path.parent,
                    scope,
                    time_validators,
                )
                current_local_state, current_local_revision = _read_local_state(
                    path.parent,
                    scope,
                    local_state_validator,
                )
            except (
                OSError,
                ValueError,
                json.JSONDecodeError,
                TransactionRollbackError,
            ) as error:
                return _problem(
                    409,
                    "report_unavailable",
                    "Source files or their pending transaction are unavailable",
                    str(error),
                )
            if (
                current_revision != session.revision
                or auxiliary_revision(path.parent) != session.auxiliary_revision
                or current_inputs_revision != session.inputs_revision
                or current_local_revision != session.local_revision
                or current_report.get("report_id") != session.report_id
            ):
                return _problem(
                    409,
                    "source_changed",
                    "Source files changed after the edit session started",
                )

            next_config = replacement_inputs.get("config", current_inputs["config"])
            before_present, before_value = _delivery_value(current_inputs["config"])
            after_present, after_value = _delivery_value(next_config)
            delivery_changed = (
                before_present != after_present
                or (before_present and before_value != after_value)
            )
            if delivery_changed and len(audit_requests) != 1:
                return _problem(
                    422,
                    "change_reason_required",
                    "Changing delivery_at requires exactly one private history reason",
                )
            if not delivery_changed and audit_requests:
                return _problem(
                    422,
                    "unexpected_history_event",
                    "Private history was supplied without a delivery_at change",
                )

            next_local_state = current_local_state
            if delivery_changed:
                request = audit_requests[0]
                occurred_at = datetime.fromtimestamp(
                    now(),
                    tz=datetime_timezone.utc,
                ).isoformat().replace("+00:00", "Z")
                operation = (
                    "set"
                    if not before_present and after_present
                    else "clear"
                    if before_present and not after_present
                    else "change"
                )
                event = {
                    "event_id": secrets.token_hex(12),
                    "occurred_at": occurred_at,
                    "actor": request["actor"],
                    "operation": operation,
                    "field_path": "time.config.project.delivery_at",
                    "reason": request["reason"],
                    "redacted": True,
                    "fingerprint_algorithm": "sha256",
                    "before_present": before_present,
                    "before_fingerprint": _fingerprint_sensitive_value(
                        before_present,
                        before_value,
                    ),
                    "after_present": after_present,
                    "after_fingerprint": _fingerprint_sensitive_value(
                        after_present,
                        after_value,
                    ),
                }
                if current_local_state is not None:
                    next_local_state = json.loads(json.dumps(current_local_state))
                else:
                    next_local_state = {
                        "schema_version": "1.0",
                        "scope_id": scope,
                        "updated_at": occurred_at,
                        "history": [],
                    }
                next_local_state["updated_at"] = occurred_at
                next_local_state["history"].append(event)

            def validate_staged_payloads() -> None:
                report_errors = _schema_errors(schema_source.validator(), report)
                if report_errors:
                    raise ValueError(
                        "report.json failed validation: "
                        + schema_source.annotate(report_errors)
                    )
                for key, payload in replacement_inputs.items():
                    errors = _json_schema_errors(time_validators[key], payload)
                    if errors:
                        filename = (
                            "time.config.json"
                            if key == "config"
                            else "time.estimates.json"
                        )
                        raise ValueError(
                            f"{filename} failed validation: {'; '.join(errors[:8])}"
                        )
                    if payload.get("scope_id") != scope:
                        raise ValueError(f"{key} scope_id does not match {scope}")
                if delivery_changed and next_local_state is not None:
                    local_errors = _json_schema_errors(
                        local_state_validator,
                        next_local_state,
                    )
                    if local_errors:
                        raise ValueError(
                            "taskprogress.local.json failed validation: "
                            + "; ".join(local_errors[:8])
                        )

            transaction = LocalFileTransaction(path.parent)
            created_analysis_registration: str | None = None
            try:
                transaction.stage_bytes(path, formatted_report)
                for key, payload in replacement_inputs.items():
                    filename = (
                        "time.config.json"
                        if key == "config"
                        else "time.estimates.json"
                    )
                    transaction.stage_json(filename, payload)
                if delivery_changed and next_local_state is not None:
                    transaction.stage_json("taskprogress.local.json", next_local_state)
                transaction.watch(path.parent / "time.analysis.json")
                transaction.prepare((validate_staged_payloads,))
                transaction.apply()
                analysis_task = asyncio.create_task(asyncio.to_thread(
                    _run_analysis,
                    analyzer_command,
                    path,
                ))
                try:
                    analysis_ok, analysis_error = await asyncio.shield(analysis_task)
                except asyncio.CancelledError:
                    try:
                        while not analysis_task.done():
                            try:
                                await asyncio.shield(analysis_task)
                            except asyncio.CancelledError:
                                continue
                        analysis_task.result()
                    finally:
                        transaction.rollback()
                    raise
                if not analysis_ok:
                    transaction.rollback()
                    return _problem(
                        409,
                        "analysis_failed",
                        "Time analysis failed; the file transaction was restored",
                        analysis_error,
                    )
                analysis_path = path.parent / "time.analysis.json"
                if analysis_path.is_file():
                    analysis_route = _time_analysis_route(scope)
                    existing_analysis = registry.get_by_url(analysis_route)
                    if existing_analysis is None:
                        registration, created = registry.register(
                            analysis_route,
                            analysis_path,
                        )
                        if created:
                            created_analysis_registration = registration.id
                    elif existing_analysis.file_path != analysis_path.resolve():
                        raise ValueError(
                            f"{analysis_route} is registered to another file"
                        )
                next_inputs, next_inputs_revision = _read_time_inputs(
                    path.parent,
                    scope,
                    time_validators,
                )
                _, next_local_revision = _read_local_state(
                    path.parent,
                    scope,
                    local_state_validator,
                )
                transaction.commit()
            except (OSError, ValueError, RuntimeError) as error:
                if created_analysis_registration is not None:
                    registry.unregister(created_analysis_registration)
                try:
                    transaction.rollback()
                except (OSError, TransactionRollbackError) as rollback_error:
                    return _problem(
                        500,
                        "transaction_rollback_failed",
                        "The file transaction could not be restored",
                        str(rollback_error),
                    )
                return _problem(
                    500,
                    "transaction_failed",
                    "The file transaction was not committed",
                    str(error),
                )

            new_revision = _revision(formatted_report)
            with sessions_lock:
                sessions.pop(session.token, None)
            next_session = issue_session(
                scope,
                new_revision,
                next_inputs_revision,
                next_local_revision,
                session.report_id,
                auxiliary_revision(path.parent),
            )
            return JSONResponse(
                {
                    "report": report,
                    "revision": new_revision,
                    "inputs": next_inputs,
                    "inputs_revision": next_session.inputs_revision,
                    "local_revision": next_session.local_revision,
                    "token": next_session.token,
                    "expires_at": next_session.expires_at,
                }
            )

    @router.put("/edit-sessions/{scope}")
    async def save_edit_session(scope: str, request: Request) -> Response:
        """Save report plus selected private inputs in one recoverable transaction.

        ``inputs`` is a patch-by-file: omitted config/estimates files are kept,
        while a present object replaces that canonical JSON file. Deletion is
        intentionally not part of the first contract.
        """

        if not _browser_write_allowed(request, control_port):
            return _problem(403, "browser_origin_forbidden", "Trusted same-origin editor required")
        if not _content_type_is_json(request):
            return _problem(415, "unsupported_media_type", "Requests must use application/json")
        session = authorize_session(request, scope)
        if session is None:
            return _problem(401, "invalid_edit_session", "A valid edit session is required")
        expected_revision = request.headers.get("if-match", "").strip('"')
        if not expected_revision or expected_revision != session.revision:
            return _problem(409, "stale_revision", "The edit session revision is stale")
        content_length = request.headers.get("content-length")
        if content_length:
            try:
                if int(content_length) > MAX_EDIT_PAYLOAD_BYTES:
                    return _problem(413, "edit_payload_too_large", "Edit payload exceeds the limit")
            except ValueError:
                return _problem(400, "invalid_content_length", "Content-Length is invalid")
        source = await request.body()
        if len(source) > MAX_EDIT_PAYLOAD_BYTES:
            return _problem(413, "edit_payload_too_large", "Edit payload exceeds the limit")
        try:
            payload = json.loads(source)
        except json.JSONDecodeError as error:
            return _problem(422, "invalid_json", "Edit payload is not valid JSON", str(error))
        if not isinstance(payload, dict) or set(payload) != {
            "report",
            "inputs_revision",
            "local_revision",
            "inputs",
            "changes",
        }:
            return _problem(
                422,
                "invalid_edit_payload",
                "Edit payload requires report, dual private revisions, inputs, and changes",
            )
        report = payload["report"]
        inputs_revision = payload["inputs_revision"]
        local_revision = payload["local_revision"]
        replacement_inputs = payload["inputs"]
        raw_changes = payload["changes"]
        if (
            not isinstance(inputs_revision, str)
            or not re.fullmatch(r"[a-f0-9]{64}", inputs_revision)
            or inputs_revision != session.inputs_revision
        ):
            return _problem(
                409,
                "stale_inputs_revision",
                "The edit session time-input revision is stale",
            )
        if (
            not isinstance(local_revision, str)
            or not re.fullmatch(r"[a-f0-9]{64}", local_revision)
            or local_revision != session.local_revision
        ):
            return _problem(
                409,
                "stale_local_revision",
                "The edit session private-history revision is stale",
            )
        if not isinstance(raw_changes, list) or len(raw_changes) > 10:
            return _problem(
                422,
                "invalid_change_reasons",
                "changes must be an array with at most 10 entries",
            )
        audit_requests: list[dict[str, str]] = []
        for raw_change in raw_changes:
            if (
                not isinstance(raw_change, dict)
                or set(raw_change) != {"field_path", "reason", "actor"}
                or raw_change.get("field_path") != "time.config.project.delivery_at"
                or raw_change.get("actor") not in {"human", "agent", "system"}
                or not isinstance(raw_change.get("reason"), str)
            ):
                return _problem(
                    422,
                    "invalid_change_reasons",
                    "A private change reason is invalid",
                )
            reason = raw_change["reason"].strip()
            if (
                not reason
                or len(reason) > 500
                or not any(char.isalnum() for char in reason)
                or re.search(r"\d{4}-\d{2}-\d{2}", reason)
            ):
                return _problem(
                    422,
                    "invalid_change_reasons",
                    "A change reason requires meaningful text and cannot contain an ISO date",
                )
            audit_requests.append(
                {
                    "field_path": raw_change["field_path"],
                    "reason": reason,
                    "actor": raw_change["actor"],
                }
            )
        if not isinstance(report, dict):
            return _problem(422, "invalid_report", "report.json root must be an object")
        report_errors = _schema_errors(schema_source.validator(), report)
        if report_errors:
            return _problem(
                422,
                "invalid_report",
                "report.json failed validation",
                schema_source.annotate(report_errors),
            )
        if report.get("scope_id") != scope or report.get("report_id") != session.report_id:
            return _problem(
                422,
                "identity_change_forbidden",
                "scope_id and report_id cannot be changed by this editor",
            )
        if (
            not isinstance(replacement_inputs, dict)
            or not set(replacement_inputs).issubset({"config", "estimates"})
        ):
            return _problem(
                422,
                "invalid_time_inputs",
                "inputs may contain only config and estimates replacements",
            )
        for key, value in replacement_inputs.items():
            if not isinstance(value, dict):
                return _problem(
                    422,
                    "invalid_time_inputs",
                    f"inputs.{key} must be an object",
                )
            errors = _json_schema_errors(time_validators[key], value)
            if errors:
                return _problem(
                    422,
                    "invalid_time_inputs",
                    f"inputs.{key} failed validation",
                    "; ".join(errors[:8]),
                )
            if value.get("scope_id") != scope:
                return _problem(
                    422,
                    "identity_change_forbidden",
                    f"inputs.{key}.scope_id cannot be changed by this editor",
                )
            formatted_input = (
                json.dumps(value, ensure_ascii=False, indent=2).encode("utf-8") + b"\n"
            )
            if len(formatted_input) > MAX_TRANSACTION_FILE_BYTES:
                return _problem(
                    413,
                    "time_input_too_large",
                    f"inputs.{key} exceeds the edit limit",
                )
        formatted_report = (
            json.dumps(report, ensure_ascii=False, indent=2).encode("utf-8") + b"\n"
        )
        if len(formatted_report) > MAX_REPORT_BYTES:
            return _problem(413, "report_too_large", "report.json exceeds the edit limit")
        path = registered_report(scope)
        if path is None:
            return _problem(404, "scope_not_found", "Editable scope was not found")
        return await commit_edit(
            scope=scope,
            path=path,
            session=session,
            report=report,
            formatted_report=formatted_report,
            replacement_inputs=replacement_inputs,
            audit_requests=audit_requests,
        )

    @router.put("/reports/{scope}")
    async def save_report(scope: str, request: Request) -> Response:
        if not _browser_write_allowed(request, control_port):
            return _problem(403, "browser_origin_forbidden", "Trusted same-origin editor required")
        if not _content_type_is_json(request):
            return _problem(415, "unsupported_media_type", "Requests must use application/json")
        session = authorize_session(request, scope)
        if session is None:
            return _problem(401, "invalid_edit_session", "A valid edit session is required")
        expected_revision = request.headers.get("if-match", "").strip('"')
        if not expected_revision or expected_revision != session.revision:
            return _problem(409, "stale_revision", "The edit session revision is stale")
        content_length = request.headers.get("content-length")
        if content_length:
            try:
                if int(content_length) > MAX_REPORT_BYTES:
                    return _problem(413, "report_too_large", "report.json exceeds the edit limit")
            except ValueError:
                return _problem(400, "invalid_content_length", "Content-Length is invalid")
        source = await request.body()
        if len(source) > MAX_REPORT_BYTES:
            return _problem(413, "report_too_large", "report.json exceeds the edit limit")
        try:
            report = json.loads(source)
        except json.JSONDecodeError as error:
            return _problem(422, "invalid_json", "report.json is not valid JSON", str(error))
        if not isinstance(report, dict):
            return _problem(422, "invalid_report", "report.json root must be an object")
        errors = _schema_errors(schema_source.validator(), report)
        if errors:
            return _problem(
                422,
                "invalid_report",
                "report.json failed validation",
                schema_source.annotate(errors),
            )
        if report.get("scope_id") != scope or report.get("report_id") != session.report_id:
            return _problem(
                422,
                "identity_change_forbidden",
                "scope_id and report_id cannot be changed by this editor",
            )
        path = registered_report(scope)
        if path is None:
            return _problem(404, "scope_not_found", "Editable scope was not found")
        formatted = (
            json.dumps(report, ensure_ascii=False, indent=2).encode("utf-8") + b"\n"
        )

        return await commit_edit(
            scope=scope,
            path=path,
            session=session,
            report=report,
            formatted_report=formatted,
            replacement_inputs={},
            audit_requests=[],
        )

    route_count = len(application.router.routes)
    application.include_router(router)
    added_routes = application.router.routes[route_count:]
    del application.router.routes[route_count:]
    mount_index = next(
        (
            index
            for index, route in enumerate(application.router.routes)
            if isinstance(route, Mount)
        ),
        len(application.router.routes),
    )
    application.router.routes[mount_index:mount_index] = added_routes


def create_taskprogress_app_factory(
    local_web_service: ModuleType,
    *,
    report_schema: os.PathLike[str] | str,
    analyzer_command: Sequence[str] = (),
    endpoints_directory: os.PathLike[str] | str | None = None,
) -> Callable[..., FastAPI]:
    original_create_app = local_web_service.create_app

    def create_taskprogress_app(*args: object, **kwargs: object) -> FastAPI:
        application = original_create_app(*args, **kwargs)
        control_port = kwargs.get("control_port")
        if not isinstance(control_port, int):
            raise ValueError("TaskProgress edit host requires control mode")
        client_token = secrets.token_urlsafe(32) if endpoints_directory is not None else None
        if endpoints_directory is not None:
            directory = Path(endpoints_directory).expanduser().resolve()
            exposed = [Path(args[0] if args else kwargs["web_root"]).resolve()]
            mounts = args[1] if len(args) > 1 else kwargs.get("mounts")
            exposed.extend(Path(value).resolve() for value in (mounts or {}).values())
            if any(directory.is_relative_to(root) for root in exposed):
                raise ValueError("Checklist endpoint directory cannot be placed in an exposed directory")
            files = args[2] if len(args) > 2 else kwargs.get("files")
            if any(Path(value).resolve().is_relative_to(directory) for value in (files or {}).values()):
                raise ValueError("Checklist endpoint files cannot be exposed as exact-file routes")
            _install_checklist_endpoint(application, directory, control_port, client_token)
        install_edit_api(
            application,
            report_schema=report_schema,
            control_port=control_port,
            analyzer_command=analyzer_command,
            client_token=client_token,
        )
        return application

    return create_taskprogress_app


def _parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="TaskProgress local edit host")
    parser.add_argument("--root", required=True)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8001)
    parser.add_argument("--control-state", required=True)
    parser.add_argument("--endpoints-directory")
    parser.add_argument("--local-web-service", required=True)
    parser.add_argument("--report-schema", required=True)
    parser.add_argument("--analyzer-executable", required=True)
    parser.add_argument("--analyzer-assembly")
    parser.add_argument("--no-browser", action="store_true")
    parser.add_argument("--log-file")
    parser.add_argument("--log-console", action="store_true")
    return parser.parse_args(argv)


def main(argv: Sequence[str] | None = None) -> int:
    args = _parse_args(argv)
    if args.log_file:
        if __package__:
            from .service_log import install_service_log
        else:
            from service_log import install_service_log
        install_service_log(args.log_file, args.root, console=args.log_console)
    local_web_service = _load_module(args.local_web_service)
    analyzer_command = [args.analyzer_executable]
    if args.analyzer_assembly:
        analyzer_command.append(args.analyzer_assembly)
    local_web_service.create_app = create_taskprogress_app_factory(
        local_web_service,
        report_schema=args.report_schema,
        analyzer_command=analyzer_command,
        endpoints_directory=args.endpoints_directory,
    )
    local_web_service.serve(
        web_root=args.root,
        host=args.host,
        port=args.port,
        control_state_file=args.control_state,
        open_browser=not args.no_browser,
        cors_origins=(),
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
