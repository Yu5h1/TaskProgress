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

function reduce(document, command) {
  const { item, check } = findCheck(document, command.workItemId, command.checkIndex);
  if (!check.isManual || check.persistedStatus !== "pending") {
    throw new Error("只有尚未儲存的 manual check 可以修改。");
  }
  if (command.type === "set-result") {
    if (!["pending", "passed", "failed"].includes(command.status)) {
      throw new Error("不支援的 manual check 狀態。");
    }
    check.status = command.status;
    if (command.status !== "failed") check.observed = null;
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

function normalize(document) {
  const normalized = structuredClone(document);
  normalized.items.forEach((item) => item.checks.forEach((check) => {
    check.persistedStatus = check.status;
  }));
  return normalized;
}

export function createChecklistEditorSession(document, options = {}) {
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
      if (!check.isManual || check.persistedStatus !== "pending" || check.status === "pending") return;
      const observed = String(check.observed ?? "").trim();
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
      revision: transaction.draft.revision,
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
    commit(savedDocument) { transaction.commit(normalize(savedDocument)); return snapshot(); },
  });
}
