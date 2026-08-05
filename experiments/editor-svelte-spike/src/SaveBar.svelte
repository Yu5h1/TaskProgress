<script>
  // Fixed save bar. Renders the bar's contents only — `hidden`, `data-state`,
  // `aria-live` and `aria-busy` belong to the mount container, which the host
  // owns and styles (`.edit-save-bar` is position: fixed and aligned to the
  // content panel). Class names are the Viewer's existing ones so the bar keeps
  // its styling instead of being restyled from scratch.
  export let dirty = false;
  export let saving = false;
  export let canUndo = false;
  export let canRedo = false;
  export let message = "";
  export let buttonLabel = "儲存";
  export let savingLabel = "正在儲存…";
  export let undoLabel = "復原";
  export let redoLabel = "重做";
  export let onSave = () => {};
  export let onUndo = () => {};
  export let onRedo = () => {};
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
<button
  class="primary-button edit-save-button"
  type="button"
  disabled={!dirty || saving}
  onclick={onSave}
>{saving ? savingLabel : buttonLabel}</button>
