// One microtask per synchronous render batch. Each action reads its latest
// options when flushed; removing it also releases a disconnected host.
export function createActionQueue(enqueue = queueMicrotask) {
  const pending = new Set();
  let queued = false;
  const flush = () => {
    queued = false;
    const batch = [...pending];
    for (const action of batch) {
      if (!pending.delete(action)) continue;
      try { action.flush(); }
      catch (error) { enqueue(() => { throw error; }); }
    }
  };
  return {
    add(action) { pending.add(action); if (!queued) { queued = true; enqueue(flush); } },
    delete(action) { pending.delete(action); },
  };
}
