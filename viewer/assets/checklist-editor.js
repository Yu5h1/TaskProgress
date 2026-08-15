import { createEditorTransaction } from "./editor-transaction.js";

function findCheck(document, workItemId, checkIndex) {
  const item = document.items.find((candidate) => candidate.id === workItemId);
  if (!item) throw new Error(`找不到 work item ${workItemId}。`);
  const check = item.checks.find((candidate) => candidate.index === checkIndex);
  if (!check) throw new Error(`找不到 work item ${workItemId} 的 check ${checkIndex}。`);
  return { item, check };
}

function derive(document) {
  const result = structuredClone(document);
  result.items.forEach((item) => {
    if (item.checks.some((check) => check.status === "failed")) item.status = "failed";
    else if (item.checks.every((check) => check.status === "passed")) item.status = "passed";
    else item.status = "pending";
  });
  return result;
}

const CYCLE = { pending: "passed", passed: "failed", failed: "pending" };

function reduce(document, command) {
  const { item, check } = findCheck(document, command.workItemId, command.checkIndex);
  // Manual results stay editable after they are saved; Agent results are frozen
  // execution evidence.
  if (!check.isManual) throw new Error("Agent check 是唯讀的。");
  if (command.type === "set-result" || command.type === "cycle-result") {
    const next = command.type === "cycle-result"
      ? CYCLE[check.status] ?? "pending"
      : command.status;
    if (!["pending", "passed", "failed"].includes(next)) {
      throw new Error("不支援的 manual check 狀態。");
    }
    check.status = next;
    if (next !== "failed") {
      // Leaving a failure drops the result it described.
      check.observed = null;
      check.resolved = null;
    }
  } else if (command.type === "set-observed") {
    if (check.status !== "failed") throw new Error("只有失敗草稿可以填寫 Observed。");
    check.observed = String(command.value ?? "");
  } else {
    throw new Error(`不支援的 Checklist command：${command.type}`);
  }
  if (item.checks.some((candidate) => candidate.status === "failed")) item.status = "failed";
  else if (item.checks.every((candidate) => candidate.status === "passed")) item.status = "passed";
  else item.status = "pending";
  return document;
}

// The saved state travels with the draft so a save can submit exactly the manual
// checks the reader actually changed, in either direction.
function normalize(document) {
  const normalized = structuredClone(document);
  normalized.items.forEach((item) => item.checks.forEach((check) => {
    check.persistedStatus = check.status;
    check.persistedObserved = check.observed ?? null;
  }));
  return normalized;
}

export function createChecklistEditorSession(document, options = {}) {
  // The source revision follows the last saved document, not the draft: Undo can
  // restore an older draft, and that older draft must still be written against
  // the revision the file actually has now.
  let revision = document.revision;
  const transaction = createEditorTransaction(normalize(document), {
    derive,
    historyLimit: options.historyLimit,
  });

  function snapshot() {
    return Object.freeze({
      document: structuredClone(transaction.derived),
      dirty: transaction.dirty,
      history: transaction.history,
    });
  }

  function dispatch(command) {
    const mergeKey = command.type === "set-observed"
      ? `${command.type}:${command.workItemId}:${command.checkIndex}`
      : "";
    transaction.apply(command, reduce, mergeKey);
    return snapshot();
  }

  function prepareSave() {
    const results = [];
    const errors = [];
    transaction.derived.items.forEach((item) => item.checks.forEach((check) => {
      if (!check.isManual) return;
      const observed = String(check.observed ?? "").trim();
      const persistedObserved = String(check.persistedObserved ?? "").trim();
      if (check.status === check.persistedStatus && observed === persistedObserved) return;
      if (check.status === "failed" && !observed) {
        errors.push({
          code: "observed_required",
          workItemId: item.id,
          checkIndex: check.index,
          message: `「${check.title}」失敗時必須填寫 Observed。`,
        });
        return;
      }
      results.push({
        workItemId: item.id,
        checkIndex: check.index,
        status: check.status,
        observed: check.status === "failed" ? observed : null,
      });
    }));
    if (transaction.dirty && results.length === 0 && errors.length === 0) {
      errors.push({ code: "empty_change", message: "沒有可儲存的 manual check 結果。" });
    }
    return Object.freeze({
      revision,
      results,
      errors,
    });
  }

  return Object.freeze({
    snapshot,
    dispatch,
    prepareSave,
    undo() { transaction.undo(); return snapshot(); },
    redo() { transaction.redo(); return snapshot(); },
    discard() { transaction.discard(); return snapshot(); },
    commit(savedDocument) {
      revision = savedDocument.revision;
      transaction.commit(normalize(savedDocument), { keepHistory: true });
      return snapshot();
    },
  });
}
