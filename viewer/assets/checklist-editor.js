import { createEditorTransaction } from "./editor-transaction.js";

function findCheck(document, workItemId, checkIndex) {
  const item = document.items.find((candidate) => candidate.id === workItemId);
  if (!item) throw new Error(`找不到 work item ${workItemId}。`);
  const check = item.checks.find((candidate) => candidate.index === checkIndex);
  if (!check) throw new Error(`找不到 work item ${workItemId} 的 check ${checkIndex}。`);
  return { item, check };
}

// The one place the derived work-item rule lives: any failure fails the item,
// otherwise every check must pass.
function itemStatus(item) {
  if (item.checks.some((check) => check.status === "failed")) return "failed";
  if (item.checks.length > 0 && item.checks.every((check) => check.status === "passed")) return "passed";
  return "pending";
}

function derive(document) {
  const result = structuredClone(document);
  result.items.forEach((item) => {
    item.status = itemStatus(item);
  });
  return result;
}

function isBlocked(item, byId) {
  return (item.dependsOn ?? []).some((id) => itemStatus(byId.get(id) ?? { checks: [] }) !== "passed");
}

/*
 * Counts, bar cells and the single outstanding check, derived from the whole
 * document.
 *
 * Always the whole document: a filtered view changes what is on screen, never
 * what is true, so a summary computed from a filter would misreport progress.
 *
 * The next step prefers a failure over a pending check — a failure is a stop
 * condition someone has to answer — and skips any item still waiting on an
 * unfinished dependency, because starting there is not actually possible yet.
 */
export function summarizeChecklist(document) {
  const items = document?.items ?? [];
  const byId = new Map(items.map((item) => [item.id, item]));
  const cells = [];
  const checks = { total: 0, passed: 0, failed: 0, pending: 0 };
  const itemCounts = { total: items.length, passed: 0, failed: 0, pending: 0 };
  let failedStep = null;
  let pendingStep = null;

  items.forEach((item) => {
    itemCounts[itemStatus(item)] += 1;
    const blocked = isBlocked(item, byId);
    item.checks.forEach((check) => {
      checks.total += 1;
      checks[check.status] = (checks[check.status] ?? 0) + 1;
      cells.push(check.status);
      const step = {
        workItemId: item.id,
        checkIndex: check.index,
        itemTitle: item.title,
        title: check.title,
        action: check.action,
        expect: check.expect,
        isManual: check.isManual,
      };
      if (check.status === "failed" && !failedStep) failedStep = step;
      if (check.status === "pending" && !blocked && !pendingStep) pendingStep = step;
    });
  });

  return Object.freeze({
    items: Object.freeze(itemCounts),
    checks: Object.freeze(checks),
    cells: Object.freeze(cells),
    nextStep: failedStep ?? pendingStep ?? null,
  });
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
  item.status = itemStatus(item);
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

/*
 * Checklist filtering: two independent groups, status and owner.
 *
 * A filter decides what is on screen and nothing else. It never reaches the
 * summary (which counts the whole document), never reaches a save, and never
 * reorders anything — work item order is the document's, not the reader's.
 *
 * A work item survives a filter when any of its checks does, and it keeps only
 * its matching checks, so a filtered item never implies its hidden checks are
 * gone.
 */
export const CHECKLIST_FILTERS = Object.freeze({
  status: Object.freeze(["pending", "passed", "failed"]),
  owner: Object.freeze(["manual", "agent"]),
});

function matchesFilter(check, filter) {
  if (filter.status && check.status !== filter.status) return false;
  if (filter.owner === "manual" && !check.isManual) return false;
  if (filter.owner === "agent" && check.isManual) return false;
  return true;
}

export function filterChecklist(document, filter = {}) {
  const status = CHECKLIST_FILTERS.status.includes(filter.status) ? filter.status : null;
  const owner = CHECKLIST_FILTERS.owner.includes(filter.owner) ? filter.owner : null;
  if (!status && !owner) return document;
  const active = { status, owner };
  return {
    ...document,
    items: document.items
      .map((item) => ({
        ...item,
        checks: item.checks.filter((check) => matchesFilter(check, active)),
      }))
      .filter((item) => item.checks.length > 0),
  };
}

export function checklistFilterCategories(document, filter = {}) {
  const checks = document.items.flatMap((item) => item.checks);
  const count = (predicate) => checks.filter(predicate).length;
  return {
    status: CHECKLIST_FILTERS.status.map((id) => ({
      id,
      count: count((check) => check.status === id),
      selected: filter.status === id,
    })),
    owner: CHECKLIST_FILTERS.owner.map((id) => ({
      id,
      count: count((check) => (id === "manual" ? check.isManual : !check.isManual)),
      selected: filter.owner === id,
    })),
  };
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
    const document = structuredClone(transaction.derived);
    return Object.freeze({
      document,
      summary: summarizeChecklist(document),
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
