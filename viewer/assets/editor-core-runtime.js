(function initializeTaskProgressEditorCoreRuntime(global) {
function createEditorCore({
  calculateProjectProgress,
  calculateTaskProgress,
  validateReport,
}) {
if (
  typeof calculateProjectProgress !== "function"
  || typeof calculateTaskProgress !== "function"
  || typeof validateReport !== "function"
) {
  throw new TypeError("Editor Core 需要 progress 與 validation 純函式。");
}

const ITEM_FIELDS = Object.freeze(["completed_items", "pending_items"]);
const REPORT_FIELDS = new Set(["summary"]);
const TASK_FIELDS = new Set(["title", "summary", "status", "priority"]);
const ITEM_PROPERTIES = new Set(["title", "priority", "status"]);
const ITEM_STATUSES = new Set(["planned", "in_progress", "blocked", "done", "archive"]);

/*
 * The array an item belongs in is a projection of its status, not a second
 * place to record it: `done` lives in `completed_items`, everything else in
 * `pending_items`.
 */
function fieldForItemStatus(status) {
  return status === "done" ? "completed_items" : "pending_items";
}

function cloneValue(value) {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function normalizeMeaningfulText(value) {
  const normalized = String(value ?? "").trim().replace(/\s+/g, " ");
  return /[\p{L}\p{N}]/u.test(normalized) ? normalized : "";
}

function nextStableId(prefix, existingIds) {
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

function normalizeEditableReport(report, fallbackPriority = 4) {
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

function itemLocations(task) {
  const locations = new Map();
  ITEM_FIELDS.forEach((field) => {
    (task?.[field] ?? []).forEach((item) => {
      if (item && typeof item === "object" && !Array.isArray(item)) {
        locations.set(item.id, { field, item });
      }
    });
  });
  return locations;
}

function diffEditableReports(baselineReport, draftReport) {
  const baselineTasks = new Map(
    (baselineReport.tasks ?? []).map((task) => [task.id, task]),
  );
  const draftTasks = new Map(
    (draftReport.tasks ?? []).map((task) => [task.id, task]),
  );
  const taskIds = new Set([...baselineTasks.keys(), ...draftTasks.keys()]);
  const changes = [];
  const timeAffectedTaskIds = new Set();
  const timeAffectedItemIds = new Set();

  // A report-level field describes the report, not its work, so it makes the
  // draft dirty without invalidating any time data.
  const changedReportFields = [...REPORT_FIELDS].filter(
    (field) => reportSignature(baselineReport[field]) !== reportSignature(draftReport[field]),
  );
  if (changedReportFields.length) {
    changes.push({ kind: "report-updated", fields: changedReportFields });
  }

  taskIds.forEach((taskId) => {
    const baselineTask = baselineTasks.get(taskId);
    const draftTask = draftTasks.get(taskId);
    if (!baselineTask || !draftTask) {
      const task = draftTask ?? baselineTask;
      changes.push({
        kind: baselineTask ? "task-deleted" : "task-added",
        taskId,
      });
      timeAffectedTaskIds.add(taskId);
      itemLocations(task).forEach((_location, itemId) => {
        timeAffectedItemIds.add(itemId);
      });
      return;
    }

    const changedFields = [...TASK_FIELDS].filter(
      (field) => reportSignature(baselineTask[field]) !== reportSignature(draftTask[field]),
    );
    if (
      reportSignature(baselineTask.progress)
      !== reportSignature(draftTask.progress)
    ) {
      changedFields.push("progress");
    }
    if (changedFields.length) {
      changes.push({ kind: "task-updated", taskId, fields: changedFields });
      if (changedFields.some((field) => ["status", "progress"].includes(field))) {
        timeAffectedTaskIds.add(taskId);
      }
    }

    const baselineItems = itemLocations(baselineTask);
    const draftItems = itemLocations(draftTask);
    const itemIds = new Set([...baselineItems.keys(), ...draftItems.keys()]);
    itemIds.forEach((itemId) => {
      const baselineLocation = baselineItems.get(itemId);
      const draftLocation = draftItems.get(itemId);
      if (!baselineLocation || !draftLocation) {
        changes.push({
          kind: baselineLocation ? "item-deleted" : "item-added",
          taskId,
          itemId,
          field: (draftLocation ?? baselineLocation).field,
        });
        timeAffectedTaskIds.add(taskId);
        timeAffectedItemIds.add(itemId);
        return;
      }
      if (baselineLocation.field !== draftLocation.field) {
        changes.push({
          kind: "item-state-changed",
          taskId,
          itemId,
          from: baselineLocation.field,
          to: draftLocation.field,
        });
        timeAffectedTaskIds.add(taskId);
        timeAffectedItemIds.add(itemId);
      }
      const changedItemFields = [...ITEM_PROPERTIES].filter(
        (field) => (
          reportSignature(baselineLocation.item[field])
          !== reportSignature(draftLocation.item[field])
        ),
      );
      if (changedItemFields.length) {
        changes.push({
          kind: "item-updated",
          taskId,
          itemId,
          fields: changedItemFields,
        });
      }
    });
  });

  return Object.freeze({
    changes,
    dirty: reportSignature(baselineReport) !== reportSignature(draftReport),
    timeInvalidation: Object.freeze({
      stale: timeAffectedTaskIds.size > 0,
      taskIds: [...timeAffectedTaskIds],
      itemIds: [...timeAffectedItemIds],
    }),
  });
}

function deriveReportEditorState(baselineReport, draftReport) {
  const diff = diffEditableReports(baselineReport, draftReport);
  return Object.freeze({
    diff,
    dirty: diff.dirty,
    progress: Object.freeze({
      project: calculateProjectProgress(draftReport.tasks ?? []),
      tasks: Object.fromEntries(
        (draftReport.tasks ?? []).map((task) => [
          task.id,
          calculateTaskProgress(task),
        ]),
      ),
    }),
    timeInvalidation: diff.timeInvalidation,
    validation: validateReport(draftReport),
  });
}

function createReportEditorSession(
  persistedReport,
  { fallbackPriority = 4, historyLimit = 100 } = {},
) {
  let persisted = cloneValue(persistedReport);
  let draft = normalizeEditableReport(persisted, fallbackPriority);
  let baseline = cloneValue(draft);
  let derived = deriveReportEditorState(baseline, draft);
  const undoStack = [];
  const redoStack = [];
  const stableHistoryLimit = Number.isInteger(historyLimit) && historyLimit > 0
    ? historyLimit
    : 100;

  function commandMergeKey(command) {
    if (command.type === "set-report-field") {
      return [command.type, command.field].join(":");
    }
    if (command.type === "set-task-field") {
      return [command.type, command.taskId, command.field].join(":");
    }
    if (command.type === "set-item-field") {
      return [
        command.type,
        command.taskId,
        command.field,
        command.itemId,
        command.property,
      ].join(":");
    }
    return "";
  }

  function historyState() {
    const undoEntry = undoStack.at(-1) ?? null;
    const redoEntry = redoStack.at(-1) ?? null;
    return Object.freeze({
      canUndo: Boolean(undoEntry),
      canRedo: Boolean(redoEntry),
      undoDepth: undoStack.length,
      redoDepth: redoStack.length,
      undoCommandType: undoEntry?.command.type ?? null,
      redoCommandType: redoEntry?.command.type ?? null,
    });
  }

  function clearHistory() {
    undoStack.length = 0;
    redoStack.length = 0;
  }

  function recordHistory(beforeDraft, command) {
    const afterDraft = cloneValue(draft);
    const mergeKey = commandMergeKey(command);
    const previous = undoStack.at(-1);
    if (mergeKey && previous?.mergeKey === mergeKey) {
      previous.after = afterDraft;
      previous.command = cloneValue(command);
      if (reportSignature(previous.before) === reportSignature(previous.after)) {
        undoStack.pop();
      }
    } else {
      undoStack.push({
        before: beforeDraft,
        after: afterDraft,
        command: cloneValue(command),
        mergeKey,
      });
      if (undoStack.length > stableHistoryLimit) undoStack.shift();
    }
    redoStack.length = 0;
  }

  function dispatch(command) {
    if (!command || typeof command !== "object") {
      throw new TypeError("Editor command 必須是物件。");
    }
    const beforeDraft = cloneValue(draft);
    const before = reportSignature(beforeDraft);
    switch (command.type) {
      /*
       * Unwritten is a legal state for a report-level field, and the report
       * shows its generated line again when it is. Clearing one therefore
       * removes the field rather than saving an empty string, which the
       * schema would reject anyway.
       */
      case "set-report-field": {
        if (!REPORT_FIELDS.has(command.field)) {
          throw new Error(`不支援的報告欄位「${command.field}」。`);
        }
        const value = typeof command.value === "string" ? command.value : "";
        if (value.trim()) draft[command.field] = value;
        else delete draft[command.field];
        break;
      }
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
      /*
       * Setting a status can also require relocating the item, and the two
       * have to happen together: a draft where the status says `done` while
       * the item still sits in `pending_items` is exactly the contradiction
       * validation rejects, and issuing two commands would make it reachable
       * between them — and undoable as two separate steps.
       */
      case "set-item-status": {
        if (!ITEM_STATUSES.has(command.status)) {
          throw new Error(`不支援的子項目狀態「${command.status}」。`);
        }
        const task = findTask(draft, command.taskId);
        const item = findItem(task, command.field, command.itemId);
        item.status = command.status;
        const toField = fieldForItemStatus(command.status);
        if (toField !== command.field) {
          const source = task[command.field] ?? [];
          const sourceIndex = source.findIndex((candidate) => candidate?.id === command.itemId);
          if (sourceIndex < 0) throw new Error(`找不到子項目「${command.itemId}」。`);
          task[toField] ??= [];
          const [moved] = source.splice(sourceIndex, 1);
          task[toField].push(moved);
        }
        break;
      }
      case "move-item": {
        if (!ITEM_FIELDS.includes(command.fromField) || !ITEM_FIELDS.includes(command.toField)) {
          throw new Error("子項目只能在待處理與已完成清單間移動。");
        }
        if (command.fromField === command.toField) break;
        const task = findTask(draft, command.taskId);
        const source = task[command.fromField] ?? [];
        const sourceIndex = source.findIndex((item) => (
          item
          && typeof item === "object"
          && !Array.isArray(item)
          && item.id === command.itemId
        ));
        if (sourceIndex < 0) throw new Error(`找不到子項目「${command.itemId}」。`);
        task[command.toField] ??= [];
        if (task[command.toField].some((item) => item?.id === command.itemId)) {
          throw new Error(`子項目 ID「${command.itemId}」已存在於目標清單。`);
        }
        const [item] = source.splice(sourceIndex, 1);
        task[command.toField].push(item);
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
    const changed = before !== reportSignature(draft);
    if (changed) {
      recordHistory(beforeDraft, command);
      derived = deriveReportEditorState(baseline, draft);
    }
    return changed;
  }

  function undo() {
    const entry = undoStack.pop();
    if (!entry) return false;
    redoStack.push(entry);
    draft = cloneValue(entry.before);
    derived = deriveReportEditorState(baseline, draft);
    return true;
  }

  function redo() {
    const entry = redoStack.pop();
    if (!entry) return false;
    undoStack.push(entry);
    draft = cloneValue(entry.after);
    derived = deriveReportEditorState(baseline, draft);
    return true;
  }

  function discard() {
    draft = normalizeEditableReport(persisted, fallbackPriority);
    baseline = cloneValue(draft);
    clearHistory();
    derived = deriveReportEditorState(baseline, draft);
    return draft;
  }

  function commit(savedReport, { keepHistory = false } = {}) {
    persisted = cloneValue(savedReport);
    if (keepHistory) {
      draft = normalizeEditableReport(persisted, fallbackPriority);
      baseline = cloneValue(draft);
      derived = deriveReportEditorState(baseline, draft);
      return draft;
    }
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
    get derived() {
      return derived;
    },
    get dirty() {
      return derived.dirty;
    },
    get history() {
      return historyState();
    },
    commit,
    createItemId,
    createTaskId,
    discard,
    dispatch,
    prepareSave,
    redo,
    task(taskId) {
      return findTask(draft, taskId);
    },
    validate(report = draft) {
      return validateReport(report);
    },
    undo,
  });
}

return Object.freeze({
  createReportEditorSession,
  deriveReportEditorState,
  diffEditableReports,
  nextStableId,
  normalizeEditableReport,
  normalizeMeaningfulText,
});
}

global.TaskProgressEditorCoreRuntime = Object.freeze({ createEditorCore });
})(globalThis);
