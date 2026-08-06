<script>
  import { WEEKDAY_OPTIONS } from "../../../viewer/assets/time-dialog-control.js";

  /*
   * The local-only capacity quick-recalculate form. It only appears while the
   * whole report is in global edit mode (the host ties `capacityEditorOpen` to
   * the same edit session, not to a separate dialog toggle) and only on
   * origins where `time-model.js#canUseLocalTimeOverrides` allows it.
   *
   * Draft fields are local and deliberately NOT re-synced from `editor` on
   * every prop update — a periodic refresh must not overwrite what the reader
   * is mid-typing. The host remounts this component (via `{#key editor.revision}`
   * in TimeDialog.svelte) only when a recalculation actually succeeds, so the
   * draft still normalizes to the just-applied values afterward.
   */
  export let editor;
  export let onSubmit = () => {};

  let sleepHours = String(editor.sleepHours);
  let lifeHours = String(editor.lifeHours);
  let otherHours = String(editor.otherHours);
  let workingWeekdays = [...editor.workingWeekdays];
  let exceptionsText = editor.exceptionsText;

  $: derivedCapacity = 24 - Number(sleepHours) - Number(lifeHours) - Number(otherHours);
  $: derivedLabel = derivedCapacity > 0
    ? `每日工作容量：${Math.round(derivedCapacity * 10) / 10} hr`
    : "每日工作容量必須大於 0 hr";

  function toggleWeekday(value, checked) {
    workingWeekdays = checked
      ? [...workingWeekdays, value]
      : workingWeekdays.filter((day) => day !== value);
  }

  function submit(event) {
    event.preventDefault();
    onSubmit({ sleepHours, lifeHours, otherHours, workingWeekdays, exceptionsText });
  }
</script>

<form class="time-capacity-editor" onsubmit={submit}>
  <div class="time-editor-heading">
    <h3>設定</h3>
    <span>重新計算只更新預覽；全域儲存才提交本機設定</span>
  </div>
  <div class="time-editor-fields">
    <label class="time-editor-field">
      <span>每日睡眠</span>
      <span class="time-editor-control">
        <input type="number" min="0" max="24" step="0.5" required bind:value={sleepHours}>
        <span>hr</span>
      </span>
    </label>
    <label class="time-editor-field">
      <span>每日生活時間</span>
      <span class="time-editor-control">
        <input type="number" min="0" max="24" step="0.5" required bind:value={lifeHours}>
        <span>hr</span>
      </span>
    </label>
    <label class="time-editor-field">
      <span>其他固定不可工作</span>
      <span class="time-editor-control">
        <input type="number" min="0" max="24" step="0.5" required bind:value={otherHours}>
        <span>hr</span>
      </span>
    </label>
  </div>
  <p class="time-capacity-derived">{derivedLabel}</p>
  <fieldset class="time-weekdays">
    <legend>工作日</legend>
    {#each WEEKDAY_OPTIONS as day (day.value)}
      <label>
        <input
          type="checkbox"
          checked={workingWeekdays.includes(day.value)}
          onchange={(event) => toggleWeekday(day.value, event.currentTarget.checked)}
        >
        週{day.label}
      </label>
    {/each}
  </fieldset>
  <label class="time-exceptions-editor">
    <span>休假與例外</span>
    <textarea rows="4" placeholder="2026-07-29 | 0 | 休假" bind:value={exceptionsText}></textarea>
    <small>每行：日期 | 當日可工作 hr | 公開標籤</small>
  </label>
  <p class="time-editor-error" hidden={!editor.error}>{editor.error}</p>
  <div class="time-editor-actions">
    <button class="primary-button" type="submit">重新計算</button>
  </div>
</form>
