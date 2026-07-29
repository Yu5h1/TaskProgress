const ITEM_FIELDS = Object.freeze(["completed_items", "pending_items"]);
const TASK_FIELDS = new Set(["title", "summary", "status", "priority"]);
const ITEM_PROPERTIES = new Set(["title", "priority"]);

function cloneValue(value) {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

export function normalizeMeaningfulText(value) {
  const normalized = String(value ?? "").trim().replace(/\s+/g, " ");
  return /[\p{L}\p{N}]/u.test(normalized) ? normalized : "";
}

export function nextStableId(prefix, existingIds) {
  let index = 1;
  let candidate = prefix;
  while (existingIds.has(candidate)) {
    candidate = `${prefix}-${index}`;
    index += 1;
  }
  return candidate;
}

function allItemIds(task) {
  return new Set(
    ITEM_FIELDS.flatMap((field) => task[field] ?? [])
      .filter((item) => item && typeof item === "object" && !Array.isArray(item))
      .map((item) => item.id),
  );
}

export function normalizeEditableReport(report, fallbackPriority = 4) {
  const normalized = cloneValue(report);
  normalized.tasks.forEach((task) => {
    const existingIds = allItemIds(task);
    ITEM_FIELDS.forEach((field) => {
      task[field] = (task[field] ?? []).map((item, index) => {
        if (item && typeof item === "object" && !Array.isArray(item)) return item;
        const kind = field === "completed_items" ? "done" : "todo";
        const id = nextStableId(`item-${task.id}-${kind}-${index + 1}`, existingIds);
        existingIds.add(id);
        return {
          id,
          title: String(item),
          priority: fallbackPriority,
        };
      });
    });
  });
  return normalized;
}

function findTask(report, taskId) {
  const task = report.tasks.find((candidate) => candidate.id === taskId);
  if (!task) throw new Error(`找不到任務「${taskId}」。`);
  return task;
}

function findItem(task, field, itemId) {
  if (!ITEM_FIELDS.includes(field)) {
    throw new Error(`不支援的子項目欄位「${field}」。`);
  }
  const items = task[field] ?? [];
  const item = items.find((candidate) => (
    candidate
    && typeof candidate === "object"
    && !Array.isArray(candidate)
    && candidate.id === itemId
  ));
  if (!item) throw new Error(`找不到子項目「${itemId}」。`);
  return item;
}

function reportSignature(report) {
  return JSON.stringify(report);
}

export function createReportEditorSession(
  persistedReport,
  { fallbackPriority = 4 } = {},
) {
  let persisted = cloneValue(persistedReport);
  let draft = normalizeEditableReport(persisted, fallbackPriority);
  let baselineSignature = reportSignature(draft);

  function dispatch(command) {
    if (!command || typeof command !== "object") {
      throw new TypeError("Editor command 必須是物件。");
    }
    const before = reportSignature(draft);
    switch (command.type) {
      case "set-task-field": {
        if (!TASK_FIELDS.has(command.field)) {
          throw new Error(`不支援的任務欄位「${command.field}」。`);
        }
        findTask(draft, command.taskId)[command.field] = command.value;
        break;
      }
      case "delete-task": {
        const index = draft.tasks.findIndex((task) => task.id === command.taskId);
        if (index < 0) throw new Error(`找不到任務「${command.taskId}」。`);
        draft.tasks.splice(index, 1);
        break;
      }
      case "add-task": {
        if (draft.tasks.some((task) => task.id === command.task?.id)) {
          throw new Error(`任務 ID「${command.task.id}」已存在。`);
        }
        const task = cloneValue(command.task);
        task.completed_items ??= [];
        task.pending_items ??= [];
        draft.tasks.push(task);
        break;
      }
      case "set-item-field": {
        if (!ITEM_PROPERTIES.has(command.property)) {
          throw new Error(`不支援的子項目欄位「${command.property}」。`);
        }
        const task = findTask(draft, command.taskId);
        findItem(task, command.field, command.itemId)[command.property] = command.value;
        break;
      }
      case "delete-item": {
        const task = findTask(draft, command.taskId);
        const items = task[command.field] ?? [];
        const index = items.findIndex((item) => (
          item
          && typeof item === "object"
          && !Array.isArray(item)
          && item.id === command.itemId
        ));
        if (index < 0) throw new Error(`找不到子項目「${command.itemId}」。`);
        items.splice(index, 1);
        break;
      }
      case "add-item": {
        const task = findTask(draft, command.taskId);
        if (!ITEM_FIELDS.includes(command.field)) {
          throw new Error(`不支援的子項目欄位「${command.field}」。`);
        }
        if (allItemIds(task).has(command.item?.id)) {
          throw new Error(`子項目 ID「${command.item.id}」已存在。`);
        }
        task[command.field] ??= [];
        task[command.field].push(cloneValue(command.item));
        break;
      }
      default:
        throw new Error(`不支援的 Editor command「${command.type}」。`);
    }
    return before !== reportSignature(draft);
  }

  function discard() {
    draft = normalizeEditableReport(persisted, fallbackPriority);
    baselineSignature = reportSignature(draft);
    return draft;
  }

  function commit(savedReport) {
    persisted = cloneValue(savedReport);
    return discard();
  }

  function prepareSave(updatedAt) {
    const prepared = cloneValue(draft);
    prepared.updated_at = updatedAt;
    return prepared;
  }

  function createTaskId(prefix) {
    return nextStableId(prefix, new Set(draft.tasks.map((task) => task.id)));
  }

  function createItemId(taskId, prefix) {
    return nextStableId(prefix, allItemIds(findTask(draft, taskId)));
  }

  return Object.freeze({
    get draft() {
      return draft;
    },
    get dirty() {
      return reportSignature(draft) !== baselineSignature;
    },
    commit,
    createItemId,
    createTaskId,
    discard,
    dispatch,
    prepareSave,
    task(taskId) {
      return findTask(draft, taskId);
    },
  });
}
