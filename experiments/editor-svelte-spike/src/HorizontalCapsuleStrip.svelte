<script>
  import { tick } from "svelte";

  export let items = [];
  export let className = "";
  export let ariaLabel = "可排序膠囊列";
  export let onActivate = () => {};
  export let onReorder = () => {};

  let draggingId = null;
  let dropTarget = null;
  let suppressClick = false;
  let pointerDrag = null;
  let pendingFocus = null;
  let strip;

  $: if (items && pendingFocus) restoreFocus();

  async function restoreFocus() {
    const id = pendingFocus;
    pendingFocus = null;
    await tick();
    [...(strip?.querySelectorAll("[data-capsule-id]") ?? [])]
      .find((button) => button.dataset.capsuleId === id)
      ?.focus();
  }

  function clearDrag() {
    draggingId = null;
    dropTarget = null;
  }

  function dropClass(id, target) {
    if (target?.id !== id) return "";
    return target.placeAfter ? "capsule-drop-after" : "capsule-drop-before";
  }

  function placeAfterFor(element, clientX) {
    const bounds = element.getBoundingClientRect();
    return clientX >= bounds.left + bounds.width / 2;
  }

  function sortableItems() {
    return items.filter((item) => item.sortable !== false);
  }

  function requestMove(id, targetId, placeAfter, focusId = id) {
    pendingFocus = focusId;
    onReorder(id, targetId, placeAfter);
  }

  function moveByOffset(id, offset) {
    const sortable = sortableItems();
    const index = sortable.findIndex((item) => item.id === id);
    const target = sortable[index + offset];
    if (index < 0 || !target) return;
    requestMove(id, target.id, offset > 0);
  }

  function handleClick(item, event) {
    if (suppressClick) {
      event.preventDefault();
      suppressClick = false;
      return;
    }
    onActivate(item.id);
  }

  function handleKeydown(item, event) {
    if (!event.altKey || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    moveByOffset(item.id, event.key === "ArrowLeft" ? -1 : 1);
  }

  function handleDragStart(item, event) {
    draggingId = item.id;
    suppressClick = true;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", item.id);
  }

  function handleDragOver(item, event) {
    if (!draggingId || item.id === draggingId || item.sortable === false) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    dropTarget = { id: item.id, placeAfter: placeAfterFor(event.currentTarget, event.clientX) };
  }

  function handleDragLeave(item, event) {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    if (dropTarget?.id === item.id) dropTarget = null;
  }

  function handleDrop(item, event) {
    if (!draggingId || item.sortable === false) return;
    event.preventDefault();
    const source = draggingId;
    const placeAfter = placeAfterFor(event.currentTarget, event.clientX);
    clearDrag();
    requestMove(source, item.id, placeAfter);
  }

  function handleDragEnd() {
    clearDrag();
    setTimeout(() => { suppressClick = false; }, 0);
  }

  function handlePointerDown(item, event) {
    if (item.sortable === false || event.pointerType === "mouse" || event.button !== 0) return;
    pointerDrag = {
      pointerId: event.pointerId,
      id: item.id,
      startX: event.clientX,
      startY: event.clientY,
      active: false,
      targetId: null,
      placeAfter: false,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function handlePointerMove(item, event) {
    if (!pointerDrag || pointerDrag.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - pointerDrag.startX;
    const deltaY = event.clientY - pointerDrag.startY;
    if (!pointerDrag.active) {
      if (Math.hypot(deltaX, deltaY) < 8) return;
      if (Math.abs(deltaY) > Math.abs(deltaX)) return;
      pointerDrag.active = true;
      suppressClick = true;
      draggingId = item.id;
    }
    event.preventDefault();
    const element = document.elementFromPoint(event.clientX, event.clientY);
    const targetButton = element?.closest?.("[data-reorder-capsule='true']") ?? null;
    const targetId = targetButton?.dataset.capsuleId ?? null;
    if (!targetId || targetId === item.id) {
      pointerDrag.targetId = null;
      dropTarget = null;
      return;
    }
    pointerDrag.targetId = targetId;
    pointerDrag.placeAfter = placeAfterFor(targetButton, event.clientX);
    dropTarget = { id: targetId, placeAfter: pointerDrag.placeAfter };
  }

  function finishPointerDrag(event) {
    if (!pointerDrag || pointerDrag.pointerId !== event.pointerId) return;
    const completed = pointerDrag;
    pointerDrag = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    clearDrag();
    if (completed.active && completed.targetId) {
      requestMove(completed.id, completed.targetId, completed.placeAfter);
    }
    setTimeout(() => { suppressClick = false; }, 0);
  }
</script>

<div class={`horizontal-capsule-strip ${className}`} role="toolbar" aria-label={ariaLabel} bind:this={strip}>
  {#each items as item (item.id)}
    {@const sortable = item.sortable !== false}
    <button
      class={`capsule-button ${item.className ?? ""} ${sortable ? "capsule-sortable" : ""} ${draggingId === item.id ? "capsule-dragging" : ""} ${dropClass(item.id, dropTarget)}`}
      type="button"
      data-capsule-id={item.id}
      data-reorder-capsule={sortable ? "true" : null}
      aria-pressed={item.pressed ?? null}
      aria-label={item.ariaLabel ?? item.label}
      aria-keyshortcuts={sortable ? "Alt+ArrowLeft Alt+ArrowRight" : null}
      title={item.title ?? null}
      disabled={item.disabled ?? false}
      draggable={sortable}
      onclick={(event) => handleClick(item, event)}
      onkeydown={sortable ? (event) => handleKeydown(item, event) : null}
      ondragstart={sortable ? (event) => handleDragStart(item, event) : null}
      ondragover={sortable ? (event) => handleDragOver(item, event) : null}
      ondragleave={sortable ? (event) => handleDragLeave(item, event) : null}
      ondrop={sortable ? (event) => handleDrop(item, event) : null}
      ondragend={sortable ? handleDragEnd : null}
      onpointerdown={sortable ? (event) => handlePointerDown(item, event) : null}
      onpointermove={sortable ? (event) => handlePointerMove(item, event) : null}
      onpointerup={sortable ? finishPointerDrag : null}
      onpointercancel={sortable ? finishPointerDrag : null}
    >
      <!--
        A capsule is a label plus two optional affordances, both generic
        rather than any one module's: a tone dot (this subject's state at a
        glance) and a chevron (this capsule opens a panel). Modules supply
        whether to show them; the strip never knows which module asked.
      -->
      <span>{item.label}</span>
      {#if item.showDot}<span class={`time-risk-dot ${item.dotClass ?? ""}`}></span>{/if}
      {#if item.showChevron}<span class="time-chevron">›</span>{/if}
    </button>
  {/each}
</div>
