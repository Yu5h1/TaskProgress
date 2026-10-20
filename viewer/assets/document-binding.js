import { createChecklistHttpTransport } from "./checklist-http-transport.js";
import { createDecisionHttpTransport } from "./decision-transport.js";
import { mergeReports } from "./report-model.js";

/**
 * Normalizes a document_ref object into a standard shape.
 */
export function normalizeDocumentRef(ref) {
  if (!ref || typeof ref !== "object" || Array.isArray(ref)) return null;
  const kind = ref.kind === "checklist" || ref.kind === "decision" ? ref.kind : null;
  const scope_id = typeof ref.scope_id === "string" && ref.scope_id.trim() ? ref.scope_id.trim() : null;
  const rawTask = ref.task ?? ref.stem;
  const task = typeof rawTask === "string" && rawTask.trim() ? rawTask.trim() : null;
  if (!kind || !scope_id || !task) return null;
  return { kind, scope_id, task };
}

/**
 * Produces a stable lookup key for a document_ref.
 */
export function documentBindingKey(ref) {
  const norm = normalizeDocumentRef(ref);
  return norm ? `${norm.kind}:${norm.scope_id}:${norm.task}` : null;
}

/**
 * Builds the browser URL for opening the bound checklist or decision file.
 */
export function documentBindingHref(ref) {
  const norm = normalizeDocumentRef(ref);
  if (!norm) return null;
  const base = norm.kind === "checklist" ? "/checklist/" : "/decisions/";
  return `${base}?scope=${encodeURIComponent(norm.scope_id)}&task=${encodeURIComponent(norm.task)}`;
}

/**
 * Evaluates whether a loaded checklist document is fully completed.
 * Condition: at least one check, and ALL checks are "passed".
 */
export function evaluateChecklistDocument(payload) {
  const items = payload?.document?.items ?? payload?.items ?? [];
  const checks = items.flatMap((item) => item?.checks ?? []);
  const total = checks.length;
  const passed = checks.filter((c) => c?.status === "passed").length;
  const completed = total > 0 && passed === total;
  return { ok: true, completed, total, passed };
}

/**
 * Evaluates whether a loaded decision document is fully completed.
 * Condition: at least one decision, and ALL decisions have status "decided" with non-null answer.
 */
export function evaluateDecisionDocument(result) {
  if (result && result.ok === false) {
    return { ok: false, completed: false, error: result?.error?.message ?? "決策載入失敗" };
  }
  const decisions = result?.document?.decisions ?? [];
  const total = decisions.length;
  const decided = decisions.filter((d) => d?.status === "decided" && d?.answer !== null).length;
  const completed = total > 0 && decided === total;
  return { ok: true, completed, total, decided };
}

/**
 * Fetches and evaluates a single bound document.
 */
export async function fetchDocumentBinding(
  ref,
  {
    fetchImpl = globalThis.fetch,
    createChecklistTransport = createChecklistHttpTransport,
    createDecisionTransport = createDecisionHttpTransport,
  } = {},
) {
  const norm = normalizeDocumentRef(ref);
  if (!norm) return { ok: false, completed: false, error: "無效的文件綁定參照" };

  try {
    if (norm.kind === "checklist") {
      const transport = createChecklistTransport({
        scope: norm.scope_id,
        task: norm.task,
        fetchImpl,
      });
      const payload = await transport.load();
      return evaluateChecklistDocument(payload);
    }
    if (norm.kind === "decision") {
      const transport = createDecisionTransport(norm.scope_id, norm.task);
      const result = await transport.load();
      return evaluateDecisionDocument(result);
    }
    return { ok: false, completed: false, error: `不支援的文件種類：${norm.kind}` };
  } catch (error) {
    return { ok: false, completed: false, error: error?.message ?? "無法讀取來源文件" };
  }
}

/**
 * Derives a task's display status from its original status and the document evaluation.
 * - archive stays archive.
 * - original done stays done.
 * - successful completion derives to done.
 * - incomplete / error / reverted retains original status.
 */
export function deriveBoundTaskStatus(originalStatus, evaluation) {
  if (originalStatus === "archive") return "archive";
  if (originalStatus === "done") return "done";
  if (evaluation?.ok && evaluation?.completed) return "done";
  return originalStatus;
}

/**
 * Derives an item's display status from its original status and the document evaluation.
 * - archive stays archive.
 * - original done stays done.
 * - successful completion derives to done.
 * - incomplete / error / reverted retains original status.
 */
/**
 * Derives a task card's display status from its child items.
 * - archive stays archive.
 * - if the task has no non-archived items, retains original status.
 * - if all items are done, derives to done.
 * - if incomplete and was done, reverts to in_progress.
 * - otherwise retains original status.
 */
export function deriveCardStatusFromItems(originalStatus, completedCount, totalCount, hasItems) {
  if (originalStatus === "archive") return "archive";
  if (!hasItems) return originalStatus;
  if (completedCount === totalCount && totalCount > 0) return "done";
  if (completedCount < totalCount) {
    if (originalStatus === "done") return "in_progress";
    return originalStatus;
  }
  return originalStatus;
}

export function deriveBoundItemStatus(originalStatus, evaluation) {
  if (originalStatus === "archive") return "archive";
  if (evaluation?.ok && evaluation?.completed) return "done";
  if (originalStatus === "done") return "in_progress";
  return originalStatus ?? "planned";
}

export const DEFAULT_DOCUMENT_BINDING_CONCURRENCY = 4;

async function mapConcurrent(items, limit, fn) {
  const boundedLimit = Math.max(1, Number.isInteger(limit) && limit > 0 ? limit : DEFAULT_DOCUMENT_BINDING_CONCURRENCY);
  let index = 0;
  const workers = Array.from({ length: Math.min(boundedLimit, items.length) }, async () => {
    while (index < items.length) {
      const currentIndex = index++;
      await fn(items[currentIndex], currentIndex);
    }
  });
  await Promise.all(workers);
}

/**
 * Evaluates all unique document bindings referenced in a task list.
 */
export async function evaluateAllDocumentBindings(tasks, options = {}) {
  const { concurrency = DEFAULT_DOCUMENT_BINDING_CONCURRENCY, ...bindingOptions } = options;
  const refsByKey = new Map();

  for (const task of tasks ?? []) {
    for (const field of ["completed_items", "pending_items"]) {
      for (const item of task[field] ?? []) {
        if (!item || typeof item !== "object") continue;
        const itemKey = documentBindingKey(item.document_ref);
        if (itemKey && !refsByKey.has(itemKey)) {
          refsByKey.set(itemKey, item.document_ref);
        }
      }
    }
  }

  const evaluations = new Map();
  const entries = Array.from(refsByKey.entries());
  await mapConcurrent(entries, concurrency, async ([key, ref]) => {
    const result = await fetchDocumentBinding(ref, bindingOptions);
    evaluations.set(key, result);
  });

  return evaluations;
}

/**
 * Projects a tasks array with derived display statuses and sourceRef metadata
 * based on evaluation results.
 * This is a read-only projection; the raw persisted report is not mutated.
 */
export function projectTasksWithBindings(tasks, evaluations = new Map()) {
  return (tasks ?? []).map((task) => {
    const completedItems = [];
    const promotedItems = [];
    const pendingItems = [];

    // Helper to process an item
    const processItem = (item, defaultOriginField) => {
      if (!item || typeof item !== "object") {
        if (defaultOriginField === "completed_items") completedItems.push(item);
        else pendingItems.push(item);
        return;
      }

      const itemKey = documentBindingKey(item.document_ref);
      if (!itemKey) {
        if (defaultOriginField === "completed_items") completedItems.push(item);
        else pendingItems.push(item);
        return;
      }

      const norm = normalizeDocumentRef(item.document_ref);
      const evalResult = evaluations.get(itemKey) ?? { ok: false, completed: false, error: "未評估" };
      const rawStatus = item.status ?? (defaultOriginField === "completed_items" ? "done" : "planned");
      const derivedStatus = deriveBoundItemStatus(rawStatus, evalResult);

      const itemSourceRef = {
        href: documentBindingHref(item.document_ref),
        kind: norm.kind,
        scope_id: norm.scope_id,
        task: norm.task,
        label: norm.kind === "checklist" ? "Checklist" : "Decision",
        completed: Boolean(evalResult.ok && evalResult.completed),
        available: Boolean(evalResult.ok),
        error: evalResult.ok ? null : (evalResult.error ?? "來源無法讀取"),
      };

      const projectedItem = {
        ...item,
        status: derivedStatus,
        sourceRef: itemSourceRef,
      };

      if (derivedStatus === "done") {
        (defaultOriginField === "pending_items" ? promotedItems : completedItems).push(projectedItem);
      } else {
        pendingItems.push(projectedItem);
      }
    };

    for (const item of task.completed_items ?? []) {
      processItem(item, "completed_items");
    }
    for (const item of task.pending_items ?? []) {
      processItem(item, "pending_items");
    }

    const hasBoundItems = [
      ...(task.completed_items ?? []),
      ...(task.pending_items ?? []),
    ].some((item) => item && typeof item === "object" && Boolean(documentBindingKey(item.document_ref)));

    let nextTaskStatus = task.status;
    if (hasBoundItems) {
      const nonArchivedStatuses = [
        ...[...promotedItems, ...completedItems].map((item) => (item && typeof item === "object") ? (item.status ?? "done") : "done"),
        ...pendingItems.map((item) => (item && typeof item === "object") ? (item.status ?? "planned") : "planned"),
      ].filter((status) => status !== "archive");
      const hasItems = nonArchivedStatuses.length > 0;
      const completedCount = nonArchivedStatuses.filter((status) => status === "done").length;
      const totalCount = nonArchivedStatuses.length;
      nextTaskStatus = deriveCardStatusFromItems(task.status, completedCount, totalCount, hasItems);
    }

    const projectedTask = {
      ...task,
      status: nextTaskStatus,
      completed_items: [...promotedItems, ...completedItems],
      pending_items: pendingItems,
    };
    delete projectedTask.sourceRef;
    return projectedTask;
  });
}

/**
 * Creates a coordinated document binding refresher with generation token
 * and active state checking to prevent stale or out-of-order responses from
 * overwriting newer scopes, reports, or in-flight user edits.
 */
export function createDocumentBindingRefresher({
  getReport,
  getDeveloperReport = () => null,
  getEditorState = () => null,
  evaluateAll = evaluateAllDocumentBindings,
  merge = mergeReports,
  project = projectTasksWithBindings,
  onApply,
}) {
  let generation = 0;

  function isEditorBusy(editor) {
    if (!editor || !editor.editing) return false;
    return Boolean(
      editor.dirty
      || editor.saving
      || editor.pending
      || editor.previewing
      || editor.timeSettingsPending
      || editor.confirmingDeliverySave
    );
  }

  return async function refresh() {
    const report = getReport();
    if (!report) return { applied: false, reason: "no_report" };
    if (isEditorBusy(getEditorState())) return { applied: false, reason: "editor_busy" };

    const currentGen = ++generation;
    const initialScopeId = report.scope_id;
    const initialReportId = report.report_id;
    const initialUpdatedAt = report.updated_at;
    const initialReport = report;
    const initialDevReport = getDeveloperReport();

    const merged = merge(initialReport, initialDevReport);
    try {
      const evaluations = await evaluateAll(merged.tasks);
      if (currentGen !== generation) return { applied: false, reason: "stale_generation" };
      const currentReport = getReport();
      if (!currentReport || currentReport.scope_id !== initialScopeId || currentReport.report_id !== initialReportId) {
        return { applied: false, reason: "scope_or_report_changed" };
      }
      if (currentReport.updated_at !== initialUpdatedAt || currentReport !== initialReport) {
        return { applied: false, reason: "report_version_changed" };
      }
      if (isEditorBusy(getEditorState())) return { applied: false, reason: "editor_became_busy" };

      const freshMerged = merge(currentReport, getDeveloperReport());
      const tasks = project(freshMerged.tasks, evaluations);
      onApply?.({ evaluations, tasks, merged: freshMerged });
      return { applied: true, evaluations, tasks };
    } catch (error) {
      return { applied: false, reason: "evaluation_failed", error };
    }
  };
}

