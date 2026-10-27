import { bootstrap } from './bootstrap.mjs';
import { html, nothing, repeat, live, View, Cards, inline, copyButton, disclosure, filters, dialog, productBack, productTheme, historyTools } from './common.mjs';
import { createDecisionSession, same } from '@taskprogress/decision-session.js';
import { createDocumentTransport } from '@taskprogress/document-transport.js';
import { createFilterSelection, loadFilterSelection, saveFilterSelection, isDefaultLit, toggleTag, toggleDefault, DEFAULT_CAPSULE_ID } from '@taskprogress/filter-selection.js';
import { stackDecisions } from '@taskprogress/completed-stacking.js';
import { installForegroundRefresh } from '@taskprogress/foreground-refresh.js';
import { documentLinkTarget, readLinkSelection } from '@taskprogress/link-selection.js';
import { installFocusShield } from '@taskprogress/focus-shield.js';

const env = await bootstrap('decisions');
const params = new URLSearchParams(location.search);
let transport;
try { transport = createDocumentTransport('decisions', { params }); }
catch (error) { transport = { load: () => Promise.reject(error) }; }
class Decisions extends View {
  constructor(target, options = {}) {
    super(target, {}, (_, v) => v.template()); this.transport=options.transport ?? transport; this.editable=options.editable ?? env.editable; this.loadGeneration=0; this.cards = new Cards(this);
    this.message = '載入中…'; this.queued = new Set(); this.failed = new Set(); this.sourceOverrides = {}; this.sourceRequest = 0;
    this.selection = loadFilterSelection(null, ['pending', 'decided'], undefined, ['pending']);
    this.linkRequest = readLinkSelection(location.search); this.linked = this.linkRequest?.id ?? null;
    this.cleanups.push(installFocusShield());
    this.cleanups.push(installForegroundRefresh({ canRefresh: () => this.canRefresh(), reload: () => this.refreshSource() }));
    this.on(window, 'beforeunload', e => { if (this.data?.dirty || this.data?.pending) { e.preventDefault(); e.returnValue = ''; } });
  }
  sync() { if(this.disposed)return;this.data = this.session.view(); this.draw(); }
  decisions() { return this.data?.snapshot.document.decisions ?? []; }
  select(value) { this.selection = value; saveFilterSelection(this.filterKey, value); this.draw(); }
  selectCard(id) {
    if(id===null){this.held=null;if(this.linkedSelected)this.linked=null;return;}
    this.linkedSelected=true;
    this.held=this.cards.orderedIds(this.decisions().filter(item=>this.selection.selected.has(item.status)||item.id===id));
  }
  canRefresh() { return !this.disposed && !this.data?.dirty && !this.data?.pending && !this.data?.busy && !this.clearOpen && !this.sourceOpen && !this.historyOpen && !this.refreshing; }
  async load() {
    if(this.disposed)return;
    const generation=++this.loadGeneration,current=()=>!this.disposed&&generation===this.loadGeneration;
    try {
      const result = await this.transport.load();if(!current())return;if (!result.ok) throw new Error(result.error?.message ?? '無法載入決策');
      Promise.resolve().then(()=>this.transport.loadOwnerReport?.()).then(owner=>{if(current()){this.owner=owner;this.draw();}}).catch(()=>{});
      if (result.files) { this.summary = result; this.message = ''; this.draw(); return; }
      this.session = createDecisionSession(result); this.data = this.session.view();
      this.filterKey = `taskprogress.filters.decisions.v1:${result.document_key}`;
      this.selection = loadFilterSelection(this.filterKey, ['pending', 'decided'], undefined, ['pending']);
      this.linked = documentLinkTarget(this.linkRequest, this.decisions().map(i => i.id));
      this.message = ''; this.draw();
    } catch (e) { if(current()){this.message = e.message; this.draw();} }
  }
  async refreshSource() {
    if (!this.canRefresh()) return; this.refreshing = true;const initial=this.session;
    try { const result = await this.transport.load();if(this.disposed||this.session!==initial)return;if (!result.ok) throw new Error(result.error?.message ?? '無法載入決策文件');
      if (result.files) this.summary = result;
      else if (!this.session) { this.session = createDecisionSession(result); this.sync(); }
      else if (result.revision !== this.data.snapshot.revision || !same(result.sources, this.data.snapshot.sources)) { this.session.merge(result); this.sourceOverrides = {}; this.sync(); }
    } catch (e) { if(!this.disposed)console.warn('Decision foreground refresh failed:', e); } finally { if(!this.disposed){this.refreshing = false; this.draw();} }
  }
  choose(id, value) {
    if(this.disposed||!this.session)return;
    if (!this.editable) { this.message = '此入口目前為唯讀，無法保存答案。'; this.draw(); return; }
    this.session.select(id, value); this.sync(); this.confirm(id);
  }
  confirm(id) {
    if(this.disposed||!this.session)return;
    this.queued.add(id); this.failed.delete(id); if (this.refreshing) return;
    const operation = this.session.saveOperation(id); if (operation) return this.send(id, operation);
  }
  changeOther(id, value) {
    if(this.disposed||!this.session)return;
    this.session.edit(id, { other: value, cleared: this.data.drafts[id]?.cleared ?? false }); this.sync();
    if (this.data.drafts[id]?.choice === '__other') this.confirm(id);
  }
  async send(id, operation = 'confirm', retry = false) {
    if(this.disposed||!this.session)return;
    const initial=this.session,current=()=>!this.disposed&&this.session===initial;
    try {
      const request = retry ? this.session.retry() : operation === 'clear_all' ? this.session.beginClearAll() : this.session.begin(id, operation);
      if (!retry) this.queued.delete(request.decision_id); this.sync(); this.message = '保存中…'; this.draw();
      let result;
      try { result = await this.transport.request(request);if(!current())return; }
      catch (e) { if(!current())return;this.session.failed(); this.sync(); this.message = `尚未收到操作結果：${e.message}。請查詢／重送同一筆操作；這不會復原舊答案。`; this.draw(); return; }
      this.session.complete(result); this.sync();
      this.message = result.ok ? (result.status === 'already_applied' ? '原操作已完成；以下顯示目前最新狀態。' : request.operation === 'clear_all' ? '已清除全部答案與理由，以下顯示最新狀態。' : '已保存；以下顯示最新狀態。') : result.error.message;
      if (!result.ok) {
        this.queued.delete(request.decision_id); this.failed.add(request.decision_id); this.refreshing = true;
        try { const fresh = await this.transport.load();if(!current())return;if (fresh.ok) { this.session.merge(fresh); this.sync(); } } catch (e) { if(current())this.message = e.message; } finally { if(current())this.refreshing = false; }
      }
      if (request.operation === 'clear_all') { if (result.ok) { this.queued.clear(); this.failed.clear(); this.cards.select(null); } this.draw(); return; }
      const next = [...this.queued].find(key => !this.failed.has(key) && this.session.saveOperation(key));
      if (next) await this.send(next, this.session.saveOperation(next));
    } catch (e) { if(current())this.message = e.message; }
    this.draw();
  }
  async traverse(direction) {
    if (this.refreshing || this.clearOpen || this.sourceOpen) return;
    const ids = this.session[direction](); this.sync(); for (const id of ids) { this.queued.add(id); this.failed.delete(id); }
    const next = [...this.queued].find(id => !this.failed.has(id) && this.session.saveOperation(id));
    if (next) await this.send(next, this.session.saveOperation(next));
  }
  async openSource(id) {
    if(this.disposed||!this.session)return;
    const request = ++this.sourceRequest; this.sourceOpen = true; this.sourcePreview = null; this.sourceMessage = '載入來源…'; this.draw();
    try {
      const result = await this.transport.request({ operation: 'source', decision_id: id }); if (this.disposed||request !== this.sourceRequest) return;
      if (!result.ok) throw new Error(result.error?.message ?? '無法讀取來源'); this.sourcePreview = result.source;
      this.sourceOverrides[id] = { ...result.source, revision: this.data.snapshot.revision, content: undefined };
      this.sourceMessage = result.source.status === 'available' ? '' : result.source.message;
    } catch (e) { if (!this.disposed&&request === this.sourceRequest) this.sourceMessage = `無法讀取來源：${e.message}`; }
    this.draw();
  }
  visible() { return stackDecisions(this.decisions().filter(d => this.held ? this.held.includes(d.id) : String(d.id) === this.linked || this.selection.selected.has(d.status))); }
  canClear() { return !this.disposed && this.editable && this.data && !this.data.pending && !this.data.busy && !this.refreshing && (this.decisions().some(d => d.answer) || this.data.dirty); }
  card(item, card) {
    const d = this.data, draft = Object.hasOwn(d.drafts, item.id) ? d.drafts[item.id] : null;
    const choice = draft ? draft.choice : item.answer?.kind === 'other' ? '__other' : item.answer?.option_id ?? '';
    const disabled = !this.editable || this.refreshing || d.pending?.operation === 'clear_all' || (!!d.pending && !d.busy) || draft?.conflict;
    const source = this.sourceOverrides[item.id] ?? d.snapshot.sources?.[item.id];
    return html`<article class="checklist-item decision-card ${card.visibilityEnabled ? 'decision-has-visibility' : ''}">${disclosure({ ...card, id: `body-${item.id}`, label: item.question },
      html`<header class="checklist-item-header">${copyButton(item.id, item.question)}<h2 id="decision-${item.id}" tabindex="-1">${item.question}</h2><span class="checklist-status">${item.status === 'pending' ? '待決策' : '已決策'}</span></header>`,
      html`<div class="decision-content">${item.source_ref ? html`<div class="decision-source">${source?.status === 'available' ? html`<button data-decision-control type="button" class="source-link" @click=${() => this.openSource(item.id)}>來源：${item.source_ref}</button>` : html`<span>${source?.message ?? '來源尚未檢查，請更新並重啟服務'}</span><small>${item.source_ref}</small>${source ? html`<button data-decision-control type="button" class="source-link" @click=${() => this.openSource(item.id)}>重新檢查來源</button>` : nothing}`}</div>` : nothing}
      ${item.context || item.recommendation ? html`<div class="decision-description">${item.context ? html`<p class="decision-text">${inline(item.context)}</p>` : nothing}${item.recommendation ? html`<p>建議：${item.options.find(o => o.id === item.recommendation.option_id)?.label} — ${inline(item.recommendation.reason)}</p>` : nothing}</div>` : nothing}
      <fieldset ?disabled=${disabled}><legend class="decision-visually-hidden">${item.question}</legend>${repeat(item.options, o => o.id, (o, index) => html`<label class="decision-option"><input type="radio" name="answer-${item.id}" .checked=${live(choice === o.id)} @click=${() => this.choose(item.id, o.id)}><span>${String.fromCharCode(65 + index)}　${o.label}${o.id === item.recommendation?.option_id ? '（建議）' : ''}${o.description ? html` <small>${inline(o.description)}</small>` : nothing}</span></label>`)}
      ${item.allow_other ? html`<label class="decision-option"><input type="radio" name="answer-${item.id}" .checked=${live(choice === '__other')} @click=${() => { this.choose(item.id, '__other'); queueMicrotask(() => document.getElementById(`other-${item.id}`)?.focus()); }}><span>其他</span></label><div class="decision-other"><label for="other-${item.id}">其他方案與理由</label><textarea id="other-${item.id}" ?readonly=${choice !== '__other' && this.editingOther !== item.id} @focus=${() => { this.editingOther = item.id; this.draw(); }} @blur=${() => { this.editingOther = null; this.draw(); }} .value=${live(draft ? draft.other : item.answer?.kind === 'other' ? item.answer.text : '')} @input=${e => this.changeOther(item.id, e.currentTarget.value)}></textarea></div>` : nothing}</fieldset>
      ${draft?.conflict ? html`<p role="alert">此題已變更，原草稿保留：${draft.choice} ${draft.other}</p><button data-decision-control ?disabled=${this.refreshing || !!d.pending} @click=${() => { this.session.rebase(item.id); this.sync(); this.confirm(item.id); }}>已核對最新題目，套用選擇</button>` : nothing}
      <div class="decision-actions">${this.failed.has(item.id) && draft && !draft.conflict && !d.pending ? html`<button data-decision-control ?disabled=${this.refreshing} @click=${() => this.confirm(item.id)}>重試保存</button>` : nothing}</div></div>`)}</article>`;
  }
  template() {
    const d = this.data, decisions = this.decisions(), visible = this.visible();
    return html`<main class="checklist-shell decisions-shell"><header class="checklist-header"><div><div class="replica-title-row">${productBack()}<h1>決策項目</h1></div>${this.owner ? html`<p class="document-owner"><a href=${this.owner.href}><span class="owner-arrow" aria-hidden="true">←</span><span class="owner-name">${this.owner.title}</span></a></p>` : nothing}</div>${productTheme()}</header>
      ${this.message ? html`<p role="status">${this.message}</p>` : nothing}
      ${this.summary ? html`<p>待決策 ${this.summary.pending}${this.summary.incomplete ? '（統計不完整）' : ''}</p>${this.summary.files.map(file => html`<article class="checklist-item"><a href="?scope=${this.summary.scope_id}&task=${file.task_id}">${file.task_id}</a><p>${file.error ?? `待決策 ${file.pending}／全部 ${file.total}`}</p></article>`)}${!this.summary.files.length ? html`<p>尚未建立決策文件。</p>` : nothing}` : d ? html`
      <div class="decision-overview"><p>待決策 ${decisions.filter(i => i.status === 'pending').length}／全部 ${decisions.length}</p><p>選項可隨時修改；選取「其他」後，文字更動會自動保存，空白則為待決策。未選取時可點擊文字欄編輯本頁草稿。保存失敗會保留修改供重試。</p></div>
      <div class="decision-controls">${historyTools({ id: 'decision-history', targetId:d.snapshot.document_key, history:d.history, disabled:!this.editable || this.refreshing || this.clearOpen || this.sourceOpen, onUndo:() => this.traverse('undo'), onRedo:() => this.traverse('redo'), onClear:() => { this.session.clearHistory(); this.sync(); }, onOpenChange:value => { this.historyOpen = value; } }, this)}
      <button data-decision-control type="button" ?disabled=${!decisions.some(i => i.status === 'pending')} @click=${() => { const item = decisions.find(i => i.status === 'pending'); if (!this.selection.selected.has('pending')) this.select(toggleTag(this.selection, 'pending')); this.cards.expand(item.id, true); queueMicrotask(() => document.getElementById(`decision-${item.id}`)?.focus()); }}>下一項待決策</button><button data-decision-control type="button" ?disabled=${!this.canClear()} @click=${() => { this.clearOpen = true; this.draw(); }}>清除全部答案</button></div>
      ${d.pending && !d.busy ? html`<button data-decision-control type="button" @click=${() => this.send(null, null, true)}>${d.pending.operation === 'clear_all' ? '查詢／重送清除操作' : '查詢／重送保存操作'}</button>` : nothing}${!visible.length ? html`<p>目前沒有符合條件的決策項目。</p>` : nothing}
      ${this.cards.render({ items: visible, allIds: decisions.map(i => i.id), storageKey: `taskprogress.decisions:${d.snapshot.document_key}`, disclosureKey: `taskprogress.decisions:${d.snapshot.document_key}`, heldOrder: this.held, onSelectionChange: id => this.selectCard(id), hiddenCount: decisions.length - visible.length, onShowHidden: () => this.select(createFilterSelection(['pending', 'decided'])) }, (item, card) => this.card(item, card),
      filters({ categories: [{ id: 'pending', label: '待決策' }, { id: 'decided', label: '已決策' }], order: [DEFAULT_CAPSULE_ID, 'pending', 'decided'], selected: this.selection.selected, defaultLit: isDefaultLit(this.selection), defaultLabel: '全部', onSelect: id => this.select(toggleTag(this.selection, id)), onSelectDefault: () => this.select(toggleDefault(this.selection)) }))}
      ${Object.entries(d.drafts).filter(([id]) => !decisions.some(i => i.id === id)).map(([id, draft]) => html`<p role="alert">已移除題目 ${id} 的原草稿：${draft.choice} ${draft.other}</p><button data-decision-control @click=${() => { this.session.discard(id); this.sync(); }}>關閉已移除題目提示</button>`)}` : nothing}</main>
      ${dialog({ open: !!this.sourceOpen, title: '決策來源', onClose: () => { this.sourceOpen = false; this.sourceRequest++; this.draw(); } }, html`${this.sourcePreview ? html`<p class="decision-text">${this.sourcePreview.reference}</p>` : nothing}${this.sourceMessage ? html`<p role="status">${this.sourceMessage}</p>` : nothing}${this.sourcePreview?.status === 'available' ? html`<pre class="source-content" aria-label="來源文件內容">${this.sourcePreview.content.replace(/\r\n/g, '\n').split('\n').map((line, i) => html`<span id="source-line-${i + 1}" class=${i + 1 === this.sourcePreview.line ? 'source-target' : ''}>${line || ' '}${'\n'}</span>`)}</pre>` : nothing}`)}
      ${dialog({ open: !!this.clearOpen, title: '清除全部決策答案？', onClose: () => { this.clearOpen = false; this.draw(); } }, html`<p>將清除目前文件「${d?.snapshot.document.task_id}」全部 ${decisions.length} 題的答案、「其他」理由及尚未保存的輸入，包含篩選後隱藏的題目。所有題目回到待決策，題目與選項保留。</p><p>清除成功後可在本頁按「復原」還原；重新整理或離開頁面後，歷史不會保留。</p><div class="theme-dialog-actions"><button data-decision-control type="button" class="secondary-button" @click=${() => { this.clearOpen = false; this.draw(); }}>取消</button><button data-decision-control type="button" class="primary-button" ?disabled=${!this.canClear()} @click=${() => { this.clearOpen = false; this.send(null, 'clear_all'); }}>確認清除全部</button></div>`)}`;
  }
}
const app = new Decisions(document.querySelector('#app')); app.draw(); await app.load();
globalThis.taskprogressWebUi = { kind: 'decisions', app, editable: env.editable };
addEventListener('pagehide', e => { if (!e.persisted) app.destroy(); });
