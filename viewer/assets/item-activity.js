/** Item activity log: who created, started, changed, finished or took over a Report child item. */

export const ACTIVITY_RECENT_LIMIT = 3;
export const ACTIVITY_MAX_ITEMS = 64;
export const ACTIVITY_EVENTS = Object.freeze(["created", "started", "updated", "done", "takeover", "released", "promoted", "disputed"]);
const PERMANENT_EVENTS = new Set(["started", "takeover", "promoted"]);
const LATEST_EVENTS = new Set(["released", "disputed"]);
const ACTOR_PATTERN = /^[a-z][a-z0-9-]{0,31}$/u;
const ITEM_FIELDS = ["pending_items", "completed_items"];
const LABELS = { created: "建立", started: "開始", updated: "修改", done: "完成", takeover: "接手", released: "釋放", promoted: "升級成卡", disputed: "爭議" };

// Reserved notes distinguish terminal transitions from ordinary edits without changing the event model.
export function terminalActivityStatus(entry) {
  if (entry.event === 'done') return 'done';
  if (entry.event === 'updated' && ['status:obsolete', 'status:discontinued'].includes(entry.note)) return entry.note.slice(7);
  return null;
}

export function terminalActivityTime(item) {
  const status = item?.status ?? 'done';
  const entry = item?.activity?.findLast(entry => terminalActivityStatus(entry) === status);
  return entry ? Date.parse(entry.at) || 0 : 0;
}

export function latestTerminalActivityTime(item) {
  return Math.max(0, ...(item?.activity ?? []).filter(terminalActivityStatus).map(entry => Date.parse(entry.at) || 0));
}

function terminalEntry(before, item, at) {
  if (!['done', 'obsolete', 'discontinued'].includes(item.status) || item.status === before?.status) return null;
  return { event: item.status === 'done' ? 'done' : 'updated', actor: 'user', at,
    ...(item.status === 'done' ? {} : { note: `status:${item.status}` }) };
}

/** One logical millisecond resolves same-clock transitions, including several changes in one draft. */
export function recordTerminalTransitions(before, after, at = new Date().toISOString()) {
  const next = structuredClone(after);
  const previous = new Map((before.tasks ?? []).flatMap(task => objectItemEntries(task).map(({item,status}) => [`${task.id}/${item.id}`, {...item,status}])));
  let last = Math.max(0, ...(before.tasks ?? []).flatMap(task => objectItems(task).map(latestTerminalActivityTime)));
  for (const task of next.tasks ?? []) for (const {item,status} of objectItemEntries(task)) {
    const entry = terminalEntry(previous.get(`${task.id}/${item.id}`), {...item,status}, at);
    if (!entry) continue;
    last = Math.max(Date.parse(at), last + 1);
    entry.at = new Date(last).toISOString();
    item.activity = appendActivity(item.activity, entry);
  }
  return next;
}

/**
 * Appends an entry, keeping the first created entry and every start or takeover so the executors stay
 * known, the latest release and dispute, and only the most recent other entries.
 */
export function appendActivity(activity, entry) {
  const list = [...(Array.isArray(activity) ? activity : []), entry];
  const created = list.findIndex(item => item.event === "created");
  const latest = new Map();
  list.forEach((item, index) => { if (LATEST_EVENTS.has(item.event)) latest.set(item.event, index); });
  list.forEach((item, index) => { if (terminalActivityStatus(item)) latest.set('terminal', index); });
  const others = list.map((item, index) => index)
    .filter(index => list[index].event !== "created" && !PERMANENT_EVENTS.has(list[index].event) && !LATEST_EVENTS.has(list[index].event))
    .slice(-ACTIVITY_RECENT_LIMIT);
  const keep = new Set([...latest.values(), ...others]);
  if (created >= 0) keep.add(created);
  list.forEach((item, index) => { if (PERMANENT_EVENTS.has(item.event)) keep.add(index); });
  return list.filter((item, index) => keep.has(index));
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
  return objectItemEntries(task).map(({item})=>item);
}

function objectItemEntries(task) {
  return ITEM_FIELDS.flatMap(field => (task?.[field] ?? []).filter(item => item && typeof item === "object" && !Array.isArray(item))
    .map(item => ({item,status:item.status ?? (field === 'completed_items' ? 'done' : 'planned')})));
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
  let last = Math.max(0, ...(before?.tasks ?? []).flatMap(task => objectItems(task).map(latestTerminalActivityTime)));
  const beforeTasks = new Map((before?.tasks ?? []).map(task => [task.id, task]));
  for (const task of next.tasks ?? []) {
    if (task.kind === "report_pointer") continue;
    const previousTask = beforeTasks.get(task.id);
    const previousItems = new Map(objectItemEntries(previousTask).map(entry => [entry.item.id, entry]));
    const moved = movedIds(previousTask, task);
    for (const {item,status} of objectItemEntries(task)) {
      const previousEntry = previousItems.get(item.id);
      const previous = previousEntry?.item ?? null;
      const effectiveBefore = previous ? {...previous,status:previousEntry.status} : null;
      const effectiveAfter = {...item,status};
      const staged = item.activity?.findLast(entry => terminalActivityStatus(entry) === status);
      const newTerminal = staged && terminalActivityTime(item) > latestTerminalActivityTime(previous);
      const changed = !previous || content(previous) !== content(item) || moved.has(item.id) || newTerminal;
      const activity = previous?.activity;
      if (changed) {
        const entry = newTerminal ? { ...staged, actor: 'user' }
          : terminalEntry(effectiveBefore, effectiveAfter, at) ?? { event: activityEvent(effectiveBefore, effectiveAfter), actor: "user", at };
        if (terminalActivityStatus(entry)) {
          if (!newTerminal) entry.at = new Date(Math.max(Date.parse(at), last + 1)).toISOString();
          last = Math.max(last, Date.parse(entry.at));
        }
        const history = !previous && terminalActivityStatus(entry) ? appendActivity(activity, { event:'created', actor:'user', at:entry.at }) : activity;
        item.activity = appendActivity(history, entry);
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
  if (!Array.isArray(value) || value.length > ACTIVITY_MAX_ITEMS) {
    errors.push(issue("invalid_activity", path, `${path} 必須是最多 ${ACTIVITY_MAX_ITEMS} 筆的陣列。`));
    return;
  }
  value.forEach((entry, index) => {
    const entryPath = `${path}[${index}]`;
    const keys = entry && typeof entry === "object" && !Array.isArray(entry) ? Object.keys(entry) : null;
    const valid = keys
      && keys.every(key => ["event", "actor", "session", "session_id", "at", "note"].includes(key))
      && (entry.note === undefined || (typeof entry.note === "string" && entry.note.length > 0 && entry.note.length <= 300))
      && ACTIVITY_EVENTS.includes(entry.event)
      && typeof entry.actor === "string" && ACTOR_PATTERN.test(entry.actor)
      && ["session", "session_id"].every(key => entry[key] === undefined || (typeof entry[key] === "string" && entry[key].length > 0 && entry[key].length <= 100))
      && typeof entry.at === "string" && !Number.isNaN(Date.parse(entry.at));
    if (!valid) errors.push(issue("invalid_activity", entryPath, `${entryPath} 必須有 event、actor、at，session 與 session_id 可省略。`));
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

/** Tooltip text, one line per entry, oldest first; names the session by its name, never its ID. */
export function formatActivity(activity, now = Date.now()) {
  if (!Array.isArray(activity) || !activity.length) return "";
  return activity.map((entry) => {
    const who = entry.session ? `${entry.actor} (${entry.session})` : entry.actor;
    const when = relative(entry.at, now);
    const note = entry.note ? `：${entry.note}` : "";
    return `${LABELS[entry.event] ?? entry.event}：${who}${when ? ` · ${when}` : ""}${note}`;
  }).join("\n");
}
