<script>
  // Global preview/edit toggle. One implementation for every host: the class is
  // `view-mode-toggle` because that is where the Viewer's colours live, and
  // `editor-mode-dock` supplies position and size. The host owns permission,
  // draft lifecycle and persistence; this component only projects mode state.
  export let mode = "preview";
  export let available = true;
  export let disabled = false;
  export let hideWhenUnavailable = false;
  export let unavailableTitle = "";
  export let onToggle = () => {};

  $: editing = mode === "edit";
  $: currentLabel = editing ? "編輯模式" : "預覽模式";
  $: nextLabel = editing ? "預覽模式" : "編輯模式";
</script>

<button
  class="view-mode-toggle editor-mode-dock"
  type="button"
  aria-pressed={editing}
  aria-label={`目前為${currentLabel}；按下切換到${nextLabel}`}
  disabled={disabled || !available}
  hidden={hideWhenUnavailable && !available}
  title={!available ? unavailableTitle : ""}
  onclick={() => onToggle(editing ? "preview" : "edit")}
>{currentLabel}</button>
