import "./priority-policy.js";

/*
 * Every reader in the project accepts the same set of report versions, and
 * reads it from here. 1.1 adds the tagged task variants; 1.0 reports stay
 * readable unchanged, so both are live during the migration.
 */
export const SUPPORTED_SCHEMA_VERSIONS = Object.freeze(["1.0", "1.1"]);

export function isSupportedSchemaVersion(version) {
  return SUPPORTED_SCHEMA_VERSIONS.includes(version);
}

export const TASK_KINDS = Object.freeze(["standard", "report_pointer"]);
export const DEFAULT_TASK_KIND = "standard";

/*
 * A 1.0 report carries no `kind` and all of its tasks are standard ones.
 * Reading the kind through one function keeps that compatibility rule in a
 * single place. Do not infer the variant from whether `report_ref` happens to
 * be present: the tag is the contract, the field is not.
 */
export function taskKind(task) {
  return task?.kind ?? DEFAULT_TASK_KIND;
}

export const STATUS_META = Object.freeze({
  planned: { label: "待處理", tone: "neutral" },
  in_progress: { label: "進行中", tone: "active" },
  blocked: { label: "受阻", tone: "danger" },
  done: { label: "已完成", tone: "success" },
  archive: { label: "已封存", tone: "muted" },
});

export const PRIORITY_POLICY = globalThis.TaskProgressPriorityPolicy;
export const PRIORITY_META = Object.freeze(
  Object.fromEntries(PRIORITY_POLICY.levels.map((level) => [level.value, level])),
);
export const DEFAULT_PRIORITY = PRIORITY_POLICY.fallbackValue;

const ID_PATTERN = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/;

export function validateScopeCatalog(catalog) {
  if (!catalog || typeof catalog !== "object" || Array.isArray(catalog)) {
    throw new Error("scope catalog 的根節點必須是物件。");
  }
  if (catalog.schema_version !== "1.0" || !Array.isArray(catalog.scopes)) {
    throw new Error("scope catalog 格式不相容。");
  }

  const seen = new Set();
  return catalog.scopes.map((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)
      || typeof entry.id !== "string" || entry.id.length > 100
      || !ID_PATTERN.test(entry.id)
      || typeof entry.has_developer_report !== "boolean"
      || seen.has(entry.id)) {
      throw new Error("scope catalog 包含無效或重複的 scope。");
    }
    seen.add(entry.id);
    return {
      id: entry.id,
      hasDeveloperReport: entry.has_developer_report,
    };
  });
}

export function buildScopeHref(scope, developerMode = "auto") {
  if (typeof scope !== "string" || scope.length > 100 || !ID_PATTERN.test(scope)) {
    throw new Error("scope 無效。");
  }
  if (!["auto", "none", "explicit"].includes(developerMode)) {
    throw new Error("Developer 顯示模式無效。");
  }
  const params = new URLSearchParams({ scope });
  if (developerMode === "none") params.set("dev", "none");
  if (developerMode === "explicit") {
    params.set("dev", `../reports/${scope}/report.dev.json`);
  }
  return `?${params}`;
}

/*
 * The one relative-path rule for reaching another scope's base report,
 * whether that is the page's own scope switch or a Report pointer card's
 * target. Both a Launcher-hosted loopback root and the public docs site serve
 * every registered scope at this same `../reports/<id>/` layout, so no
 * caller needs its own copy of the path.
 */
export function reportPathForScope(scopeId) {
  if (typeof scopeId !== "string" || scopeId.length > 100 || !ID_PATTERN.test(scopeId)) {
    throw new Error("scope 必須是小寫英數字組成的穩定 ID，可使用點、底線或連字號。");
  }
  return `../reports/${scopeId}/report.json`;
}

export function resolveReportRequest(params) {
  const explicitReport = params.get("report");
  if (explicitReport) {
    return { source: "report", reportSource: explicitReport, scope: null };
  }

  const scope = params.get("scope");
  if (!scope) return null;
  return {
    source: "scope",
    reportSource: reportPathForScope(scope),
    scope,
  };
}

function isLoopbackHostname(hostname) {
  const normalized = hostname.toLowerCase();
  return normalized === "localhost"
    || normalized === "127.0.0.1"
    || normalized === "::1"
    || normalized === "[::1]";
}

export function resolveDeveloperReportSource(params, request, baseUrl) {
  const explicitDeveloperSource = params.get("dev");
  if (explicitDeveloperSource === "none") return null;
  if (explicitDeveloperSource) {
    return new URL(explicitDeveloperSource, baseUrl);
  }
  if (request?.source !== "scope" || !request.scope) return null;

  const viewerUrl = new URL(baseUrl);
  if (!isLoopbackHostname(viewerUrl.hostname)) return null;

  const reportUrl = new URL(request.reportSource, viewerUrl);
  return new URL("report.dev.json", reportUrl);
}

export function calculateTaskProgress(task) {
  const completedItems = task.completed_items?.length ?? 0;
  const pendingItems = task.pending_items?.length ?? 0;
  if (completedItems + pendingItems > 0) {
    return { completed: completedItems, total: completedItems + pendingItems };
  }

  if (task.progress) return { ...task.progress };

  return { completed: task.status === "done" ? 1 : 0, total: 1 };
}

export function calculateProjectProgress(tasks) {
  const progress = tasks
    .filter((task) => task.status !== "archive")
    .map(calculateTaskProgress);
  const completed = progress.reduce((sum, item) => sum + item.completed, 0);
  const total = progress.reduce((sum, item) => sum + item.total, 0);
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completed, total, percentage };
}

/*
 * A report describes itself the way a task card does: a title and a summary
 * written by whoever owns it. The field is optional, so a report written
 * before it existed still shows something — the fallback is the generated
 * count line that every report displayed until the field arrived.
 *
 * One implementation, because the Viewer header and a pointer card's derived
 * summary must not answer this differently.
 */
export function reportSummaryText(report) {
  const summary = typeof report?.summary === "string" ? report.summary.trim() : "";
  if (summary) return summary;
  return `${report?.tasks?.length ?? 0} 個可追溯任務；狀態由報告資料提供。`;
}

/*
 * One report, one status, derived here and nowhere else — a card that guessed
 * its own would disagree with the report it points at.
 *
 * `archive` means explicitly archived and only that: archived tasks are left
 * out of the outstanding work rather than counted as finished, and a report
 * whose every task is archived reports itself archived instead of done.
 *
 * A task carrying no status of its own — a pointer card is the case that
 * exists — stays outstanding. It cannot be counted as finished, so a report
 * holding one never reports `done` on its behalf.
 */
export function deriveReportStatus(tasks) {
  const considered = (tasks ?? []).filter((task) => task?.status !== "archive");
  if (considered.length === 0) return (tasks ?? []).length > 0 ? "archive" : "planned";

  const outstanding = considered.filter((task) => task.status !== "done");
  if (outstanding.length === 0) return "done";
  if (outstanding.some((task) => task.status === "in_progress")) return "in_progress";
  if (outstanding.every((task) => task.status === "blocked")) return "blocked";
  return "planned";
}

/*
 * The read-only projection behind a Report pointer card: one layer deep, and
 * derived on demand from the target report the caller just read.
 *
 * Nothing here is written back to the upper report and nothing is kept between
 * calls. Two copies of the same number drift the moment one is edited, so the
 * target report stays the only source and this function holds no state.
 *
 * A target task that is itself a pointer contributes its title and whatever
 * status it already has — which is none, because a pointer stores none. Its
 * own target is not read: that is the reader's next scope, not this preview.
 */
export function projectPointerCard(pointerTask, targetReport) {
  const targetTasks = targetReport?.tasks ?? [];
  return Object.freeze({
    id: pointerTask.id,
    title: pointerTask.title,
    kind: "report_pointer",
    scopeId: pointerTask.report_ref?.scope_id ?? null,
    status: deriveReportStatus(targetTasks),
    summary: reportSummaryText(targetReport),
    progress: Object.freeze(calculateProjectProgress(targetTasks)),
    rows: Object.freeze(targetTasks.map((task) => Object.freeze({
      id: task.id,
      title: task.title,
      status: taskKind(task) === "report_pointer" ? null : task.status,
    }))),
  });
}

function normalizedPriority(value) {
  return PRIORITY_POLICY.normalize(value, DEFAULT_PRIORITY);
}

export function taskPriority(task) {
  return normalizedPriority(task?.priority);
}

export function taskItemPriority(item) {
  return normalizedPriority(
    item !== null && typeof item === "object" && !Array.isArray(item)
      ? item.priority
      : undefined,
  );
}

export function stableSortTasksByPriority(tasks) {
  return [...(tasks ?? [])]
    .map((task, index) => ({ task, index }))
    .sort((left, right) => (
      taskPriority(left.task) - taskPriority(right.task)
      || left.index - right.index
    ))
    .map(({ task }) => task);
}

export function stableSortTaskItemsByPriority(items) {
  return [...(items ?? [])]
    .map((item, index) => ({ item, index }))
    .sort((left, right) => {
      const leftPriority = taskItemPriority(left.item);
      const rightPriority = taskItemPriority(right.item);
      return leftPriority - rightPriority || left.index - right.index;
    })
    .map(({ item }) => item);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function issue(code, path, message) {
  return { code, path, message };
}

function requireString(value, path, errors, options = {}) {
  const { id = false } = options;
  if (typeof value !== "string" || value.trim().length === 0) {
    errors.push(issue("invalid_string", path, `${path} 必須是非空白文字。`));
    return;
  }
  if (id && !ID_PATTERN.test(value)) {
    errors.push(issue("invalid_id", path, `${path} 不是有效的穩定 ID。`));
  }
}

function validateStringList(value, path, errors) {
  if (value === undefined) return;
  if (!Array.isArray(value)) {
    errors.push(issue("invalid_list", path, `${path} 必須是文字陣列。`));
    return;
  }
  value.forEach((item, index) => requireString(item, `${path}[${index}]`, errors));
}

function validateTaskItemList(value, path, errors, ids) {
  if (value === undefined) return;
  if (!Array.isArray(value)) {
    errors.push(issue("invalid_list", path, `${path} 必須是項目陣列。`));
    return;
  }
  value.forEach((item, index) => {
    const itemPath = `${path}[${index}]`;
    if (typeof item === "string") {
      requireString(item, itemPath, errors);
      return;
    }
    if (!isObject(item)) {
      errors.push(issue("invalid_item", itemPath, `${itemPath} 必須是文字或穩定項目物件。`));
      return;
    }
    requireString(item.id, `${itemPath}.id`, errors, { id: true });
    requireString(item.title, `${itemPath}.title`, errors);
    if (
      item.priority !== undefined
      && (!Number.isInteger(item.priority) || item.priority < 0 || item.priority > 4)
    ) {
      errors.push(issue(
        "invalid_priority",
        `${itemPath}.priority`,
        `${itemPath}.priority 必須是 0、1、2、3 或 4。`,
      ));
    }
    if (typeof item.id === "string") {
      if (ids.has(item.id)) {
        errors.push(issue("duplicate_item", `${itemPath}.id`, `item id「${item.id}」重複。`));
      }
      ids.add(item.id);
    }
  });
}

function validateTimestamp(value, path, errors) {
  requireString(value, path, errors);
  if (typeof value === "string" && Number.isNaN(Date.parse(value))) {
    errors.push(issue("invalid_timestamp", path, `${path} 必須是有效的 date-time。`));
  }
}

const POINTER_FORBIDDEN_FIELDS = Object.freeze([
  "status",
  "summary",
  "completed_items",
  "pending_items",
  "progress",
  "priority",
]);

function validatePriority(value, path, errors) {
  if (value === undefined) return;
  if (!Number.isInteger(value) || value < 0 || value > 4) {
    errors.push(issue("invalid_priority", path, `${path} 必須是 0、1、2、3 或 4。`));
  }
}

function validateStandardTask(task, path, errors) {
  requireString(task.summary, `${path}.summary`, errors);
  if (!Object.hasOwn(STATUS_META, task.status)) {
    errors.push(issue("invalid_status", `${path}.status`, `${path}.status 不是支援的狀態。`));
  }
  validatePriority(task.priority, `${path}.priority`, errors);
  if (task.report_ref !== undefined) {
    errors.push(issue(
      "unexpected_report_ref",
      `${path}.report_ref`,
      `${path} 是一般任務卡，不能保存 report_ref；指路卡必須標記 kind: "report_pointer"。`,
    ));
  }

  const itemIds = new Set();
  validateTaskItemList(task.completed_items, `${path}.completed_items`, errors, itemIds);
  validateTaskItemList(task.pending_items, `${path}.pending_items`, errors, itemIds);

  if (task.progress !== undefined) {
    if (!isObject(task.progress)) {
      errors.push(issue("invalid_progress", `${path}.progress`, `${path}.progress 必須是物件。`));
      return;
    }
    const { completed, total } = task.progress;
    if (!Number.isInteger(completed) || completed < 0) {
      errors.push(issue("invalid_progress", `${path}.progress.completed`, "completed 必須是非負整數。"));
    }
    if (!Number.isInteger(total) || total < 1) {
      errors.push(issue("invalid_progress", `${path}.progress.total`, "total 必須是大於零的整數。"));
    }
    if (Number.isInteger(completed) && Number.isInteger(total) && completed > total) {
      errors.push(issue("invalid_progress", `${path}.progress`, "completed 不可大於 total。"));
    }
  }
}

/*
 * A pointer card holds a route and nothing else. Every field it is forbidden
 * to keep is one the target report already owns, and two copies of the same
 * number drift apart the moment one of them is edited.
 */
function validateReportPointerTask(task, path, errors, currentScopeId) {
  POINTER_FORBIDDEN_FIELDS.forEach((field) => {
    if (task[field] === undefined) return;
    errors.push(issue(
      "unexpected_pointer_field",
      `${path}.${field}`,
      `${path} 是 Report 指路卡，不能保存由目標 report 衍生的 ${field}。`,
    ));
  });

  if (!isObject(task.report_ref)) {
    errors.push(issue("invalid_report_ref", `${path}.report_ref`, `${path}.report_ref 必須是物件。`));
    return;
  }
  requireString(task.report_ref.scope_id, `${path}.report_ref.scope_id`, errors, { id: true });
  if (task.report_ref.scope_id === currentScopeId) {
    errors.push(issue(
      "self_reference",
      `${path}.report_ref.scope_id`,
      `${path}.report_ref 不能指向目前 scope 自身。`,
    ));
  }
}

export function validateReport(report) {
  const errors = [];
  if (!isObject(report)) {
    return [issue("invalid_report", "$", "report.json 的根節點必須是物件。")];
  }

  requireString(report.schema_version, "schema_version", errors);
  requireString(report.report_id, "report_id", errors, { id: true });
  requireString(report.scope_id, "scope_id", errors, { id: true });
  requireString(report.title, "title", errors);
  // Optional, and validated only when present: a report written before the
  // field existed stays valid, and the Viewer falls back to a generated line.
  if (report.summary !== undefined) {
    requireString(report.summary, "summary", errors);
  }
  validateTimestamp(report.updated_at, "updated_at", errors);

  if (!Array.isArray(report.tasks)) {
    errors.push(issue("invalid_tasks", "tasks", "tasks 必須是陣列。"));
    return errors;
  }

  const ids = new Set();
  report.tasks.forEach((task, index) => {
    const path = `tasks[${index}]`;
    if (!isObject(task)) {
      errors.push(issue("invalid_task", path, `${path} 必須是物件。`));
      return;
    }
    requireString(task.id, `${path}.id`, errors, { id: true });
    requireString(task.title, `${path}.title`, errors);
    if (typeof task.id === "string") {
      if (ids.has(task.id)) {
        errors.push(issue("duplicate_task", `${path}.id`, `task id「${task.id}」重複。`));
      }
      ids.add(task.id);
    }

    const kind = taskKind(task);
    if (!TASK_KINDS.includes(kind)) {
      errors.push(issue(
        "invalid_kind",
        `${path}.kind`,
        `${path}.kind 不是支援的任務卡種類。`,
      ));
      return;
    }
    if (kind === "report_pointer") {
      validateReportPointerTask(task, path, errors, report.scope_id);
      return;
    }
    validateStandardTask(task, path, errors);
  });

  return errors;
}

export function validateDeveloperReport(report) {
  const errors = [];
  if (!isObject(report)) {
    return [issue("invalid_report", "$", "report.dev.json 的根節點必須是物件。")];
  }

  requireString(report.schema_version, "schema_version", errors);
  requireString(report.report_id, "report_id", errors, { id: true });
  validateTimestamp(report.updated_at, "updated_at", errors);
  if (!Array.isArray(report.tasks)) {
    errors.push(issue("invalid_tasks", "tasks", "Developer tasks 必須是陣列。"));
    return errors;
  }

  const ids = new Set();
  report.tasks.forEach((task, index) => {
    const path = `tasks[${index}]`;
    if (!isObject(task)) {
      errors.push(issue("invalid_task", path, `${path} 必須是物件。`));
      return;
    }
    requireString(task.id, `${path}.id`, errors, { id: true });
    if (typeof task.id === "string") {
      if (ids.has(task.id)) {
        errors.push(issue("duplicate_task", `${path}.id`, `Developer task id「${task.id}」重複。`));
      }
      ids.add(task.id);
    }
    if (task.next_step !== undefined) {
      requireString(task.next_step, `${path}.next_step`, errors);
    }
    validateStringList(task.next_steps, `${path}.next_steps`, errors);
    validateStringList(task.blockers, `${path}.blockers`, errors);

    if (task.decisions !== undefined) {
      if (!Array.isArray(task.decisions)) {
        errors.push(issue("invalid_decisions", `${path}.decisions`, "decisions 必須是陣列。"));
      } else {
        task.decisions.forEach((decision, decisionIndex) => {
          const decisionPath = `${path}.decisions[${decisionIndex}]`;
          if (!isObject(decision)) {
            errors.push(issue("invalid_decision", decisionPath, `${decisionPath} 必須是物件。`));
            return;
          }
          requireString(decision.summary, `${decisionPath}.summary`, errors);
          if (decision.reference !== undefined) {
            requireString(decision.reference, `${decisionPath}.reference`, errors);
          }
        });
      }
    }

    if (task.routes !== undefined) {
      if (!Array.isArray(task.routes)) {
        errors.push(issue("invalid_routes", `${path}.routes`, "routes 必須是陣列。"));
      } else {
        task.routes.forEach((route, routeIndex) => {
          const routePath = `${path}.routes[${routeIndex}]`;
          if (!isObject(route)) {
            errors.push(issue("invalid_route", routePath, `${routePath} 必須是物件。`));
            return;
          }
          requireString(route.title, `${routePath}.title`, errors);
          if (!["candidate", "selected", "rejected"].includes(route.state)) {
            errors.push(issue("invalid_route_state", `${routePath}.state`, `${routePath}.state 不受支援。`));
          }
          if (route.reason !== undefined) requireString(route.reason, `${routePath}.reason`, errors);
        });
      }
    }

    if (task.claim !== undefined) {
      if (!isObject(task.claim)) {
        errors.push(issue("invalid_claim", `${path}.claim`, "claim 必須是物件。"));
      } else {
        requireString(task.claim.agent, `${path}.claim.agent`, errors);
        if (task.claim.worktree !== undefined) {
          requireString(task.claim.worktree, `${path}.claim.worktree`, errors);
        }
        validateStringList(task.claim.source_paths, `${path}.claim.source_paths`, errors);
      }
    }
  });

  return errors;
}

const ITEM_FIELDS = ["completed_items", "pending_items"];

/*
 * A legacy plain-string item is a valid, schema-accepted stable item — the
 * string itself is its title, and it carries no id of its own. Every shared
 * component built since (`ItemRow.svelte`, its `TaskCard.svelte` each-block
 * key) assumes an object with `.id`/`.title`, so a bare string has to become
 * one before it reaches them. This is presentation-only: it is derived fresh
 * from the report the caller just read, on the merged view `mergeReports`
 * already produces for rendering, and is never written back — editing still
 * operates on `state.persistedReport`, the untouched source.
 */
function normalizeStableItem(item, taskId, field, index) {
  if (typeof item !== "string") return item;
  return { id: `legacy-${taskId}-${field}-${index}`, title: item };
}

export function mergeReports(report, developerReport = null) {
  const diagnostics = [];
  const tasks = report.tasks.map((task) => {
    const next = { ...task, developer: null };
    for (const field of ITEM_FIELDS) {
      if (!Array.isArray(next[field])) continue;
      next[field] = next[field].map((item, index) => normalizeStableItem(item, task.id, field, index));
    }
    return next;
  });
  if (!developerReport) return { tasks, diagnostics, developerAvailable: false };

  if (developerReport.schema_version !== report.schema_version) {
    diagnostics.push({
      level: "error",
      code: "schema_mismatch",
      message: `Developer Report 版本 ${developerReport.schema_version} 與基本報告 ${report.schema_version} 不相容，已忽略擴充資料。`,
    });
    return { tasks, diagnostics, developerAvailable: false };
  }
  if (developerReport.report_id !== report.report_id) {
    diagnostics.push({
      level: "error",
      code: "report_id_mismatch",
      message: "Developer Report 的 report_id 與基本報告不同，已忽略擴充資料。",
    });
    return { tasks, diagnostics, developerAvailable: false };
  }

  const overlays = new Map(developerReport.tasks.map((task) => [task.id, task]));
  const taskIds = new Set(report.tasks.map((task) => task.id));
  for (const overlay of developerReport.tasks) {
    if (!taskIds.has(overlay.id)) {
      diagnostics.push({
        level: "warning",
        code: "orphan_developer_task",
        message: `Developer task「${overlay.id}」找不到對應的觀看者 task，未進行猜測配對。`,
      });
    }
  }

  for (const task of tasks) {
    task.developer = overlays.get(task.id) ?? null;
  }
  return { tasks, diagnostics, developerAvailable: true };
}
