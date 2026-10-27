import { bootstrap } from './bootstrap.mjs';
import { html, nothing, repeat, live, View, Cards, inline, marker, copyButton, disclosure, filters, progressSummary, saveBar, dialog, productBack, productTheme } from './common.mjs';
import { checklistFilterCategories, createChecklistEditorSession, filterChecklistBySelection, filterOperableChecks, isTagged, lockReason, orderChecklistItems } from '@taskprogress/checklist-editor.js';
import { stackChecklistItems } from '@taskprogress/completed-stacking.js';
import { createFilterSelection, loadFilterSelection, saveFilterSelection, groupingOrder, isDefaultLit, toggleDefault, toggleTag, DEFAULT_CAPSULE_ID } from '@taskprogress/filter-selection.js';
import { createPersistenceController } from '@taskprogress/persistence-mode.js';
import { createChecklistFilterOrder } from '@taskprogress/checklist-filter-order.js';
import { createDocumentTransport } from '@taskprogress/document-transport.js';
import { installForegroundRefresh } from '@taskprogress/foreground-refresh.js';
import { documentLinkTarget, readLinkSelection } from '@taskprogress/link-selection.js';
import { installFocusShield } from '@taskprogress/focus-shield.js';

const env = await bootstrap('checklist');
const params = new URLSearchParams(location.search);
let transport;
try { transport = createDocumentTransport('checklist', { params }); }
catch (error) { transport = { load: () => Promise.reject(error) }; }
const TAGS = ['pending', 'passed', 'failed'];
const STATUS = { pending: '未執行', passed: '通過', failed: '失敗' };
const VALIDITY = { no_recorder: '需重驗：沒有記錄者', fingerprint: '需重驗：內容已變更', released: '需重驗：之後重新執行過' };

class Checklist extends View {
  constructor(target, options = {}) {
    super(target, {}, (_, v) => v.template()); this.transport=options.transport ?? transport; this.editable=options.editable ?? env.editable; this.params=options.params ?? params; this.storage=options.storage; this.loadGeneration=0;
    this.cards = new Cards(this); this.message = '正在載入 Checklist…'; this.loading = true; this.operable = false;
    this.selection = createFilterSelection(TAGS); this.orderController = createChecklistFilterOrder({ supportedIds: [DEFAULT_CAPSULE_ID, ...TAGS] }); this.order = this.orderController.order;
    this.linkRequest = readLinkSelection(location.search); this.linked = this.linkRequest?.id ?? null;
    this.held = null; this.activeCard=null; this.resetOpen = false; this.resetBusy = false; this.resetTargets = [];
    this.cleanups.push(installFocusShield());
    this.cleanups.push(installForegroundRefresh({ canRefresh: () => this.canRefresh(), reload: () => this.refreshSource() }));
    this.on(window, 'beforeunload', e => { if (this.data?.dirty || this.data?.pending) { e.preventDefault(); e.returnValue = ''; } });
  }
  canRefresh() { return !this.disposed && this.data && !this.data.dirty && !this.data.saving && !this.data.pending && !this.resetOpen && !this.resetBusy; }
  install(document) {
    if(this.disposed)return;
    let controller;
    const current=()=>!this.disposed&&this.persistence===controller;
    controller = createPersistenceController({ session: createChecklistEditorSession(document), storage:this.storage, timers:this.timers,
      save:async payload=>{if(!current())throw new Error('Checklist view is no longer active');const saved=await this.transport.save(payload);if(!current())throw new Error('Checklist response belongs to an inactive view');return saved;},
      debounceCommand: c => c.type === 'set-observed', onChange: next => { if (!current()) return; this.data = next; this.message = next.message; this.draw(); } });
    this.persistence=controller;
    this.data = this.persistence.snapshot(); this.message = this.data.message;
    const key = `taskprogress.disclosure:checklist:${location.pathname}:${location.search}:${document.fileName}:${document.roundIdentity}`;
    if (this.filterKey !== key + ':filters') { this.filterKey = key + ':filters'; this.selection = loadFilterSelection(this.filterKey, TAGS); }
    if (!this.resolvedLink) { this.linked = documentLinkTarget(this.linkRequest, document.items.map(i => i.id)); this.resolvedLink = true; }
  }
  async load() {
    if(this.disposed)return;
    const generation=++this.loadGeneration,current=()=>!this.disposed&&generation===this.loadGeneration;
    try { const document=await this.transport.load();if(!current())return;this.install(document);
      Promise.resolve().then(()=>this.transport.loadOwnerReport?.()).then(owner=>{if(current()){this.owner=owner;this.draw();}}).catch(()=>{});
    }
    catch (error) { if(!current())return;this.failure = error.message; }
    if(!current())return;
    this.loading = false; this.draw();
  }
  async refreshSource() {
    if (!this.canRefresh()) return;
    const initial = this.persistence, revision = this.data.document.revision;
    try { const document = await this.transport.load(); if (!this.canRefresh() || this.persistence !== initial || this.data.document.revision !== revision || document.revision === revision) return;
      const cautious = this.data.cautious; this.install(document); if (cautious) await this.persistence.setCautious(true); this.draw();
    } catch (error) { console.warn('Checklist foreground refresh failed:', error); }
  }
  apply(command) { if (this.disposed || !this.persistence || this.resetBusy) return; try { this.persistence.dispatch(command); this.data = this.persistence.snapshot(); this.message = this.data.message; } catch (e) { this.message = e.message; } this.draw(); }
  async setCautious(value) { const initial=this.persistence;if(this.disposed||!initial)return;const data=await initial.setCautious(value);if(!this.disposed&&this.persistence===initial){this.data=data;this.draw();} }
  async save() { const initial=this.persistence;if(this.disposed||!initial)return;await initial.save();if(!this.disposed&&this.persistence===initial){this.data=initial.snapshot();this.draw();} }
  cycle(id, check) {
    if (!this.editable) { this.message = '此入口目前為唯讀，無法保存結果。'; this.draw(); return; }
    if (check.isAcceptance && check.recorder && check.recorder !== 'user' && !confirm('確認修改 agent 紀錄嗎？')) return;
    this.apply({ type: 'cycle-result', workItemId: id, checkIndex: check.index });
  }
  select(value) { this.selection = value; saveFilterSelection(this.filterKey, value); this.draw(); }
  selectCard(id,items) {
    if(this.activeCard===id)return;
    if(this.activeCard!==null)this.linked=null;
    this.activeCard=id;
    if(id===null){this.held=null;this.heldOrder=null;return;}
    this.held=items;this.heldOrder=this.cards.orderedIds(items);
  }
  visible() {
    if (!this.data) return [];
    const doc = this.data.document;
    if (this.held) return this.held.flatMap(held => { const item = doc.items.find(i => i.id === held.id); return item ? [{ ...item, checks: held.checks.flatMap(c => item.checks.find(n => n.index === c.index) ?? []) }] : []; });
    const ordered = orderChecklistItems(doc, this.order);
    let stacked = { ...ordered, items: stackChecklistItems(ordered.items, { asWritten: groupingOrder(this.order).filter(id => TAGS.includes(id)).length === 0 }) };
    if (this.operable) stacked = filterOperableChecks(stacked);
    return stacked.items.flatMap(item => String(item.id) === this.linked ? [item] : filterChecklistBySelection({ items: [item] }, this.selection.selected).items);
  }
  manualTargets() { return this.data?.document.items.flatMap(i => i.checks.filter(c => c.isManual).map(c => ({ workItemId: i.id, checkIndex: c.index }))) ?? []; }
  canReset() { const d = this.data; return !this.disposed && this.editable && d && !d.dirty && !d.saving && !d.pending && !d.blocked && !this.resetBusy && this.manualTargets().length > 0; }
  async reset() {
    if (!this.canReset()) return;
    this.resetBusy = true; const cautious = this.data.cautious, initial=this.persistence;
    try { const document=await this.transport.reset({ targets: this.resetTargets });if(this.disposed||this.persistence!==initial)return;this.install(document);await this.setCautious(cautious);if(this.disposed)return;this.message = '實機結果已清空；其他檢查結果保留。'; this.resetOpen = false; }
    catch (e) { if(!this.disposed)this.message = e.message; } finally { if(!this.disposed){this.resetBusy = false; this.draw();} }
  }
  check(item, check) {
    const tag = check.isAcceptance ? 'acceptance' : check.isManual ? 'manual' : null;
    const locked = isTagged(check) ? lockReason(this.data.document, check) : null;
    const interactive = isTagged(check) && !this.resetBusy && (!locked || check.status !== 'pending');
    return html`<section id="check-${item.id}-${check.index}" tabindex="-1" class="checklist-check checklist-${check.status} ${tag ? `checklist-${tag}` : ''}">
      <div class="checklist-check-heading">${marker(check.status, check.title, interactive ? () => this.cycle(item.id, check) : null, !!check.validity && check.validity !== 'valid')}<strong>${check.title}</strong><span class="checklist-owner ${tag ? `checklist-owner-${tag}` : ''}">${({ manual: '實機', acceptance: '他驗' })[tag] ?? 'Agent'}</span></div>
      ${locked && check.status === 'pending' ? html`<p class="checklist-lock">${locked}</p>` : nothing}<dl><div><dt>Action</dt><dd>${inline(check.action)}</dd></div><div><dt>Expect</dt><dd>${inline(check.expect)}</dd></div>
      ${check.reason ? html`<div><dt>Reason</dt><dd>${check.reason}</dd></div>` : nothing}
      ${check.observed && !(isTagged(check) && check.status === 'failed') ? html`<div><dt>Observed</dt><dd>${check.observed}</dd></div>` : nothing}
      ${check.resolved ? html`<div><dt>Resolved</dt><dd>${check.resolved}</dd></div>` : nothing}
      ${check.validity && check.validity !== 'valid' ? html`<div><dt>狀態</dt><dd class="checklist-void">${VALIDITY[check.validity]}</dd></div>` : check.recorder ? html`<div><dt>記錄</dt><dd>${check.recorder === 'user' ? '使用者' : check.recorder}</dd></div>` : nothing}</dl>
      ${check.isAcceptance && check.status === 'failed' ? html`<label class="checklist-observed"><span>不通過的原因</span><select ?disabled=${this.resetBusy || !this.editable} .value=${live(check.rejectReason ?? 'implementation')} @change=${e => this.apply({ type: 'set-reason', workItemId: item.id, checkIndex: check.index, value: e.currentTarget.value })}><option value="implementation">實作不符</option><option value="condition">條件不符</option></select></label>` : nothing}
      ${isTagged(check) && check.status === 'failed' ? html`<label class="checklist-observed"><span>Observed</span><textarea rows="3" ?disabled=${this.resetBusy || !this.editable} .value=${live(check.observed ?? '')} @input=${e => this.apply({ type: 'set-observed', workItemId: item.id, checkIndex: check.index, value: e.currentTarget.value })} placeholder="記錄實際看到的結果"></textarea></label>` : nothing}
    </section>`;
  }
  template() {
    const d = this.data, items = this.visible();
    return html`<main class="checklist-page"><header class="checklist-header"><div><div class="replica-title-row">${productBack(this.owner)}<h1>${d?.document.fileName ?? 'TaskProgress Checklist'}</h1></div>${d ? html`<details class="checklist-round"><summary>本輪依據</summary><p>${d.document.roundIdentity}</p></details>` : nothing}</div>${productTheme()}</header>
      ${this.loading ? html`<p class="checklist-notice" role="status">${this.message}</p>` : !d ? html`<p class="checklist-notice checklist-error" role="alert">${this.failure}</p>` : html`
      ${progressSummary({ bar: { form: 'segmented', cells: d.summary.cells }, caption: `${d.summary.checks.passed} / ${d.summary.checks.total} checks 通過`, note: d.summary.checks.failed > 0 ? `${d.summary.checks.failed} 個失敗` : '' })}
      <label class="checklist-operable-toggle"><input type="checkbox" .checked=${this.operable} @change=${e => { this.operable = e.currentTarget.checked; this.draw(); }}><span>只顯示我能操作的檢查</span></label>
      <section class="checklist-items" aria-label="Implementation checklist items">${this.cards.render({ items, allIds: orderChecklistItems(d.document, this.order).items.map(i => i.id), storageKey: this.params.has('scope') ? `taskprogress.cards.checklist.v1:${location.pathname}:${this.params.get('scope')}:${this.params.get('task')}:${d.document.roundIdentity}` : null,
        disclosureKey: `taskprogress.disclosure:checklist:${location.pathname}:${location.search}:${d.document.fileName}:${d.document.roundIdentity}`,
        heldOrder: this.heldOrder, onSelectionChange: id => this.selectCard(id,items), hiddenCount: d.document.items.length - items.length,
        onShowHidden: () => { this.operable = false; this.select(createFilterSelection(TAGS)); } },
        (item, card) => { const full = d.document.items.find(i => i.id === item.id); return html`<article class="checklist-item checklist-${item.status}">${disclosure({ ...card, id: `checklist-body-${item.id}`, label: item.title },
          html`<header class="checklist-item-header">${marker(item.status, `工作項目 ${item.id}`)}${copyButton(item.id, item.title)}<div><h2>${item.id}. ${item.title}</h2></div><span class="checklist-status" aria-label="通過 ${full.progress.passed}，共 ${full.progress.total}">${full.progress.passed}/${full.progress.total}</span></header>`,
          html`<div class="checklist-checks"><p class="checklist-outcome">${inline(item.outcome)}</p>${item.dependsOn.length ? html`<p class="checklist-chips"><span class="checklist-chip">Depends on ${item.dependsOn.join(', ')}</span></p>` : nothing}${repeat(item.checks, c => c.index, c => this.check(item, c))}</div>`)}</article>`; },
        filters({ categories: checklistFilterCategories(d.document).map(c => ({ ...c, label: STATUS[c.id] })), order: this.order, selected: this.selection.selected, defaultLit: isDefaultLit(this.selection), className: 'status-filter-strip status-summary-filters', ariaLabel: '依 check 狀態篩選；可拖曳調整順序', reorderable: true,
          onSelect: id => this.select(toggleTag(this.selection, id)), onSelectDefault: () => this.select(toggleDefault(this.selection)), onReorder: (id, target, after) => { this.order = [...this.orderController.move(id, target, after)]; this.draw(); } }))}</section>
      <footer class="edit-save-bar" data-state=${['incomplete', 'conflict', 'error', 'mode_blocked'].includes(d.status) ? 'error' : d.saving ? 'saving' : 'clean'} aria-live="polite" aria-busy=${d.saving || this.resetBusy}>
        ${saveBar({ ...d, saving: d.saving || this.resetBusy, canUndo: d.history.canUndo, canRedo: d.history.canRedo, message: this.message, onToggleCautious: value => this.setCautious(value), onSave: () => this.save(), onUndo: () => { this.persistence.undo(); this.draw(); }, onRedo: () => { this.persistence.redo(); this.draw(); }, onDiscard: () => { this.data = this.persistence.discard(); this.draw(); } })}
        <button type="button" class="secondary-button checklist-reset-button" ?disabled=${!this.canReset()} @click=${() => { this.resetTargets = this.manualTargets().map(t => ({ ...t })); this.resetOpen = true; this.draw(); }}>清空結果</button></footer>`}</main>
      ${dialog({ open: this.resetOpen, title: '清空結果？', onClose: () => { this.resetOpen = false; this.draw(); } }, html`<p>將 ${this.resetTargets.length} 個實機檢查重設為未執行，並清除 Observed／Resolved，包含篩選後隱藏的項目。其他檢查結果不受影響。</p><p>此操作無法復原；如需回復，請使用 Git 歷史。</p><div class="theme-dialog-actions"><button type="button" class="secondary-button" @click=${() => { this.resetOpen = false; this.draw(); }}>取消</button><button type="button" class="primary-button" ?disabled=${this.resetBusy} @click=${() => this.reset()}>確認清空</button></div>`)}`;
  }
}
const app = new Checklist(document.querySelector('#app')); app.draw(); await app.load();
globalThis.taskprogressWebUi = { kind: 'checklist', app, editable: env.editable };
addEventListener('pagehide', e => { if (!e.persisted) app.destroy(); });
