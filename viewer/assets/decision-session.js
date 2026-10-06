// Keeps per-question drafts independent from the persisted snapshot and request receipts.
const clone = value => structuredClone(value);
const canonical = value => value && typeof value === "object"
  ? Array.isArray(value) ? value.map(canonical) : Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])])) : value;
const same = (a, b) => JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));
export function createDecisionSession(initial) {
  let snapshot = clone(initial), drafts = Object.create(null), pending = null, sentDraft = null, busy = false;
  const find = id => snapshot.document.decisions.find(d => d.id === id);
  function view() { return { snapshot: clone(snapshot), drafts: clone(drafts), pending: clone(pending), busy, dirty: Object.keys(drafts).length > 0 }; }
  function merge(next) {
    for (const [id, draft] of Object.entries(drafts)) {
      const current = next.document.decisions.find(d => d.id === id);
      draft.conflict = !current || !same(draft.base, current);
    }
    snapshot = clone(next);
  }
  return {
    view,
    canConfirm(id) {
      const draft = drafts[id], decision = find(id);
      return !pending && !busy && !!decision && !!draft && !draft.conflict &&
        (draft.choice === "__other" ? decision.allow_other && !!draft.other.trim() :
          decision.options.some(option => option.id === draft.choice));
    },
    saveOperation(id) {
      const draft = drafts[id];
      if (pending || busy || !draft || draft.conflict || !find(id)) return null;
      if (this.canConfirm(id)) return "confirm";
      if (find(id).answer && draft.cleared && !draft.choice) return "reopen";
      return find(id).answer && find(id).allow_other && draft.choice === "__other" && !draft.other.trim() ? "reopen" : null;
    },
    edit(id, fields) {
      if ((pending && !busy) || pending?.operation === "clear_all" || !find(id)) return;
      const answer = find(id).answer;
      drafts[id] ??= { base: clone(find(id)), choice: answer?.kind === "other" ? "__other" : answer?.option_id ?? "",
        other: answer?.kind === "other" ? answer.text : "", conflict: false };
      Object.assign(drafts[id], { cleared: false }, fields);
      if (drafts[id].cleared && !drafts[id].other && !answer && pending?.decision_id !== id) delete drafts[id];
    },
    select(id, choice) {
      if ((pending && !busy) || pending?.operation === "clear_all" || !find(id) || drafts[id]?.conflict) return;
      const answer = find(id).answer;
      const current = drafts[id]?.choice ?? (answer?.kind === "other" ? "__other" : answer?.option_id ?? "");
      const next = current === choice ? "" : choice;
      this.edit(id, next ? { choice: next } : { choice: "", cleared: true });
      return next;
    },
    discard(id) { if (pending?.decision_id !== id) delete drafts[id]; },
    rebase(id) {
      const current = find(id), draft = drafts[id];
      if (!draft || !current) return;
      if (draft.choice && ((draft.choice !== "__other" && !current.options.some(o => o.id === draft.choice)) ||
          (draft.choice === "__other" && !current.allow_other))) {
        draft.choice = ""; draft.cleared = false;
      }
      draft.base = clone(current); draft.conflict = false;
      if (draft.cleared && !draft.other && !current.answer) delete drafts[id];
    },
    merge,
    beginClearAll() {
      if (pending || busy) throw new Error("請先查核上一筆請求的結果。");
      pending = { operation: "clear_all", expected_revision: snapshot.revision,
        request_id: crypto.randomUUID(), payload: {} };
      sentDraft = null; busy = true;
      return clone(pending);
    },
    begin(id, operation = "confirm") {
      if (pending || busy) throw new Error("請先查核上一筆請求的結果。");
      const decision = find(id), draft = drafts[id];
      let payload = {};
      if (operation === "confirm") {
        if (!draft || draft.conflict || !draft.choice) throw new Error("請選擇答案並處理衝突。");
        if (draft.choice === "__other") {
          if (!draft.other.trim()) throw new Error("請輸入其他方案。");
          payload = { kind: "other", text: draft.other };
        } else payload = { kind: "option", option_id: draft.choice };
      }
      pending = { operation, decision_id: id, expected_revision: snapshot.revision,
        expected_version: decision.version, request_id: crypto.randomUUID(), payload };
      sentDraft = draft ? clone(draft) : null;
      busy = true;
      return clone(pending);
    },
    retry() { if (!pending || busy) throw new Error("沒有待查核請求。"); busy = true; return clone(pending); },
    failed() { busy = false; },
    complete(response) {
      busy = false;
      if (!response.ok) { pending = null; sentDraft = null; return; }
      if (pending?.operation === "clear_all") {
        drafts = Object.create(null); pending = null; sentDraft = null;
        merge(response); return;
      }
      const id = pending?.decision_id;
      const draft = drafts[id];
      const changed = draft && sentDraft && (draft.choice !== sentDraft.choice || draft.other !== sentDraft.other);
      const preserved = draft && (changed || (pending?.operation === "reopen" && (!draft.cleared || draft.other))) ? clone(draft) : null;
      if (pending) delete drafts[pending.decision_id];
      pending = null; sentDraft = null;
      merge(response);
      if (preserved) {
        const current = find(id);
        // Only our answer changed; a concurrent question revision must still require review.
        const definition = value => {
          if (!value) return null;
          const { answer, status, last_request, ...rest } = value;
          return rest;
        };
        preserved.conflict = !current || !same(definition(preserved.base), definition(current));
        if (!preserved.conflict) preserved.base = clone(current);
        if (!(preserved.cleared && !preserved.other && !preserved.conflict && !current.answer)) drafts[id] = preserved;
      }
    }
  };
}
