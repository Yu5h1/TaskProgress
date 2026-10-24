"""ID-addressed Report operations; candidates are isolated until the entire batch validates."""
from __future__ import annotations

import json
import os
import re
from copy import deepcopy
from pathlib import Path

from .report_store import validate_documents


class ReportError(ValueError):
    def __init__(self, code, message, exit_code=2, operation_index=None, field=None):
        super().__init__(message)
        self.code, self.exit_code = code, exit_code
        self.operation_index, self.field = operation_index, field


FIELDS = {
    "report.update": ({"title", "summary"}, {"summary"}),
    "task.update": ({"title", "summary", "status", "priority", "progress", "document_ref"}, {"priority", "progress", "document_ref"}),
    "item.update": ({"title", "status", "priority", "waits_for"}, {"priority", "waits_for"}),
    "dev.update": ({"next_step", "blockers", "decisions", "routes"}, {"next_step", "blockers", "decisions", "routes"}),
}


ACTIVITY_RECENT_LIMIT = 3
PERMANENT_EVENTS = {"started", "takeover"}
LATEST_EVENTS = {"released", "disputed"}
ITEM_EVENTS = LATEST_EVENTS
ACTOR_PATTERN = re.compile(r"^[a-z][a-z0-9-]{0,31}$")
CLAIMS = {"own", "takeover", "recover"}
WAIT_DEPTH_LIMIT = 50


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
    """Keeps the first created entry and every start or takeover, the latest release and dispute,
    and only the most recent other entries; the executor record must never be pushed out."""
    entries = [*item.get("activity", []), entry]
    created = next((i for i, e in enumerate(entries) if e["event"] == "created"), None)
    latest = {e["event"]: i for i, e in enumerate(entries) if e["event"] in LATEST_EVENTS}
    others = [i for i, e in enumerate(entries)
              if e["event"] not in PERMANENT_EVENTS | LATEST_EVENTS | {"created"}][-ACTIVITY_RECENT_LIMIT:]
    keep = {i for i, e in enumerate(entries) if e["event"] in PERMANENT_EVENTS}
    keep |= set(latest.values()) | set(others) | ({created} if created is not None else set())
    item["activity"] = [e for i, e in enumerate(entries) if i in keep]


def activity_entry(event, actor, at, note=None):
    entry = {"event": event, "actor": actor["actor"], "at": at}
    for key in ("session", "session_id"):
        if actor.get(key):
            entry[key] = actor[key]
    if note:
        entry["note"] = note
    return entry


def scope_registry():
    """Registered scope folders, from the same scopes.json the CLI writes."""
    home = os.environ.get("TASK_PROGRESS_HOME") or os.path.join(os.environ.get("LOCALAPPDATA", ""), "TaskProgress")
    path = Path(home) / "scopes.json"
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}
    scopes = data.get("scopes", data) if isinstance(data, dict) else {}
    return {key: value for key, value in scopes.items() if isinstance(key, str) and isinstance(value, str)}


def find_item(report, task_id, item_id):
    task = next((t for t in report.get("tasks", []) if t.get("id") == task_id), None)
    if task is None:
        return None
    return next((i for key in ("pending_items", "completed_items") for i in task.get(key, [])
                 if isinstance(i, dict) and i.get("id") == item_id), None)


CHECKLIST_WORK_ITEM = re.compile(r"^- \[[ x!]\] \*\*(\d+)\.", re.MULTILINE)
DOCUMENT_STEM = re.compile(r"^[A-Za-z0-9._-]+$")


def check_card_document(report, task, folder=None):
    """A card binds only its own experience record: experience/<task>.md in the card's own scope, which must exist."""
    reference = task.get("document_ref")
    if reference is None:
        return
    require(isinstance(reference, dict) and set(reference) == {"kind", "scope_id", "task"},
            "A card document_ref needs kind, scope_id and task", "document_ref")
    require(reference["kind"] == "experience", "A card binds only an experience document", "document_ref.kind")
    require(reference["scope_id"] == report["scope_id"], "A card's experience document lives in its own scope", "document_ref.scope_id")
    require(isinstance(reference["task"], str) and bool(DOCUMENT_STEM.match(reference["task"])),
            "document_ref.task must be a file stem", "document_ref.task")
    if folder is not None:
        path = Path(folder) / "experience" / (reference["task"] + ".md")
        require(path.is_file(), "Experience document was not found: experience/" + reference["task"] + ".md", "document_ref.task")


def check_waits(report, task_id, item, folder=None):
    """Rejects waits on items or checklist work items that cannot be found and any wait that closes a loop."""
    waits = item.get("waits_for")
    if waits is None:
        return
    require(isinstance(waits, list) and 0 < len(waits) <= 20, "waits_for must list 1–20 items", "waits_for")
    own_scope = report["scope_id"]
    registry, loaded = scope_registry(), {own_scope: report}

    def load(scope):
        if scope not in loaded:
            folder = registry.get(scope)
            require(folder is not None, "waits_for scope is not registered: " + scope, "waits_for")
            try:
                loaded[scope] = json.loads((Path(folder) / "report.json").read_text(encoding="utf-8"))
            except (OSError, ValueError) as error:
                raise ReportError("invalid_operation", "Cannot read the report of scope " + scope + ": " + str(error),
                                  field="waits_for") from error
        return loaded[scope]

    def folder_of(scope):
        found = folder if scope == own_scope and folder is not None else registry.get(scope)
        require(found is not None, "waits_for scope is not registered: " + scope, "waits_for")
        return Path(found)

    start = (own_scope, task_id, item["id"])
    seen, seen_checks = set(), set()
    for wait in waits:
        if isinstance(wait, dict) and "checklist" in wait:
            require(set(wait) == {"scope_id", "checklist", "work_item"}
                    and isinstance(wait["scope_id"], str) and wait["scope_id"]
                    and isinstance(wait["checklist"], str) and re.fullmatch(r"[A-Za-z0-9._-]+", wait["checklist"])
                    and isinstance(wait["work_item"], int) and not isinstance(wait["work_item"], bool) and wait["work_item"] > 0,
                    "A checklist waits_for entry needs scope_id, checklist and a positive work_item", "waits_for")
            check = (wait["scope_id"], wait["checklist"], wait["work_item"])
            require(check not in seen_checks, "Duplicate waits_for entry", "waits_for")
            seen_checks.add(check)
            path = folder_of(check[0]) / "checklists" / (check[1] + ".checklist")
            try:
                numbers = {int(n) for n in CHECKLIST_WORK_ITEM.findall(path.read_text(encoding="utf-8"))}
            except OSError:
                numbers = None
            require(numbers is not None, "waits_for checklist was not found: " + check[0] + "/" + check[1], "waits_for")
            require(check[2] in numbers, "waits_for work item was not found: " + "/".join(map(str, check)), "waits_for")
            continue
        require(isinstance(wait, dict) and {"scope_id", "task_id", "item_id"} <= set(wait) <= {"scope_id", "task_id", "item_id", "strict"}
                and all(isinstance(wait[k], str) and wait[k] for k in ("scope_id", "task_id", "item_id"))
                and wait.get("strict", True) is True,
                "Each waits_for entry needs scope_id, task_id and item_id, and strict may only be true", "waits_for")
        key = (wait["scope_id"], wait["task_id"], wait["item_id"])
        require(key != start, "An item cannot wait for itself", "waits_for")
        require(key not in seen, "Duplicate waits_for entry", "waits_for")
        seen.add(key)
        require(find_item(load(key[0]), key[1], key[2]) is not None,
                "waits_for item was not found: " + "/".join(key), "waits_for")

    stack, visited = [(key, 1) for key in seen], set()
    while stack:
        key, depth = stack.pop()
        require(key != start, "waits_for would form a loop back to this item", "waits_for")
        if key in visited or depth > WAIT_DEPTH_LIMIT:
            continue
        visited.add(key)
        target = find_item(load(key[0]), key[1], key[2]) if key[0] in registry or key[0] == own_scope else None
        for wait in (target or {}).get("waits_for", []) if isinstance(target, dict) else []:
            if isinstance(wait, dict) and {"scope_id", "task_id", "item_id"} <= set(wait):
                stack.append(((wait["scope_id"], wait["task_id"], wait["item_id"]), depth + 1))


NEXT_OPERATIONS = {"next.set": {"op", "task_id", "item_id"}, "next.clear": {"op"}}


def apply_next(report, operation, name, actor, at):
    """The scope's one Next marker: set points it at an unfinished object item, clear removes it."""
    require(set(operation) <= NEXT_OPERATIONS[name], "Unknown operation property")
    if name == "next.clear":
        report.pop("next", None)
        return {"op": name, "task_id": None, "fields": ["next"]}
    task = find_task(report, operation.get("task_id"))
    item_id = operation.get("item_id")
    require(isinstance(item_id, str), "item_id must be a stable ID; string items require migration", "item_id")
    item = next((i for i in task.get("pending_items", []) if isinstance(i, dict) and i.get("id") == item_id), None)
    require(item is not None, "Next must point at an unfinished object item of that task", "item_id")
    marker = {"task_id": task["id"], "item_id": item_id}
    if report.get("next") != marker:
        report["next"] = marker
        append_activity(item, activity_entry("updated", actor, at))
    return {"op": name, "task_id": task["id"], "item_id": item_id, "fields": ["next"]}


def status_event(previous_status, status):
    if status != previous_status and status in ("in_progress", "done"):
        return "started" if status == "in_progress" else "done"
    return None


def claim_relation(item, actor):
    """None when the writer may proceed; otherwise conflict (someone else) or unverified (cannot tell)."""
    if item.get("status") != "in_progress":
        return None, None
    activity = item.get("activity", [])
    index = next((i for i in range(len(activity) - 1, -1, -1) if activity[i]["event"] in ("started", "takeover")), None)
    if index is None or any(e["event"] == "released" for e in activity[index + 1:]):
        return None, None
    claimant = activity[index]
    mine, theirs = actor.get("session_id"), claimant.get("session_id")
    if claimant["actor"] == actor["actor"] and mine and theirs and mine == theirs:
        return None, claimant
    if claimant["actor"] != actor["actor"] or (mine and theirs):
        return "conflict", claimant
    return "unverified", claimant


def claimant_label(claimant):
    label = claimant.get("session") or claimant.get("session_id")
    return claimant["actor"] + (" (" + label + ")" if label else "")


def check_release(item, operation, actor):
    """A release frees only the writer's own claim, unless the user confirmed a recovery of another session's."""
    relation, claimant = claim_relation(item, actor)
    claim = operation.get("claim")
    require(claim is None or claim in ("own", "recover"), "A release takes claim own or recover", "claim")
    if relation is None:
        return
    who = claimant_label(claimant)
    if relation == "conflict" and claim != "recover":
        raise ReportError("claim_conflict", "Item is claimed by " + who + " since " + claimant["at"]
                          + "; release only your own claim. If that session ended after committing its work, "
                          "ask the user, then retry with claim: recover", field="claim")
    if relation == "unverified" and claim is None:
        raise ReportError("claim_unverified", "Item is claimed by " + who + " since " + claimant["at"]
                          + " and the session ID cannot be compared; retry with claim: own if you started it, "
                          "otherwise ask the user and retry with claim: recover", field="claim")


def check_claim(item, operation, actor, at):
    relation, claimant = claim_relation(item, actor)
    claim = operation.get("claim")
    require(claim is None or claim in CLAIMS, "claim must be own or takeover", "claim")
    require(claim != "recover", "claim recover only applies to a released event", "claim")
    if relation is None:
        return
    who = claimant_label(claimant)
    if relation == "conflict" and claim != "takeover":
        raise ReportError("claim_conflict", "Item is in progress by " + who + " since " + claimant["at"]
                          + "; ask the user, then retry with claim: takeover", field="claim")
    if relation == "unverified" and claim not in CLAIMS:
        raise ReportError("claim_unverified", "Item is in progress by " + who + " since " + claimant["at"]
                          + " and the session ID cannot be compared; retry with claim: own if you started it, "
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


def apply_operations(report, overlay, operations, actor=None, at=None, folder=None):
    require(isinstance(actor, dict) and isinstance(actor.get("actor"), str) and bool(ACTOR_PATTERN.match(actor["actor"])),
            "actor is required: the writing tool in lowercase, such as claude, codex or antigravity", "actor")
    for key in ("session", "session_id"):
        require(actor.get(key) is None or (isinstance(actor[key], str) and 0 < len(actor[key]) <= 100),
                key + " must be a non-empty string of at most 100 characters", key)
    require(isinstance(at, str), "Activity time is required", "at")
    require(isinstance(operations, list) and 0 < len(operations) <= 1000, "operations must contain 1–1000 entries", "operations")
    report, overlay = deepcopy(report), deepcopy(overlay)
    summaries = []
    for index, operation in enumerate(operations):
        try:
            require(isinstance(operation, dict), "Operation must be an object")
            name = operation.get("op")
            require(isinstance(name, str) and name in {*FIELDS, "task.add", "item.add", "item.move", "item.event", *NEXT_OPERATIONS},
                    "Unknown operation", "op")
            if name in NEXT_OPERATIONS:
                summaries.append(apply_next(report, operation, name, actor, at))
                validate_documents(report, overlay)
                continue
            keys = {"op", "set", "unset"}
            if name != "report.update":
                keys.add("task_id")
            if name == "item.update":
                keys |= {"item_id", "claim"}
            if name in {"task.add", "item.add"}:
                keys = {"op", "task_id", "value", "position"} if name == "item.add" else {"op", "value"}
            if name == "item.move":
                keys = {"op", "task_id", "item_id", "position", "claim"}
            if name == "item.event":
                keys = {"op", "task_id", "item_id", "event", "note", "claim"}
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
                check_card_document(report, value, folder)
                report["tasks"].insert(0 if value.get("status") == "done" else len(report["tasks"]), value)
                task_id = value.get("id")
            else:
                task = find_task(report, task_id)
                if name == "task.update":
                    previous_status = task.get("status")
                    update(task, operation, name)
                    check_card_document(report, task, folder)
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
                    check_waits(report, task_id, value, folder)
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
                    if name == "item.event":
                        event, note = operation.get("event"), operation.get("note")
                        require(event in ITEM_EVENTS, "event must be released or disputed", "event")
                        require(note is None or (isinstance(note, str) and 0 < len(note.strip()) <= 300),
                                "note must be a non-empty string of at most 300 characters", "note")
                        require(event != "disputed" or note is not None, "A dispute needs a note with the reason", "note")
                        if event == "released":
                            check_release(item, operation, actor)
                        else:
                            require("claim" not in operation, "Only a released event takes claim", "claim")
                        append_activity(item, activity_entry(event, actor, at, note.strip() if note else None))
                        if event == "released" and item.get("status") == "in_progress":
                            item["status"] = "planned"
                        validate_documents(report, overlay)
                        summaries.append({"op": name, "task_id": task_id, "fields": ["activity"], "item_id": item_id})
                        continue
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
                        if "waits_for" in operation.get("set", {}):
                            check_waits(report, task_id, item, folder)
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
