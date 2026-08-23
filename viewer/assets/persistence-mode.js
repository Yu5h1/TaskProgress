/*
 * Shared persistence mode for every surface that can write.
 *
 * `auto` is the default: discrete commands commit immediately, text commands
 * commit after a short debounce, and Undo/Redo are ordinary changes that follow
 * the same path. `cautious` keeps an in-memory draft and is the only mode that
 * offers Save and Discard. Both modes drive the same editor transaction, the
 * same validation, and the same revision-checked save function — this module
 * decides *when* a commit happens, never *how* one is written.
 *
 * Framework-neutral by contract: no DOM, no component import. Browser storage
 * stops here (the `theme-control.js` pattern), so shared components stay free of
 * it.
 */
export const CAUTIOUS_MODE_STORAGE_KEY = "task-progress.cautious-mode.v1";

const AUTO_READY = "自動儲存模式。";
const CAUTIOUS_READY = "謹慎模式：修改後需按儲存。";
const DRAFT = "有尚未儲存的變更。";
const PENDING = "即將自動儲存…";
const SAVING = "正在寫入…";
const SAVED = "已儲存。";
const DISCARDED = "已放棄尚未儲存的變更。";
const NOTHING_TO_SAVE = "沒有需要儲存的變更。";
const SAVE_FAILED = "儲存失敗。";
const SAVE_CANCELLED = "已取消儲存；草稿仍保留。";
const MODE_BLOCKED = "謹慎模式仍有未儲存草稿；請先儲存或放棄再切換。";

export function loadCautiousPreference(storage = globalThis.localStorage) {
  try {
    return storage?.getItem(CAUTIOUS_MODE_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function saveCautiousPreference(storage, cautious) {
  const value = cautious === true;
  try {
    storage?.setItem(CAUTIOUS_MODE_STORAGE_KEY, value ? "true" : "false");
  } catch {
    // A profile without writable storage keeps the session's mode only.
  }
  return value;
}

export function createPersistenceController({
  session,
  save,
  storage = globalThis.localStorage ?? null,
  debounceMs = 400,
  debounceCommand = () => false,
  confirmSave = null,
  timers = globalThis,
  onChange = () => {},
} = {}) {
  if (!session
    || typeof session.snapshot !== "function"
    || typeof session.dispatch !== "function"
    || typeof session.prepareSave !== "function") {
    throw new TypeError("Persistence controller 需要既有的 editor session。");
  }
  if (typeof save !== "function") {
    throw new TypeError("Persistence controller 需要 save 函式。");
  }

  let cautious = loadCautiousPreference(storage);
  let status = "idle";
  let message = cautious ? CAUTIOUS_READY : AUTO_READY;
  let blocked = false;
  let timer = null;
  let queue = Promise.resolve();
  let queued = 0;

  const view = () => session.snapshot();

  function snapshot() {
    // The session's own view passes through whole: enumerating its fields here
    // would make this controller know what kind of document it is persisting.
    const current = view();
    return Object.freeze({
      ...current,
      mode: cautious ? "cautious" : "auto",
      cautious,
      status,
      message,
      blocked,
      saving: status === "saving",
      pending: timer !== null || queued > 0,
    });
  }

  function notify() {
    onChange(snapshot());
  }

  function setStatus(next, text) {
    status = next;
    message = text;
  }

  function cancelTimer() {
    if (timer === null) return;
    timers.clearTimeout(timer);
    timer = null;
  }

  async function runSave(manual) {
    // A paused automatic mode keeps collecting draft changes; only an explicit
    // save resumes writing after a conflict or a write error.
    if (blocked && !manual) return;
    if (!view().dirty) {
      if (manual) {
        setStatus("idle", NOTHING_TO_SAVE);
        notify();
      }
      return;
    }
    const prepared = session.prepareSave();
    const errors = Array.isArray(prepared.errors) ? prepared.errors : [];
    if (errors.length) {
      // An incomplete draft (a failure without Observed) is never written and
      // never pauses the mode — the next valid edit commits it.
      setStatus("incomplete", errors[0].message);
      notify();
      return;
    }
    const { errors: _errors, ...payload } = prepared;
    if (typeof confirmSave === "function" && await confirmSave(payload, { manual }) === false) {
      setStatus("cancelled", SAVE_CANCELLED);
      notify();
      return;
    }
    blocked = false;
    setStatus("saving", SAVING);
    notify();
    try {
      const saved = await save(payload);
      session.commit(saved);
      setStatus("saved", SAVED);
    } catch (error) {
      // The draft stays on screen; the source is untouched.
      blocked = true;
      setStatus(
        error?.code === "revision_conflict" ? "conflict" : "error",
        error?.message ?? SAVE_FAILED,
      );
    }
    notify();
  }

  function commitNow(manual = false) {
    cancelTimer();
    queued += 1;
    queue = queue
      .then(() => runSave(manual))
      .catch((error) => {
        blocked = true;
        setStatus("error", error?.message ?? SAVE_FAILED);
        notify();
      })
      .finally(() => {
        queued -= 1;
      });
    return queue;
  }

  async function flush() {
    for (let guard = 0; guard < 8; guard += 1) {
      if (timer !== null) commitNow();
      await queue;
      if (timer === null && queued === 0) return;
    }
  }

  function schedule(debounce) {
    if (cautious) {
      if (!blocked) setStatus("draft", DRAFT);
      return null;
    }
    if (blocked) return null;
    if (!debounce) return commitNow();
    cancelTimer();
    setStatus("pending", PENDING);
    timer = timers.setTimeout(() => {
      timer = null;
      commitNow();
    }, debounceMs);
    return null;
  }

  function afterChange(debounce) {
    const pending = schedule(debounce);
    notify();
    return pending;
  }

  async function setCautious(next) {
    const value = next === true;
    if (value === cautious) return snapshot();
    if (value) {
      // Entering cautious mode must not strand an automatic commit in flight.
      await flush();
      cautious = true;
    } else {
      if (view().dirty) {
        setStatus("mode_blocked", MODE_BLOCKED);
        notify();
        return snapshot();
      }
      cautious = false;
    }
    saveCautiousPreference(storage, cautious);
    if (!blocked) setStatus("idle", cautious ? CAUTIOUS_READY : AUTO_READY);
    notify();
    return snapshot();
  }

  return Object.freeze({
    snapshot,
    dispatch(command) {
      const changed = session.dispatch(command);
      if (changed === false) {
        notify();
        return null;
      }
      return afterChange(debounceCommand(command) === true);
    },
    changed(command = {}) {
      return afterChange(debounceCommand(command) === true);
    },
    undo() {
      session.undo();
      return afterChange(false);
    },
    redo() {
      session.redo();
      return afterChange(false);
    },
    discard() {
      cancelTimer();
      session.discard();
      blocked = false;
      setStatus("idle", DISCARDED);
      notify();
      return snapshot();
    },
    save() {
      return commitNow(true);
    },
    flush,
    setCautious,
  });
}
