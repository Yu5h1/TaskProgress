// TaskProgress presentation only. Figures, risk, validation and saving remain
// with the pinned product controllers; these templates never calculate a quote.
import { html, nothing, repeat, live, dialog } from './common.mjs';
import { timeSettings } from './time-settings.mjs';

export const metricGrid = (metrics = []) => html`<div class="assessment-metric-grid">${metrics.map(m => html`<div class="assessment-metric"><span>${m.label}</span><strong>${m.tone ? html`<span class="assessment-tone-dot assessment-tone-${m.tone}" aria-hidden="true"></span>` : nothing}${m.value}</strong></div>`)}</div>`;
const note = (heading, body, tone) => html`<section class="assessment-note"><h3>${tone ? html`<span class="assessment-tone-dot assessment-tone-${tone}" aria-hidden="true"></span>` : nothing}${heading}</h3>${body}</section>`;
const badges = rows => (rows ?? []).map(b => html`<span class="assessment-source-badge source-${b.kind}">${b.label}</span>`);
const readout = (label, value, chips) => html`<section class="assessment-readout"><span class="assessment-readout-label">${label}</span><span class="assessment-readout-badges">${chips}</span><strong class="assessment-readout-value">${value}</strong></section>`;
const sources = rows => html`<div class="time-source-list">${(rows ?? []).map(r => html`<div class="time-source-row"><div><strong>${r.label}</strong><p>${r.note}</p></div><span>${r.value}</span></div>`)}</div>`;
const composition = rows => html`<section class="time-composition"><h3>估算組成</h3>${sources(rows)}</section>`;
const evalNode = (n, cls = '') => html`<div class="time-evaluation-node ${cls}"><span>${n.label}</span><strong>${n.value}</strong><small>${n.note}</small></div>`;
const flowPanel = (flow, active) => html`<section class="time-tab-panel time-flow-panel" id="time-flow-panel" role="tabpanel" aria-labelledby="time-flow-tab" ?hidden=${!active}><p class="time-flow-intro">${flow.intro}</p><div class="time-flow-lanes">
  <section class="time-flow-lane" aria-label="工程估算路徑">${evalNode(flow.engineeringLane.source)}<span class="time-flow-arrow">→</span>${evalNode(flow.engineeringLane.result, 'time-evaluation-result')}</section>
  <section class="time-flow-lane" aria-label="工作容量路徑">${evalNode(flow.capacityLane.source)}<span class="time-flow-arrow">→</span>${evalNode(flow.capacityLane.result, 'time-evaluation-result')}</section></div>
  <div class="time-flow-merge"><span class="time-flow-arrow">↓</span>${evalNode(flow.merge, flow.merge.className)}</div><div class="time-flow-lane time-flow-risk">${evalNode(flow.risk.trend)}<span class="time-flow-arrow">→</span>${evalNode(flow.risk.result, flow.risk.result.className)}</div><p class="time-flow-note">${flow.note}</p></section>`;
const engineeringPanel = (p, active) => html`<section class="time-tab-panel" id="time-engineering-panel" role="tabpanel" aria-labelledby="time-engineering-tab" ?hidden=${!active}>${metricGrid(p.metrics)}${note('風險評估公式', html`<p>${p.explanation.text}</p><code class="time-formula">${p.explanation.formula}</code>`, p.explanation.className)}${note('執行校準', html`<p>${p.calibrationText}</p>`)}${composition(p.composition)}</section>`;
const capacityPanel = (p, active) => html`<section class="time-tab-panel" id="time-capacity-panel" role="tabpanel" aria-labelledby="time-capacity-tab" ?hidden=${!active}><div class="time-capacity-toolbar"><p>工作容量由每日分配、工作日及休假例外共同產生。</p></div>${metricGrid(p.metrics)}${note('每日容量公式', html`<p>固定不可工作時間只在產生容量時間線時扣除一次；週末依工作日設定排除。</p><code class="time-formula">${p.formulaCode}</code>`)}<section class="time-composition"><h3>${p.exceptionsHeading}</h3>${p.exceptions ? sources(p.exceptions) : html`<div class="time-source-list"><p class="time-empty-note">目前沒有休假或其他容量例外。</p></div>`}</section></section>`;
const estimatePanel = p => html`<section class="time-tab-panel time-estimate-only-panel"><p class="time-flow-intro">${p.intro}</p>${metricGrid(p.metrics)}${note('執行校準', html`<p>${p.calibrationText}</p>`)}${composition(p.composition)}</section>`;

export function manualEstimate(p, view) {
  const item = p.item, current = p.activeEstimate;
  const key = `${item.itemId}:${current?.estimate_id ?? 'analysis'}`;
  if (view.state.manualKey !== key) {
    view.state.manualKey = key;
    view.state.manual = { hours: current?.likely_minutes ? String(current.likely_minutes / 60) : item.unset ? '' : String(item.likelyMinutes / 60), note: current?.human_note ?? '', confirmed: !!(current?.human_confirmed ?? item.humanConfirmed), error: '' };
  }
  const s = view.state.manual, title = p.title;
  return html`<form class="spike-estimate-form" @submit=${e => { e.preventDefault(); const hours = Number(s.hours); if (!Number.isFinite(hours) || hours <= 0) s.error = '工時必須大於 0。'; else s.error = p.onManualEstimate({ taskId: item.taskId, itemId: item.itemId, likelyMinutes: Math.round(hours * 60), humanNote: s.note, humanConfirmed: s.confirmed })?.error ?? ''; view.draw(); }}>
    <section class="spike-estimate-row"><div class="spike-estimate-badges"><span>預估工時</span>${badges(item.sourceBadges)}</div><label class="spike-estimate-hours"><span>人工工時（hr）</span><input type="number" min="0.02" step="0.25" aria-label="「${title}」人工工時（hr）" .value=${live(String(s.hours ?? ''))} @input=${e => { s.hours = e.currentTarget.value === '' ? undefined : e.currentTarget.valueAsNumber; }}></label></section>
    <div class="time-item-rationale">${note('估算依據', html`<label class="spike-estimate-note"><span>人工依據</span><input maxlength="1000" aria-label="「${title}」人工依據" .value=${live(s.note)} @input=${e => { s.note = e.currentTarget.value; }} placeholder="例如：已拆解三個步驟"></label>`)}</div>
    <label class="spike-estimate-confirmation"><input type="checkbox" aria-label="確認「${title}」的人工估算" .checked=${s.confirmed} @change=${e => { s.confirmed = e.currentTarget.checked; }}><span>人工確認此工時</span></label><p class="spike-estimate-contract">未勾選仍可儲存人工工時與依據；確認只表示你接受目前估算結果。</p><div class="spike-estimate-actions"><button type="submit" aria-label="套用「${title}」人工估算草稿">套用工時草稿</button></div>${s.error ? html`<p class="spike-field-error" role="alert">${s.error}</p>` : nothing}</form>`;
}

export function timeDialog(p, view) {
  if (!p.open) { delete view.state.manualKey; delete view.state.settings; return dialog({ ...p, id: 'time-dialog', className: 'replica-time-dialog' }, nothing); }
  if (p.kind !== 'item' || !p.editing) delete view.state.manualKey;
  if (p.kind !== 'project' || !p.editing || !p.timeSettings?.hasConfig) delete view.state.settings;
  const item = p.item, project = p.project;
  const body = p.kind === 'item' && item ? html`<div><div class="time-detail-toolbar"><span class=${item.confidenceClass}>${item.confidenceLabel}</span><button class="time-small-button" type="button" @click=${p.onToggleDetails}>${item.toggleLabel}</button></div>
    ${p.editing && p.onManualEstimate ? manualEstimate(p, view) : html`${readout('預估工時', item.likelyHoursLabel, badges(item.sourceBadges))}<div class="time-item-rationale">${note('估算依據', html`<p>${item.rationale}</p>`)}</div>`}
    <section class="time-item-technical" ?hidden=${!item.detailsExpanded}>${metricGrid(item.technical.metrics)}${item.technical.analysisMethod ? html`<div class="time-source-row"><div><strong>${item.technical.analysisMethod.name}</strong><p>${item.technical.analysisMethod.note}</p></div><span>${item.technical.analysisMethod.version}</span></div>` : nothing}${item.technical.formula ? note('固定公式', html`<code class="time-formula">${item.technical.formula}</code>`) : nothing}${item.technical.reference ? html`<code class="time-reference">${item.technical.reference}</code>` : nothing}</section></div>`
    : p.kind === 'project' && project ? html`<div><div class="time-detail-toolbar"><span class="time-report-caption">${project.captionLabel}</span><button class="time-small-button" type="button" aria-expanded=${project.detailsExpanded} @click=${p.onToggleDetails}>${project.toggleLabel}</button></div>
    <section class="time-report-overview"><div class="time-report-grid">${project.overview.map(f => html`<div class="time-report-field"><span>${f.label}</span><strong>${f.urgencyClassName ? html`<span class="time-risk-dot ${f.urgencyClassName}" aria-hidden="true"></span>` : nothing}${f.value}</strong></div>`)}</div><p class="time-report-updated">${project.updatedLabel}</p></section>
    <section class="time-project-details" ?hidden=${!project.detailsExpanded}>${p.editing && p.timeSettings ? p.timeSettings.hasConfig ? html`${timeSettings(p.timeSettings, view)}${p.deliveryPreview ? riskPreview(p.deliveryPreview) : nothing}` : html`<section class="time-missing-config" aria-labelledby="time-missing-config-title"><h3 id="time-missing-config-title">尚未建立工作容量設定</h3><p>建立後採單人、平日 09:00–17:00、睡眠 8h／生活 8h／工作 8h；只是草稿，仍由全域儲存決定是否寫入。</p><button type="button" @click=${p.timeSettings.onInitializeConfig}>建立 8/8/8 預設設定</button></section>`
      : project.hasDeadline ? html`<div class="time-tab-list" role="tablist" aria-label="進度報告詳細資訊">${repeat(project.tabs, tab => tab.name, (tab, i) => html`<button class="time-tab" id="time-${tab.name}-tab" type="button" role="tab" aria-controls="time-${tab.name}-panel" aria-selected=${project.activeTab === tab.name} tabindex=${project.activeTab === tab.name ? 0 : -1} @click=${() => p.onSetTab(tab.name)} @keydown=${e => { if (!['ArrowLeft','ArrowRight'].includes(e.key)) return; e.preventDefault(); const next = project.tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + project.tabs.length) % project.tabs.length]; p.onSetTab(next.name); queueMicrotask(() => view.target.querySelector(`#time-${next.name}-tab`)?.focus()); }}>${tab.label}</button>`)}</div>${flowPanel(project.flow, project.activeTab === 'flow')}${engineeringPanel(project.engineering, project.activeTab === 'engineering')}${capacityPanel(project.capacity, project.activeTab === 'capacity')}` : estimatePanel(project.estimateOnly)}</section></div>` : nothing;
  return dialog({ ...p, id: 'time-dialog', className: 'replica-time-dialog', closeLabel: `關閉${p.kicker}` }, html`<div class="time-dialog-content">${body}</div>`);
}

export function costDialog(p) {
  const item = p.item, total = p.total;
  return dialog({ ...p, id: 'cost-dialog', className: 'replica-cost-dialog', closeLabel: `關閉${p.kicker}` }, html`<div class="cost-dialog-content">${p.kind === 'item' && item ? html`
    ${readout('估算成本', item.exact, badges(item.contributors))}${metricGrid([...(item.confidenceLabel ? [{ label:'信心', value:item.confidenceLabel }] : []), { label:'人工確認', value:item.humanConfirmed ? '已確認' : '未確認' }, { label:'狀態', value:item.done ? '已完成' : '未完成' }])}
    ${!item.humanConfirmed ? note('尚未由人確認', html`<p>這筆金額還沒有人接受為最終結果。有人填過參數或工具提出過建議，都不等於已確認。</p>`) : nothing}`
    : total ? html`${readout('估算總額', total.exact, html`<span class="cost-coverage cost-coverage-${total.coverage}">${total.coverageLabel}</span>`)}${metricGrid([{ label:'未完成成本', value:total.remaining }, ...(total.available ? [{ label:'可用資源', value:total.available }, { label:'餘額', value:total.balance, tone:total.tone }] : [])])}
      ${total.coverage !== 'full' ? note('為什麼沒有資源判斷', html`<p>尚有子項未估算，總額只涵蓋已估算的部分。未設置的值不計為零，也不代入預設值，因此在涵蓋率完整之前不宣稱預算充足與否。</p>`) : nothing}` : nothing}</div>`);
}

const number = new Intl.NumberFormat('zh-TW', { maximumFractionDigits: 1 });
const hours = value => value == null ? '—' : `${number.format(value / 60)} hr`;
const delta = value => value == null ? '無法比較' : `${value > 0 ? '+' : ''}${number.format(value / 60)} hr`;
function deliveryLabel(value) { if (!value?.present) return '未指定'; const d = new Date(value.value); return Number.isNaN(d.getTime()) ? value.value : new Intl.DateTimeFormat('zh-TW', { dateStyle:'medium', timeStyle:'short', hour12:false }).format(d); }
export function riskPreview(p, heading = '交付日草稿預覽') {
  return html`<section class="spike-risk-preview" aria-labelledby="delivery-risk-preview-title"><div class="spike-risk-preview-heading"><div><p class="spike-editor-kicker">尚未寫入</p><h3 id="delivery-risk-preview-title">${heading}</h3></div><span class="spike-preview-badge">預覽</span></div>
    ${p.deliveryChanged ? html`<dl class="spike-delivery-diff"><div><dt>原交付日</dt><dd>${deliveryLabel(p.before)}</dd></div><div><dt>草稿交付日</dt><dd>${deliveryLabel(p.after)}</dd></div></dl>` : p.capacityChanged ? html`<p class="spike-capacity-preview-note">交付日未變更；以下比較只反映工作容量草稿。</p>` : nothing}
    <div class="spike-risk-comparison"><article><span>目前分析</span><strong>${p.current.label}</strong><small>剩餘容量 ${hours(p.current.remainingCapacityMinutes)}</small></article><span class="spike-risk-arrow" aria-hidden="true">→</span><article class="risk-${p.next.urgency ?? 'none'}"><span>草稿分析</span><strong>${p.next.label}</strong><small>剩餘容量 ${hours(p.next.remainingCapacityMinutes)}</small></article></div>
    <dl class="spike-risk-deltas"><div><dt>容量變化</dt><dd>${delta(p.capacityDelta)}</dd></div><div><dt>餘裕／缺口變化</dt><dd>${delta(p.balanceDelta)}</dd></div></dl>${p.reason ? html`<p class="spike-preview-reason"><strong>修改原因：</strong>${p.reason}</p>` : nothing}</section>`;
}
export const deliveryConfirmation = p => dialog({ open:true, title:'確認儲存交付日變更？', kicker:'敏感資料確認', className:'replica-delivery-confirmation', busy:p.busy, dismissOnBackdrop:false, initialFocus:'[data-return-button]', onClose:() => { if (!p.busy) p.onBack(); } },
  html`<div class="spike-confirm-copy"><p>確認後才會重新驗證並寫入設定、分析與本機遮蔽歷史；預覽本身沒有修改檔案。</p></div>${riskPreview(p.preview, '儲存影響確認')}<div class="spike-confirm-actions"><button data-return-button type="button" ?disabled=${p.busy} @click=${p.onBack}>返回修改</button><button class="spike-save-button" type="button" ?disabled=${p.busy} @click=${p.onConfirm}>${p.busy ? '正在儲存…' : '確認儲存'}</button></div>`);
