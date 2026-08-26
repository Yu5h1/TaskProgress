<script>
  import DialogShell from "./DialogShell.svelte";
  import {
    CUSTOM_COLOR_FIELDS,
    createCustomPalette,
    getContrastWarnings,
  } from "../../../viewer/assets/theme-model.js";

  /*
   * Theme picker plus the custom-palette dialog, for every host.
   *
   * The picker and the dialog are one component because they are one control:
   * `自訂…` is the dialog's only entry point, and cancelling has to put the
   * select back to the preference the host still holds. Splitting them would
   * mean a host had to re-implement that handshake.
   *
   * Storage and the document root stay outside — the host supplies the current
   * preference and receives the reader's choice — while the shared theme model
   * owns palette defaults and the contrast rule.
   */
  export let mode = "system";
  export let custom = null;
  export let systemScheme = "light";
  export let onModeChange = () => {};
  export let onApplyCustom = () => {};

  const MODE_OPTIONS = [
    { value: "system", label: "系統選擇" },
    { value: "light", label: "亮色" },
    { value: "dark", label: "暗色" },
    { value: "custom", label: "自訂…" },
  ];
  const HEX_COLOR = /^#[0-9a-f]{6}$/i;
  const HEX_PATTERN = "#[0-9a-fA-F]{6}";

  // `DialogShell` owns the `<dialog>` element and every close path; this flag
  // is the only thing the picker still holds, because `自訂…` is the dialog's
  // only entry point and cancelling has to put the select back.
  let dialogOpen = false;
  let textInputs = [];
  let selectValue = mode;
  let base = custom?.base ?? systemScheme;
  // Two states on purpose. `values` is what the reader has typed and may be
  // half-finished; `colors` is the last valid hex per field. The swatch and the
  // contrast note read `colors`, so a code being typed never makes the palette
  // flicker back to its default, while an unfinished field still blocks 套用.
  let values = paletteValues(createCustomPalette(base));
  let colors = { ...values };

  // The host owns the preference; the select only mirrors it until the reader
  // opens the dialog, and cancelling restores this value.
  $: selectValue = mode;
  $: draft = createCustomPalette(base, colors);
  $: warnings = getContrastWarnings(draft);
  $: statusText = warnings.length
    ? `注意：${warnings.join("；")}。仍可套用，但可能較難閱讀。`
    : "目前的文字與背景色彩對比符合 4.5:1。";

  function paletteValues(palette) {
    return Object.fromEntries(CUSTOM_COLOR_FIELDS.map((field) => [field.key, palette[field.key]]));
  }

  function resetValues(palette) {
    base = palette.base;
    values = paletteValues(palette);
    colors = { ...values };
    for (const input of textInputs) input?.setCustomValidity("");
  }

  function changeMode(event) {
    const next = event.currentTarget.value;
    if (next === "custom") {
      openDialog();
      return;
    }
    onModeChange(next);
  }

  function openDialog() {
    resetValues(custom ? createCustomPalette(custom.base, custom) : createCustomPalette(systemScheme));
    dialogOpen = true;
  }

  function closeDialog() {
    dialogOpen = false;
  }

  function changeBase(event) {
    resetValues(createCustomPalette(event.currentTarget.value));
  }

  function pickColor(field, index, event) {
    const picked = event.currentTarget.value;
    values = { ...values, [field.key]: picked };
    colors = { ...colors, [field.key]: picked };
    textInputs[index]?.setCustomValidity("");
  }

  function typeColor(field, event) {
    const input = event.currentTarget;
    const valid = HEX_COLOR.test(input.value);
    input.setCustomValidity(valid ? "" : "請輸入 #RRGGBB 格式的色碼");
    values = { ...values, [field.key]: input.value };
    if (valid) colors = { ...colors, [field.key]: input.value.toLowerCase() };
  }

  // Every dismissal route — the shell's close button, the backdrop, Escape —
  // arrives here through `onClose`, so restoring the select happens once.
  function cancel() {
    selectValue = mode;
    closeDialog();
  }

  function apply() {
    const invalid = textInputs.find((input) => input && !input.checkValidity());
    if (invalid) {
      invalid.reportValidity();
      return;
    }
    // Built from `colors` rather than the rendered `draft`: what gets saved
    // must not depend on whether the reactive statement has run yet.
    onApplyCustom(createCustomPalette(base, colors));
    closeDialog();
  }
</script>

<label class="theme-picker" for="theme-select">
  <span>主題</span>
  <!-- `bind:value` is what lets cancelling put the select back: without it the
       reader's own selection never reaches `selectValue`, so restoring the
       host's mode would be a no-op assignment and 自訂… would stay showing. -->
  <select id="theme-select" aria-label="顯示主題" bind:value={selectValue} onchange={changeMode}>
    {#each MODE_OPTIONS as option (option.value)}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
</label>

<DialogShell
  open={dialogOpen}
  id="theme-dialog"
  titleId="theme-dialog-title"
  kicker="Custom theme"
  title="自訂 Viewer 顏色"
  closeLabel="關閉自訂主題"
  onClose={cancel}
>
  <p class="theme-dialog-description">
    選擇基底後調整主要介面顏色；任務狀態色會沿用基底，保持完成、進行中與受阻容易辨識。
  </p>
  <label class="theme-base-field" for="theme-custom-base">
    <span>狀態色基底</span>
    <select id="theme-custom-base" value={base} onchange={changeBase}>
      <option value="light">亮色基底</option>
      <option value="dark">暗色基底</option>
    </select>
  </label>
  <div class="theme-color-fields" id="theme-color-fields">
    {#each CUSTOM_COLOR_FIELDS as field, index (field.key)}
      <label class="theme-color-field">
        <span>{field.label}</span>
        <span class="theme-color-controls">
          <input
            type="color"
            aria-label={`${field.label}選色器`}
            value={draft[field.key]}
            oninput={(event) => pickColor(field, index, event)}
          >
          <input
            type="text"
            inputmode="text"
            maxlength="7"
            pattern={HEX_PATTERN}
            aria-label={`${field.label}十六進位色碼`}
            value={values[field.key]}
            oninput={(event) => typeColor(field, event)}
            bind:this={textInputs[index]}
          >
        </span>
      </label>
    {/each}
  </div>
  <p
    class="theme-dialog-status"
    id="theme-dialog-status"
    class:theme-status-warning={warnings.length > 0}
    aria-live="polite"
  >{statusText}</p>
  <div class="theme-dialog-actions">
    <button
      class="secondary-button"
      id="theme-reset"
      type="button"
      onclick={() => resetValues(createCustomPalette(base))}
    >恢復基底預設</button>
    <span class="theme-dialog-action-spacer"></span>
    <button class="secondary-button" id="theme-cancel" type="button" onclick={cancel}>取消</button>
    <button class="primary-button" id="theme-apply" type="button" onclick={apply}>套用自訂主題</button>
  </div>
</DialogShell>
