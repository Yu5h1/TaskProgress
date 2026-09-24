<script>
  import { onDestroy, tick } from "svelte";
  import { nextChoice, pickerChoices } from "../../../viewer/assets/icon-choice.js";
  export let items = [];
  export let value;
  export let label = "選擇";
  export let interaction = "picker";
  export let orientation = "horizontal";
  export let placement = "aligned";
  export let onChoose = () => {};

  let root, trigger, panel, timer;
  let open = false, holding = false, suppressClick = false, hovered = null;
  let left = 0, top = 0, ready = false;
  let pointerId = null;
  let generation = 0;
  $: current = items.find(item => item.id === value && item.kind !== "action") ?? items.find(item => item.kind !== "action");
  $: choices = pickerChoices(items, value, placement);

  function close(restore = false) {
    clearTimeout(timer);
    generation++;
    if (pointerId !== null && trigger?.hasPointerCapture(pointerId)) trigger.releasePointerCapture(pointerId);
    pointerId = null;
    open = false; holding = false; hovered = null; ready = false;
    if (restore) trigger?.focus();
  }
  function choose(id) { close(true); onChoose(id); }
  async function show(focus = false) {
    if (!choices.length) return;
    open = true; ready = false;
    const ticket = ++generation;
    await tick();
    if (!open || ticket !== generation || !panel) return;
    const anchor = trigger.getBoundingClientRect();
    const bounds = panel.getBoundingClientRect();
    const buttons = [...panel.querySelectorAll("button")];
    const selected = buttons.find(button => button.dataset.choice === String(value)) ?? buttons[0];
    const selectedBounds = selected.getBoundingClientRect();
    if (placement === "aligned") {
      left = anchor.left + anchor.width / 2 - (selectedBounds.left - bounds.left + selectedBounds.width / 2);
      top = anchor.top + anchor.height / 2 - (selectedBounds.top - bounds.top + selectedBounds.height / 2);
    } else if (orientation === "horizontal") {
      left = anchor.right + 4;
      if (left + bounds.width > window.innerWidth - 4) left = anchor.left - bounds.width - 4;
      top = anchor.top + (anchor.height - bounds.height) / 2;
    } else {
      left = anchor.left + (anchor.width - bounds.width) / 2;
      top = anchor.bottom + 4;
      if (top + bounds.height > window.innerHeight - 4) top = anchor.top - bounds.height - 4;
    }
    left = Math.max(4, Math.min(left, window.innerWidth - bounds.width - 4));
    top = Math.max(4, Math.min(top, window.innerHeight - bounds.height - 4));
    ready = true;
    await tick();
    if (focus && open && ticket === generation) selected.focus({ preventScroll: true });
  }
  function hit(event) {
    const button = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-choice]");
    return button && panel?.contains(button) ? button.dataset.choice : null;
  }
  function release(event) {
    clearTimeout(timer);
    if (pointerId === null) return;
    if (holding) {
      const id = hit(event);
      suppressClick = true;
      if (id !== null) choose(choices.find(item => String(item.id) === id).id);
      else close(true);
    } else {
      const rect = trigger.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
        suppressClick = true; close(true);
      }
    }
    pointerId = null;
  }
  function keydown(event) {
    if (["Enter", " "].includes(event.key) && pointerId === null) suppressClick = false;
    if (event.key === "Tab" && open) { close(true); return; }
    if (event.key === "Escape") {
      if (open || pointerId !== null) { event.preventDefault(); suppressClick = true; close(true); }
      return;
    }
    const arrows = orientation === "horizontal" ? ["ArrowLeft", "ArrowRight"] : ["ArrowUp", "ArrowDown"];
    if (interaction === "cycle" || ![...arrows, "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (!open) { show(true); return; }
    const buttons = [...panel.querySelectorAll("button")];
    const index = buttons.indexOf(document.activeElement);
    const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1
      : (index + (event.key === arrows[0] ? -1 : 1) + buttons.length) % buttons.length;
    buttons[next]?.focus();
  }
  function cancelGesture() {
    if (pointerId !== null) suppressClick = true;
    close(root?.contains(document.activeElement));
  }
  onDestroy(() => clearTimeout(timer));
</script>

<svelte:window onpointerdown={event => { if (!root?.contains(event.target)) close(); }}
  onresize={cancelGesture} onblur={cancelGesture} />
<svelte:document onscrollcapture={event => { if (!panel?.contains(event.target)) cancelGesture(); }} />
<div class="icon-choice" bind:this={root} role="group" aria-label={label}
  onfocusout={event => { if (!root.contains(event.relatedTarget)) close(); }}>
  <button class="card-toolbar-icon" type="button" bind:this={trigger}
    onkeydown={keydown}
    aria-label={`${label}：${current?.label ?? ""}`} aria-expanded={interaction === "cycle" ? undefined : open}
    title={`${label}：${current?.label ?? ""}；${interaction === "both" ? "點擊切換，長按選擇" : interaction === "cycle" ? "點擊切換" : "點擊或長按選擇"}`}
    disabled={!current} style:touch-action={interaction === "cycle" ? "auto" : "none"}
    onpointerdown={event => {
      if (event.button !== 0) return;
      suppressClick = false;
      if (interaction === "cycle" || open) return;
      pointerId = event.pointerId;
      trigger.setPointerCapture(pointerId);
      clearTimeout(timer);
      timer = setTimeout(() => { holding = true; show(); }, 300);
    }}
    onpointermove={event => { if (holding) hovered = hit(event); }}
    onpointerup={release} onpointercancel={cancelGesture}
    onclick={() => {
      if (suppressClick) { suppressClick = false; return; }
      if (open) { close(true); return; }
      if (interaction === "picker") show(true);
      else { const next = nextChoice(items, value); if (next !== undefined) onChoose(next); }
    }}>
    <slot name="icon" item={current} />
  </button>
  {#if open}
    <div class="icon-choice-options" class:vertical={orientation === "vertical"} bind:this={panel}
      role="group" aria-label={`${label}選項`} style:left={`${left}px`} style:top={`${top}px`} style:visibility={ready ? "visible" : "hidden"}>
      {#each choices as item (item.id)}
        <button class="card-toolbar-icon" class:icon-choice-hover={hovered === String(item.id)} type="button"
          onkeydown={keydown} tabindex="-1"
          data-choice={item.id} aria-label={item.label} title={item.label}
          aria-pressed={item.kind === "action" ? undefined : item.id === value} onclick={() => choose(item.id)}>
          <slot name="icon" {item} />
        </button>
      {/each}
    </div>
  {/if}
</div>
