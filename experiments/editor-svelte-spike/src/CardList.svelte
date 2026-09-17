<script>
  import { tick } from "svelte";
  import { displayCards, moveVisibleCard } from "../../../viewer/assets/card-order.js";
  export let items = [];
  export let allIds = [];
  export let storageKey;
  export let expanded = true;
  export let onToggleAll = () => {};
  let mode = "forward";
  const modes = ["forward", "reverse", "free"];
  const modeLabels = { forward: "順排", reverse: "逆排", free: "自由排序（可拖曳）" };
  let order = null;
  let selected = null;
  let armed = null;
  let dragging = null;
  let target = null;
  let root;
  let notice = "";
  $: load(storageKey);
  $: ordered = displayCards(items, order, mode);

  function load(key) {
    selected = null;
    armed = null;
    dragging = null;
    target = null;
    if (!key) { order = null; mode = "forward"; return; }
    try {
      const saved = JSON.parse(localStorage.getItem(key) ?? "null");
      order = Array.isArray(saved) ? saved : null;
      const storedMode = localStorage.getItem(`${key}:mode`);
      mode = modes.includes(storedMode) ? storedMode : (order ? "free" : "forward");
    } catch { order = null; mode = "forward"; }
  }
  function save(value) {
    order = value;
    if (!storageKey) { notice = "順序僅保留於本頁"; return; }
    try {
      if (value) localStorage.setItem(storageKey, JSON.stringify(value));
      else localStorage.removeItem(storageKey);
      notice = value ? "已記住本機卡片順序" : "已還原排序";
    } catch { notice = "此環境無法保存檢視設定；順序僅保留於本頁"; }
  }
  function cycleMode() {
    clearDrag();
    mode = modes[(modes.indexOf(mode) + 1) % modes.length];
    notice = "";
    if (!storageKey) return;
    try { localStorage.setItem(`${storageKey}:mode`, mode); }
    catch { notice = "此環境無法保存檢視設定；順序僅保留於本頁"; }
  }
  async function move(id, targetId, after) {
    if (mode !== "free") return;
    if (id === targetId) return;
    save(moveVisibleCard(allIds, order, ordered.map(item => item.id), id, targetId, after));
    selected = id;
    await tick();
    [...root.querySelectorAll("[data-card-id]")].find(button => button.dataset.cardId === String(id))?.focus();
  }
  function moveBy(id, offset) {
    const index = ordered.findIndex(item => item.id === id);
    const other = ordered[index + offset];
    if (other) move(id, other.id, offset > 0);
  }
  function clearDrag() { armed = null; dragging = null; target = null; }
  function dragOver(item, event) {
    if (dragging === null || dragging === item.id) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    const bounds = event.currentTarget.getBoundingClientRect();
    target = { id: item.id, after: event.clientY >= bounds.top + bounds.height / 2 };
  }
</script>

<div class="card-list-tools">
  <p class="section-kicker">工作項目</p>
  <button type="button" class="card-toolbar-icon" aria-label={expanded ? "全部收合" : "全部展開"}
    title={expanded ? "全部收合" : "全部展開"} onclick={() => onToggleAll(!expanded)}>
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path d={expanded ? "M5 15l7-7 7 7" : "M5 9l7 7 7-7"} fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>
  <button type="button" class="card-toolbar-icon" aria-label={`排序：${modeLabels[mode]}；切換為${modeLabels[modes[(modes.indexOf(mode) + 1) % modes.length]]}`}
    title={`${modeLabels[mode]}；點擊切換排序`} onclick={cycleMode}>
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      {#if mode === "free"}
        <path d="M4 5h15M4 10h8M4 15h17M4 20h11" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      {:else}
        <path d={mode === "forward" ? "M5 3v18m-3-3 3 3 3-3" : "M5 21V3m-3 3 3-3 3 3"}
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d={mode === "forward" ? "M11 4h10M11 9h8M11 14h6M11 19h3" : "M11 4h3M11 9h6M11 14h8M11 19h10"}
          fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      {/if}
    </svg>
  </button>
  <slot name="filters" />
  <span role="status">{notice}</span>
</div>
<div class="arrangeable-cards" bind:this={root}>
  {#each ordered as item (item.id)}
    <div class:card-selected={selected === item.id}
      class:card-drop-before={target?.id === item.id && !target.after}
      class:card-drop-after={target?.id === item.id && target.after}
      class="arrangeable-card" role="group" aria-label={`${item.title}${selected === item.id ? "，已選取" : ""}`}
      tabindex="0" data-card-id={item.id} draggable={mode === "free" && armed === item.id}
      onpointerdown={event => {
        armed = null;
        if (event.button !== 0) return;
        if (event.target.closest('button, a, input, textarea, select, label, [contenteditable], [role="button"], [role="checkbox"]')) return;
        selected = item.id;
        if (mode !== "free" || event.pointerType !== "mouse") return;
        // Only layout whitespace starts a card drag; controls and text retain their normal gestures.
        if (event.target.closest('button, a, input, textarea, select, label, [contenteditable], [role="button"], [role="checkbox"], h1, h2, h3, p, span, strong, code, dt, dd, li, svg')) return;
        armed = item.id;
      }}
      onpointerup={() => { armed = null; }}
      onkeydown={event => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault(); selected = item.id;
        } else if (event.key === "Escape") {
          selected = null;
        }
        if (mode === "free" && event.target === event.currentTarget && event.altKey && ["ArrowUp", "ArrowDown"].includes(event.key)) {
          event.preventDefault(); moveBy(item.id, event.key === "ArrowUp" ? -1 : 1);
        }
      }}
      ondragstart={event => {
        if (mode !== "free" || armed !== item.id || event.target !== event.currentTarget) return;
        dragging = item.id;
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", String(item.id));
      }} ondragend={clearDrag}
      ondragover={event => dragOver(item, event)}
      ondragleave={event => { if (!event.currentTarget.contains(event.relatedTarget)) target = null; }}
      ondrop={event => {
        if (dragging === null || target?.id !== item.id) return;
        event.preventDefault();
        move(dragging, item.id, target.after);
        clearDrag();
      }}>
      <slot {item} />
    </div>
  {/each}
</div>
