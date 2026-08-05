<script>
  import { tick } from "svelte";

  // Status filter pills, which double as the reader's ordering control.
  // The host owns the order and persists it; this component owns the
  // interaction — mouse drag, touch drag and Alt+Arrow keys — and reports the
  // requested move. Drop indicators are reactive state rather than class
  // juggling, so a re-render cannot leave a stale highlight behind.
  export let counts = {};
  export let statusOrder = [];
  export let activeFilter = "all";
  export let statusLabels = {};
  export let onFilterChange = () => {};
  export let onReorder = () => {};

  let draggingStatus = null;
  let dropTarget = null;
  let suppressClick = false;
  let pointerDrag = null;
  let pendingFocus = null;
  let firstButton;

  $: visible = ["all", ...statusOrder]
    .filter((filter) => filter === "all" || (counts[filter] ?? 0) > 0);

  // After the host applies a move the pills re-render, so focus has to be
  // restored to the button the reader was moving.
  $: if (statusOrder && pendingFocus) restoreFocus();

  async function restoreFocus() {
    const status = pendingFocus;
    pendingFocus = null;
    await tick();
    firstButton?.parentElement?.querySelector(`[data-filter="${status}"]`)?.focus();
  }

  function clearDrag() {
    draggingStatus = null;
    dropTarget = null;
  }

  // `target` is passed in rather than read from scope so the template records
  // the dependency: a call expression hides what it reads, and the indicator
  // would never re-render when the drop target moves.
  function dropClass(filter, target) {
    if (target?.status !== filter) return "";
    return target.placeAfter ? "status-drop-after" : "status-drop-before";
  }

  function placeAfterFor(element, clientX) {
    const bounds = element.getBoundingClientRect();
    return clientX >= bounds.left + bounds.width / 2;
  }

  function requestMove(status, targetStatus, placeAfter, focusStatus = null) {
    pendingFocus = focusStatus;
    onReorder(status, targetStatus, placeAfter);
  }

  function moveByOffset(status, offset) {
    const sortable = visible.filter((filter) => filter !== "all");
    const index = sortable.indexOf(status);
    const targetIndex = index + offset;
    if (index < 0 || targetIndex < 0 || targetIndex >= sortable.length) return;
    requestMove(status, sortable[targetIndex], offset > 0, status);
  }

  function handleClick(filter, event) {
    if (suppressClick) {
      event.preventDefault();
      suppressClick = false;
      return;
    }
    onFilterChange(filter);
  }

  function handleKeydown(status, event) {
    if (!event.altKey || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    moveByOffset(status, event.key === "ArrowLeft" ? -1 : 1);
  }

  function handleDragStart(status, event) {
    draggingStatus = status;
    suppressClick = true;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", status);
  }

  function handleDragOver(status, event) {
    if (!draggingStatus || status === draggingStatus) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    dropTarget = { status, placeAfter: placeAfterFor(event.currentTarget, event.clientX) };
  }

  function handleDragLeave(status, event) {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    if (dropTarget?.status === status) dropTarget = null;
  }

  function handleDrop(status, event) {
    if (!draggingStatus) return;
    event.preventDefault();
    const source = draggingStatus;
    const placeAfter = placeAfterFor(event.currentTarget, event.clientX);
    clearDrag();
    requestMove(source, status, placeAfter);
  }

  function handleDragEnd() {
    clearDrag();
    setTimeout(() => { suppressClick = false; }, 0);
  }

  // Touch dragging: start only after the pointer clears a small threshold and
  // is moving mostly sideways, so vertical scrolling still works.
  function handlePointerDown(status, event) {
    if (event.pointerType === "mouse" || event.button !== 0) return;
    pointerDrag = {
      pointerId: event.pointerId,
      status,
      startX: event.clientX,
      startY: event.clientY,
      active: false,
      targetStatus: null,
      placeAfter: false,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function handlePointerMove(status, event) {
    if (!pointerDrag || pointerDrag.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - pointerDrag.startX;
    const deltaY = event.clientY - pointerDrag.startY;
    if (!pointerDrag.active) {
      if (Math.hypot(deltaX, deltaY) < 8) return;
      if (Math.abs(deltaY) > Math.abs(deltaX)) return;
      pointerDrag.active = true;
      suppressClick = true;
      draggingStatus = status;
    }
    event.preventDefault();
    const element = document.elementFromPoint(event.clientX, event.clientY);
    const targetButton = element?.closest?.(".filter-button.status-sortable") ?? null;
    const targetStatus = targetButton?.dataset.filter ?? null;
    if (!targetStatus || targetStatus === status) {
      pointerDrag.targetStatus = null;
      dropTarget = null;
      return;
    }
    pointerDrag.targetStatus = targetStatus;
    pointerDrag.placeAfter = placeAfterFor(targetButton, event.clientX);
    dropTarget = { status: targetStatus, placeAfter: pointerDrag.placeAfter };
  }

  function finishPointerDrag(event) {
    if (!pointerDrag || pointerDrag.pointerId !== event.pointerId) return;
    const completed = pointerDrag;
    pointerDrag = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    clearDrag();
    if (completed.active && completed.targetStatus) {
      requestMove(completed.status, completed.targetStatus, completed.placeAfter);
    }
    setTimeout(() => { suppressClick = false; }, 0);
  }
</script>

  {#each visible as filter (filter)}
    {@const label = filter === "all" ? "全部" : statusLabels[filter] ?? filter}
    {@const count = counts[filter] ?? 0}
    {@const sortable = filter !== "all"}
    <button
      class="filter-button {sortable ? 'status-sortable' : ''} {draggingStatus === filter ? 'status-dragging' : ''} {dropClass(filter, dropTarget)}"
      type="button"
      data-filter={filter}
      aria-pressed={filter === activeFilter}
      draggable={sortable}
      title={!sortable
        ? null
        : filter === "planned"
          ? "點擊顯示待規劃或仍有待處理子項目的任務；拖曳可調整排序"
          : "拖曳調整卡片排序；Alt＋左右方向鍵也可移動"}
      aria-keyshortcuts={sortable ? "Alt+ArrowLeft Alt+ArrowRight" : null}
      aria-label={sortable
        ? `${label} ${count}，排序第 ${visible.indexOf(filter)}；可拖曳調整`
        : null}
      onclick={(event) => handleClick(filter, event)}
      onkeydown={sortable ? (event) => handleKeydown(filter, event) : null}
      ondragstart={sortable ? (event) => handleDragStart(filter, event) : null}
      ondragover={sortable ? (event) => handleDragOver(filter, event) : null}
      ondragleave={sortable ? (event) => handleDragLeave(filter, event) : null}
      ondrop={sortable ? (event) => handleDrop(filter, event) : null}
      ondragend={sortable ? handleDragEnd : null}
      onpointerdown={sortable ? (event) => handlePointerDown(filter, event) : null}
      onpointermove={sortable ? (event) => handlePointerMove(filter, event) : null}
      onpointerup={sortable ? finishPointerDrag : null}
      onpointercancel={sortable ? finishPointerDrag : null}
      bind:this={firstButton}
    >{label} {count}</button>
  {/each}
