"""ID-addressed Report operations; candidates are isolated until the entire batch validates."""
from __future__ import annotations

import re
from copy import deepcopy

from .report_store import validate_documents


class ReportError(ValueError):
    def __init__(self, code, message, exit_code=2, operation_index=None, field=None):
        super().__init__(message)
        self.code, self.exit_code = code, exit_code
        self.operation_index, self.field = operation_index, field


FIELDS = {
    "report.update": ({"title", "summary"}, {"summary"}),
    "task.update": ({"title", "summary", "status", "priority", "progress"}, {"priority", "progress"}),
    "item.update": ({"title", "status", "priority"}, {"priority"}),
    "dev.update": ({"next_step", "blockers", "decisions", "routes"}, {"next_step", "blockers", "decisions", "routes"}),
}


ACTIVITY_RECENT_LIMIT = 3
ACTOR_PATTERN = re.compile(r"^[a-z][a-z0-9-]{0,31}$")
CLAIMS = {"own", "takeover"}


def require(condition, message, field=None):
    if not condition:
        raise ReportError("invalid_operation", message, field=field)


def find_task(report, identity):
    require(isinstance(identity, str), "task_id must be a string", "task_id")
    task = next((t for t in report["tasks"] if t["id"] == identity), None)
    require(task is not None, "Task ID was not found", "task_id")
    require(task.get("kind") != "report_pointer", "Pointer tasks cannot be modified", "task_id")
    return task


def insert_item(task, field, item):
    items = task.setdefault(field, [])
    items.insert(0 if field == "completed_items" else len(items), item)


def place_pending_item(task, item, position, *, moving=False):
    require(isinstance(position, dict) and len(position) == 1
            and set(position) <= {"before", "after"},
            "position requires exactly one before or after item ID", "position")
    relation, anchor_id = next(iter(position.items()))
    require(isinstance(anchor_id, str) and bool(anchor_id.strip()),
            "Position anchor must be a stable item ID", "position")
    require(anchor_id != item["id"], "An item cannot be its own position anchor", "position")
    items = task.get("pending_items", [])
    anchor = next((candidate for candidate in items
                   if isinstance(candidate, dict) and candidate.get("id") == anchor_id), None)
    require(anchor is not None, "Position anchor must belong to this task's pending_items", "position")
    if moving:
        items.remove(item)
    items.insert(items.index(anchor) + (relation == "after"), item)


def append_activity(item, entry):
    """Keeps the first created entry forever and only the most recent other entries."""
    entries = [*item.get("activity", []), entry]
    created = next((e for e in entries if e["event"] == "created"), None)
    recent = [e for e in entries if e["event"] != "created"][-ACTIVITY_RECENT_LIMIT:]
    item["activity"] = ([created] if created else []) + recent


def activity_entry(event, actor, at):
    entry = {"event": event, "actor": actor["actor"], "at": at}
    if actor.get("session"):
        entry["session"] = actor["session"]
    return entry


def status_event(previous_status, status):
    if status != previous_status and status in ("in_progress", "done"):
        return "started" if status == "in_progress" else "done"
    return None


def claim_relation(item, actor):
    """None when the writer may proceed; otherwise conflict (someone else) or unverified (cannot tell)."""
    if item.get("status") != "in_progress":
        return None, None
    claimant = next((e for e in reversed(item.get("activity", [])) if e["event"] in ("started", "takeover")), None)
    if claimant is None:
        return None, None
    mine, theirs = actor.get("session"), claimant.get("session")
    if claimant["actor"] == actor["actor"] and mine and theirs and mine == theirs:
        return None, claimant
    if claimant["actor"] != actor["actor"] or (mine and theirs):
        return "conflict", claimant
    return "unverified", claimant


def check_claim(item, operation, actor, at):
    relation, claimant = claim_relation(item, actor)
    claim = operation.get("claim")
    require(claim is None or claim in CLAIMS, "claim must be own or takeover", "claim")
    if relation is None:
        return
    who = claimant["actor"] + (" (" + claimant["session"] + ")" if claimant.get("session") else "")
    if relation == "conflict" and claim != "takeover":
        raise ReportError("claim_conflict", "Item is in progress by " + who + " since " + claimant["at"]
                          + "; ask the user, then retry with claim: takeover", field="claim")
    if relation == "unverified" and claim not in CLAIMS:
        raise ReportError("claim_unverified", "Item is in progress by " + who + " since " + claimant["at"]
                          + " and the session cannot be compared; retry with claim: own if you started it, "
                          "otherwise ask the user and retry with claim: takeover", field="claim")
    if claim == "takeover":
        append_activity(item, activity_entry("takeover", actor, at))


def stamp_new_item(item, actor, at):
    append_activity(item, activity_entry("created", actor, at))
    event = status_event(None, item.get("status"))
    if event:
        append_activity(item, activity_entry(event, actor, at))


def without_activity(item):
    return {key: value for key, value in item.items() if key != "activity"}


def update(target, operation, name):
    allowed, removable = FIELDS[name]
    values, unset = operation.get("set", {}), operation.get("unset", [])
    require(isinstance(values, dict), "set must be an object", "set")
    require(isinstance(unset, list) and all(isinstance(x, str) for x in unset), "unset must be a string array", "unset")
    require(len(unset) == len(set(unset)), "Duplicate unset field", "unset")
    require(set(values) <= allowed, "Unknown set field", "set")
    require(set(unset) <= removable, "Field cannot be unset", "unset")
    require(not set(values).intersection(unset), "A field cannot be set and unset", "unset")
    target.update(deepcopy(values))
    for key in unset:
        target.pop(key, None)


def apply_operations(report, overlay, operations, actor=None, at=None):
    require(isinstance(actor, dict) and isinstance(actor.get("actor"), str) and bool(ACTOR_PATTERN.match(actor["actor"])),
            "actor is required: the writing tool in lowercase, such as claude, codex or antigravity", "actor")
    require(actor.get("session") is None or (isinstance(actor["session"], str) and 0 < len(actor["session"]) <= 100),
            "session must be a non-empty string of at most 100 characters", "session")
    require(isinstance(at, str), "Activity time is required", "at")
    require(isinstance(operations, list) and 0 < len(operations) <= 1000, "operations must contain 1–1000 entries", "operations")
    report, overlay = deepcopy(report), deepcopy(overlay)
    summaries = []
    for index, operation in enumerate(operations):
        try:
            require(isinstance(operation, dict), "Operation must be an object")
            name = operation.get("op")
            require(isinstance(name, str) and name in {*FIELDS, "task.add", "item.add", "item.move"}, "Unknown operation", "op")
            keys = {"op", "set", "unset"}
            if name != "report.update":
                keys.add("task_id")
            if name == "item.update":
                keys |= {"item_id", "claim"}
            if name in {"task.add", "item.add"}:
                keys = {"op", "task_id", "value", "position"} if name == "item.add" else {"op", "value"}
            if name == "item.move":
                keys = {"op", "task_id", "item_id", "position", "claim"}
            require(set(operation) <= keys, "Unknown operation property")
            task_id = operation.get("task_id")
            if name == "report.update":
                update(report, operation, name)
            elif name == "task.add":
                value = operation.get("value")
                require(isinstance(value, dict), "value must be a task object", "value")
                require(value.get("kind") != "report_pointer", "Only ordinary tasks may be added", "value.kind")
                require(not any(t["id"] == value.get("id") for t in report["tasks"]), "Task ID already exists", "value.id")
                value = deepcopy(value)
                for key in ("pending_items", "completed_items"):
                    for item in value.get(key) if isinstance(value.get(key), list) else []:
                        if isinstance(item, dict):
                            require("activity" not in item, "activity is written by the CLI, not supplied", "value." + key)
                            stamp_new_item(item, actor, at)
                report["tasks"].insert(0 if value.get("status") == "done" else len(report["tasks"]), value)
                task_id = value.get("id")
            else:
                task = find_task(report, task_id)
                if name == "task.update":
                    previous_status = task.get("status")
                    update(task, operation, name)
                    if previous_status != "done" and task.get("status") == "done":
                        report["tasks"].remove(task)
                        report["tasks"].insert(0, task)
                elif name == "dev.update":
                    existing = next((t for t in (overlay or {}).get("tasks", []) if t["id"] == task_id), None)
                    target = existing if existing is not None else {"id": task_id}
                    update(target, operation, name)
                    if "next_step" in operation.get("set", {}) or "next_step" in operation.get("unset", []):
                        target.pop("next_steps", None)
                    if existing is None and len(target) > 1:
                        if overlay is None:
                            overlay = {"schema_version": report["schema_version"], "report_id": report["report_id"], "updated_at": report["updated_at"], "tasks": []}
                        overlay["tasks"].append(target)
                elif name == "item.add":
                    value = operation.get("value")
                    require(isinstance(value, dict) and isinstance(value.get("id"), str), "value must be an item with an ID", "value")
                    require(not any(isinstance(i, dict) and i.get("id") == value["id"] for key in ("pending_items", "completed_items") for i in task.get(key, [])), "Item ID already exists", "value.id")
                    require("activity" not in value, "activity is written by the CLI, not supplied", "value.activity")
                    value = deepcopy(value)
                    value.setdefault("status", "planned")
                    stamp_new_item(value, actor, at)
                    key = "completed_items" if value["status"] == "done" else "pending_items"
                    if "position" in operation:
                        require(key == "pending_items", "Completed items cannot specify a position", "position")
                        place_pending_item(task, value, operation["position"])
                    else:
                        insert_item(task, key, value)
                else:
                    item_id = operation.get("item_id")
                    require(isinstance(item_id, str), "item_id must be a stable ID; string items require migration", "item_id")
                    found = [(key, item) for key in ("completed_items", "pending_items") for item in task.get(key, []) if isinstance(item, dict) and item.get("id") == item_id]
                    require(len(found) == 1, "Item ID was not found; legacy string items require migration", "item_id")
                    previous, item = found[0]
                    check_claim(item, operation, actor, at)
                    before_item = without_activity(item)
                    if name == "item.move":
                        require(previous == "pending_items", "Only pending items can be moved", "item_id")
                        before_order = [i.get("id") if isinstance(i, dict) else i for i in task["pending_items"]]
                        place_pending_item(task, item, operation.get("position"), moving=True)
                        if before_order != [i.get("id") if isinstance(i, dict) else i for i in task["pending_items"]]:
                            append_activity(item, activity_entry("updated", actor, at))
                    else:
                        update(item, operation, name)
                        if without_activity(item) != before_item:
                            event = status_event(before_item.get("status"), item.get("status")) or "updated"
                            append_activity(item, activity_entry(event, actor, at))
                        effective = item.get("status", "done" if previous == "completed_items" else "planned")
                        destination = "completed_items" if effective == "done" else "pending_items"
                        if destination != previous:
                            task[previous].remove(item)
                            insert_item(task, destination, item)
            validate_documents(report, overlay)
            fields = set(operation.get("set", {})) | set(operation.get("unset", []))
            if "position" in operation:
                fields.add("position")
            summary = {"op": name, "task_id": task_id, "fields": sorted(fields)}
            if name.startswith("item."):
                summary["item_id"] = operation["value"]["id"] if name == "item.add" else operation["item_id"]
            summaries.append(summary)
        except (ValueError, TypeError, KeyError) as error:
            if not isinstance(error, ReportError):
                error = ReportError("invalid_operation", str(error), field=getattr(error, "field", "$"))
            error.operation_index = index
            raise error
    return report, overlay, summaries
