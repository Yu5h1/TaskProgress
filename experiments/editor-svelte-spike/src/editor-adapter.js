import {
  createReportEditorSession,
  normalizeMeaningfulText,
} from "../../../viewer/assets/editor-core.js";

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

export function createSvelteEditorAdapter(
  report,
  { fallbackPriority = 4, historyLimit = 100 } = {},
) {
  const session = createReportEditorSession(report, {
    fallbackPriority,
    historyLimit,
  });

  function snapshot() {
    return Object.freeze({
      report: clone(session.draft),
      derived: session.derived,
      dirty: session.dirty,
      history: session.history,
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
    save(updatedAt) {
      const prepared = session.prepareSave(updatedAt);
      const errors = [
        ...session.validate(prepared),
        ...meaningfulTextErrors(prepared),
      ];
      if (errors.length) {
        return Object.freeze({ errors, snapshot: snapshot() });
      }
      session.commit(prepared);
      return Object.freeze({ errors: [], snapshot: snapshot() });
    },
  });
}
