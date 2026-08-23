/*
 * Report-specific editor session for the shared persistence controller.
 *
 * Editor Core owns report mutations and history; the time-input draft owns
 * its private files. This adapter presents both as one atomic save payload
 * without deciding when to save. Timing, retries, modes, and failure state
 * remain the responsibility of `persistence-mode.js`.
 */
import {
  createReportEditorSession,
  normalizeMeaningfulText,
} from "./editor-core.js";

function clone(value) {
  return structuredClone(value);
}

function meaningfulTextErrors(report) {
  const errors = [];
  (report.tasks ?? []).forEach((task, taskIndex) => {
    for (const field of ["title", "summary"]) {
      if (!normalizeMeaningfulText(task[field])) {
        errors.push({
          code: "invalid_description",
          path: `tasks[${taskIndex}].${field}`,
          message: `${field === "title" ? "任務標題" : "任務描述"}至少需要一個文字或數字。`,
        });
      }
    }
    for (const itemField of ["completed_items", "pending_items"]) {
      (task[itemField] ?? []).forEach((item, itemIndex) => {
        if (!normalizeMeaningfulText(item?.title ?? item)) {
          errors.push({
            code: "invalid_description",
            path: `tasks[${taskIndex}].${itemField}[${itemIndex}].title`,
            message: "子項目描述至少需要一個文字或數字。",
          });
        }
      });
    }
  });
  return errors;
}

export function createReportEditorAdapter(
  report,
  {
    fallbackPriority = 4,
    historyLimit = 100,
    timeDraft = null,
    isExternalDirty = () => false,
    onCommit = () => {},
    onDiscard = () => {},
    now = () => new Date().toISOString(),
  } = {},
) {
  const session = createReportEditorSession(report, {
    fallbackPriority,
    historyLimit,
  });

  function snapshot() {
    return Object.freeze({
      report: clone(session.draft),
      derived: session.derived,
      dirty: Boolean(session.dirty || timeDraft?.snapshot().dirty || isExternalDirty()),
      history: session.history,
    });
  }

  function prepareSave(updatedAt = now()) {
    const report = session.prepareSave(updatedAt);
    const errors = [
      ...session.validate(report),
      ...meaningfulTextErrors(report),
    ];
    return Object.freeze({
      report: clone(report),
      inputs: clone(timeDraft?.replacements() ?? {}),
      changes: clone(timeDraft?.changes() ?? []),
      errors,
    });
  }

  return Object.freeze({
    snapshot,
    dispatch(command) {
      session.dispatch(command);
      return snapshot();
    },
    undo() {
      session.undo();
      return snapshot();
    },
    redo() {
      session.redo();
      return snapshot();
    },
    discard() {
      session.discard();
      timeDraft?.discard();
      onDiscard();
      return snapshot();
    },
    addPendingItem(taskId, title, priority) {
      const normalizedTitle = normalizeMeaningfulText(title);
      if (!normalizedTitle) {
        return Object.freeze({
          error: "描述至少需要一個文字或數字。",
          snapshot: snapshot(),
        });
      }
      const itemId = session.createItemId(taskId, `item-${taskId}-pending`);
      session.dispatch({
        type: "add-item",
        taskId,
        field: "pending_items",
        item: { id: itemId, title: normalizedTitle, priority },
      });
      return Object.freeze({ error: "", snapshot: snapshot() });
    },
    prepareSave,
    commit(saved) {
      const savedReport = saved?.report ?? saved;
      session.commit(savedReport, { keepHistory: true });
      timeDraft?.commit();
      saved?.externalSave?.commit?.();
      onCommit(saved);
      return snapshot();
    },
    createTaskId(prefix) {
      return session.createTaskId(prefix);
    },
    createItemId(taskId, prefix) {
      return session.createItemId(taskId, prefix);
    },
  });
}
