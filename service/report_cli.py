"""One-shot Report CLI adapter. Does not start or connect to a persistent server."""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

if not __package__:
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from service.report_lock import scope_lock
from service.report_operations import ReportError, apply_operations, require
from service.report_store import (
    LocalFileTransaction, TransactionRollbackError, TRANSACTION_JOURNAL,
    MAX_REPORT_BYTES, strict_json, validate_documents, recover_pending_transaction, run_time_analysis,
)

SOURCE_FILES = ("report.json", "report.dev.json", "time.config.json", "time.estimates.json",
                "time.events.json", "time.analysis.json", "taskprogress.local.json")


def read_sources(folder):
    sources = {}
    for name in SOURCE_FILES:
        path = folder / name
        if path.is_symlink() or path.resolve().parent != folder:
            raise ReportError("invalid_source", "Linked source files are forbidden")
        sources[name] = path.read_bytes() if path.exists() else None
        if sources[name] is not None and len(sources[name]) > 4 * MAX_REPORT_BYTES:
            raise ReportError("invalid_source", name + " exceeds the 4 MiB limit")
    if sources["report.json"] is None:
        raise ReportError("invalid_source", "report.json was not found")
    for name in ("report.json", "report.dev.json"):
        if sources[name] is not None and len(sources[name]) > MAX_REPORT_BYTES:
            raise ReportError("invalid_source", name + " exceeds the 1 MiB edit limit")
    return sources


def revision(sources):
    digest = hashlib.sha256()
    for name, source in sources.items():
        digest.update(name.encode() + b"\0")
        digest.update(b"missing\0" if source is None else b"present\0" + hashlib.sha256(source).digest())
    return digest.hexdigest()


def documents(sources):
    report = strict_json(sources["report.json"])
    overlay = strict_json(sources["report.dev.json"]) if sources["report.dev.json"] is not None else None
    if sources["report.dev.json"] is not None:
        require(isinstance(overlay, dict), "report.dev.json root must be an object")
    require(isinstance(report, dict), "Report root must be an object")
    validate_documents(report, overlay)
    return report, overlay


def needs_analysis(sources):
    return any(sources[name] is not None for name in ("time.config.json", "time.estimates.json", "time.events.json", "time.analysis.json"))


def run_analysis(folder, command):
    ok, detail = run_time_analysis(folder, command)
    if not ok:
        raise ReportError("analysis_failed", detail, 4)


def execute(folder, action, request=None, *, task=None, dry_run=False, analyzer=(), analyze=run_analysis):
    folder = Path(folder).resolve(strict=True)
    with scope_lock(folder):
        if (folder / TRANSACTION_JOURNAL).exists():
            if action != "apply" or dry_run:
                raise ReportError("recovery_required", "Pending transaction requires a non-dry-run apply", 4)
            recover_pending_transaction(folder)
        sources = read_sources(folder)
        report, overlay = documents(sources)
        before = revision(sources)
        if action == "validate":
            return {"ok": True, "revision": before}
        if action == "get":
            if task is None:
                return {"ok": True, "revision": before, "report": report, "developer": overlay}
            selected = next((t for t in report["tasks"] if t["id"] == task), None)
            if selected is None:
                raise ReportError("task_not_found", "Task ID was not found")
            developer = next((t for t in (overlay or {}).get("tasks", []) if t["id"] == task), None)
            return {"ok": True, "revision": before, "task": selected, "developer": developer}
        require(action == "apply", "Unknown action")
        require(isinstance(request, dict) and set(request) == {"version", "expected_revision", "operations"}, "Invalid request properties")
        require(request["version"] == "1", "Unsupported request version", "version")
        if request["expected_revision"] != before:
            raise ReportError("revision_conflict", "Source revision changed; load it again", 3)
        candidate, next_overlay, summaries = apply_operations(report, overlay, request["operations"])
        changed_report, changed_overlay = candidate != report, next_overlay != overlay
        changed = changed_report or changed_overlay
        analysis = changed_report and needs_analysis(sources)
        result = {"ok": True, "source_revision": before, "revision": before, "changed": changed,
                  "dry_run": dry_run, "task_ids": sorted({s["task_id"] for s in summaries if s["task_id"] is not None}),
                  "changes": summaries if changed else [], "analysis": "planned" if analysis else "not_required"}
        if not changed:
            return result
        stamp = datetime.now(timezone.utc).isoformat()
        staged = {}
        for name, payload, modified in (("report.json", candidate, changed_report), ("report.dev.json", next_overlay, changed_overlay)):
            if modified:
                payload["updated_at"] = stamp
                staged[name] = (json.dumps(payload, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
                require(len(staged[name]) <= MAX_REPORT_BYTES, name + " exceeds the 1 MiB edit limit")
        validate_documents(candidate, next_overlay)
        if dry_run:
            return result
        transaction = LocalFileTransaction(folder)
        try:
            if revision(read_sources(folder)) != before:
                raise ReportError("revision_conflict", "Source changed during validation", 3)
            for name, source in staged.items():
                transaction.stage_bytes(name, source)
            if analysis:
                transaction.watch("time.analysis.json")
            transaction.prepare()
            transaction.apply()
            if analysis:
                analyze(folder, analyzer)
            after_sources = read_sources(folder)
            for name in SOURCE_FILES:
                if name not in staged and not (analysis and name == "time.analysis.json") and after_sources[name] != sources[name]:
                    raise ReportError("external_write_conflict", "A source changed outside the transaction", 4)
                if name in staged and after_sources[name] != staged[name]:
                    raise ReportError("external_write_conflict", "A written source changed outside the transaction", 4)
            documents(after_sources)
            transaction.commit()
            result["revision"] = revision(after_sources)
            result["analysis"] = "updated" if analysis else "not_required"
            return result
        except Exception as error:
            transaction.rollback()
            if isinstance(error, ReportError):
                raise
            raise ReportError("transaction_failed", str(error), 4) from error


class JsonParser(argparse.ArgumentParser):
    def error(self, message):
        raise ReportError("invalid_input", message)


def main(argv=None):
    try:
        parser = JsonParser()
        parser.add_argument("action", choices=("get", "validate", "apply"))
        parser.add_argument("--folder", required=True)
        parser.add_argument("--task")
        parser.add_argument("--dry-run", action="store_true")
        parser.add_argument("--analyzer-json", default="[]")
        args = parser.parse_args(argv)
        require(args.action == "get" or args.task is None, "--task requires get")
        require(args.action == "apply" or not args.dry_run, "--dry-run requires apply")
        analyzer = strict_json(args.analyzer_json)
        require(isinstance(analyzer, list) and all(isinstance(s, str) for s in analyzer), "Invalid analyzer command")
        request = None
        if args.action == "apply":
            source = sys.stdin.buffer.read(4 * MAX_REPORT_BYTES + 1)
            require(len(source) <= 4 * MAX_REPORT_BYTES, "Request exceeds 4 MiB")
            request = strict_json(source)
        result = execute(args.folder, args.action, request, task=args.task, dry_run=args.dry_run, analyzer=analyzer)
        code = 0
    except (ReportError, ValueError, OSError, RuntimeError, subprocess.SubprocessError) as error:
        code = error.exit_code if isinstance(error, ReportError) else 2 if isinstance(error, ValueError) else 4
        detail = {"code": error.code if isinstance(error, ReportError) else "invalid_input" if code == 2 else "runtime_error", "message": str(error)}
        if isinstance(error, ReportError):
            for key in ("operation_index", "field"):
                if getattr(error, key) is not None:
                    detail[key] = getattr(error, key)
        result = {"ok": False, "error": detail}
    print(json.dumps(result, ensure_ascii=True))
    return code


if __name__ == "__main__":
    raise SystemExit(main())
