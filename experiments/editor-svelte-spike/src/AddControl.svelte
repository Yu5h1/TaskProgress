<script>
  import { tick } from "svelte";

  /*
   * Collapsed `＋` plus the expanded creation form, for both the top-level task
   * adder and the per-card child-item adder.
   *
   * Field order differs by kind and is part of the established contract:
   *   task: title, summary, priority, contract, error, actions(cancel, submit)
   *   item: title, priority, cancel, submit, error
   *
   * Values are reported raw. Validation stays with the host because meaningful
   * text is a Unicode rule owned by Editor Core — `"✨".trim()` is truthy but
   * not a valid title — and the host also owns stable ID generation.
   */
  export let kind = "item";
  export let expanded = false;
  export let policy;
  export let triggerAriaLabel = "";
  export let titlePlaceholder = "";
  export let titleAriaLabel = "";
  export let summaryPlaceholder = "任務描述（必填）";
  export let summaryAriaLabel = "新任務描述";
  export let priorityAriaLabel = "";
  export let contractText = "";
  export let submitLabel = "";
  export let cancelLabel = "取消";
  export let errorMessage = "";
  export let onOpen = () => {};
  export let onCancel = () => {};
  export let onSubmit = () => {};

  let title = "";
  let summary = "";
  let priority = policy?.creationDefaultValue ?? 4;
  let titleInput;

  $: taskControl = kind === "task";
  $: resolvedTrigger = triggerAriaLabel
    || (taskControl ? "增加工作項目" : "增加待處理子任務");
  $: resolvedTitlePlaceholder = titlePlaceholder || (taskControl ? "任務名稱" : "子任務描述");
  $: resolvedTitleAria = titleAriaLabel || (taskControl ? "新任務名稱" : "新子任務描述");
  $: resolvedPriorityAria = priorityAriaLabel
    || (taskControl ? "新任務優先級" : "新子任務優先級");
  $: resolvedSubmit = submitLabel || (taskControl ? "加入任務" : "新增");
  // The form is the reader's current focus target whenever it opens.
  $: if (expanded) focusTitle();

  async function focusTitle() {
    await tick();
    titleInput?.focus?.();
  }

  function submit(event) {
    event.preventDefault();
    onSubmit({
      title,
      summary,
      priority: policy.normalize(priority, policy.creationDefaultValue),
    });
  }

  function handleKeydown(event) {
    if (event.key !== "Escape") return;
    event.preventDefault();
    onCancel();
  }
</script>

{#if !expanded}
  <button
    class={taskControl ? "task-add-trigger" : "inline-add-trigger"}
    type="button"
    aria-label={resolvedTrigger}
    onclick={onOpen}
  >＋</button>
{:else}
  <form
    class={taskControl ? "task-add-form" : "inline-add-form"}
    onsubmit={submit}
    onkeydown={handleKeydown}
  >
    <input
      class="inline-edit-input"
      type="text"
      maxlength={taskControl ? 160 : 300}
      placeholder={resolvedTitlePlaceholder}
      aria-label={resolvedTitleAria}
      bind:value={title}
      bind:this={titleInput}
    >
    {#if taskControl}
      <textarea
        class="task-summary-input"
        rows="2"
        maxlength="1000"
        placeholder={summaryPlaceholder}
        aria-label={summaryAriaLabel}
        bind:value={summary}
      ></textarea>
    {/if}
    <select
      class="inline-priority-select"
      aria-label={resolvedPriorityAria}
      bind:value={priority}
    >
      {#each policy.levels as level (level.value)}
        <option value={level.value}>{policy.format(level.value)}</option>
      {/each}
    </select>
    {#if taskControl && contractText}
      <span class="task-add-contract">{contractText}</span>
    {/if}
    {#if taskControl}
      <span class="inline-add-error" role="alert" hidden={!errorMessage}>{errorMessage}</span>
      <div class="inline-add-actions">
        <button class="secondary-button inline-add-cancel" type="button" onclick={onCancel}>{cancelLabel}</button>
        <button class="secondary-button" type="submit">{resolvedSubmit}</button>
      </div>
    {:else}
      <button class="secondary-button inline-add-cancel" type="button" onclick={onCancel}>{cancelLabel}</button>
      <button class="secondary-button" type="submit">{resolvedSubmit}</button>
      <span class="inline-add-error" role="alert" hidden={!errorMessage}>{errorMessage}</span>
    {/if}
  </form>
{/if}
