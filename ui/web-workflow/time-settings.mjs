// TaskProgress's TimeSettingsEditor UI draft, ported from the pinned source.
// This is a product fixture, not a Web time/capacity module.
import { html, nothing, repeat, live } from './common.mjs';
import { zoneOffset } from './time-settings-offset.mjs';

export function createSettingsDraft(config) {
  const a = config.standard_allocation;
  return { initialDelivery:config.project?.delivery_at ?? '', delivery:(config.project?.delivery_at ?? '').slice(0,16), reason:'', sleep:String(a.sleep_minutes_per_day / 60), life:String(a.life_minutes_per_day / 60), other:String(a.other_unavailable_minutes_per_day / 60), weekdays:[...a.working_weekdays], nextKey:1 + (config.project?.capacity_exceptions?.length ?? 0),
    exceptions:(config.project?.capacity_exceptions ?? []).map((e,i) => ({ key:i+1, date:e.date, availableHours:String(e.available_minutes / 60), reason:e.reason ?? '', publicLabel:e.public_label ?? '' })), error:'' };
}
export function settingsCommand(s, config) {
  const existingOffset = s.initialDelivery.match(/(Z|[+-]\d{2}:\d{2})$/)?.[1];
  return { deliveryAt:s.delivery ? `${s.delivery}:00${existingOffset ?? zoneOffset(s.delivery, config.timezone)}` : '', deliveryReason:s.reason,
    capacity:{ sleepMinutes:Math.round(Number(s.sleep)*60), lifeMinutes:Math.round(Number(s.life)*60), otherUnavailableMinutes:Math.round(Number(s.other)*60), workingWeekdays:s.weekdays,
      capacityExceptions:s.exceptions.map(e => ({ date:e.date, availableMinutes:Math.round(Number(e.availableHours)*60), reason:e.reason, publicLabel:e.publicLabel })) } };
}
const weekdays = ['一','二','三','四','五','六','日'];
export function timeSettings(p, view) {
  const s = view.state.settings ??= createSettingsDraft(p.config);
  const pending = () => { s.error = ''; p.onPendingChange(true); view.draw(); };
  const update = (key, value) => { s[key] = value; pending(); };
  const numberInput = (key, label) => html`<label><span>${label}</span><input type="number" min="0" max="24" step="0.5" .value=${live(String(s[key] ?? ''))} @input=${e => update(key,e.currentTarget.value === '' ? undefined : e.currentTarget.valueAsNumber)}></label>`;
  const capacity = 24 - Number(s.sleep) - Number(s.life) - Number(s.other);
  return html`<section class="spike-time-editor" aria-labelledby="time-settings-title"><div class="spike-time-editor-heading"><p class="spike-editor-kicker">時間設定</p><h2 id="time-settings-title">工作容量與交付日</h2><p>所有欄位先保存在記憶體草稿；重新計算只預覽，全域儲存才寫入。</p><p class="spike-timezone">時區：${p.config.timezone}</p></div>
    <div class="spike-time-settings-fields"><section class="spike-delivery-settings" aria-labelledby="delivery-settings-title"><h3 id="delivery-settings-title">交付日</h3><div class="spike-delivery-controls"><label><span>排他截止時間</span><input type="datetime-local" .value=${live(s.delivery)} @input=${e => update('delivery',e.currentTarget.value)}></label><label class="spike-delivery-reason"><span>修改原因（不填敏感原文）</span><input maxlength="500" .value=${live(s.reason)} @input=${e => update('reason',e.currentTarget.value)} placeholder="例如：配合里程碑調整"></label><button class="spike-subtle-button" type="button" @click=${() => update('delivery','')}>設為未指定</button></div></section>
    <section class="spike-capacity-settings" aria-labelledby="capacity-settings-title"><div class="spike-setting-heading"><h3 id="capacity-settings-title">每日分配</h3><strong class=${capacity > 0 ? '' : 'invalid'}>工作 ${Number.isFinite(capacity) ? capacity : '—'} hr</strong></div><div class="spike-allocation-fields">${numberInput('sleep','睡眠（hr）')}${numberInput('life','生活（hr）')}${numberInput('other','其他不可工作（hr）')}</div><fieldset class="spike-weekdays"><legend>工作日</legend>${weekdays.map((label,i) => html`<label><input type="checkbox" .checked=${s.weekdays.includes(i+1)} @change=${e => { s.weekdays = e.currentTarget.checked ? [...new Set([...s.weekdays,i+1])].sort((a,b) => a-b) : s.weekdays.filter(d => d !== i+1); pending(); }}><span>週${label}</span></label>`)}</fieldset></section>
    <section class="spike-exception-settings" aria-labelledby="exception-settings-title"><div class="spike-setting-heading"><div><h3 id="exception-settings-title">休假與容量例外</h3><p>請假／例外說明可能公開；請勿填私人細節。既有私人理由會保留但不在此顯示或修改。</p></div><button class="spike-subtle-button" type="button" @click=${() => { s.exceptions.push({ key:s.nextKey++, date:'', availableHours:'0', reason:'', publicLabel:'' }); pending(); }}>＋ 新增例外</button></div>
    ${s.exceptions.length ? html`<div class="spike-exception-list">${repeat(s.exceptions,e => e.key,e => html`<div class="spike-exception-row"><label><span>日期</span><input type="date" .value=${live(e.date)} @input=${event => { e.date = event.currentTarget.value; pending(); }}></label><label><span>可工作（hr）</span><input type="number" min="0" max="24" step="0.5" .value=${live(String(e.availableHours ?? ''))} @input=${event => { e.availableHours = event.currentTarget.value; pending(); }}></label><label><span>請假／例外說明</span><input maxlength="500" .value=${live(e.publicLabel)} placeholder="例如：不可工作" @input=${event => { e.publicLabel = event.currentTarget.value; pending(); }}></label><button class="spike-delete-exception" type="button" @click=${() => { s.exceptions = s.exceptions.filter(entry => entry.key !== e.key); pending(); }}>刪除</button></div>`)}</div>` : html`<p class="spike-empty-setting">目前沒有休假或容量例外。</p>`}</section>
    <div class="spike-time-settings-actions"><button type="button" @click=${async () => { const result = p.onApply(settingsCommand(s,p.config)); s.error = result?.error ?? ''; view.draw(); if (s.error) return; p.onPendingChange(false); await p.onPreview(); }}>重新計算預覽</button>${s.error ? html`<p class="spike-field-error" role="alert">${s.error}</p>` : nothing}</div></div></section>`;
}
