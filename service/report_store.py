"""Shared Report validation and recoverable file transactions for CLI and HTTP."""
from __future__ import annotations
import hashlib
import json
import os
import re
import secrets
import subprocess
import tempfile
from dataclasses import dataclass
from datetime import datetime, timezone as datetime_timezone
from pathlib import Path
from typing import Any, Callable, Sequence
from jsonschema import Draft202012Validator, FormatChecker

MAX_REPORT_BYTES = 1024 * 1024
MAX_TRANSACTION_FILE_BYTES = 4 * 1024 * 1024
TRANSACTION_FILES = frozenset(
    {
        "report.json",
        "report.dev.json",
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

def _revision(source: bytes) -> str:
    return hashlib.sha256(source).hexdigest()


def _read_report(path: Path) -> tuple[bytes, dict[str, Any], str]:
    source = path.read_bytes()
    if len(source) > MAX_REPORT_BYTES:
        raise ValueError("report.json exceeds the 1 MiB edit limit")
    payload = strict_json(source)
    if not isinstance(payload, dict):
        raise ValueError("report.json root must be an object")
    return source, payload, _revision(source)



def _cross_validate_report(report: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    task_ids: set[str] = set()
    tasks = report.get("tasks", [])
    if not isinstance(tasks, list):
        return errors
    for task_index, task in enumerate(tasks):
        if not isinstance(task, dict):
            continue
        task_id = task.get("id")
        if isinstance(task_id, str):
            if task_id in task_ids:
                errors.append(f"tasks[{task_index}].id is duplicated")
            task_ids.add(task_id)
        item_ids: set[str] = set()
        progress = task.get("progress")
        if isinstance(progress, dict):
            if progress["completed"] > progress["total"]:
                errors.append(f"tasks[{task_index}].progress.completed exceeds total")
        for field in ("completed_items", "pending_items"):
            items = task.get(field, [])
            if not isinstance(items, list):
                continue
            for item_index, item in enumerate(items):
                if not isinstance(item, dict):
                    continue
                if "status" in item and (item["status"] == "done") != (field == "completed_items"):
                    errors.append(f"tasks[{task_index}].{field}[{item_index}].status contradicts its array")
                item_id = item.get("id")
                if not isinstance(item_id, str):
                    continue
                if item_id in item_ids:
                    errors.append(
                        f"tasks[{task_index}].{field}[{item_index}].id is duplicated"
                    )
                item_ids.add(item_id)
    return errors


class _SchemaSource:
    """The report schema as the file it is, not as a copy taken at startup.

    A validator built once and kept forever keeps answering with whatever the
    schema said at that moment — and it answers confidently, blaming the report
    it was handed rather than reporting itself as stale. That failure is
    silent, misleading, and costs a restart to clear. Reading the file back
    whenever it changes on disk costs one ``stat`` per validation.

    A schema that momentarily fails to parse — an editor writing it — leaves
    the last good validator in place rather than breaking every save. The
    fingerprint in :meth:`label` is what shows that it did not advance.
    """

    def __init__(self, path: os.PathLike[str] | str) -> None:
        self._path = Path(path)
        self._signature: object = None
        self._validator: Draft202012Validator | None = None
        self._fingerprint = "unreadable"
        self._loaded_at = "never"

    def validator(self) -> Draft202012Validator:
        try:
            stat = self._path.stat()
            signature: object = (stat.st_mtime_ns, stat.st_size)
        except OSError:
            signature = self._signature
        if self._validator is not None and signature == self._signature:
            return self._validator
        try:
            source = self._path.read_bytes()
            validator = Draft202012Validator(
                json.loads(source), format_checker=FormatChecker()
            )
        except (OSError, ValueError):
            if self._validator is None:
                raise
            return self._validator
        self._validator = validator
        self._signature = signature
        self._fingerprint = hashlib.sha256(source).hexdigest()[:12]
        self._loaded_at = datetime.now(datetime_timezone.utc).isoformat(
            timespec="seconds"
        )
        return validator

    def label(self) -> str:
        return f"{self._path.name}@{self._fingerprint} loaded {self._loaded_at}"

    def annotate(self, errors: Sequence[str]) -> str:
        return "; ".join(list(errors)[:8]) + f" [{self.label()}]"


def _schema_errors(
    validator: Draft202012Validator,
    report: dict[str, Any],
) -> list[str]:
    errors = [
        f"{'.'.join(str(part) for part in error.absolute_path) or '$'}: {error.message}"
        for error in sorted(validator.iter_errors(report), key=lambda item: list(item.path))
    ]
    if not errors:
        errors.extend(_cross_validate_report(report))
    return errors


def _json_schema_errors(
    validator: Draft202012Validator,
    payload: dict[str, Any],
) -> list[str]:
    return [
        f"{'.'.join(str(part) for part in error.absolute_path) or '$'}: {error.message}"
        for error in sorted(validator.iter_errors(payload), key=lambda item: list(item.path))
    ]



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
        if candidate.is_symlink() or target != candidate.absolute():
            raise ValueError("Linked transaction targets are forbidden")
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
    payload = strict_json(journal.read_text(encoding="utf-8"))
    state, entries = _journal_entries(root, payload)
    for entry in entries:
        if entry.target.is_symlink() or entry.target.resolve().parent != root:
            raise ValueError("Linked recovery targets are forbidden")
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




def strict_json(source):
    if isinstance(source, bytes):
        source = source.decode("utf-8-sig")
    def object_pairs(pairs):
        result = {}
        for key, value in pairs:
            if key in result:
                raise ValueError(f"Duplicate JSON property: {key}")
            result[key] = value
        return result
    def reject_constant(value):
        raise ValueError(f"Invalid JSON constant: {value}")
    return json.loads(source, object_pairs_hook=object_pairs, parse_constant=reject_constant)


def auxiliary_revision(folder):
    digest = hashlib.sha256()
    for name in ("report.dev.json", "time.events.json"):
        path = Path(folder) / name
        digest.update(name.encode() + b"\0")
        digest.update(b"present\0" + path.read_bytes() if path.exists() else b"missing\0")
    return digest.hexdigest()


def read_overlay(folder):
    path = Path(folder) / "report.dev.json"
    if not path.exists():
        return None
    if path.is_symlink() or path.resolve().parent != Path(folder).resolve():
        raise ValueError("Linked developer overlay is forbidden")
    source = path.read_bytes()
    if len(source) > MAX_REPORT_BYTES:
        raise ValueError("report.dev.json exceeds the 1 MiB edit limit")
    result = strict_json(source)
    if not isinstance(result, dict):
        raise ValueError("report.dev.json root must be an object")
    return result


class ReportValidationError(ValueError):
    def __init__(self, message):
        super().__init__(message)
        self.field = message.split(":", 1)[0] if ":" in message else "$"


def validate_documents(report, overlay, report_validator=None):
    root = Path(__file__).resolve().parents[1] / "schemas"
    errors = _schema_errors(report_validator or _SchemaSource(root / "report.schema.json").validator(), report)
    if overlay is not None:
        errors += _json_schema_errors(_SchemaSource(root / "report.dev.schema.json").validator(), overlay)
        if isinstance(overlay, dict) and not errors:
            for key in ("schema_version", "report_id"):
                if overlay.get(key) != report.get(key):
                    errors.append(f"report.dev.json.{key} does not match report.json")
            ids = {t.get("id") for t in report.get("tasks", []) if isinstance(t, dict)}
            seen = set()
            for task in overlay.get("tasks", []):
                if not isinstance(task, dict):
                    continue
                identity = task.get("id")
                if identity not in ids or identity in seen:
                    errors.append("report.dev.json task id is unknown or duplicated")
                seen.add(identity)
    if errors:
        raise ReportValidationError("; ".join(errors[:8]))


def run_time_analysis(folder, command, *, hidden=False):
    folder = Path(folder)
    if not any((folder / name).is_file() for name in (
        "time.config.json", "time.estimates.json", "time.events.json", "time.analysis.json"
    )):
        return True, ""
    if not command:
        return False, "Time data exists but no analyzer command is available"
    try:
        completed = subprocess.run(
            [*command, "analyze", str(folder), "--module", "time"],
            cwd=folder, capture_output=True, encoding="utf-8", errors="replace",
            timeout=120, check=False,
            creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0) if hidden else 0,
        )
    except (OSError, subprocess.SubprocessError) as error:
        return False, str(error)
    if completed.returncode != 0:
        return False, "Time analyzer failed"
    try:
        output = strict_json((folder / "time.analysis.json").read_bytes())
        schema = Path(__file__).resolve().parents[1] / "experiments/time-reference/schemas/time.analysis.schema.json"
        errors = _json_schema_errors(_SchemaSource(schema).validator(), output)
        report = _read_report(folder / "report.json")[1]
        if errors or output.get("scope_id") != report["scope_id"]:
            return False, "Time analysis output failed validation"
    except (OSError, ValueError, AttributeError) as error:
        return False, str(error)
    return True, ""
