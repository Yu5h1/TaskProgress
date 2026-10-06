// Keeps per-question drafts independent from the persisted snapshot and request receipts.
const clone = value => structuredClone(value);
const canonical = value => value && typeof value === "object"
  ? Array.isArray(value) ? value.map(canonical) : Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])])) : value;
const same = (a, b) => JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));
export function createDecisionSession(initial) {
  let snapshot = clone(initial), drafts = Object.create(null), pending = null, busy = false;
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
      return find(id).answer && find(id).allow_other && draft.choice === "__other" && !draft.other.trim() ? "reopen" : null;
    },
    edit(id, fields) {
      if (pending || !find(id)) return;
      const answer = find(id).answer;
      drafts[id] ??= { base: clone(find(id)), choice: answer?.kind === "other" ? "__other" : answer?.option_id ?? "",
        other: answer?.kind === "other" ? answer.text : "", conflict: false };
      Object.assign(drafts[id], fields);
    },
    discard(id) { if (pending?.decision_id !== id) delete drafts[id]; },
    rebase(id) {
      const current = find(id), draft = drafts[id];
      if (!draft || !current) return;
      if (draft.choice !== "__other" && !current.options.some(o => o.id === draft.choice)) draft.choice = "";
      if (draft.choice === "__other" && !current.allow_other) draft.choice = "";
      draft.base = clone(current); draft.conflict = false;
    },
    merge,
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
      busy = true;
      return clone(pending);
    },
    retry() { if (!pending || busy) throw new Error("沒有待查核請求。"); busy = true; return clone(pending); },
    failed() { busy = false; },
    complete(response) {
      busy = false;
      if (!response.ok) { pending = null; return; }
      const clearing = pending?.operation === "reopen" ? pending.decision_id : null;
      const preserved = clearing && drafts[clearing] ? clone(drafts[clearing]) : null;
      if (pending) delete drafts[pending.decision_id];
      pending = null;
      merge(response);
      if (preserved && find(clearing)?.status === "pending") {
        preserved.base = clone(find(clearing)); preserved.conflict = false;
        drafts[clearing] = preserved;
      }
    }
  };
}
