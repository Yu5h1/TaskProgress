<script>
  import DialogShell from "./DialogShell.svelte";

  // Controlled history projection: the host owns commands, persistence and labels.
  // Supply a unique id when mounting more than one tool in the same document.
  export let id = "history-tools";
  export let history = { entries: [], undoDepth: 0, redoDepth: 0, canUndo: false, canRedo: false, canClear: false };
  export let disabled = false;
  export let onUndo = () => {};
  export let onRedo = () => {};
  export let onClear = () => {};
  export let onOpenChange = () => {};
  let open = false, confirming = false;
  function setOpen(value) { open = value; confirming = false; onOpenChange(value); }
  function clear() {
    if (disabled || !history.canClear) return;
    onClear(); confirming = false;
  }
</script>

<div class="history-capsule" role="group" aria-label="編輯歷史">
  <button type="button" aria-label={`復原（${history.undoDepth}）`} title={`復原（${history.undoDepth}）`}
    disabled={disabled || !history.canUndo} onclick={onUndo}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4 4 9l5 5M4 9h9a7 7 0 0 1 0 14" transform="translate(0 -2)" /></svg>
  </button>
  <button type="button" aria-label={`重做（${history.redoDepth}）`} title={`重做（${history.redoDepth}）`}
    disabled={disabled || !history.canRedo} onclick={onRedo}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 4 5 5-5 5m5-5h-9a7 7 0 0 0 0 14" transform="translate(0 -2)" /></svg>
  </button>
  <button type="button" aria-label="開啟歷史面板" title="歷史面板" aria-haspopup="dialog"
    aria-expanded={open} aria-controls={`${id}-dialog`} disabled={disabled} onclick={() => setOpen(true)}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 3v18m4-12h5m-5 4h5m-5 4h3" /></svg>
  </button>
</div>

<DialogShell {open} id={`${id}-dialog`} title="編輯歷史" titleId={`${id}-title`} onClose={() => setOpen(false)}>
  <div class="history-panel">
    <p class="history-note">紀錄只保留在目前頁面，重新整理或離開後會清除。復原與重做仍依編輯器的保存方式處理。</p>
    <div class="history-actions" role="group" aria-label="逐步操作歷史">
      <button type="button" disabled={disabled || !history.canUndo} onclick={onUndo}>復原一步</button>
      <button type="button" disabled={disabled || !history.canRedo} onclick={onRedo}>重做一步</button>
    </div>
    <p class="history-position" role="status">目前位置：{history.undoDepth}／{history.entries.length}；可重做 {history.redoDepth} 步</p>
    {#if history.entries.length}
      <ol class="history-entries" aria-label="操作紀錄">
        {#if history.undoDepth === 0}<li class="history-cursor" aria-current="step">目前位置：保留紀錄的起點</li>{/if}
        {#each history.entries as entry (entry.id)}
          <li class:history-redo={!entry.applied}>
            <span>{entry.label}</span><small>{entry.applied ? "已套用" : "可重做"}</small>
          </li>
          {#if entry.applied && entry.id === history.entries[history.undoDepth - 1]?.id}
            <li class="history-cursor" aria-current="step">目前位置</li>
          {/if}
        {/each}
      </ol>
    {:else}<p class="history-note">尚無操作紀錄。</p>{/if}
    <div class="history-clear">
      {#if confirming}
        <p>清除全部復原與重做紀錄？目前內容與已保存資料會保留，清除後無法復原這些紀錄。</p>
        <div class="history-actions">
          <button type="button" disabled={disabled || !history.canClear} onclick={clear}>確認清除歷史</button>
          <button type="button" onclick={() => { confirming = false; }}>取消</button>
        </div>
      {:else}
        <button type="button" disabled={disabled || !history.canClear} onclick={() => { confirming = true; }}>清除歷史…</button>
      {/if}
    </div>
  </div>
</DialogShell>

<style>
  .history-capsule { display:inline-flex; align-items:center; padding:3px; border:1px solid var(--history-border, var(--color-border, GrayText)); border-radius:999px; background:var(--history-surface, var(--color-panel-bg, Canvas)); }
  .history-capsule, .history-panel { color:var(--history-text, var(--color-item-text, CanvasText)); }
  button { font:inherit; color:inherit; background:var(--history-surface, var(--color-panel-bg, Canvas)); border:1px solid var(--history-border, var(--color-border, GrayText)); border-radius:6px; padding:6px 12px; cursor:pointer; }
  .history-capsule button { display:grid; place-items:center; width:40px; height:36px; margin:0; padding:8px; border:0; border-radius:999px; background:transparent; }
  button:disabled { opacity:.4; cursor:default; }
  button:focus-visible { outline:2px solid var(--history-accent, var(--color-accent, Highlight)); outline-offset:2px; }
  .history-capsule button:hover:not(:disabled) { background:var(--history-hover, var(--color-reference-bg, ButtonFace)); }
  svg { width:20px; height:20px; fill:none; stroke:currentColor; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
  .history-panel { display:grid; gap:14px; min-width:0; }
  p { margin:0; }
  .history-note, small { color:var(--history-muted, var(--color-secondary-text, GrayText)); }
  .history-actions { display:flex; flex-wrap:wrap; gap:8px; }
  .history-actions button, .history-clear button { margin:0; }
  .history-entries { display:grid; gap:6px; max-height:40vh; overflow:auto; padding:0; margin:0; list-style:none; }
  .history-entries li { display:flex; align-items:baseline; gap:12px; padding:8px 10px; border-radius:6px; overflow-wrap:anywhere; }
  .history-entries span { flex:1; min-width:0; }
  small { flex-shrink:0; }
  .history-redo { opacity:.65; }
  .history-entries .history-cursor { color:var(--history-accent, var(--color-accent, Highlight)); border-block:1px solid var(--history-border, var(--color-border, GrayText)); font-size:.85em; }
  .history-clear { display:grid; gap:10px; border-top:1px solid var(--history-border, var(--color-border, GrayText)); padding-top:14px; }
</style>
