<script>
  // Hosts decision content in the same card and dialog components as Checklist.
  import { onMount, tick } from "svelte";
  import CardList from "./CardList.svelte";
  import CardDisclosure from "./CardDisclosure.svelte";
  import FilterStrip from "./FilterStrip.svelte";
  import { DEFAULT_CAPSULE_ID, createFilterSelection, isDefaultLit, toggleTag, toggleDefault } from "../../../viewer/assets/filter-selection.js";
  import ThemeControl from "./ThemeControl.svelte";
  import { createThemeControl } from "../../../viewer/assets/theme-control.js";
  import { createDecisionSession } from "../../../viewer/assets/decision-session.js";
  import { loadDisclosure, saveDisclosure } from "../../../viewer/assets/card-disclosure-state.js";
  export let transport;
  export let onPersistenceChange = () => {};
  let session, view, summary, message = "載入中…", expanded = true, overrides = {}, cardList;
  let selection = createFilterSelection(["pending", "decided"]);
  let theme, themeState, failedId = null, replacementId = null;
  function readTheme() { themeState = {mode:theme.mode,custom:theme.custom,systemScheme:theme.systemScheme}; }
  $: decisions = view?.snapshot.document.decisions ?? [];
  $: dirty = !!view?.dirty || !!view?.pending;
  $: onPersistenceChange({ dirty, saving: !!view?.busy, pending: !!view?.pending });
  $: storageKey = view ? `taskprogress.decisions:${view.snapshot.document_key}` : null;
  const sync = () => { view = session.view(); };
  const edit = (id, fields) => { session.edit(id, fields); sync(); };
  const confirmSelection = id => { const operation = session.saveOperation(id); if (operation) return send(id, operation); };
  function choose(id, choice) {
    if (view.pending) return;
    edit(id, {choice});
    if (choice !== "__other" || !view.drafts[id]?.other.trim()) return confirmSelection(id);
  }
  function finishOther(id, event) {
    // Let a replacement choice win over the textarea blur.
    const target = event.relatedTarget;
    if (replacementId === id || target?.closest("fieldset") === event.currentTarget.closest("fieldset")) return;
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
      const saved = loadDisclosure(`taskprogress.decisions:${result.document_key}`); expanded = saved.expanded; overrides = saved.overrides;
      message = "";
    } catch (error) { message = error.message; }
  }
  onMount(() => {
    theme = createThemeControl(); readTheme();
    load();
    const leave = e => { if (dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", leave);
    return () => { window.removeEventListener("beforeunload", leave); theme?.destroy?.(); };
  });
  async function send(id, operation = "confirm", retry = false) {
    try {
      const request = retry ? session.retry() : session.begin(id, operation); failedId = null; sync();
      let result;
      try { result = await transport.request(request); }
      catch (error) { session.failed(); sync(); message = `結果未確認：${error.message}`; return; }
      session.complete(result); sync();
      message = result.ok ? "已保存；以下顯示最新狀態。" : result.error.message;
      if (!result.ok) {
        failedId = request.decision_id;
        const fresh = await transport.load();
        if (fresh.ok) { session.merge(fresh); sync(); }
      }
    } catch (error) { message = error.message; }
  }
  async function next() {
    const target = decisions.find(d => d.status === "pending");
    if (!target) return;
    if (!selection.selected.has("pending")) selection = toggleTag(selection, "pending");
    disclose(target.id, true); await tick();
    cardList?.revealCard(target.id); await tick(); document.getElementById(`decision-${target.id}`)?.focus();
  }
</script>

<main class="checklist-shell decisions-shell">
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
    <p>選項可隨時修改，選取即保存；「其他」填寫理由後離開輸入框保存，空白則為待決策。保存失敗會保留修改供重試。</p>
    </div>
    <div class="decision-controls">
    <button onclick={next} disabled={!decisions.some(d => d.status === "pending")}>下一項待決策</button>

    </div>
    {#if view.pending && !view.busy}<button onclick={() => send(null, null, true)}>查核／重試原請求</button>{/if}
    {#if !decisions.some(d => selection.selected.has(d.status))}<p>目前沒有符合條件的決策項目。</p>{/if}
    <CardList bind:this={cardList} items={decisions.filter(d => selection.selected.has(d.status)).map(d => ({...d,title:d.question}))} allIds={decisions.map(d => d.id)} {storageKey}
      {expanded} onToggleAll={all} let:item let:visibilityEnabled let:visible let:onVisibleChange>
      <svelte:fragment slot="filters">
    <FilterStrip categories={[{id:"pending",label:"待決策"},{id:"decided",label:"已決策"}]} order={[DEFAULT_CAPSULE_ID,"pending","decided"]}
      selected={selection.selected} defaultLit={isDefaultLit(selection)} defaultLabel="全部"
      onSelect={id => selection = toggleTag(selection, id)} onSelectDefault={() => selection = toggleDefault(selection)} />
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
            <fieldset disabled={!!view.pending || draft?.conflict}
              onpointerdown={e => replacementId = e.target.closest(".decision-option") ? item.id : null}
              onpointerup={() => replacementId = null} onpointercancel={() => replacementId = null}>
              <legend class="decision-visually-hidden">{item.question}</legend>
              {#each item.options as option, index}
                <label class="decision-option"><input type="radio" name={`answer-${item.id}`} checked={choice === option.id}
                  onchange={() => choose(item.id, option.id)} />
                  <span>{String.fromCharCode(65 + index)}　{option.label}{option.id === item.recommendation?.option_id ? "（建議）" : ""}
                    {#if option.description}<small>{option.description}</small>{/if}</span></label>
              {/each}
              {#if item.allow_other}<label class="decision-option"><input type="radio" name={`answer-${item.id}`} checked={choice === "__other"}
                onchange={async () => { await choose(item.id, "__other"); await tick(); document.getElementById(`other-${item.id}`)?.focus(); }} /><span>其他</span></label>
                <div class="decision-other"><label for={`other-${item.id}`}>其他方案與理由</label><textarea id={`other-${item.id}`} value={draft ? draft.other : item.answer?.kind === "other" ? item.answer.text : ""} oninput={e => edit(item.id, {choice:"__other", other:e.currentTarget.value})} onblur={e => finishOther(item.id, e)}></textarea></div>{/if}
            </fieldset>
          {#if draft?.conflict}<p role="alert">此題已變更，原草稿保留：{draft.choice} {draft.other}</p>
            <button disabled={!!view.pending} onclick={() => { session.rebase(item.id); sync(); confirmSelection(item.id); }}>已核對最新題目，套用選擇</button>{/if}
          <div class="decision-actions">
          {#if failedId === item.id && draft && !draft.conflict && !view.pending}<button onclick={() => confirmSelection(item.id)}>重試保存</button>{/if}
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
