import { createChecklistHttpTransport } from "./checklist-http-transport.js";
import { createDecisionHttpTransport } from "./decision-transport.js";

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
export function deriveBoundItemStatus(originalStatus, evaluation) {
  if (originalStatus === "archive") return "archive";
  if (originalStatus === "done") return "done";
  if (evaluation?.ok && evaluation?.completed) return "done";
  return originalStatus ?? "planned";
}

/**
 * Evaluates all unique document bindings referenced in a task list.
 */
export async function evaluateAllDocumentBindings(tasks, options = {}) {
  const refsByKey = new Map();

  for (const task of tasks ?? []) {
    const taskKey = documentBindingKey(task.document_ref);
    if (taskKey && !refsByKey.has(taskKey)) {
      refsByKey.set(taskKey, task.document_ref);
    }
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
  await Promise.all(
    Array.from(refsByKey.entries()).map(async ([key, ref]) => {
      const result = await fetchDocumentBinding(ref, options);
      evaluations.set(key, result);
    }),
  );

  return evaluations;
}

/**
 * Projects a tasks array with derived display statuses and sourceRef metadata
 * based on evaluation results.
 * This is a read-only projection; the raw persisted report is not mutated.
 */
export function projectTasksWithBindings(tasks, evaluations = new Map()) {
  return (tasks ?? []).map((task) => {
    let nextTaskStatus = task.status;
    let taskSourceRef = null;

    const taskKey = documentBindingKey(task.document_ref);
    if (taskKey) {
      const norm = normalizeDocumentRef(task.document_ref);
      const evalResult = evaluations.get(taskKey) ?? { ok: false, completed: false, error: "未評估" };
      nextTaskStatus = deriveBoundTaskStatus(task.status, evalResult);
      taskSourceRef = {
        href: documentBindingHref(task.document_ref),
        kind: norm.kind,
        scope_id: norm.scope_id,
        task: norm.task,
        label: norm.task,
        completed: Boolean(evalResult.ok && evalResult.completed),
        available: Boolean(evalResult.ok),
        error: evalResult.ok ? null : (evalResult.error ?? "來源無法讀取"),
      };
    }

    const completedItems = [];
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
        label: norm.task,
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
        completedItems.push(projectedItem);
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

    return {
      ...task,
      status: nextTaskStatus,
      sourceRef: taskSourceRef,
      completed_items: completedItems,
      pending_items: pendingItems,
    };
  });
}
