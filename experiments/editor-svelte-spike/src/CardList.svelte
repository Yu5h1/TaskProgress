<script>
  import IconChoice from "./IconChoice.svelte";
  import VisibilityMenu from "./VisibilityMenu.svelte";
  import { isCardVisible, chooseVisibility } from "../../../viewer/assets/card-visibility.js";
  import { tick } from "svelte";
  import { displayCards, moveVisibleCard } from "../../../viewer/assets/card-order.js";
  export let items = [];
  export let allIds = [];
  export let storageKey;
  export let pinEnabled = false;
  let pinnedIds = [];
  export let expanded = true;
  export let onToggleAll = () => {};
  let mode = "forward";
  const modes = ["forward", "reverse", "free"];
  const modeLabels = { forward: "順排", reverse: "逆排", free: "自由排序（可拖曳）" };
  let visibilityMode = "disabled";
  $: visibilityEnabled = visibilityMode === "enabled";
  let hiddenIds = [];

  function saveVisibility() {
    if (!storageKey) return;
    try { sessionStorage.setItem(`${storageKey}:visibility`, JSON.stringify({ mode: visibilityMode, hiddenIds })); } catch {}
  }
  function selectVisibility(action) {
    const next = chooseVisibility(visibilityMode, hiddenIds, action);
    visibilityMode = next.mode;
    hiddenIds = next.hiddenIds;
    clearDrag();
    saveVisibility();
  }
  function setVisible(id, visible) {
    hiddenIds = visible ? hiddenIds.filter(key => key !== id) : [...new Set([...hiddenIds, id])];
    clearDrag();
    saveVisibility();
  }
  export function revealCard(id) { if (visibilityMode === "closed") visibilityMode = "enabled"; setVisible(id, true); }
  $: movable = ordered.filter(item => isCardVisible(item.id, visibilityMode, hiddenIds) && !(pinEnabled && pinnedIds.includes(item.id)));
  let order = null;
  let selected = null;
  let armed = null;
  let dragging = null;
  let target = null;
  let root;
  let notice = "";
  $: load(storageKey);
  $: ordered = displayCards(items, order, mode, pinEnabled ? pinnedIds : []);

  function togglePin(id) {
    clearDrag();
    pinnedIds = pinnedIds.includes(id) ? pinnedIds.filter(key => key !== id) : [id, ...pinnedIds];
    if (!storageKey) { notice = "釘選僅保留於本頁"; return; }
    try { localStorage.setItem(`${storageKey}:pins`, JSON.stringify(pinnedIds)); notice = "已記住本機釘選"; }
    catch { notice = "此環境無法保存檢視設定；釘選僅保留於本頁"; }
  }

  function load(key) {
    pinnedIds = [];
    if (key) {
      try {
        const saved = JSON.parse(localStorage.getItem(`${key}:pins`) ?? "null");
        pinnedIds = Array.isArray(saved) ? [...new Set(saved.filter(id => typeof id === "string" || typeof id === "number"))] : [];
      } catch {}
    }
    visibilityMode = "disabled";
    hiddenIds = [];
    if (key) {
      try {
        const saved = JSON.parse(sessionStorage.getItem(`${key}:visibility`));
        visibilityMode = ["enabled", "closed", "disabled"].includes(saved?.mode) ? saved.mode : (saved?.enabled === true ? "enabled" : "disabled");
        hiddenIds = Array.isArray(saved?.hiddenIds) ? saved.hiddenIds : [];
      } catch {}
    }
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
  function selectMode(value) {
    clearDrag();
    mode = value;
    notice = "";
    if (!storageKey) return;
    try { localStorage.setItem(`${storageKey}:mode`, mode); }
    catch { notice = "此環境無法保存檢視設定；順序僅保留於本頁"; }
  }
  async function move(id, targetId, after) {
    if (mode !== "free") return;
    if (pinEnabled && (pinnedIds.includes(id) || pinnedIds.includes(targetId))) return;
    if (id === targetId) return;
    save(moveVisibleCard(allIds, order, movable.map(item => item.id), id, targetId, after));
    selected = id;
    await tick();
    [...root.querySelectorAll("[data-card-id]")].find(button => button.dataset.cardId === String(id))?.focus();
  }
  function moveBy(id, offset) {
    const index = movable.findIndex(item => item.id === id);
    if (index < 0) return;
    const other = movable[index + offset];
    if (other) move(id, other.id, offset > 0);
  }
  function clearDrag() { armed = null; dragging = null; target = null; }
  function dragOver(item, event) {
    if (pinEnabled && pinnedIds.includes(item.id)) return;
    if (dragging === null || dragging === item.id) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    const bounds = event.currentTarget.getBoundingClientRect();
    target = { id: item.id, after: event.clientY >= bounds.top + bounds.height / 2 };
  }
</script>

<div class="card-list-controls">
<div class="card-list-heading">
  <p class="section-kicker">工作項目</p>
  <slot name="filters" />
</div>
<div class="card-list-tools">
  <button type="button" class="card-toolbar-icon" aria-label={expanded ? "全部收合" : "全部展開"}
    title={expanded ? "全部收合" : "全部展開"} onclick={() => onToggleAll(!expanded)}>
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path d={expanded ? "M5 15l7-7 7 7" : "M5 9l7 7 7-7"} fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>
  <IconChoice items={modes.map(id => ({ id, label: modeLabels[id] }))} value={mode}
    label="排序" interaction="both" orientation="vertical" onChoose={selectMode}>
    <svelte:fragment slot="icon" let:item>
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      {#if item.id === "free"}
        <path d="M4 5h15M4 10h8M4 15h17M4 20h11" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      {:else}
        <path d={item.id === "forward" ? "M5 3v18m-3-3 3 3 3-3" : "M5 21V3m-3 3 3-3 3 3"}
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d={item.id === "forward" ? "M11 4h10M11 9h8M11 14h6M11 19h3" : "M11 4h3M11 9h6M11 14h8M11 19h10"}
          fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      {/if}
    </svg>
    </svelte:fragment>
  </IconChoice>
  <VisibilityMenu mode={visibilityMode} onChoose={selectVisibility} />
  <span role="status">{notice}</span>
</div>
</div>
<div class="arrangeable-cards" bind:this={root}>
  {#each ordered as item (item.id)}
    <div hidden={!isCardVisible(item.id, visibilityMode, hiddenIds)} class:card-selected={selected === item.id}
      class:card-drop-before={target?.id === item.id && !target.after}
      class:card-drop-after={target?.id === item.id && target.after}
      class="arrangeable-card" role="group" aria-label={`${item.title}${selected === item.id ? "，已選取" : ""}`}
      tabindex="0" data-card-id={item.id} draggable={mode === "free" && armed === item.id}
      onpointerdown={event => {
        armed = null;
        if (event.button !== 0) return;
        if (event.target.closest('button, a, input, textarea, select, label, [contenteditable], [role="button"], [role="checkbox"]')) return;
        selected = item.id;
        if (mode !== "free" || event.pointerType !== "mouse" || (pinEnabled && pinnedIds.includes(item.id))) return;
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
      {#if pinEnabled}
        <button type="button" class="card-pin" class:is-pinned={pinnedIds.includes(item.id)}
          aria-label={pinnedIds.includes(item.id) ? `取消釘選：${item.title}` : `釘選置頂：${item.title}`}
          aria-pressed={pinnedIds.includes(item.id)} title={pinnedIds.includes(item.id) ? "取消釘選" : "釘選置頂"}
          onclick={() => togglePin(item.id)}>
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path d="M8 3h8l-1 7 4 4v2H5v-2l4-4-1-7Zm4 13v6" fill={pinnedIds.includes(item.id) ? "currentColor" : "none"} stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      {/if}
      <slot {item} {visibilityEnabled} visible={!hiddenIds.includes(item.id)} onVisibleChange={value => setVisible(item.id, value)} />
    </div>
  {/each}
</div>
