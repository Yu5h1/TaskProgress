<script>
  // Hosts decision content in the same card and dialog components as Checklist.
  import { onMount, tick } from "svelte";
  import CardList from "./CardList.svelte";
  import FocusShield from "./FocusShield.svelte";
  import DialogShell from "./DialogShell.svelte";
  import CardDisclosure from "./CardDisclosure.svelte";
  import FilterStrip from "./FilterStrip.svelte";
  import { DEFAULT_CAPSULE_ID, createFilterSelection, loadFilterSelection, saveFilterSelection, isDefaultLit, toggleTag, toggleDefault } from "../../../viewer/assets/filter-selection.js";
  import ThemeControl from "./ThemeControl.svelte";
  import { createThemeControl } from "../../../viewer/assets/theme-control.js";
  import { createDecisionSession } from "../../../viewer/assets/decision-session.js";
  import { loadDisclosure, saveDisclosure } from "../../../viewer/assets/card-disclosure-state.js";
  export let transport;
  export let onPersistenceChange = () => {};
  let session, view, summary, message = "載入中…", expanded = true, overrides = {}, cardList;
  let selection = createFilterSelection(["pending", "decided"]);
  let filterKey = null;
  function setSelection(next) { selection = next; saveFilterSelection(filterKey, selection); }
  let theme, themeState, failedIds = new Set(), refreshing = false;
  let clearOpen = false;
  $: canClear = !!view && !view.pending && !view.busy && !refreshing &&
    (decisions.some(d => d.answer) || view.dirty);
  const queuedIds = new Set();
  let activeCard = null, heldOrder = null, shell;
  $: visibleDecisions = decisions.filter(d => heldOrder ? heldOrder.includes(d.id) : selection.selected.has(d.status));
  function releaseCard() { activeCard = null; heldOrder = null; }
  function trackCard(event) {
    const card = event.target?.closest?.(".arrangeable-card");
    if (!card || !shell?.contains(card)) { releaseCard(); return; }
    const id = card.dataset.cardId;
    if (activeCard === id) return;
    activeCard = id;
    const nextItems = decisions.filter(d => selection.selected.has(d.status) || d.id === id);
    heldOrder = cardList?.orderedIds(nextItems) ?? nextItems.map(d => d.id);
  }
  function readTheme() { themeState = {mode:theme.mode,custom:theme.custom,systemScheme:theme.systemScheme}; }
  $: decisions = view?.snapshot.document.decisions ?? [];
  $: dirty = !!view?.dirty || !!view?.pending;
  $: onPersistenceChange({ dirty, saving: !!view?.busy, pending: !!view?.pending || clearOpen || refreshing });
  $: storageKey = view ? `taskprogress.decisions:${view.snapshot.document_key}` : null;
  const sync = () => { view = session.view(); };
  const edit = (id, fields) => { session.edit(id, fields); sync(); };
  const confirmSelection = id => {
    queuedIds.add(id);
    failedIds = new Set([...failedIds].filter(key => key !== id));
    if (refreshing) return;
    const operation = session.saveOperation(id);
    if (operation) return send(id, operation);
  };
  function choose(id, choice) {
    const selected = session.select(id, choice);
    sync();
    confirmSelection(id);
    return selected;
  }
  function changeOther(id, text) {
    edit(id, {choice: "__other", other: text});
    confirmSelection(id);
  }
  function disclose(id, value) { overrides = { ...overrides, [id]: value }; saveDisclosure(storageKey, expanded, overrides); }
  function all(value) { expanded = value; overrides = {}; saveDisclosure(storageKey, expanded, overrides); }
  async function load() {
    try {
      const result = await transport.load();
      if (!result.ok) throw new Error(result.error.message);
      if (result.files) { summary = result; message = ""; return; }
      session = createDecisionSession(result); sync();
      filterKey = `taskprogress.filters.decisions.v1:${result.document_key}`;
      selection = loadFilterSelection(filterKey, ["pending", "decided"]);
      const saved = loadDisclosure(`taskprogress.decisions:${result.document_key}`); expanded = saved.expanded; overrides = saved.overrides;
      message = "";
    } catch (error) { message = error.message; }
  }
  onMount(() => {
    theme = createThemeControl(); readTheme();
    load();
    const leave = e => { if (dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", leave);
    document.addEventListener("pointerdown", trackCard, true);
    document.addEventListener("focusin", trackCard, true);
    window.addEventListener("blur", releaseCard);
    return () => {
      window.removeEventListener("beforeunload", leave);
      document.removeEventListener("pointerdown", trackCard, true);
      document.removeEventListener("focusin", trackCard, true);
      window.removeEventListener("blur", releaseCard);
      theme?.destroy?.();
    };
  });
  async function send(id, operation = "confirm", retry = false) {
    try {
      const request = retry ? session.retry() : operation === "clear_all" ? session.beginClearAll() : session.begin(id, operation);
      if (!retry) queuedIds.delete(request.decision_id);
      sync();
      message = "保存中…";
      let result;
      try { result = await transport.request(request); }
      catch (error) { session.failed(); sync(); message = `尚未收到操作結果：${error.message}。請查詢／重送同一筆操作；這不會復原舊答案。`; return; }
      session.complete(result); sync();
      message = result.ok ? (result.status === "already_applied" ? "原操作已完成；以下顯示目前最新狀態。" : request.operation === "clear_all" ? "已清除全部答案與理由，以下顯示最新狀態。" : "已保存；以下顯示最新狀態。") : result.error.message;
      if (!result.ok) {
        queuedIds.delete(request.decision_id);
        failedIds = new Set([...failedIds, request.decision_id]);
        refreshing = true;
        try {
          const fresh = await transport.load();
          if (fresh.ok) { session.merge(fresh); sync(); }
        } catch (error) { message = error.message; }
        finally { refreshing = false; }
      }
      if (request.operation === "clear_all") {
        if (result.ok) { queuedIds.clear(); failedIds = new Set(); releaseCard(); }
        return;
      }
      const nextId = [...queuedIds].find(key => !failedIds.has(key) && session.saveOperation(key));
      if (nextId) await send(nextId, session.saveOperation(nextId));
    } catch (error) { message = error.message; }
  }
  async function next() {
    const target = decisions.find(d => d.status === "pending");
    if (!target) return;
    if (!selection.selected.has("pending")) setSelection(toggleTag(selection, "pending"));
    disclose(target.id, true); await tick();
    cardList?.revealCard(target.id); await tick(); document.getElementById(`decision-${target.id}`)?.focus();
  }
</script>

<FocusShield />
<main class="checklist-shell decisions-shell" bind:this={shell}>
  <header class="checklist-header"><h1>決策項目</h1>
    {#if themeState}<ThemeControl mode={themeState.mode} custom={themeState.custom} systemScheme={themeState.systemScheme}
      onModeChange={mode => { theme.setMode(mode); readTheme(); }}
      onApplyCustom={palette => { theme.applyCustom(palette); readTheme(); }} />{/if}
  </header>
  {#if message}<p role="status">{message}</p>{/if}
  {#if summary}
    <p>待決策 {summary.pending}{summary.incomplete ? "（統計不完整）" : ""}</p>
    {#each summary.files as file}<article class="checklist-item">
      <a href={`?scope=${encodeURIComponent(summary.scope_id)}&task=${encodeURIComponent(file.task_id)}`}>{file.task_id}</a>
      <p>{file.error ?? `待決策 ${file.pending}／全部 ${file.total}`}</p>
    </article>{/each}
    {#if !summary.files.length}<p>尚未建立決策文件。</p>{/if}
  {:else if view}
    <div class="decision-overview">
    <p>待決策 {decisions.filter(d => d.status === "pending").length}／全部 {decisions.length}</p>
    <p>選項可隨時修改；「其他」文字一更動就自動保存，空白則為待決策。保存失敗會保留修改供重試。</p>
    </div>
    <div class="decision-controls">
    <button onclick={next} disabled={!decisions.some(d => d.status === "pending")}>下一項待決策</button>
    <button onclick={() => { if (canClear) clearOpen = true; }} disabled={!canClear}>清除全部答案</button>
    </div>
    {#if view.pending && !view.busy}<button onclick={() => send(null, null, true)}>{view.pending.operation === "clear_all" ? "查詢／重送清除操作" : "查詢／重送保存操作"}</button>{/if}
    {#if !visibleDecisions.length}<p>目前沒有符合條件的決策項目。</p>{/if}
    <CardList bind:this={cardList} items={visibleDecisions.map(d => ({...d,title:d.question}))} allIds={decisions.map(d => d.id)} {storageKey} {heldOrder}
      {expanded} onToggleAll={all} let:item let:visibilityEnabled let:visible let:onVisibleChange>
      <svelte:fragment slot="filters">
    <FilterStrip categories={[{id:"pending",label:"待決策"},{id:"decided",label:"已決策"}]} order={[DEFAULT_CAPSULE_ID,"pending","decided"]}
      selected={selection.selected} defaultLit={isDefaultLit(selection)} defaultLabel="全部"
      onSelect={id => setSelection(toggleTag(selection, id))} onSelectDefault={() => setSelection(toggleDefault(selection))} />
      </svelte:fragment>
      {@const draft = Object.hasOwn(view.drafts, item.id) ? view.drafts[item.id] : null}
      {@const choice = draft ? draft.choice : item.answer?.kind === "other" ? "__other" : item.answer?.option_id ?? ""}
      <article class="checklist-item decision-card" class:decision-has-visibility={visibilityEnabled}>
        <CardDisclosure {visibilityEnabled} {visible} {onVisibleChange} expanded={overrides[item.id] ?? expanded}
          onToggle={value => disclose(item.id, value)} contentId={`body-${item.id}`} label={item.question}>
          <header slot="header" class="checklist-item-header"><h2 id={`decision-${item.id}`} tabindex="-1">{item.question}</h2><span class="checklist-status">{item.status === "pending" ? "待決策" : "已決策"}</span></header>
          <div class="decision-content">
          {#if item.context || item.recommendation}<div class="decision-description">
          {#if item.context}<p class="decision-text">{item.context}</p>{/if}
          {#if item.recommendation}<p>建議：{item.options.find(o => o.id === item.recommendation.option_id)?.label} — {item.recommendation.reason}</p>{/if}
          </div>{/if}
            <fieldset disabled={refreshing || view.pending?.operation === "clear_all" || (!!view.pending && !view.busy) || draft?.conflict}>
              <legend class="decision-visually-hidden">{item.question}</legend>
              {#each item.options as option, index}
                <label class="decision-option"><input type="radio" name={`answer-${item.id}`} checked={choice === option.id}
                  onclick={event => { event.currentTarget.checked = choose(item.id, option.id) === option.id; }} />
                  <span>{String.fromCharCode(65 + index)}　{option.label}{option.id === item.recommendation?.option_id ? "（建議）" : ""}
                    {#if option.description}<small>{option.description}</small>{/if}</span></label>
              {/each}
              {#if item.allow_other}<label class="decision-option"><input type="radio" name={`answer-${item.id}`} checked={choice === "__other"}
                onclick={async event => { const selected = choose(item.id, "__other"); event.currentTarget.checked = selected === "__other"; await tick(); if (selected === "__other" && activeCard === item.id) document.getElementById(`other-${item.id}`)?.focus(); }} /><span>其他</span></label>
                <div class="decision-other"><label for={`other-${item.id}`}>其他方案與理由</label><textarea id={`other-${item.id}`} value={draft ? draft.other : item.answer?.kind === "other" ? item.answer.text : ""} oninput={e => changeOther(item.id, e.currentTarget.value)}></textarea></div>{/if}
            </fieldset>
          {#if draft?.conflict}<p role="alert">此題已變更，原草稿保留：{draft.choice} {draft.other}</p>
            <button disabled={refreshing || !!view.pending} onclick={() => { session.rebase(item.id); sync(); confirmSelection(item.id); }}>已核對最新題目，套用選擇</button>{/if}
          <div class="decision-actions">
          {#if failedIds.has(item.id) && draft && !draft.conflict && !view.pending}<button disabled={refreshing} onclick={() => confirmSelection(item.id)}>重試保存</button>{/if}
          </div>

          </div>
        </CardDisclosure>
      </article>
    </CardList>
    {#each Object.entries(view.drafts).filter(([id]) => !decisions.some(d => d.id === id)) as [id, draft]}
      <p role="alert">已移除題目 {id} 的原草稿：{draft.choice} {draft.other}</p>
      <button onclick={() => { session.discard(id); sync(); }}>關閉已移除題目提示</button>
    {/each}
  {/if}
</main>
<DialogShell open={clearOpen} title="清除全部決策答案？" titleId="decision-clear-title"
  kicker="決策項目" onClose={() => { clearOpen = false; }} let:close>
  <p>將清除目前文件「{view?.snapshot.document.task_id}」全部 {decisions.length} 題的答案、「其他」理由及尚未保存的輸入，包含篩選後隱藏的題目。所有題目回到待決策，題目與選項保留。</p>
  <p>此操作無法復原。</p>
  <form class="theme-dialog-actions" onsubmit={event => {
    event.preventDefault();
    if (!canClear) return;
    close();
    send(null, "clear_all");
  }}>
    <button type="button" class="secondary-button" onclick={close}>取消</button>
    <button type="submit" class="primary-button" disabled={!canClear}>確認清除全部</button>
  </form>
</DialogShell>
<style>
  .decision-card { display:grid; grid-template-columns:auto minmax(0, 1fr); column-gap:8px; padding-inline-start:12px; }
  .decision-card.decision-has-visibility { grid-template-columns:auto auto minmax(0, 1fr); }
  .decision-card > :global(.card-disclosure-heading) { display:contents; }
  .decision-card > :global(.card-disclosure-heading > .card-disclosure-toggle) { grid-column:1; grid-row:1; align-self:center; margin:0; }
  .decision-card > :global(.card-disclosure-heading > .card-visibility-toggle) { grid-column:2; grid-row:1; align-self:center; }
  .decision-card .checklist-item-header { grid-column:-2 / -1; grid-row:1; padding-block:12px; }
  .decision-card :global(.card-disclosure-collapsed > .checklist-item-header) { padding-block:7px; }
  .decision-card > :global(.card-disclosure-body) { grid-column:-2 / -1; grid-row:2; min-width:0; }
  .decision-content { display:grid; gap:20px; min-width:0; padding:4px 18px 18px; line-height:1.45; }
  .decision-description { display:grid; gap:4px; }
  .decision-overview { display:grid; gap:4px; margin:10px 0 18px; }
  .decision-overview p { margin:0; }
  .decision-controls { display:grid; justify-items:start; gap:12px; margin-bottom:20px; }
  .decision-controls > button { margin:0; }
  .decisions-shell :global(.arrangeable-cards) { gap:20px; }
  .checklist-item-header h2 { flex:1; min-width:0; overflow-wrap:anywhere; }
  .decision-option { display:grid; grid-template-columns:1rem minmax(0, 1fr); gap:10px; align-items:start; padding:4px 0; line-height:1.4; }
  .decision-option input { width:1rem; height:1rem; margin:4px 0 0; }
  .decision-option span { min-width:0; overflow-wrap:anywhere; }
  .decision-option small { display:block; margin-top:2px; color:var(--muted); }
  .decision-other { display:grid; gap:6px; margin-top:14px; margin-inline-start:calc(1rem + 10px); }
  textarea { display:block; width:100%; min-height:5rem; padding:10px 12px; box-sizing:border-box; font:inherit; resize:vertical; }
  fieldset { min-width:0; margin:0; padding:0; border:0; }
  .decision-visually-hidden { position:absolute; width:1px; height:1px; padding:0; overflow:hidden; clip-path:inset(50%); white-space:nowrap; }
  .decision-text { white-space:pre-wrap; overflow-wrap:anywhere; }
  .decision-actions { display:flex; flex-wrap:wrap; gap:8px; padding-top:12px; border-top:1px solid var(--line); }
  .decision-actions:empty { display:none; }
  button { margin:.4rem .4rem .4rem 0; }
  .decision-content button { justify-self:start; margin:0; }
  .decisions-shell { max-width:1000px; margin:auto; padding:1rem; }
</style>
