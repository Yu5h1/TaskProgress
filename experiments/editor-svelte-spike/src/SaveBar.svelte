<script>
  // Fixed save bar. Renders the bar's contents only — `hidden`, `data-state`,
  // `aria-live` and `aria-busy` belong to the mount container, which the host
  // owns and styles (`.edit-save-bar` is position: fixed and aligned to the
  // content panel). Class names are the Viewer's existing ones so the bar keeps
  // its styling instead of being restyled from scratch.
  //
  // `cautious` is the persistence mode, not a host knob: Save and Discard exist
  // only in cautious mode, while status and Undo/Redo exist in both. Automatic
  // mode is the shared default; each host passes the controller's current mode.
  export let cautious = false;
  export let onToggleCautious = null;
  export let cautiousLabel = "謹慎模式";
  export let dirty = false;
  export let saving = false;
  export let canUndo = false;
  export let canRedo = false;
  export let message = "";
  export let buttonLabel = "儲存";
  export let savingLabel = "正在儲存…";
  export let undoLabel = "復原";
  export let redoLabel = "重做";
  export let discardLabel = "放棄";
  export let onSave = () => {};
  export let onUndo = () => {};
  export let onRedo = () => {};
  export let onDiscard = () => {};
</script>

<span class="edit-save-status" id="edit-save-status" role="status">{message}</span>
<span class="edit-history-actions">
  <button
    class="secondary-button edit-history-button"
    type="button"
    aria-label={`${undoLabel}上一個修改`}
    disabled={!canUndo || saving}
    onclick={onUndo}
  >{undoLabel}</button>
  <button
    class="secondary-button edit-history-button"
    type="button"
    aria-label={`${redoLabel}下一個修改`}
    disabled={!canRedo || saving}
    onclick={onRedo}
  >{redoLabel}</button>
</span>
{#if onToggleCautious}
  <button
    class="secondary-button edit-mode-button"
    type="button"
    aria-pressed={cautious}
    aria-label={`${cautiousLabel}：改為手動儲存與放棄`}
    disabled={saving}
    onclick={() => onToggleCautious(!cautious)}
  >{cautiousLabel}</button>
{/if}
{#if cautious}
  <button
    class="secondary-button edit-discard-button"
    type="button"
    aria-label="放棄全部修改"
    disabled={saving}
    onclick={onDiscard}
  >{discardLabel}</button>
  <button
    class="primary-button edit-save-button"
    type="button"
    disabled={!dirty || saving}
    onclick={onSave}
  >{saving ? savingLabel : buttonLabel}</button>
{/if}
