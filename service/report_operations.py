"""ID-addressed Report operations; candidates are isolated until the entire batch validates."""
from __future__ import annotations

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


def require(condition, message, field=None):
    if not condition:
        raise ReportError("invalid_operation", message, field=field)


def find_task(report, identity):
    require(isinstance(identity, str), "task_id must be a string", "task_id")
    task = next((t for t in report["tasks"] if t["id"] == identity), None)
    require(task is not None, "Task ID was not found", "task_id")
    require(task.get("kind") != "report_pointer", "Pointer tasks cannot be modified", "task_id")
    return task


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


def apply_operations(report, overlay, operations):
    require(isinstance(operations, list) and 0 < len(operations) <= 1000, "operations must contain 1–1000 entries", "operations")
    report, overlay = deepcopy(report), deepcopy(overlay)
    summaries = []
    for index, operation in enumerate(operations):
        try:
            require(isinstance(operation, dict), "Operation must be an object")
            name = operation.get("op")
            require(isinstance(name, str) and name in {*FIELDS, "task.add", "item.add"}, "Unknown operation", "op")
            keys = {"op", "set", "unset"}
            if name != "report.update":
                keys.add("task_id")
            if name == "item.update":
                keys.add("item_id")
            if name in {"task.add", "item.add"}:
                keys = {"op", "task_id", "value"} if name == "item.add" else {"op", "value"}
            require(set(operation) <= keys, "Unknown operation property")
            task_id = operation.get("task_id")
            if name == "report.update":
                update(report, operation, name)
            elif name == "task.add":
                value = operation.get("value")
                require(isinstance(value, dict), "value must be a task object", "value")
                require(value.get("kind") != "report_pointer", "Only ordinary tasks may be added", "value.kind")
                require(not any(t["id"] == value.get("id") for t in report["tasks"]), "Task ID already exists", "value.id")
                report["tasks"].append(deepcopy(value))
                task_id = value.get("id")
            else:
                task = find_task(report, task_id)
                if name == "task.update":
                    update(task, operation, name)
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
                    value = deepcopy(value)
                    value.setdefault("status", "planned")
                    key = "completed_items" if value["status"] == "done" else "pending_items"
                    task.setdefault(key, []).append(value)
                else:
                    item_id = operation.get("item_id")
                    require(isinstance(item_id, str), "item_id must be a stable ID; string items require migration", "item_id")
                    found = [(key, item) for key in ("completed_items", "pending_items") for item in task.get(key, []) if isinstance(item, dict) and item.get("id") == item_id]
                    require(len(found) == 1, "Item ID was not found; legacy string items require migration", "item_id")
                    previous, item = found[0]
                    update(item, operation, name)
                    effective = item.get("status", "done" if previous == "completed_items" else "planned")
                    destination = "completed_items" if effective == "done" else "pending_items"
                    if destination != previous:
                        task[previous].remove(item)
                        task.setdefault(destination, []).append(item)
            validate_documents(report, overlay)
            summaries.append({"op": name, "task_id": task_id, "fields": sorted(set(operation.get("set", {})) | set(operation.get("unset", [])))})
        except (ValueError, TypeError, KeyError) as error:
            if not isinstance(error, ReportError):
                error = ReportError("invalid_operation", str(error), field=getattr(error, "field", "$"))
            error.operation_index = index
            raise error
    return report, overlay, summaries
