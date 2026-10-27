import { html, svg, render, nothing } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { guard } from 'lit/directives/guard.js';
import { live } from 'lit/directives/live.js';
import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';
import { expandableText } from '@taskprogress/expandable-text.js';
import { inlineLinks } from '@taskprogress/inline-links.js';
import { displayCards, promotePin, moveVisibleCard } from '@taskprogress/card-order.js';
import { loadDisclosure, saveDisclosure } from '@taskprogress/card-disclosure-state.js';
import { DEFAULT_CAPSULE_ID } from '@taskprogress/filter-selection.js';
import { createLinkSelection, readLinkSelection } from '@taskprogress/link-selection.js';
import { copyText } from '@taskprogress/item-reference.js';
import { bindLongPress, bindReorder, registerUi } from '@web/ui';
import { createBackLink } from './bootstrap.mjs';
import { createActionQueue } from './action-queue.mjs';
import { enabledAction } from './enabled-action.mjs';
export { html, render, nothing, repeat, live };

// Native actions keep exclusive ownership of an empty host, just as they did in
// the source components. Lit owns the host, and disposes the action on removal.
const actionQueue = createActionQueue();
class NativeAction extends AsyncDirective {
  render() { return nothing; }
  update(part, [factory, value]) {
    this.node = part.element;
    if (this.factory !== factory) { this.clear(); this.factory = factory; }
    this.value = value;
    this.schedule();
    return nothing;
  }
  schedule() {
    actionQueue.add(this);
  }
  flush() {
    if (!this.isConnected || !this.node.isConnected) return;
    if (!this.binding) this.binding = this.factory(this.node, this.value);
    else this.binding.update?.(this.value);
  }
  clear() { actionQueue.delete(this); this.binding?.destroy?.(); this.binding?.dispose?.(); this.binding = null; }
  disconnected() { this.clear(); }
  reconnected() { if (this.factory) this.schedule(); }
}
export const action = directive(NativeAction);
export const text = (value, options = {}) => html`<div ${action(expandableText, { text: value ?? '', ...options })}></div>`;
export const inline = value => {
  const text = String(value ?? '');
  // Lit safely owns plain text. Only possible Markdown links need an action
  // and its extra host; prose and option labels need no binding lifecycle.
  return text.includes('[') ? html`<span ${action(inlineLinks, { text })}></span>` : text;
};
export const noop = () => {};
export const eye = (closed = false, disabled = false) => svg`<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${closed ? svg`<path d="M3 9c4 7 14 7 18 0M5 12l-2 3m6-1-1 3m7-3 1 3m3-5 2 3" />` : svg`<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />`}${disabled ? svg`<path d="M3 3l18 18" />` : nothing}</svg>`;
const orderIcon = id => svg`<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">${id === 'free' ? svg`<path d="M4 5h15M4 10h8M4 15h17M4 20h11" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />` : svg`<path d=${id === 'forward' ? 'M5 3v18m-3-3 3 3 3-3' : 'M5 21V3m-3 3 3-3 3 3'} fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /><path d=${id === 'forward' ? 'M11 4h10M11 9h8M11 14h6M11 19h3' : 'M11 4h3M11 9h6M11 14h8M11 19h10'} fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />`}</svg>`;
export const changed = (e, fn) => fn(e.currentTarget.value);
export const marker = (status, label, onCycle = null, stale = false) => {
  const description = `${label}：${stale ? '需重驗' : ({ pending: '未執行', passed: '通過', failed: '失敗' })[status] ?? status}`;
  const glyph = ({ pending: '', passed: '✓', failed: '!' })[status] ?? '?';
  return onCycle ? html`<button type="button" class="marker-box marker-${status} ${stale ? 'marker-stale' : ''} marker-box-button" aria-label="${description}，點擊切換下一個結果" @click=${onCycle}><span aria-hidden="true">${glyph}</span></button>`
    : html`<span class="marker-box marker-${status} ${stale ? 'marker-stale' : ''}" role="img" aria-label=${description}><span aria-hidden="true">${glyph}</span></span>`;
};
export const copyAction = (node, initial) => {
  let data = initial, timer, generation = 0;
  const copy = async event => {
    event.stopPropagation(); clearTimeout(timer); const operation = ++generation;
    let copied = false;
    try { copied = await (data.copy ? data.copy() : copyText(String(data.id))); } catch { /* Copy failure is visible on the button. */ }
    if (!node.isConnected || operation !== generation) return;
    node.textContent = copied ? '✓' : '✕'; node.classList.add('is-done'); node.classList.toggle('is-copied', copied);
    if (data.feedbackTitle) node.title = copied ? '已複製' : '無法複製';
    timer = setTimeout(() => { if (!node.isConnected) return; node.textContent = '⧉'; node.classList.remove('is-done', 'is-copied'); if (data.feedbackTitle) node.title = data.title; }, 1500);
  };
  node.addEventListener('click', copy);
  return { update: value => { data = value; }, destroy() { generation++; clearTimeout(timer); node.removeEventListener('click', copy); } };
};
export const copyButton = (id, label) => html`<button type="button" class="task-id-copy" title=${String(id)} aria-label="複製「${label}」的卡片 ID" ${action(copyAction, { id })}>⧉</button>`;
export const progressBar = ({ cells = [], form = 'segmented', ratio = 0, label = '', extraClass = '' } = {}) => form === 'segmented'
  ? html`<div class="progress-bar progress-bar-segmented ${extraClass}" role="img" aria-label=${label}>${cells.map(c => html`<i class="progress-cell progress-tone-${c}"></i>`)}</div>`
  : html`<progress class="progress-meter ${extraClass}" max="100" .value=${Math.max(0, Math.min(100, ratio * 100))} aria-label=${label}></progress>`;
export const progressSummary = ({ bar, caption, note = '' }) => html`<section class="progress-summary" aria-label="進度摘要">${progressBar({ ...bar, label: caption })}<p class="progress-caption"><span>${caption}</span>${note ? html`<span class="progress-note">${note}</span>` : nothing}</p></section>`;

export class View {
  constructor(target, props = {}, template) {
    this.target = target; this.props = { ...props }; this.state = {}; this.renderer = template; this.abort = new AbortController(); this.cleanups = []; this.disposed = false;
    const pending=new Set();
    this.timers={setTimeout:(callback,delay)=>{if(this.disposed)return null;const id=setTimeout(()=>{pending.delete(id);if(!this.disposed)callback();},delay);pending.add(id);return id;},clearTimeout:id=>{clearTimeout(id);pending.delete(id);}};
    this.cleanups.push(()=>{for(const id of pending)clearTimeout(id);pending.clear();});
  }
  update(props) { Object.assign(this.props, props); this.draw(); return this; }
  draw({ reuseCardContent = false } = {}) { if (!this.disposed) { if (!reuseCardContent) this.contentVersion = (this.contentVersion ?? 0) + 1; render(this.renderer(this.props, this), this.target); } }
  refresh = () => this.draw();
  on(target, name, fn, options = {}) { target.addEventListener(name, fn, { ...options, signal: this.abort.signal }); }
  destroy() { if(this.disposed)return;this.disposed = true; this.abort.abort(); this.cleanups.forEach(fn => typeof fn === 'function' ? fn() : fn?.dispose?.()); render(nothing, this.target); }
}

export const reorderAction = enabledAction((node, options) => {
  let settings = options;
  let disposed = false;
  const abort = new AbortController();
  const styled = new Map();
  // Project generic transient state onto the pinned product's existing CSS;
  // the layout constants and animation rules remain in the source stylesheet.
  const syncPreview = () => {
    const classes = settings.previewClasses ?? {};
    for (const row of new Set([...styled.keys(), ...node.children])) {
      const names = new Set();
      if (row.parentElement === node) {
        const side = classes[row.getAttribute('data-reorder-over')];
        if (side) names.add(side);
        if (classes.dragging && row.hasAttribute('data-reorder-dragging')) names.add(classes.dragging);
      }
      const owned = styled.get(row) ?? new Set();
      for (const name of owned) if (!names.has(name)) row.classList.remove(name);
      for (const name of names) if (!row.classList.contains(name)) row.classList.add(name);
      if (names.size) styled.set(row, names); else styled.delete(row);
    }
  };
  const observer = new node.ownerDocument.defaultView.MutationObserver(records => {
    if (records.some(record => record.type === 'childList' ? record.target === node : record.target.parentElement === node)) syncPreview();
  });
  if(options.previewClasses) {
    syncPreview();
    observer.observe(node,{subtree:true,childList:true,attributes:true,attributeFilter:['data-reorder-over','data-reorder-dragging']});
  }
  let armed;
  const clearSurface = () => { if (armed) { armed.removeAttribute('data-reorder-handle'); armed.draggable = false; armed = null; } };
  // The product permits mouse dragging from card whitespace, while text and
  // controls keep native gestures. Web Reorder still owns the drag lifecycle.
  const surface = event => {
    clearSurface();
    if (!settings.surface) return;
    const row = [...node.children].find(child => child.contains(event.target));
    if (!row || row.dataset.reorderSortable === 'false') return;
    const keyboard = event.type === 'keydown' && event.target === row && event.altKey && ['ArrowUp', 'ArrowDown'].includes(event.key);
    const excluded = settings.surface === 'item' ? 'a, button, input, select, textarea, label, [contenteditable], span, strong, code, svg' : 'button, a, input, textarea, select, label, [contenteditable], [role="button"], [role="checkbox"], h1, h2, h3, p, span, strong, code, dt, dd, li, svg';
    const mouse = event.type === 'pointerdown' && event.button === 0 && event.pointerType === 'mouse' && !event.target.closest(excluded);
    if (keyboard || mouse) { armed = row; row.setAttribute('data-reorder-handle', ''); row.draggable = true; }
  };
  node.addEventListener('pointerdown', surface, { capture: true, signal: abort.signal });
  node.addEventListener('keydown', surface, { capture: true, signal: abort.signal });
  node.ownerDocument.addEventListener('pointerup', clearSurface, { signal: abort.signal });
  node.ownerDocument.addEventListener('dragend', clearSurface, { signal: abort.signal });
  const binding = bindReorder(node, request => {
    const result=settings.onMove(request);
    if(settings.focusAfterMove)Promise.resolve(result).then(()=>queueMicrotask(()=>{if(disposed||!node.isConnected)return;[...node.children].find(row=>row.dataset.reorderId===request.id)?.focus();}));
  }, { axis: options.axis ?? 'horizontal' });
  return { update: next => {
    const previous = settings.previewClasses ?? {}, incoming = next.previewClasses ?? {};
    settings = next;
    if (styled.size || ['before', 'after', 'dragging'].some(key => previous[key] !== incoming[key])) syncPreview();
  }, destroy() { disposed=true; clearSurface(); abort.abort(); binding.dispose(); observer.disconnect(); for(const [row,names] of styled)for(const name of names)row.classList.remove(name); styled.clear(); } };
});
export function capsuleStrip(items = [], options = {}) {
  return html`<div class="horizontal-capsule-strip ${options.className ?? ''}" role="toolbar" aria-label=${options.ariaLabel ?? '模組'}
    ${action(reorderAction, { axis: 'horizontal', focusAfterMove:true, previewClasses:{before:'capsule-drop-before',after:'capsule-drop-after',dragging:'capsule-dragging'}, onMove: r => options.onReorder?.(r.id, r.targetId, r.placement === 'after') })}>
    ${repeat(items, i => i.id, i => html`<button type="button" data-capsule-id=${i.id} data-reorder-capsule=${String(i.sortable !== false)} data-reorder-id=${i.id} data-reorder-handle data-reorder-sortable=${String(i.sortable !== false)}
      class="capsule-button ${i.className ?? ''} ${i.sortable !== false ? 'capsule-sortable' : ''}" aria-pressed=${i.pressed ?? nothing}
      aria-label=${i.ariaLabel ?? i.label} aria-keyshortcuts=${i.sortable !== false?'Alt+ArrowLeft Alt+ArrowRight':nothing} title=${i.title ?? nothing} ?disabled=${i.disabled} draggable=${i.sortable !== false}
      @click=${() => options.onActivate?.(i.id)}><span>${i.label}</span>${i.showDot ? html`<span class="time-risk-dot ${i.dotClass ?? ''}"></span>` : nothing}${i.showChevron ? html`<span class="time-chevron">›</span>` : nothing}</button>`)}
  </div>`;
}
export function filters(p = {}) {
  const byId = new Map((p.categories ?? []).map(c => [c.id, c]));
  const ids = p.order?.length ? p.order : [DEFAULT_CAPSULE_ID, ...byId.keys()];
  // Use the source's actual default id; host filter props supply it in order.
  const defaultId = ids.find(id => !byId.has(id));
  const defaultLabel=p.defaultLabel??'預設';
  return capsuleStrip(ids.map(id => id === defaultId ? { id, label:defaultLabel, ariaLabel:`${defaultLabel}，${p.defaultLit?'已全選':'選取全部'}`,title:p.reorderable?'顯示全部；它左邊的標籤決定分組順序，右邊的維持原本的順序':'顯示全部', pressed: !!p.defaultLit, className: `filter-button filter-default${p.reorderable?' status-sortable':''}`, sortable: !!p.reorderable }
    : byId.has(id) ? { ...byId.get(id), id, label: byId.get(id).label + (byId.get(id).count == null ? '' : ` ${byId.get(id).count}`), pressed: p.selected?.has(id), className: `filter-button${p.reorderable&&byId.get(id).sortable!==false?' status-sortable':''}`, sortable: !!p.reorderable && byId.get(id).sortable !== false } : null).filter(Boolean),
  { className: `filter-strip ${p.className ?? ''}`, ariaLabel: p.ariaLabel ?? '篩選', onReorder: p.onReorder,
    onActivate: id => id === defaultId ? p.onSelectDefault?.() : p.onSelect?.(id) });
}
export const moduleStrip = (p = {}) => {
  const rank = new Map((p.moduleOrder ?? []).map((id, i) => [id, i]));
  const fallback = p.moduleOrder?.length ?? 0;
  const items = [...(p.capsules ?? [])].sort((a, b) => (rank.get(a.id) ?? fallback) - (rank.get(b.id) ?? fallback));
  return items.length ? capsuleStrip(items, { ...p, ariaLabel:p.ariaLabel??'子項目模組', className: p.className ?? 'item-module-strip', onActivate: p.onActivate }) : nothing;
};

const pickerDisplay = Object.freeze({ icon:true, label:false, appearance:'ghost' });
export function choice(view, key, items, value, label, choose, interaction = 'both') {
  return html`<ui-option-picker class="icon-choice" aria-label=${label} .label=${label} .options=${items}
    .value=${value} .interaction=${interaction} .delay=${300} orientation="vertical"
    .triggerDisplay=${pickerDisplay} .optionDisplay=${pickerDisplay}
    @choice-request=${event => choose(event.detail.id)}></ui-option-picker>`;
}
export function disclosure({ id, label, expanded = true, toggle, visibilityEnabled = false, visible = true, onVisibleChange }, header, body) {
  return html`<div class="card-disclosure-heading ${expanded ? '' : 'card-disclosure-collapsed'}"><button type="button" class="card-disclosure-toggle" aria-expanded=${expanded} aria-controls=${id} aria-label="${expanded ? '收合' : '展開'} ${label}" @click=${() => toggle(!expanded)}><span aria-hidden="true">${expanded ? '▼' : '▶'}</span></button>
  ${visibilityEnabled ? html`<button type="button" class="card-visibility-toggle card-toolbar-icon" aria-pressed=${visible} aria-label="${visible ? '隱藏' : '顯示'} ${label}" @click=${() => onVisibleChange(!visible)}>${eye(!visible)}</button>` : nothing}${header}</div><div id=${id} class="card-disclosure-body" ?hidden=${!expanded}>${body}</div>`;
}

export class Cards {
  constructor(view) {
    this.view = view; this.order = []; this.pins = []; this.mode = 'forward'; this.visibility = 'disabled'; this.hidden = []; this.selected = null; this.expanded = true; this.overrides = {}; this.key = null;
    this.linkSelection = createLinkSelection(readLinkSelection(location.search));
    const outside = e => { const card = e.target.closest('.arrangeable-card'); if (!card || !view.target.contains(card)) this.select(null); };
    view.on(document, 'pointerdown', outside, { capture: true });
    view.on(document, 'focusin', outside, { capture: true });
    view.on(document, 'keydown', e => { if (e.key === 'Escape' && !e.isComposing) { this.select(null); document.activeElement?.closest('.arrangeable-card') && document.activeElement.blur(); } }, { capture: true });
    view.on(window, 'blur', () => this.select(null));
  }
  select(id) { if (this.selected === id) return; this.selected = id; this.props?.onSelectionChange?.(id); this.view.draw(); }
  isExpanded(id) { return this.overrides[id] ?? this.expanded; }
  orderedIds(items = this.props?.items ?? []) { return displayCards(items, this.order, this.mode, this.props?.pinEnabled ? this.pins : [], this.props?.nextId).map(item => item.id); }
  expand(id, value) { this.overrides[id] = value; saveDisclosure(this.disclosureKey, this.expanded, this.overrides); this.view.draw(); }
  all(value) { this.expanded = value; this.overrides = {}; saveDisclosure(this.disclosureKey, this.expanded, this.overrides); this.view.draw(); }
  // Only the order-mode control reuses body templates. Every data, selection,
  // capability or disclosure draw invalidates them through View.contentVersion.
  persist(reuseCardContent = false) {
    try { if (this.key) { localStorage.setItem(this.key, JSON.stringify(this.order)); localStorage.setItem(`${this.key}:pins`, JSON.stringify(this.pins)); localStorage.setItem(`${this.key}:mode`, this.mode); sessionStorage.setItem(`${this.key}:visibility`, JSON.stringify({ mode:this.visibility, hiddenIds:this.hidden })); } } catch {}
    this.view.draw({ reuseCardContent });
  }
  render(p, itemTemplate, filter = nothing, tools = nothing) {
    this.props = p;
    const key = p.storageKey ?? null;
    if (this.key !== key) {
      this.key = key; this.lastPin = null; this.order = []; this.pins = []; this.mode = 'forward'; this.hidden = []; this.visibility = 'disabled'; this.selected = null;
      if (key) try {
        const order = JSON.parse(localStorage.getItem(key)), pins = JSON.parse(localStorage.getItem(`${key}:pins`)), visibility = JSON.parse(sessionStorage.getItem(`${key}:visibility`)), mode = localStorage.getItem(`${key}:mode`);
        this.order = Array.isArray(order) ? order : []; this.pins = Array.isArray(pins) ? [...new Set(pins.filter(id => typeof id === 'string' || typeof id === 'number'))] : [];
        this.mode = ['forward','reverse','free'].includes(mode) ? mode : Array.isArray(order) ? 'free' : 'forward';
        this.visibility = ['enabled','closed','disabled'].includes(visibility?.mode) ? visibility.mode : visibility?.enabled === true ? 'enabled' : 'disabled'; this.hidden = Array.isArray(visibility?.hiddenIds) ? visibility.hiddenIds : [];
      } catch {}
    }
    const disclosureKey = p.disclosureKey ?? `taskprogress.disclosure:${key ?? location.href}`;
    if (this.disclosureKey !== disclosureKey) { this.disclosureKey = disclosureKey; const d = loadDisclosure(disclosureKey); this.expanded = d.expanded; this.overrides = d.overrides; }
    if (p.requestedPin && this.lastPin !== p.requestedPin && (p.allIds ?? p.items.map(i => i.id)).includes(p.requestedPin)) {
      this.pins = promotePin(this.pins, p.requestedPin); this.overrides[p.requestedPin] = true; this.hidden = this.hidden.filter(id => id !== p.requestedPin); if (this.visibility === 'closed') this.visibility = 'enabled'; this.lastPin = p.requestedPin;
      try { if (key) localStorage.setItem(`${key}:pins`, JSON.stringify(this.pins)); } catch {}
    }
    const items = displayCards(p.items, p.heldOrder ?? this.order, p.heldOrder ? 'free' : this.mode, p.pinEnabled ? this.pins : [], p.nextId);
    const linked = this.linkSelection.claim(items.map(i => i.id));
    if (linked) {
      this.selected = linked.id;
      this.hidden = this.hidden.filter(id => id !== linked.id);
      if (this.visibility === 'closed') this.visibility = 'enabled';
      queueMicrotask(() => {
        if (this.view.disposed || this.selected !== linked.id) return;
        p.onSelectionChange?.(linked.id);
        this.view.draw();
        const card = [...this.view.target.querySelectorAll('[data-card-id]')].find(n => n.dataset.cardId === String(linked.id));
        card?.focus({ preventScroll: true }); card?.scrollIntoView({ block: 'center' });
      });
    }
    const linkTone = this.linkSelection.selectionChanged(this.selected);
    const visible = i => this.visibility !== 'closed' && (this.visibility !== 'enabled' || !this.hidden.includes(i.id));
    const move = r => { if (this.mode !== 'free' || (p.pinEnabled && (this.pins.includes(r.id) || this.pins.includes(r.targetId)))) return; this.order = moveVisibleCard(p.allIds ?? items.map(i => i.id), this.order, items.filter(i => visible(i) && !(p.pinEnabled && this.pins.includes(i.id))).map(i => i.id), r.id, r.targetId, r.placement === 'after'); p.onSelectionChange?.(null); this.selected = r.id; p.onSelectionChange?.(r.id); this.persist(); queueMicrotask(() => [...this.view.target.querySelectorAll('[data-card-id]')].find(n => n.dataset.cardId === String(r.id))?.focus()); };
    const leadId = items.find(visible)?.id;
    return html`<div class="card-list-controls"><div class="card-list-heading"><p class="section-kicker">工作項目</p>${filter}</div><div class="card-list-tools">
      <button type="button" class="card-toolbar-icon" aria-label=${this.expanded ? '全部收合' : '全部展開'} @click=${() => this.all(!this.expanded)}><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d=${this.expanded ? "M5 15l7-7 7 7" : "M5 9l7 7 7-7"} fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" /></svg></button>
      ${choice(this.view, 'order', ['forward','reverse','free'].map(id => ({ id, label: ({forward:'順排',reverse:'逆排',free:'自由排序（可拖曳）'})[id], icon:orderIcon(id) })), this.mode, '排序', id => { this.mode = id; this.persist(true); })}
      ${choice(this.view, 'visibility', [{ id:'enabled',label:'啟用',icon:eye() },{ id:'closed',label:'全體關閉',icon:eye(true) },{ id:'disabled',label:'禁用',icon:eye(false,true) },{ id:'reset',label:'重置',kind:'action',icon:html`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10a9 9 0 1 1 2 8M3 4v6h6" /></svg>` }], this.visibility, '可見性', id => { if (id === 'reset') { this.hidden = []; this.visibility = 'enabled'; } else this.visibility = id; this.persist(); }, 'picker')}${tools}
    </div></div><div class="arrangeable-cards" ${action(reorderAction, { axis: 'vertical', surface: true, previewClasses:{before:'card-drop-before',after:'card-drop-after'}, onMove: move })}>
    ${repeat(items, i => i.id, (i, index) => html`<div class="arrangeable-card ${this.selected === i.id ? 'card-selected' : ''}" role="group" tabindex="0" data-render-window data-card-id=${i.id} data-reorder-id=${i.id} data-reorder-sortable=${String(this.mode === 'free' && !this.pins.includes(i.id))}
      aria-label=${`${i.title ?? i.question ?? ''}${this.selected === i.id ? '，已選取' : ''}`} data-link-tone=${this.selected === i.id ? linkTone ?? nothing : nothing} ?hidden=${!visible(i)}
      @pointerdown=${e => { if (e.button === 0) this.select(i.id); }} @focusin=${() => this.select(i.id)} @keydown=${e => { if (e.target === e.currentTarget && ['Enter',' '].includes(e.key)) { e.preventDefault(); this.select(i.id); } }}>
      ${p.pinEnabled ? html`<button type="button" class="card-pin ${this.pins.includes(i.id) ? 'is-pinned' : ''} ${i.id === p.nextId ? 'is-next' : ''}" aria-label="${this.pins.includes(i.id) ? '取消釘選' : '釘選置頂'}：${i.title}" aria-pressed=${this.pins.includes(i.id)} @click=${() => { this.pins = this.pins.includes(i.id) ? this.pins.filter(id => id !== i.id) : promotePin(this.pins, i.id); this.persist(); }}><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M8 3h8l-1 7 4 4v2H5v-2l4-4-1-7Zm4 13v6" fill=${this.pins.includes(i.id) ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="1.6" /></svg></button>` : nothing}
      ${guard([this.view.contentVersion, i, i.id === leadId, this.isExpanded(i.id), this.visibility, this.hidden.includes(i.id)], () => itemTemplate(i, { lead: i.id === leadId, expanded: this.isExpanded(i.id), toggle: value => this.expand(i.id, value), visibilityEnabled: this.visibility === 'enabled', visible: !this.hidden.includes(i.id), onVisibleChange: value => { this.hidden = value ? this.hidden.filter(id => id !== i.id) : [...this.hidden, i.id]; this.persist(); } }))}
      ${this.mode === 'free' ? html`<button type="button" class="replica-card-grip" data-reorder-handle draggable="true" aria-label="移動 ${i.title ?? i.question}">⠿</button>` : nothing}
    </div>`)}</div>${p.hiddenCount > 0 ? html`<p class="card-list-hidden"><button type="button" class="card-list-hidden-link" @click=${p.onShowHidden}>…顯示隱藏項目(${p.hiddenCount})</button></p>` : nothing}`;
  }
}
export function saveBar(p) {
  registerUi();
  const history = { canClear:false, entries:[], undoDepth:0, redoDepth:0, ...p.history, canUndo:!!p.canUndo, canRedo:!!p.canRedo };
  return html`<span class="edit-save-status" id="edit-save-status" role="status">${p.message ?? ''}</span><ui-edit-history .history=${history} .panelAvailable=${false} .disabled=${!!p.saving}
    @history-request=${e => { if (!p.saving) { if (e.detail.action === 'undo' && p.canUndo) p.onUndo?.(); else if (e.detail.action === 'redo' && p.canRedo) p.onRedo?.(); } }}></ui-edit-history>
  ${p.onToggleCautious ? html`<button type="button" class="secondary-button edit-mode-button" aria-pressed=${!!p.cautious} ?disabled=${p.saving} @click=${() => p.onToggleCautious(!p.cautious)}>謹慎模式</button>` : nothing}
  ${p.cautious ? html`<button type="button" class="secondary-button edit-discard-button" ?disabled=${p.saving} @click=${p.onDiscard}>放棄</button><button type="button" class="primary-button edit-save-button" ?disabled=${!p.dirty || p.saving} @click=${p.onSave}>${p.saving ? '正在儲存…' : '儲存'}</button>` : nothing}`;
}
const dialogAction = (node, settings) => { let p = settings; const close = () => p.onClose?.(); node.addEventListener('ui-close', close); const update = next => { p = next; if (p.open) node.show(undefined, p.initialFocus ? node.querySelector(p.initialFocus) : undefined); else node.close(); }; update(p); return { update, destroy() { node.removeEventListener('ui-close', close); node.close(); } }; };
export const dialog = (p, body) => { registerUi(); return html`<ui-dialog id=${p.id ?? nothing} class=${p.className ?? ''} .heading=${p.title ?? ''} .kicker=${p.kicker ?? ''} .closeLabel=${p.closeLabel ?? ''} .dismissDisabled=${!!p.busy} .dismissOnBackdrop=${p.dismissOnBackdrop ?? true} ${action(dialogAction, p)}>${p.open ? body : nothing}</ui-dialog>`; };
export const holdAction = enabledAction((node, p) => { let settings = p; const b = bindLongPress(node, { capture: false, accept: e => !!settings.enabled && !e.target.closest('a,button,input,textarea,select,label,[contenteditable]'), onTrigger: () => settings.onTrigger?.() }); return { update: next => { settings = next; }, destroy: () => b.dispose() }; }, options => !!options.enabled);

const themePlacement = (node) => {
  const owner = globalThis.taskprogressTheme.control;
  node.append(owner);
  return { destroy() { if(owner.parentNode===node)owner.remove(); } };
};
export const productTheme = () => html`<span class="replica-theme" ${action(themePlacement, null)}></span>`;
const backPlacement = node => { const link=createBackLink();node.append(link);return{destroy:()=>link.remove()}; };
export const productBack = () => globalThis.chrome?.webview ? nothing : html`<span class="replica-back" ${action(backPlacement, null)}></span>`;

// Reset the host refresh guard even when removal bypasses a normal dialog close.
const historyLifetime = (_node, initial) => {
  let settings = initial;
  return { update: next => { settings = next; }, destroy: () => settings.onOpenChange?.(false) };
};
export function historyTools(p) {
  registerUi();
  return html`<ui-edit-history .history=${p.history} .disabled=${!!p.disabled} .targetId=${p.targetId ?? p.id ?? ''}
    .retentionLabel=${'紀錄只保留在目前頁面，重新整理或離開後會清除。復原與重做仍依編輯器的保存方式處理。'}
    @history-request=${e => {
      if (p.disabled) return;
      if (e.detail.action === 'undo' && p.history.canUndo) p.onUndo?.();
      else if (e.detail.action === 'redo' && p.history.canRedo) p.onRedo?.();
      else if (e.detail.action === 'clearHistory' && p.history.canClear) p.onClear?.();
    }} @history-open-change=${e => p.onOpenChange?.(e.detail.open)}
    ${action(historyLifetime, p)}></ui-edit-history>`;
}
