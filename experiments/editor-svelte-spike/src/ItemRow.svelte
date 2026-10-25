<script>
  import ModuleCapsuleStrip from "./ModuleCapsuleStrip.svelte";
  import ExpandableText from "./ExpandableText.svelte";
  import { copyText, itemReference } from "@editor/item-reference.js";
  import { formatActivity } from "@editor/item-activity.js";
  import { bindLongPress } from "@editor/long-press.js";
  import { statusLinks, statusTooltip } from "@editor/item-state.js";

  export let taskId;
  export let field;
  export let item;
  export let editing;
  export let policy;
  export let onCommand;
  /*
   * Module capsules arrive already built. This row used to derive Time's
   * capsule itself from a `timeItem` prop, which meant the shared row knew
   * one module by name and a second module could not appear without editing
   * it. The host now collects descriptors from the module registry, exactly
   * as the main-panel strip does.
   */
  export let moduleCapsules = [];
  export let onModuleActivate = () => {};
  export let moduleOrder = ["time"];
  export let onModuleReorder = () => {};
  // The lead card opens its first unfinished item in full on load.
  export let leadItem = false;
  // Supplied by the card for unfinished rows in edit mode: drag and Alt+Arrow
  // handlers plus the side ("before"/"after") a drop would land on.
  export let reorder = null;
  export let scopeId = null;
  // Shared across every card's rows (viewer/assets/item-selection.js); null where rows are not selectable.
  export let selection = null;
  // The scope's Next marker (Documentation/NextMarkerPlan.md). A long press
  // (UX Input INPUT-PRESS-HOLD; Shift+Enter on the keyboard) sets this row as
  // Next; a long press on the Next row clears it.
  export let isNext = false;
  export let onSetNext = null;

  function toggleNext() {
    onSetNext?.({ taskId, itemId: item.id, clear: isNext });
  }
  function nextHold(node, enabled) {
    let binding = null;
    const bind = (on) => {
      binding?.dispose();
      binding = on ? bindLongPress(node, {
        capture: false,
        accept: (event) => !event.target.closest("a, button, input, select, textarea, label, [contenteditable]"),
        onTrigger: toggleNext,
      }) : null;
    };
    bind(enabled);
    return { update: bind, destroy: () => binding?.dispose() };
  }

  $: reference = editing ? null : itemReference({ scopeId, taskId, item });
  // Relative times go stale while the page stays open, so hovering recomputes them.
  $: activityTitle = editing ? "" : formatActivity(item.activity);
  function refreshActivityTitle() {
    if (!editing) activityTitle = formatActivity(item.activity);
  }
  let copyState = "";
  let copyTimer;

  $: selectable = Boolean(reference && selection);
  $: selected = selectable && Boolean($selection?.keys.has(reference));
  $: copyCount = selected ? $selection.keys.size : 1;

  async function copyReference() {
    clearTimeout(copyTimer);
    const copied = selection ? await selection.copyReferences(reference) : await copyText(reference);
    copyState = copied ? "已複製" : "無法複製";
    copyTimer = setTimeout(() => { copyState = ""; }, 1500);
  }

  let priorityValue = policy.normalize(item.priority, policy.fallbackValue);
  // Same five statuses a task card carries. `statuses` is supplied by the
  // host so the two levels cannot drift into different sets.
  export let statuses = [];
  let statusValue = item.status ?? (field === "completed_items" ? "done" : "planned");

  $: metadata = policy.metadata(item.priority);
  $: label = policy.format(item.priority);
  $: priorityValue = policy.normalize(item.priority, policy.fallbackValue);
  // Absent `status` means the array decides, which is what those arrays
  // already meant — so a report written before the field exists reads the
  // same as it always did.
  $: itemStatus = item.status ?? (field === "completed_items" ? "done" : "planned");
  $: statusValue = itemStatus;
  $: statusEntry = item.derivedState && item.derivedState !== "done"
    ? { label: item.derivedStateLabel, tone: item.derivedStateTone }
    : statuses.find((entry) => entry.value === itemStatus) ?? { label: itemStatus, tone: "muted" };
  $: statusLabel = statusEntry.label;
  // Every status with a target shares one link/menu interaction.
  $: waitTargets = editing ? [] : statusLinks(item);
  $: waitLinked = waitTargets.filter((target) => target.href);
  $: statusHint = editing ? null : statusTooltip(item);
  let waitMenuOpen = false;
  $: if (!waitLinked.length) waitMenuOpen = false;

  // One command: the host relocates the item when the new status requires
  // it, so the row never has to know which array a status belongs in.
  function setStatus(value) {
    if (value === itemStatus) return;
    onCommand({
      type: "set-item-status",
      taskId,
      field,
      itemId: item.id,
      status: value,
    });
  }

  // The row does not know which module a capsule belongs to; the host
  // dispatches by id back to whichever module claims it.
  function activateModule(id) {
    onModuleActivate(id, { taskId, itemId: item.id, itemTitle: item.title });
  }
</script>

<li class="editor-item-row" class:editable-work-item={editing}
  class:item-drop-before={editing && reorder?.side === "before"}
  class:item-drop-after={editing && reorder?.side === "after"}
  class:item-gap-before={!editing && reorder?.side === "before"}
  class:item-gap-after={!editing && reorder?.side === "after"}
  class:item-row-reorderable={!editing && !!reorder}
  class:item-row-dragging={!!reorder?.dragging}
  class:is-selected={selected}
  class:is-next={isNext}
  use:nextHold={Boolean(onSetNext && reference && !editing)}
  data-select-key={selectable ? reference : undefined}
  tabindex={selectable ? 0 : undefined}
  onclick={selectable ? (event) => selection.rowClick(reference, event) : undefined}
  onfocus={selectable ? () => selection.rowFocus(reference) : undefined}
  draggable={!editing && reorder?.armed ? "true" : undefined}
  title={activityTitle || undefined}
  onpointerenter={refreshActivityTitle}
  onpointerdown={editing ? undefined : reorder?.arm}
  onpointerup={editing ? undefined : reorder?.disarm}
  ondragstart={editing ? undefined : reorder?.start}
  ondragend={editing ? undefined : reorder?.end}
  onkeydown={editing ? undefined : (event) => {
    if (event.shiftKey && event.key === "Enter" && onSetNext && reference && event.target === event.currentTarget) {
      event.preventDefault();
      toggleNext();
      return;
    }
    reorder?.keydown?.(event);
    if (!event.defaultPrevented && selectable) selection.rowKeydown(reference, event);
  }}
  ondragover={reorder?.over}
  ondragleave={reorder?.leave}
  ondrop={reorder?.drop}>
  {#if reorder && editing}
    <button
      type="button"
      class="item-row-grip"
      data-item-ref={`${taskId}/${item.id}`}
      draggable="true"
      aria-label={`移動「${item.title}」（Alt+↑／↓，限同優先級）`}
      title="拖曳換位（限同優先級）"
      ondragstart={reorder.start}
      ondragend={reorder.end}
      onkeydown={reorder.keydown}
    >⠿</button>
  {:else}
    <span
      class={`item-row-marker item-row-marker-${itemStatus}`}
      aria-hidden="true"
    >{itemStatus === "done" ? "✓" : "○"}</span>
  {/if}

  <!-- A finished item has no priority worth reading: priority ranks what to do
       next, and there is nothing left to schedule here. Preview therefore drops
       the badge, the same way it drops an unset value — see
       `Documentation/AssessmentModuleArchitecturePlan.md` 未設置的值. Edit mode
       still shows the select, because that is the entry point for changing it,
       and because a status set by mistake has to be recoverable. -->
  {#if editing || (itemStatus !== "done" && metadata && (!metadata.hidden || !policy.labelsValid))}
    <span class="item-row-priority">
      {#if editing}
      <select
        class="inline-priority-select"
        aria-label={`設定「${item.title}」的優先級`}
        bind:value={priorityValue}
        onchange={() => onCommand({
          type: "set-item-field",
          taskId,
          field,
          itemId: item.id,
          property: "priority",
          value: Number(priorityValue),
        })}
      >
        {#each policy.levels as level (level.value)}
          <option value={level.value}>{policy.format(level.value)}</option>
        {/each}
      </select>
      {:else}
        <span class={`priority-badge priority-${metadata.tone}`}>{label}</span>
      {/if}
    </span>
  {/if}

  <div class="item-row-description">
    {#if editing}
      <input
        class="inline-edit-input"
        aria-label={`編輯子項目：${item.title}`}
        title={item.title}
        maxlength="500"
        value={item.title}
        oninput={(event) => onCommand({
          type: "set-item-field",
          taskId,
          field,
          itemId: item.id,
          property: "title",
          value: event.currentTarget.value,
        })}
      >
    {:else}
      <div class="item-row-text">
        {#if isNext}<span class="item-next-capsule" title="Next：這個 scope 現在該做的一件事；長按取消">Next</span>{/if}
        {#if selected}<span class="item-row-selected-label">已選取</span>{/if}
        {#if item.sourceRef}
          {#if item.sourceRef.available}
            <a class="document-source-link" href={item.sourceRef.href} title={item.sourceRef.title}>
              <span class="source-icon" aria-hidden="true">{item.sourceRef.kind === "decision" ? "⚖" : item.sourceRef.manual ? "📋" : "🤖"}</span>
              <span class="source-label">{item.sourceRef.label}</span>
            </a>
          {:else}
            <span class="document-source-link source-unavailable" title={item.sourceRef.error ?? "來源無法讀取"}>
              <span class="source-icon" aria-hidden="true">⚠️</span>
              <span class="source-label">來源不可用</span>
            </span>
          {/if}
        {/if}
        <ExpandableText text={item.displayTitle ?? item.title} lines={1} expanded={leadItem} />
      </div>

    {/if}
  </div>

  {#if reference}
    <button
      type="button"
      class="item-row-copy"
      data-item-ref={`${taskId}/${item.id}`}
      class:is-done={copyState}
      class:is-copied={copyState === "已複製"}
      tabindex={selectable ? -1 : undefined}
      aria-label={copyState || (copyCount > 1 ? `複製已選取的 ${copyCount} 項參照` : `複製「${item.title}」的參照`)}
      title={copyState || (copyCount > 1 ? `複製已選取的 ${copyCount} 項參照` : reference)}
      onclick={copyReference}
    >{copyState === "已複製" ? "✓" : copyState ? "✕" : "⧉"}</button>
  {/if}

  <span class="item-row-utility-panel">
    <span class="item-row-modules">
      <ModuleCapsuleStrip
        capsules={moduleCapsules}
        {moduleOrder}
        onActivate={activateModule}
        onReorder={onModuleReorder}
      />
    </span>

    <span class="item-row-status">
      {#if editing}
        <select
          class="inline-status-select"
          aria-label={`設定「${item.title}」的狀態`}
          bind:value={statusValue}
          onchange={() => setStatus(statusValue)}
        >
          {#each statuses as status (status.value)}
            <option value={status.value}>{status.label}</option>
          {/each}
        </select>
      {:else if waitTargets.length === 1 && waitLinked.length === 1}
        <a class={`item-status-capsule status-${statusEntry.tone} is-link`} href={waitLinked[0].href}
          title={statusHint ? `${statusHint}（開啟：${waitLinked[0].label}）` : `開啟狀態對象：${waitLinked[0].label}`}>{statusLabel}</a>
      {:else if waitLinked.length}
        <span class="wait-menu"
          onfocusout={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) waitMenuOpen = false; }}>
          <button type="button" class={`item-status-capsule status-${statusEntry.tone} is-link`}
            title={statusHint ?? "狀態對象"} aria-haspopup="true" aria-expanded={waitMenuOpen}
            onclick={(event) => { event.stopPropagation(); waitMenuOpen = !waitMenuOpen; }}
            onkeydown={(event) => { if (event.key === "Escape") waitMenuOpen = false; }}>{statusLabel}</button>
          {#if waitMenuOpen}
            <ul class="wait-menu-list">
              {#each waitTargets as target, index (index)}
                <li>
                  {#if target.href}<a href={target.href} onclick={(event) => event.stopPropagation()}>{target.label}</a>{:else}<span>{target.label}（無法讀取）</span>{/if}
                </li>
              {/each}
            </ul>
          {/if}
        </span>
      {:else}
        <span class={`item-status-capsule status-${statusEntry.tone}`} title={statusHint}>{statusLabel}</span>
      {/if}
    </span>

    {#if editing}
      <span class="item-row-action">
        <button
          class="inline-delete-button"
          type="button"
          aria-label={`刪除子項目：${item.title}`}
          onclick={() => onCommand({
            type: "delete-item",
            taskId,
            field,
            itemId: item.id,
          })}
        >刪除</button>
      </span>
    {/if}
  </span>
</li>
