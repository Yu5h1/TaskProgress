/** Item activity log: who created, started, changed, finished or took over a Report child item. */

export const ACTIVITY_RECENT_LIMIT = 3;
export const ACTIVITY_EVENTS = Object.freeze(["created", "started", "updated", "done", "takeover"]);
const ACTOR_PATTERN = /^[a-z][a-z0-9-]{0,31}$/u;
const ITEM_FIELDS = ["pending_items", "completed_items"];
const LABELS = { created: "建立", started: "開始", updated: "修改", done: "完成", takeover: "接手" };

/** Appends an entry, keeping the first created entry and only the most recent others. */
export function appendActivity(activity, entry) {
  const list = [...(Array.isArray(activity) ? activity : []), entry];
  const created = list.find(item => item.event === "created");
  const recent = list.filter(item => item.event !== "created").slice(-ACTIVITY_RECENT_LIMIT);
  return created ? [created, ...recent] : recent;
}

/** The event a change from `before` to `after` records; `before` is null for a new item. */
export function activityEvent(before, after) {
  if (!before) return "created";
  const status = after.status ?? null;
  if (status !== (before.status ?? null) && status === "in_progress") return "started";
  if (status !== (before.status ?? null) && status === "done") return "done";
  return "updated";
}

function content(item) {
  const { activity, ...rest } = item;
  return JSON.stringify(rest);
}

function objectItems(task) {
  return ITEM_FIELDS.flatMap(field => (task?.[field] ?? []).filter(item => item && typeof item === "object" && !Array.isArray(item)));
}

/** IDs of pending items whose relative order changed: everything outside one longest kept order. */
function movedIds(beforeTask, afterTask) {
  const beforeIndex = new Map((beforeTask?.pending_items ?? []).map((item, index) => [item?.id, index]));
  const sequence = (afterTask?.pending_items ?? [])
    .filter(item => item?.id !== undefined && beforeIndex.has(item.id))
    .map(item => ({ id: item.id, index: beforeIndex.get(item.id) }));
  const length = sequence.map(() => 1);
  const previous = sequence.map(() => -1);
  sequence.forEach((entry, i) => {
    for (let j = 0; j < i; j += 1) {
      if (sequence[j].index < entry.index && length[j] + 1 > length[i]) {
        length[i] = length[j] + 1;
        previous[i] = j;
      }
    }
  });
  const kept = new Set();
  let cursor = length.indexOf(Math.max(0, ...length));
  while (cursor >= 0) {
    kept.add(sequence[cursor].id);
    cursor = previous[cursor];
  }
  return new Set(sequence.filter(entry => !kept.has(entry.id)).map(entry => entry.id));
}

/**
 * Returns `after` with one `user` entry appended to every item the Viewer created, changed or moved
 * since `before`. Activity always continues from `before`, so a stale draft cannot drop entries.
 */
export function recordUserActivity(before, after, at = new Date().toISOString()) {
  const next = structuredClone(after);
  const beforeTasks = new Map((before?.tasks ?? []).map(task => [task.id, task]));
  for (const task of next.tasks ?? []) {
    if (task.kind === "report_pointer") continue;
    const previousTask = beforeTasks.get(task.id);
    const previousItems = new Map(objectItems(previousTask).map(item => [item.id, item]));
    const moved = movedIds(previousTask, task);
    for (const item of objectItems(task)) {
      const previous = previousItems.get(item.id) ?? null;
      const changed = !previous || content(previous) !== content(item) || moved.has(item.id);
      const activity = previous?.activity;
      if (changed) {
        item.activity = appendActivity(activity, { event: activityEvent(previous, item), actor: "user", at });
      } else if (activity) {
        item.activity = structuredClone(activity);
      } else {
        delete item.activity;
      }
    }
  }
  return next;
}

export function validateActivity(value, path, errors, issue) {
  if (value === undefined) return;
  if (!Array.isArray(value) || value.length > ACTIVITY_RECENT_LIMIT + 1) {
    errors.push(issue("invalid_activity", path, `${path} 必須是最多 ${ACTIVITY_RECENT_LIMIT + 1} 筆的陣列。`));
    return;
  }
  value.forEach((entry, index) => {
    const entryPath = `${path}[${index}]`;
    const keys = entry && typeof entry === "object" && !Array.isArray(entry) ? Object.keys(entry) : null;
    const valid = keys
      && keys.every(key => ["event", "actor", "session", "at"].includes(key))
      && ACTIVITY_EVENTS.includes(entry.event)
      && typeof entry.actor === "string" && ACTOR_PATTERN.test(entry.actor)
      && (entry.session === undefined || (typeof entry.session === "string" && entry.session.length > 0 && entry.session.length <= 100))
      && typeof entry.at === "string" && !Number.isNaN(Date.parse(entry.at));
    if (!valid) errors.push(issue("invalid_activity", entryPath, `${entryPath} 必須有 event、actor、at，session 可省略。`));
  });
}

function relative(at, now) {
  const minutes = Math.floor((now - Date.parse(at)) / 60000);
  if (!Number.isFinite(minutes)) return "";
  if (minutes < 1) return "剛剛";
  if (minutes < 60) return `${minutes} 分鐘前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小時前`;
  return `${Math.floor(hours / 24)} 天前`;
}

/** Tooltip text, one line per entry, oldest first; empty when the item has no activity. */
export function formatActivity(activity, now = Date.now()) {
  if (!Array.isArray(activity) || !activity.length) return "";
  return activity.map((entry) => {
    const who = entry.session ? `${entry.actor} (${entry.session})` : entry.actor;
    const when = relative(entry.at, now);
    return `${LABELS[entry.event] ?? entry.event}：${who}${when ? ` · ${when}` : ""}`;
  }).join("\n");
}
