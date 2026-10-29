import { registerUiAdapter } from '@taskprogress/ui-host.js';
import { stableSortTaskItemsByPriority, STATUS_META } from '@taskprogress/report-model.js';
import { liftNextItem } from '@taskprogress/next-marker.js';
import { itemReference, copyText } from '@taskprogress/item-reference.js';
import { formatActivity } from '@taskprogress/item-activity.js';
import { statusLinks, statusTooltip } from '@taskprogress/item-state.js';
import { linkSelectionHref } from '@taskprogress/link-selection.js';
import { html, nothing, repeat, live, View, Cards, text, inline, action, holdAction, reorderAction, copyAction, disclosure, copyButton, filters, progressBar, moduleStrip, saveBar, dialog, productTheme } from './common.mjs';
import { registerUi } from '@web/ui';
import { timeDialog, costDialog, deliveryConfirmation } from './assessment.mjs';

registerUi();
const statuses = Object.entries(STATUS_META).map(([value, meta]) => ({ value, ...meta }));
const status = value => STATUS_META[value] ?? { label: value, tone: 'muted' };
const options = (entries, value, label, onChange, className = '') => html`<select class=${className} aria-label=${label} .value=${live(String(value))} @change=${e => onChange(e.currentTarget.value)}>${entries.map(e => html`<option .value=${String(e.value)} ?selected=${String(e.value) === String(value)}>${e.label}</option>`)}</select>`;
const prioritySelect = (policy, value, label, onChange) => options(policy.levels.map(e => ({ value: e.value, label: policy.format(e.value) })), policy.normalize(value, policy.fallbackValue), label, v => onChange(Number(v)), 'inline-priority-select');

function reorderItems(p, view, task) {
  return { enabled:!!(p.editing || p.reorderable), axis:'vertical', surface:p.editing ? false : 'item', previewClasses:p.editing ? {before:'item-drop-before',after:'item-drop-after',dragging:'item-row-dragging'} : {before:'item-gap-before',after:'item-gap-after',dragging:'item-row-dragging'}, onMove(request) {
    if (!(p.editing || p.reorderable)) return;
    const items=task.pending_items ?? [], item=items.find(i=>i.id===request.id), target=items.find(i=>i.id===request.targetId);
    if (!item || !target || item.legacy || target.legacy || p.policy.normalize(item.priority,p.policy.fallbackValue)!==p.policy.normalize(target.priority,p.policy.fallbackValue)) return;
    const before=items.map(i=>i.id), after=before.filter(id=>id!==item.id);
    after.splice(after.indexOf(target.id)+(request.placement==='after'?1:0),0,item.id);
    if (before.every((id,index)=>id===after[index])) return;
    const command={taskId:task.id,itemId:item.id,position:{[request.placement]:target.id}}, editing=p.editing;
    const saved=editing ? p.onCommand({type:'reorder-item',...command}) : p.onReorder?.(command);
    Promise.resolve(saved).then(()=>queueMicrotask(()=> {
      if (view.disposed || view.props.editing!==editing) return;
      const row=[...view.target.querySelectorAll('[data-item-row]')].find(n=>n.dataset.itemRow===`${task.id}/${item.id}`);
      (editing ? row?.querySelector('.item-row-grip') : row)?.focus();
    }));
  } };
}

function itemRow(p, v, task, field, item, lead) {
  const editing = p.editing, itemStatus = item.status ?? (field === 'completed_items' ? 'done' : 'planned');
  const meta = item.derivedState && item.derivedState !== 'done' ? { label: item.derivedStateLabel, tone: item.derivedStateTone } : status(itemStatus);
  const priority = p.policy.metadata(item.priority);
  const reference = editing ? null : itemReference({ scopeId: p.scopeId, taskId: task.id, item });
  const selected = reference && v.state.selection?.keys.has(reference);
  const isNext = item.id === p.nextItemId;
  const setNext = () => p.onSetNext?.({ taskId: task.id, itemId: item.id, clear: isNext });
  const cmd = (type, fields) => p.onCommand({ type, taskId: task.id, field, itemId: item.id, ...fields });
  const targets = editing ? [] : statusLinks(item).map(t => ({ ...t, href: t.href ? linkSelectionHref(t.href, meta.tone) : null }));
  const linked = targets.filter(t => t.href);
  const key = `${task.id}/${item.id}`;
  if (!linked.length) v.state[`wait:${key}`] = false;
  const canReorder=(editing || p.reorderable) && field==='pending_items' && item.id && !item.legacy;
  const copyCount=selected ? v.state.selection.keys.size : 1, copyTitle=copyCount>1?`複製已選取的 ${copyCount} 項參照`:reference;
  return html`<li class="editor-item-row ${editing ? 'editable-work-item' : canReorder ? 'item-row-reorderable' : ''} ${selected ? 'is-selected' : ''} ${isNext ? 'is-next' : ''}" data-select-key=${reference && p.selection ? reference : nothing}
    data-item-row=${key} data-reorder-id=${item.id} data-reorder-sortable=${String(!!canReorder)} data-reorder-group=${String(p.policy.normalize(item.priority,p.policy.fallbackValue))}
    tabindex=${reference && p.selection ? 0 : nothing} title=${editing ? nothing : formatActivity(item.activity)}
    ${action(holdAction, { enabled: !!(p.onSetNext && reference && !editing), onTrigger: setNext })}
    @click=${e => reference && p.selection?.rowClick(reference, e)} @focus=${() => reference && p.selection?.rowFocus(reference)}
    @keydown=${e => { if (!editing && e.shiftKey && e.key === 'Enter' && p.onSetNext && reference && e.target === e.currentTarget) { e.preventDefault(); setNext(); return; } if (reference) p.selection?.rowKeydown(reference, e); }}>
    ${editing && canReorder ? html`<button type="button" class="item-row-grip" data-item-ref=${key} data-reorder-handle draggable="true" aria-label="移動「${item.title}」（Alt+↑／↓，限同優先級）">⠿</button>` : html`<span class="item-row-marker item-row-marker-${itemStatus}" aria-hidden="true">${itemStatus === 'done' ? '✓' : '○'}</span>`}
    ${editing || (itemStatus !== 'done' && priority && (!priority.hidden || !p.policy.labelsValid)) ? html`<span class="item-row-priority">${editing ? prioritySelect(p.policy, item.priority, `設定「${item.title}」的優先級`, value => cmd('set-item-field', { property: 'priority', value })) : html`<span class="priority-badge priority-${priority.tone}">${p.policy.format(item.priority)}</span>`}</span>` : nothing}
    <div class="item-row-description" data-reorder-content>${editing ? html`<input class="inline-edit-input" aria-label="編輯子項目：${item.title}" title=${item.title} maxlength="500" .value=${live(item.title)} @input=${e => cmd('set-item-field', { property: 'title', value: e.currentTarget.value })}>`
      : html`<div class="item-row-text">${isNext ? html`<span class="item-next-capsule">Next</span>` : nothing}${selected ? html`<span class="item-row-selected-label">已選取</span>` : nothing}
      ${item.sourceRef ? item.sourceRef.available ? html`<a class="document-source-link" href=${linkSelectionHref(item.sourceRef.href, meta.tone)} title=${item.sourceRef.title}><span class="source-icon" aria-hidden="true">${item.sourceRef.kind === 'decision' ? '⚖' : item.sourceRef.manual ? '📋' : '🤖'}</span><span class="source-label">${item.sourceRef.label}</span></a>` : html`<span class="document-source-link source-unavailable" title=${item.sourceRef.error ?? '來源無法讀取'}>⚠️ 來源不可用</span>` : nothing}
      ${text(item.displayTitle ?? item.title, { lines: 1, expanded: lead, linkTone: meta.tone })}</div>`}</div>
    ${reference ? html`<button type="button" class="item-row-copy" data-item-ref=${key} tabindex=${p.selection ? -1 : 0} aria-label=${copyCount>1?`複製已選取的 ${copyCount} 項參照`:`複製「${item.title}」的參照`} title=${copyTitle} @pointerdown=${e => e.stopPropagation()} ${action(copyAction,{copy:()=>p.selection?p.selection.copyReferences(reference):copyText(reference),feedbackTitle:true,title:copyTitle})}>⧉</button>` : nothing}
    <span class="item-row-utility-panel"><span class="item-row-modules">${moduleStrip({ capsules: p.itemCapsules?.get(item.id) ?? [], moduleOrder: p.moduleOrder, onReorder: p.onModuleReorder, onActivate: id => p.onModuleActivate?.(id, { taskId: task.id, itemId: item.id, itemTitle: item.title }) })}</span>
    <span class="item-row-status">${editing ? options(statuses, itemStatus, `設定「${item.title}」的狀態`, value => cmd('set-item-status', { status: value }), 'inline-status-select')
      : targets.length === 1 && linked.length === 1 ? html`<a class="item-status-capsule status-${meta.tone} is-link" href=${linked[0].href} title=${statusTooltip(item) ?? linked[0].label}>${meta.label}</a>`
      : linked.length ? html`<span class="wait-menu" @focusout=${e => { if (!e.currentTarget.contains(e.relatedTarget)) { v.state[`wait:${key}`] = false; v.draw(); } }} @keydown=${e => { if (e.key === 'Escape') { v.state[`wait:${key}`] = false; v.draw(); } }}><button type="button" class="item-status-capsule status-${meta.tone} is-link" aria-haspopup="true" aria-expanded=${!!v.state[`wait:${key}`]} @click=${e => { e.stopPropagation(); v.state[`wait:${key}`] = !v.state[`wait:${key}`]; v.draw(); }}>${meta.label}</button>${v.state[`wait:${key}`] ? html`<ul class="wait-menu-list">${targets.map(t => html`<li>${t.href ? html`<a href=${t.href} @click=${e => e.stopPropagation()}>${t.label}</a>` : html`<span>${t.label}（無法讀取）</span>`}</li>`)}</ul>` : nothing}</span>`
      : html`<span class="item-status-capsule status-${meta.tone}" title=${statusTooltip(item) ?? nothing}>${meta.label}</span>`}</span>
    ${editing ? html`<span class="item-row-action"><button class="inline-delete-button" type="button" aria-label="刪除子項目：${item.title}" @click=${() => cmd('delete-item', {})}>刪除</button></span>` : nothing}</span>
  </li>`;
}

function developer(d) {
  if (!d) return nothing;
  const next = d.next_step ?? d.next_steps?.[0];
  if (!next && !d.next_steps?.length && !d.blockers?.length && !d.decisions?.length && !d.routes?.length && !d.claim) return nothing;
  return html`<details class="developer-details"><summary class="developer-summary">${next ? html`<span class="developer-next-label">後續：</span><span class="developer-next-action">${next}</span>` : nothing}<span class="developer-expand-hint">展開作法與方向</span></summary><div class="developer-body"><h4 class="developer-body-title">作法與方向</h4>
    ${[['後續', d.next_step ? d.next_steps : d.next_steps?.slice(1)], ['Blockers', d.blockers]].map(([label, list]) => list?.length ? html`<section class="detail-section"><h4 class="detail-heading">${label}</h4><ul class="detail-list">${list.map(value => html`<li>${value}</li>`)}</ul></section>` : nothing)}
    ${d.decisions?.map(item => html`<article class="decision-item"><p>${item.summary}</p><code>${item.reference ?? ''}</code></article>`)}
    ${d.routes?.map(item => html`<article class="route-item"><div class="route-heading"><strong>${item.title}</strong><span class="route-state route-${item.state}">${item.state}</span></div><p>${item.reason ?? ''}</p></article>`)}
    ${d.claim ? html`<section class="detail-section claim-section"><h4>Claim</h4><p>Agent: ${d.claim.agent}</p><p>${d.claim.worktree ?? ''}</p>${d.claim.source_paths?.map(path => html`<code class="reference">${path}</code>`)}</section>` : nothing}
  </div></details>`;
}
function taskCard(p, v, task, card) {
  const meta = status(task.status), priority = p.policy.metadata(task.priority), progress = p.progress[task.id];
  const command = (field, value) => p.onCommand({ type: 'set-task-field', taskId: task.id, field, value });
  const groups = [{ status: 'done', title: '已完成', className: 'completed-work', field: 'completed_items', items: task.completed_items ?? [] },
    { status: 'planned', title: '待處理', className: 'pending-work', field: 'pending_items', items: liftNextItem(stableSortTaskItemsByPriority(task.pending_items), p.nextItemId) }];
  groups.sort((a, b) => { const rank = id => { const i = p.statusOrder?.indexOf(id) ?? -1; return i < 0 ? 99 : i; }; return rank(a.status) - rank(b.status); });
  return html`<article class="task-card editor-task-card priority-${priority?.tone ?? 'unspecified'}" aria-labelledby="task-${task.id}-title">${disclosure({ ...card, id: `task-body-${task.id}`, label: task.title },
    html`<header class="task-header"><div class="task-title-group">${p.editing ? html`<div class="time-task-status-line">${options(statuses, task.status, `${task.title} 狀態`, v => command('status', v), 'inline-status-select')}${prioritySelect(p.policy, task.priority, `${task.title} 優先級`, value => command('priority', value))}</div>` : nothing}
    <div class="time-task-title-line">${p.editing ? html`<input id="task-${task.id}-title" class="task-title-input" aria-label="任務名稱" maxlength="160" .value=${live(task.title)} @input=${e => command('title', e.currentTarget.value)}>` : html`${copyButton(task.id, task.title)}<h3 id="task-${task.id}-title">${task.title}</h3>`}</div>
    ${p.moduleTotals?.[task.id]?.length ? html`<div class="task-module-totals">${p.moduleTotals[task.id].map(t => html`<span class="task-module-total task-module-total-${t.id}">${t.label}</span>`)}</div>` : nothing}</div>
    <div class="task-header-meta"><strong class="task-fraction" aria-label="子項目完成 ${progress.completed}，共 ${progress.total}">${progress.completed} / ${progress.total}</strong><span class="status-badge status-${meta.tone}">${meta.label}</span><code class="task-id">${task.id}</code></div></header>`,
    html`${p.editing ? html`<textarea class="task-summary-input" aria-label="任務描述" maxlength="1000" rows="3" .value=${live(task.summary ?? '')} @input=${e => command('summary', e.currentTarget.value)}></textarea>` : html`<div class="task-summary">${text(task.summary, { lines: 2, emphasis: true })}</div>`}${developer(task.developer)}
      <div class="work-columns">${groups.map(g => g.items.length || p.editing ? html`<section class="detail-section ${g.className}"><h4 class="detail-heading">${g.title}</h4><ul class="detail-list" id="task-${task.id}-${g.field}" ${action(reorderAction,reorderItems(p,v,task))}>${repeat(g.status === 'done' && !v.state[`completed:${task.id}`] ? g.items.slice(0, 1) : g.items, i => i.id, (item, index) => itemRow(p, v, task, g.field, item, (card.lead && g.status !== 'done' && index === 0) || item.id === p.nextItemId))}</ul>
      ${g.status === 'done' && g.items.length > 1 ? html`<button type="button" class="completed-more" aria-expanded=${!!v.state[`completed:${task.id}`]} aria-controls="task-${task.id}-${g.field}" @click=${() => { v.state[`completed:${task.id}`] = !v.state[`completed:${task.id}`]; v.draw(); }}><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d=${v.state[`completed:${task.id}`] ? 'M3 10l5-5 5 5' : 'M3 6l5 5 5-5'} fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>${v.state[`completed:${task.id}`] ? '收合' : `顯示更多（${g.items.length - 1}項）`}</button>` : nothing}</section>` : nothing)}
      <section class="task-adder-section">${p.editing ? html`<div class="spike-add-shell">${v.state[`add:${task.id}`] ? html`<form class="spike-add-form" @submit=${e => { e.preventDefault(); const data = new FormData(e.currentTarget); const result = p.onAddItem(task.id, data.get('title'), Number(data.get('priority'))); v.state[`error:${task.id}`] = result?.error; if (!result?.error) v.state[`add:${task.id}`] = false; v.draw(); }}><input name="title" aria-label="新增子項目描述" placeholder="新增待處理項目" maxlength="500"><select name="priority" aria-label="新增子項目優先級">${p.policy.levels.map(level => html`<option value=${level.value} ?selected=${level.value === p.policy.creationDefaultValue}>${p.policy.format(level.value)}</option>`)}</select><button type="submit">新增</button><button type="button" @click=${() => { v.state[`add:${task.id}`] = false; v.draw(); }}>取消</button><p class="spike-field-error" role="alert">${v.state[`error:${task.id}`] ?? ''}</p></form>` : html`<button class="spike-add-button" type="button" aria-label="在「${task.title}」新增子項目" @click=${() => { v.state[`add:${task.id}`] = true; v.draw(); }}>＋</button>`}</div>` : nothing}</section></div>`)}
  </article>`;
}

const templates = {
  'task-list': (p, v) => {
    if (!v.cards) v.cards = new Cards(v);
    if (v.selectionSource !== p.selection) { v.unsubscribe?.(); v.selectionSource = p.selection; v.unsubscribe = p.selection?.subscribe(s => { v.state.selection = s; queueMicrotask(v.refresh); }); v.cleanups.push(() => v.unsubscribe?.()); }
    return html`${v.cards.render({ items: p.tasks, allIds: p.allIds, storageKey: p.cardStorageKey, pinEnabled: true, requestedPin: p.requestedPin, nextId: p.nextTaskId, hiddenCount: p.hiddenCount, onShowHidden: p.onShowHidden },
      (task, card) => task.kind === 'report_pointer' ? pointer(p, task, card) : taskCard(p, v, task, card), p.filters ? filters(p.filters) : nothing,
      p.onSearch ? html`<ui-search-field class="task-search" label="搜尋任務卡名稱、摘要與子項" placeholder="搜尋名稱、摘要、子項"
        .query=${p.searchQuery ?? ''} @query-change=${e => p.onSearch(e.detail.query)}></ui-search-field>` : nothing)}${!p.tasks.length ? html`<p class="empty-state">${p.emptyLabel}</p>` : nothing}`;
  },
  'report-summary': p => p.editable ? html`<textarea class="report-summary-input" aria-label=${p.label ?? '報告摘要'} maxlength="1000" rows="2" placeholder=${p.placeholder ?? ''} .value=${live(p.value ?? '')} @input=${e => p.onCommit(e.currentTarget.value)}></textarea>` : html`<p class="hero-summary">${p.text}</p>`,
  'project-progress': p => html`<div class="project-progress-label"><strong id="project-progress-value">整體約 ${p.percentage}%</strong></div>${progressBar({ ...p, form: 'segmented', label: `整體進度 ${p.percentage}%，已完成 ${p.completed}，共 ${p.total}`, extraClass: 'project-progress-meter' })}`,
  'status-filters': filters,
  'status-overview': p => (p.statusOrder ?? []).filter(id => id !== 'planned' && STATUS_META[id]).map(id => html`<article class="overview-card overview-${status(id).tone}" data-status=${id}><span class="overview-value">${p.counts[id] ?? 0}</span><span class="overview-label">${id === 'in_progress' ? '目前進行' : status(id).label}</span></article>`),
  'mode-toggle': p => html`<button class="view-mode-toggle editor-mode-dock ${p.mode === 'edit' ? 'is-editing' : ''}" type="button" ?disabled=${p.disabled || !p.available} ?hidden=${p.hideWhenUnavailable && !p.available} title=${!p.available ? p.unavailableTitle : ''} aria-label="切換到${p.mode === 'edit' ? '預覽' : '編輯'}模式" @click=${() => p.onToggle(p.mode === 'edit' ? 'preview' : 'edit')}>${p.mode === 'edit' ? '預覽' : '編輯'}模式</button>`,
  'save-bar': saveBar,
  'add-control': (p, v) => p.expanded ? html`<form class=${p.kind === 'task' ? 'task-add-form' : 'inline-add-form'} @keydown=${e => { if (e.key === 'Escape') { e.preventDefault(); p.onCancel(); } }} @submit=${e => { e.preventDefault(); const d = new FormData(e.currentTarget); p.onSubmit({ title: d.get('title'), summary: d.get('summary') ?? '', priority: Number(d.get('priority')) }); }}><input name="title" class="inline-edit-input" maxlength="160" aria-label=${p.titleAriaLabel || '新任務名稱'} placeholder=${p.titlePlaceholder || '任務名稱'}>${p.kind === 'task' ? html`<textarea name="summary" class="task-summary-input" rows="2" maxlength="1000" aria-label=${p.summaryAriaLabel || '新任務描述'} placeholder=${p.summaryPlaceholder || '任務描述（必填）'}></textarea>` : nothing}<select class="inline-priority-select" name="priority" aria-label="新任務優先級">${p.policy.levels.map(l => html`<option value=${l.value} ?selected=${l.value === p.policy.creationDefaultValue}>${p.policy.format(l.value)}</option>`)}</select><span class="task-add-contract">${p.contractText ?? ''}</span><span class="inline-add-error" role="alert" ?hidden=${!p.errorMessage}>${p.errorMessage}</span><div class="inline-add-actions"><button type="button" class="secondary-button inline-add-cancel" @click=${p.onCancel}>${p.cancelLabel || '取消'}</button><button type="submit" class="secondary-button">${p.submitLabel || '加入任務'}</button></div></form>` : html`<button class=${p.kind === 'task' ? 'task-add-trigger' : 'inline-add-trigger'} type="button" aria-label=${p.triggerAriaLabel || '增加工作項目'} @click=${p.onOpen}>＋</button>`,
  'diagnostics': p => (p.diagnostics ?? []).map(d => html`<div class="diagnostic diagnostic-${d.level ?? 'error'}"><strong>${d.level === 'warning' ? '注意' : '無法載入部分資料'}</strong><p>${d.message}</p></div>`),
  'scope-directory': p => p.scopes.map(s => html`<article class="scope-entry"><a class="scope-link" href=${s.href}>${s.id}</a>${s.baseOnlyHref ? html`<a class="scope-developer-link" href=${s.baseOnlyHref}>${p.baseOnlyLabel ?? '基本報告'}</a>` : nothing}</article>`),
  'theme-control': productTheme,
  'project-module-strip': moduleStrip,
  'time-summary-button': p => html`<button class=${p.className ?? 'time-summary-button'} type="button" ?hidden=${p.hidden} ?disabled=${p.disabled} aria-label=${p.ariaLabel ?? ''} @click=${p.onClick}><span>${p.label}</span>${p.showDot ? html`<span class="time-risk-dot"></span>` : nothing}${p.showChevron ? html`<span class="time-chevron">›</span>` : nothing}</button>`,
  'delivery-save-confirmation': deliveryConfirmation,
  'time-dialog': timeDialog,
  'cost-dialog': costDialog,
};
function pointer(p, task, card) {
  const state = p.pointerCards?.[task.id] ?? { status: 'loading' }, c = state.status === 'ready' ? state.card : null;
  const entry = value => value ? STATUS_META[value] ?? { label: value, tone: 'muted' } : { label: '指路', tone: 'muted' };
  return html`<article class="task-card pointer-card ${c ? `status-${entry(c.status).tone}` : ''}" aria-labelledby=${`task-${task.id}-title`}>${disclosure({ ...card, id: `task-body-${task.id}`, label: task.title }, html`<header class="task-header"><div class="task-title-group"><div class="time-task-title-line"><h3 id=${`task-${task.id}-title`}>${state.openHref ? html`<a class="pointer-card-title-link" href=${state.openHref}>${task.title}</a>` : task.title}</h3></div>${state.openHref ? html`<a class="pointer-card-badge" href=${state.openHref}>開啟專案報告 →</a>` : nothing}</div><div class="task-header-meta">${c ? html`<strong class="task-fraction">${c.progress.completed} / ${c.progress.total}</strong><span class="status-badge status-${entry(c.status).tone}">${entry(c.status).label}</span>` : nothing}${state.status === 'error' ? html`<span class="pointer-card-error" role="alert">${state.message}</span>` : state.status === 'loading' ? html`<span role="status">讀取目標報告中…</span>` : nothing}</div></header>`, c ? html`<div class="task-summary">${text(c.summary, { emphasis: true })}</div><p class="pointer-card-progress" aria-label=${`子任務完成 ${c.progress.completed}，共 ${c.progress.total}`}>${c.progress.completed} / ${c.progress.total}（${c.progress.percentage}%）</p><ul class="pointer-card-rows">${c.rows.map(r => html`<li class="pointer-card-row"><span class="pointer-card-row-title">${r.title}</span><span class="status-badge status-${entry(r.status).tone}">${entry(r.status).label}</span></li>`)}</ul>` : nothing)}</article>`;
}
export const webViewerAdapter = {
  id: 'yu5h1-web-ui-workflow', regions: Object.keys(templates),
  mount(region, target, props) { const v = new View(target, props, templates[region]); v.draw(); return v; },
  update(instance, props) { return instance.update(props); }, destroy(instance) { instance.destroy(); },
};
registerUiAdapter(webViewerAdapter);
