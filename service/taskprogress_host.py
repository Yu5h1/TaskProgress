"""TaskProgress-owned local edit host layered on LocalWebService.

The shared LocalWebService remains generic. This process wraps its public
``create_app``/``serve`` boundary and inserts TaskProgress-only browser routes
before the static mounts.
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
from pathlib import Path
from types import ModuleType
from typing import Any, Callable, Sequence

from fastapi import APIRouter, FastAPI, Request
from fastapi.responses import JSONResponse, Response
from jsonschema import Draft202012Validator, FormatChecker
from starlette.routing import Mount


API_PREFIX = "/__taskprogress/v1"
API_VERSION = 1
MAX_REPORT_BYTES = 1024 * 1024
MAX_TRANSACTION_FILE_BYTES = 4 * 1024 * 1024
SESSION_LIFETIME_SECONDS = 10 * 60
SCOPE_PATTERN = re.compile(r"^[a-z0-9]+(?:[._-][a-z0-9]+)*$")
TRANSACTION_FILES = frozenset(
    {
        "report.json",
        "time.config.json",
        "time.estimates.json",
        "time.analysis.json",
        "taskprogress.local.json",
    }
)
TRANSACTION_JOURNAL = ".taskprogress.transaction.json"
TRANSACTION_BACKUP_PATTERN = re.compile(
    r"^\.taskprogress\.transaction\.([a-f0-9]{24})\.([a-z0-9.]+)\.bak$"
)


@dataclass(frozen=True)
class EditSession:
    token: str
    scope: str
    revision: str
    report_id: str
    expires_at: float


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


def _revision(source: bytes) -> str:
    return hashlib.sha256(source).hexdigest()


def _read_report(path: Path) -> tuple[bytes, dict[str, Any], str]:
    source = path.read_bytes()
    if len(source) > MAX_REPORT_BYTES:
        raise ValueError("report.json exceeds the 1 MiB edit limit")
    payload = json.loads(source)
    if not isinstance(payload, dict):
        raise ValueError("report.json root must be an object")
    return source, payload, _revision(source)


def _validate_scope(value: object) -> str:
    if not isinstance(value, str) or not SCOPE_PATTERN.fullmatch(value):
        raise ValueError("scope_id is invalid")
    return value


def _cross_validate_report(report: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    task_ids: set[str] = set()
    for task_index, task in enumerate(report.get("tasks", [])):
        if not isinstance(task, dict):
            continue
        task_id = task.get("id")
        if isinstance(task_id, str):
            if task_id in task_ids:
                errors.append(f"tasks[{task_index}].id is duplicated")
            task_ids.add(task_id)
        item_ids: set[str] = set()
        for field in ("completed_items", "pending_items"):
            for item_index, item in enumerate(task.get(field, [])):
                if not isinstance(item, dict):
                    continue
                item_id = item.get("id")
                if not isinstance(item_id, str):
                    continue
                if item_id in item_ids:
                    errors.append(
                        f"tasks[{task_index}].{field}[{item_index}].id is duplicated"
                    )
                item_ids.add(item_id)
    return errors


def _schema_errors(
    validator: Draft202012Validator,
    report: dict[str, Any],
) -> list[str]:
    errors = [
        f"{'.'.join(str(part) for part in error.absolute_path) or '$'}: {error.message}"
        for error in sorted(validator.iter_errors(report), key=lambda item: list(item.path))
    ]
    errors.extend(_cross_validate_report(report))
    return errors


def _atomic_replace(path: Path, source: bytes) -> None:
    descriptor, temporary_name = tempfile.mkstemp(
        prefix=f".{path.name}.",
        suffix=".tmp",
        dir=path.parent,
    )
    temporary = Path(temporary_name)
    try:
        with os.fdopen(descriptor, "wb") as stream:
            stream.write(source)
            stream.flush()
            os.fsync(stream.fileno())
        try:
            os.chmod(temporary, path.stat().st_mode)
        except OSError:
            pass
        os.replace(temporary, path)
    except BaseException:
        try:
            temporary.unlink()
        except OSError:
            pass
        raise


@dataclass(frozen=True)
class TransactionEntry:
    target: Path
    backup: Path
    existed: bool


class TransactionRollbackError(RuntimeError):
    pass


class LocalFileTransaction:
    """Recoverable same-folder transaction for TaskProgress-owned files.

    Input files are staged in memory, existing targets are copied to hidden
    backups, and a hidden journal distinguishes prepared/applying/committed
    states. A later request can recover an interrupted prepared transaction;
    a committed journal is cleanup-only.
    """

    def __init__(self, folder: os.PathLike[str] | str) -> None:
        self.folder = Path(folder).resolve(strict=True)
        if not self.folder.is_dir():
            raise ValueError("Transaction root must be a directory")
        self.transaction_id = secrets.token_hex(12)
        self.journal_path = self.folder / TRANSACTION_JOURNAL
        self._watched: set[Path] = set()
        self._staged: dict[Path, bytes] = {}
        self._entries: list[TransactionEntry] = []
        self._state = "draft"
        self._closed = False

    def _target(self, path: os.PathLike[str] | str) -> Path:
        candidate = Path(path)
        if not candidate.is_absolute():
            candidate = self.folder / candidate
        target = candidate.resolve(strict=False)
        if target.parent != self.folder or target.name not in TRANSACTION_FILES:
            raise ValueError(f"Transaction target is not allowed: {target.name}")
        return target

    def watch(self, path: os.PathLike[str] | str) -> Path:
        if self._state != "draft" or self._closed:
            raise RuntimeError("Transaction can no longer accept targets")
        target = self._target(path)
        self._watched.add(target)
        return target

    def stage_bytes(self, path: os.PathLike[str] | str, source: bytes) -> Path:
        if not isinstance(source, bytes):
            raise TypeError("Transaction source must be bytes")
        if len(source) > MAX_TRANSACTION_FILE_BYTES:
            raise ValueError("Transaction file exceeds the 4 MiB limit")
        target = self.watch(path)
        self._staged[target] = source
        return target

    def stage_json(self, path: os.PathLike[str] | str, payload: object) -> Path:
        source = json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8") + b"\n"
        return self.stage_bytes(path, source)

    def _journal_payload(self, state: str) -> bytes:
        payload = {
            "version": 1,
            "transaction_id": self.transaction_id,
            "state": state,
            "entries": [
                {
                    "target": entry.target.name,
                    "backup": entry.backup.name,
                    "existed": entry.existed,
                }
                for entry in self._entries
            ],
        }
        return json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8") + b"\n"

    def _write_journal(self, state: str) -> None:
        _atomic_replace(self.journal_path, self._journal_payload(state))
        self._state = state

    def prepare(self, validators: Sequence[Callable[[], None]] = ()) -> None:
        if self._closed or self._state != "draft":
            raise RuntimeError("Transaction is not in draft state")
        if not self._watched:
            raise ValueError("Transaction has no files")
        for validate in validators:
            validate()
        try:
            for target in sorted(self._watched, key=lambda item: item.name):
                if target.exists() and not target.is_file():
                    raise ValueError(f"Transaction target is not a file: {target.name}")
                existed = target.is_file()
                backup = self.folder / (
                    f".taskprogress.transaction.{self.transaction_id}.{target.name}.bak"
                )
                if existed:
                    source = target.read_bytes()
                    if len(source) > MAX_TRANSACTION_FILE_BYTES:
                        raise ValueError(f"Transaction source is too large: {target.name}")
                    _atomic_replace(backup, source)
                self._entries.append(TransactionEntry(target, backup, existed))
            self._write_journal("prepared")
        except BaseException:
            for entry in self._entries:
                try:
                    entry.backup.unlink()
                except FileNotFoundError:
                    pass
            self._entries.clear()
            raise

    def apply(self) -> None:
        if self._state == "draft":
            self.prepare()
        if self._closed or self._state != "prepared":
            raise RuntimeError("Transaction is not prepared")
        self._write_journal("applying")
        for target, source in sorted(self._staged.items(), key=lambda item: item[0].name):
            _atomic_replace(target, source)

    def _cleanup(self) -> None:
        for entry in self._entries:
            try:
                entry.backup.unlink()
            except FileNotFoundError:
                pass
        try:
            self.journal_path.unlink()
        except FileNotFoundError:
            pass

    def commit(self) -> None:
        if self._closed or self._state != "applying":
            raise RuntimeError("Transaction has not been applied")
        self._write_journal("committed")
        self._closed = True
        try:
            self._cleanup()
        except OSError:
            # A committed journal is cleanup-only if the process is interrupted.
            pass

    def rollback(self) -> None:
        if self._closed:
            return
        if self._state == "draft":
            self._closed = True
            return
        errors: list[str] = []
        for entry in reversed(self._entries):
            try:
                if entry.existed:
                    if entry.backup.is_symlink() or not entry.backup.is_file():
                        raise OSError(f"Missing backup for {entry.target.name}")
                    _atomic_replace(entry.target, entry.backup.read_bytes())
                elif entry.target.exists():
                    if not entry.target.is_file():
                        raise OSError(f"Rollback target is not a file: {entry.target.name}")
                    entry.target.unlink()
            except OSError as error:
                errors.append(str(error))
        if errors:
            raise TransactionRollbackError("; ".join(errors))
        self._closed = True
        self._cleanup()


def _journal_entries(folder: Path, payload: object) -> tuple[str, list[TransactionEntry]]:
    if not isinstance(payload, dict) or payload.get("version") != 1:
        raise ValueError("Transaction journal version is invalid")
    transaction_id = payload.get("transaction_id")
    state = payload.get("state")
    raw_entries = payload.get("entries")
    if (
        not isinstance(transaction_id, str)
        or not re.fullmatch(r"[a-f0-9]{24}", transaction_id)
        or not isinstance(state, str)
        or state not in {"prepared", "applying", "committed"}
        or not isinstance(raw_entries, list)
    ):
        raise ValueError("Transaction journal is invalid")
    entries: list[TransactionEntry] = []
    seen_targets: set[str] = set()
    for raw in raw_entries:
        if not isinstance(raw, dict) or set(raw) != {"target", "backup", "existed"}:
            raise ValueError("Transaction journal entry is invalid")
        target_name = raw["target"]
        backup_name = raw["backup"]
        existed = raw["existed"]
        match = (
            TRANSACTION_BACKUP_PATTERN.fullmatch(backup_name)
            if isinstance(backup_name, str)
            else None
        )
        if (
            not isinstance(target_name, str)
            or target_name not in TRANSACTION_FILES
            or target_name in seen_targets
            or not isinstance(existed, bool)
            or match is None
            or match.group(1) != transaction_id
            or match.group(2) != target_name
        ):
            raise ValueError("Transaction journal entry is unsafe")
        seen_targets.add(target_name)
        entries.append(
            TransactionEntry(folder / target_name, folder / backup_name, existed)
        )
    return str(state), entries


def recover_pending_transaction(folder: os.PathLike[str] | str) -> bool:
    root = Path(folder).resolve(strict=True)
    journal = root / TRANSACTION_JOURNAL
    if journal.is_symlink():
        raise ValueError("Transaction journal cannot be a symbolic link")
    if not journal.is_file():
        return False
    payload = json.loads(journal.read_text(encoding="utf-8"))
    state, entries = _journal_entries(root, payload)
    if state != "committed":
        errors: list[str] = []
        for entry in reversed(entries):
            try:
                if entry.existed:
                    if entry.backup.is_symlink() or not entry.backup.is_file():
                        raise OSError(f"Missing backup for {entry.target.name}")
                    _atomic_replace(entry.target, entry.backup.read_bytes())
                elif entry.target.exists():
                    if not entry.target.is_file():
                        raise OSError(f"Recovery target is not a file: {entry.target.name}")
                    entry.target.unlink()
            except OSError as error:
                errors.append(str(error))
        if errors:
            raise TransactionRollbackError("; ".join(errors))
    for entry in entries:
        try:
            entry.backup.unlink()
        except FileNotFoundError:
            pass
    journal.unlink()
    return True


def _report_route(scope: str) -> str:
    return f"/reports/{scope}/report.json"


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


def _content_type_is_json(request: Request) -> bool:
    return (
        request.headers.get("content-type", "")
        .partition(";")[0]
        .strip()
        .lower()
        == "application/json"
    )


def _run_analysis(
    analyzer_command: Sequence[str],
    report_path: Path,
) -> tuple[bool, str]:
    folder = report_path.parent
    if not any(
        (folder / name).is_file()
        for name in ("time.config.json", "time.estimates.json", "time.events.json")
    ):
        return True, ""
    if not analyzer_command:
        return False, "Time inputs exist but no analyzer command is available"
    try:
        completed = subprocess.run(
            [*analyzer_command, "analyze", str(folder)],
            cwd=folder,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=120,
            check=False,
            creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
        )
    except (OSError, subprocess.SubprocessError) as error:
        return False, str(error)
    if completed.returncode == 0:
        return True, ""
    detail = (completed.stderr or completed.stdout).strip()
    return False, detail or f"Analyzer exited with code {completed.returncode}"


def install_edit_api(
    application: FastAPI,
    *,
    report_schema: os.PathLike[str] | str,
    control_port: int,
    analyzer_command: Sequence[str] = (),
    now: Callable[[], float] = time.time,
) -> None:
    schema = json.loads(Path(report_schema).read_text(encoding="utf-8"))
    validator = Draft202012Validator(schema, format_checker=FormatChecker())
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
        report_id: str,
    ) -> EditSession:
        token = secrets.token_urlsafe(32)
        session = EditSession(
            token=token,
            scope=scope,
            revision=revision,
            report_id=report_id,
            expires_at=now() + SESSION_LIFETIME_SECONDS,
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
        async with write_lock:
            try:
                recover_pending_transaction(path.parent)
                _, report, revision = _read_report(path)
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
        return JSONResponse(
            {
                "editable": True,
                "scope_id": safe_scope,
                "revision": revision,
                "session_lifetime_seconds": SESSION_LIFETIME_SECONDS,
            }
        )

    @router.post("/edit-sessions")
    async def create_edit_session(request: Request) -> Response:
        if not _browser_write_allowed(request, control_port):
            return _problem(403, "browser_origin_forbidden", "Trusted same-origin editor required")
        if not _content_type_is_json(request):
            return _problem(415, "unsupported_media_type", "Requests must use application/json")
        try:
            payload = await request.json()
            if not isinstance(payload, dict) or set(payload) != {"scope_id"}:
                raise ValueError("Request requires only scope_id")
            scope = _validate_scope(payload["scope_id"])
        except (TypeError, ValueError, json.JSONDecodeError) as error:
            return _problem(422, "invalid_request", "Edit session request is invalid", str(error))
        path = registered_report(scope)
        if path is None:
            return _problem(404, "scope_not_found", "Editable scope was not found")
        async with write_lock:
            try:
                recover_pending_transaction(path.parent)
                _, report, revision = _read_report(path)
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
        errors = _schema_errors(validator, report)
        if errors:
            return _problem(
                409,
                "source_report_invalid",
                "Source report is invalid",
                "; ".join(errors[:8]),
            )
        if report.get("scope_id") != scope:
            return _problem(409, "scope_mismatch", "Registered report scope does not match")
        session = issue_session(scope, revision, str(report["report_id"]))
        return JSONResponse(
            {
                "token": session.token,
                "scope_id": session.scope,
                "revision": session.revision,
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
        errors = _schema_errors(validator, report)
        if errors:
            return _problem(
                422,
                "invalid_report",
                "report.json failed validation",
                "; ".join(errors[:8]),
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

        async with write_lock:
            try:
                recover_pending_transaction(path.parent)
                _, current_report, current_revision = _read_report(path)
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
            if (
                current_revision != session.revision
                or current_report.get("report_id") != session.report_id
            ):
                return _problem(
                    409,
                    "source_changed",
                    "report.json changed after the edit session started",
                )
            transaction = LocalFileTransaction(path.parent)
            try:
                transaction.stage_bytes(path, formatted)
                transaction.watch(path.parent / "time.analysis.json")
                transaction.prepare()
                transaction.apply()
                analysis_ok, analysis_error = await asyncio.to_thread(
                    _run_analysis,
                    analyzer_command,
                    path,
                )
                if not analysis_ok:
                    transaction.rollback()
                    return _problem(
                        409,
                        "analysis_failed",
                        "Time analysis failed; the file transaction was restored",
                        analysis_error,
                    )
                transaction.commit()
            except (OSError, ValueError, RuntimeError) as error:
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

            new_revision = _revision(formatted)
            with sessions_lock:
                sessions.pop(session.token, None)
            next_session = issue_session(scope, new_revision, session.report_id)
            return JSONResponse(
                {
                    "report": report,
                    "revision": new_revision,
                    "token": next_session.token,
                    "expires_at": next_session.expires_at,
                }
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
) -> Callable[..., FastAPI]:
    original_create_app = local_web_service.create_app

    def create_taskprogress_app(*args: object, **kwargs: object) -> FastAPI:
        application = original_create_app(*args, **kwargs)
        control_port = kwargs.get("control_port")
        if not isinstance(control_port, int):
            raise ValueError("TaskProgress edit host requires control mode")
        install_edit_api(
            application,
            report_schema=report_schema,
            control_port=control_port,
            analyzer_command=analyzer_command,
        )
        return application

    return create_taskprogress_app


def _parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="TaskProgress local edit host")
    parser.add_argument("--root", required=True)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8001)
    parser.add_argument("--control-state", required=True)
    parser.add_argument("--local-web-service", required=True)
    parser.add_argument("--report-schema", required=True)
    parser.add_argument("--analyzer-executable", required=True)
    parser.add_argument("--analyzer-assembly")
    parser.add_argument("--no-browser", action="store_true")
    return parser.parse_args(argv)


def main(argv: Sequence[str] | None = None) -> int:
    args = _parse_args(argv)
    local_web_service = _load_module(args.local_web_service)
    analyzer_command = [args.analyzer_executable]
    if args.analyzer_assembly:
        analyzer_command.append(args.analyzer_assembly)
    local_web_service.create_app = create_taskprogress_app_factory(
        local_web_service,
        report_schema=args.report_schema,
        analyzer_command=analyzer_command,
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
