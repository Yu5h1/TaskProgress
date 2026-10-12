(function initializeTaskProgressEditorCoreRuntime(global) {
function createEditorCore({
  createEditorTransaction = global.TaskProgressEditorTransactionRuntime?.createEditorTransaction,
  calculateProjectProgress,
  calculateTaskProgress,
  validateReport,
}) {
if (
  typeof calculateProjectProgress !== "function"
  || typeof calculateTaskProgress !== "function"
  || typeof validateReport !== "function"
  || typeof createEditorTransaction !== "function"
) {
  throw new TypeError("Editor Core 需要 transaction、progress 與 validation 純函式。");
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

function insertTaskItem(task, field, item) {
  task[field] ??= [];
  if (field === "completed_items") task[field].unshift(item);
  else task[field].push(item);
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
    if (task.kind === "report_pointer") return;
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
  const transaction = createEditorTransaction(persistedReport, {
    normalize: (report) => normalizeEditableReport(report, fallbackPriority),
    derive: (draft, baseline) => deriveReportEditorState(baseline, draft),
    historyLimit,
  });

  function commandMergeKey(command) {
    if (command.type === "set-report-field") {
      return [command.type, command.field].join(":");
    }
    if (command.type === "set-task-field") {
      if (command.field === "status") return null;
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

  function dispatch(command) {
    if (!command || typeof command !== "object") {
      throw new TypeError("Editor command 必須是物件。");
    }
    return transaction.apply(command, reduce, commandMergeKey(command));
  }

  function reduce(draft, command) {
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
        const task = findTask(draft, command.taskId);
        const newlyCompleted = command.field === "status" && command.value === "done" && task.status !== "done";
        task[command.field] = command.value;
        if (newlyCompleted) {
          draft.tasks.splice(draft.tasks.indexOf(task), 1);
          draft.tasks.unshift(task);
        }
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
        if (task.status === "done") draft.tasks.unshift(task);
        else draft.tasks.push(task);
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
          insertTaskItem(task, toField, moved);
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
        insertTaskItem(task, command.toField, item);
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
        insertTaskItem(task, command.field, cloneValue(command.item));
        break;
      }
      default:
        throw new Error(`不支援的 Editor command「${command.type}」。`);
    }
    return draft;
  }

  function discard() {
    transaction.discard();
    return transaction.draft;
  }

  function commit(savedReport, { keepHistory = false } = {}) {
    transaction.commit(savedReport, { keepHistory });
    return transaction.draft;
  }

  function prepareSave(updatedAt) {
    const prepared = cloneValue(transaction.draft);
    prepared.updated_at = updatedAt;
    return prepared;
  }

  function createTaskId(prefix) {
    return nextStableId(prefix, new Set(transaction.draft.tasks.map((task) => task.id)));
  }

  function createItemId(taskId, prefix) {
    return nextStableId(prefix, allItemIds(findTask(transaction.draft, taskId)));
  }

  return Object.freeze({
    get draft() {
      return transaction.draft;
    },
    get derived() {
      return transaction.derived;
    },
    get dirty() {
      return transaction.dirty;
    },
    get history() {
      return transaction.history;
    },
    commit,
    createItemId,
    createTaskId,
    discard,
    dispatch,
    prepareSave,
    redo: transaction.redo,
    task(taskId) {
      return findTask(transaction.draft, taskId);
    },
    validate(report = transaction.draft) {
      return validateReport(report);
    },
    undo: transaction.undo,
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
