<script>
  export let config;
  export let onApply;
  export let onPreview;
  export let onPendingChange = () => {};

  const weekdayOptions = [
    { value: 1, label: "一" },
    { value: 2, label: "二" },
    { value: 3, label: "三" },
    { value: 4, label: "四" },
    { value: 5, label: "五" },
    { value: 6, label: "六" },
    { value: 7, label: "日" },
  ];
  const allocation = config.standard_allocation;
  const initialDelivery = config?.project?.delivery_at ?? "";
  let deliveryValue = initialDelivery.slice(0, 16);
  let deliveryReason = "";
  let sleepHours = String(allocation.sleep_minutes_per_day / 60);
  let lifeHours = String(allocation.life_minutes_per_day / 60);
  let otherHours = String(allocation.other_unavailable_minutes_per_day / 60);
  let workingWeekdays = [...allocation.working_weekdays];
  let nextExceptionKey = 1;
  let capacityExceptions = (config.project?.capacity_exceptions ?? []).map((entry) => ({
    key: nextExceptionKey++,
    date: entry.date,
    availableHours: String(entry.available_minutes / 60),
    reason: entry.reason ?? "",
    publicLabel: entry.public_label ?? "",
  }));
  let error = "";

  $: derivedCapacity = 24 - Number(sleepHours) - Number(lifeHours) - Number(otherHours);

  function browserOffset() {
    const minutes = -new Date().getTimezoneOffset();
    const sign = minutes >= 0 ? "+" : "-";
    const absolute = Math.abs(minutes);
    return `${sign}${String(Math.floor(absolute / 60)).padStart(2, "0")}:${String(absolute % 60).padStart(2, "0")}`;
  }

  function zoneOffset(local, timeZone) {
    try {
      const [datePart, timePart] = local.split("T");
      const [year, month, day] = datePart.split("-").map(Number);
      const [hour, minute] = timePart.split(":").map(Number);
      const intended = Date.UTC(year, month - 1, day, hour, minute);
      const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      });
      const offsetAt = (instant) => {
        const parts = Object.fromEntries(
          formatter.formatToParts(new Date(instant))
            .filter((part) => part.type !== "literal")
            .map((part) => [part.type, Number(part.value)]),
        );
        return Math.round((Date.UTC(
          parts.year,
          parts.month - 1,
          parts.day,
          parts.hour,
          parts.minute,
        ) - instant) / 60000);
      };
      let offset = offsetAt(intended);
      offset = offsetAt(intended - offset * 60000);
      const sign = offset >= 0 ? "+" : "-";
      const absolute = Math.abs(offset);
      return `${sign}${String(Math.floor(absolute / 60)).padStart(2, "0")}:${String(absolute % 60).padStart(2, "0")}`;
    } catch {
      return browserOffset();
    }
  }

  function markPending() {
    error = "";
    onPendingChange(true);
  }

  function toggleWeekday(day, checked) {
    workingWeekdays = checked
      ? [...new Set([...workingWeekdays, day])].sort((left, right) => left - right)
      : workingWeekdays.filter((value) => value !== day);
    markPending();
  }

  function updateException(key, field, value) {
    capacityExceptions = capacityExceptions.map((entry) => (
      entry.key === key ? { ...entry, [field]: value } : entry
    ));
    markPending();
  }

  function addException() {
    capacityExceptions = [
      ...capacityExceptions,
      { key: nextExceptionKey++, date: "", availableHours: "0", reason: "", publicLabel: "" },
    ];
    markPending();
  }

  function removeException(key) {
    capacityExceptions = capacityExceptions.filter((entry) => entry.key !== key);
    markPending();
  }

  function timestampValue() {
    if (!deliveryValue) return "";
    const existingOffset = initialDelivery.match(/(Z|[+-]\d{2}:\d{2})$/)?.[1];
    return `${deliveryValue}:00${existingOffset ?? zoneOffset(deliveryValue, config.timezone)}`;
  }

  function applySettings() {
    const result = onApply({
      deliveryAt: timestampValue(),
      deliveryReason,
      capacity: {
        sleepMinutes: Math.round(Number(sleepHours) * 60),
        lifeMinutes: Math.round(Number(lifeHours) * 60),
        otherUnavailableMinutes: Math.round(Number(otherHours) * 60),
        workingWeekdays,
        capacityExceptions: capacityExceptions.map((entry) => ({
          date: entry.date,
          availableMinutes: Math.round(Number(entry.availableHours) * 60),
          reason: entry.reason,
          publicLabel: entry.publicLabel,
        })),
      },
    });
    error = result.error;
    return result;
  }

  async function recalculate() {
    const result = applySettings();
    if (result.error) return;
    onPendingChange(false);
    await onPreview();
  }
</script>

<section class="spike-time-editor" aria-labelledby="time-settings-title">
  <div class="spike-time-editor-heading">
    <p class="spike-editor-kicker">時間設定</p>
    <h2 id="time-settings-title">工作容量與交付日</h2>
    <p>所有欄位先保存在記憶體草稿；重新計算只預覽，全域儲存才寫入。</p>
    <p class="spike-timezone">時區：{config.timezone}</p>
  </div>

  <div class="spike-time-settings-fields">
    <section class="spike-capacity-settings" aria-labelledby="capacity-settings-title">
      <div class="spike-setting-heading">
        <h3 id="capacity-settings-title">每日分配</h3>
        <strong class:invalid={!(derivedCapacity > 0)}>
          工作 {Number.isFinite(derivedCapacity) ? derivedCapacity : "—"} hr
        </strong>
      </div>
      <div class="spike-allocation-fields">
        <label><span>睡眠（hr）</span><input type="number" min="0" max="24" step="0.5" bind:value={sleepHours} oninput={markPending}></label>
        <label><span>生活（hr）</span><input type="number" min="0" max="24" step="0.5" bind:value={lifeHours} oninput={markPending}></label>
        <label><span>其他不可工作（hr）</span><input type="number" min="0" max="24" step="0.5" bind:value={otherHours} oninput={markPending}></label>
      </div>
      <fieldset class="spike-weekdays">
        <legend>工作日</legend>
        {#each weekdayOptions as day (day.value)}
          <label>
            <input
              type="checkbox"
              checked={workingWeekdays.includes(day.value)}
              onchange={(event) => toggleWeekday(day.value, event.currentTarget.checked)}
            >
            <span>週{day.label}</span>
          </label>
        {/each}
      </fieldset>
    </section>

    <section class="spike-exception-settings" aria-labelledby="exception-settings-title">
      <div class="spike-setting-heading">
        <div>
          <h3 id="exception-settings-title">休假與容量例外</h3>
          <p>請假／例外說明可能公開；請勿填私人細節。既有私人理由會保留但不在此顯示或修改。</p>
        </div>
        <button class="spike-subtle-button" type="button" onclick={addException}>＋ 新增例外</button>
      </div>
      {#if capacityExceptions.length}
        <div class="spike-exception-list">
          {#each capacityExceptions as entry (entry.key)}
            <div class="spike-exception-row">
              <label><span>日期</span><input type="date" value={entry.date} oninput={(event) => updateException(entry.key, "date", event.currentTarget.value)}></label>
              <label><span>可工作（hr）</span><input type="number" min="0" max="24" step="0.5" value={entry.availableHours} oninput={(event) => updateException(entry.key, "availableHours", event.currentTarget.value)}></label>
              <label><span>請假／例外說明</span><input maxlength="500" value={entry.publicLabel} placeholder="例如：不可工作" oninput={(event) => updateException(entry.key, "publicLabel", event.currentTarget.value)}></label>
              <button class="spike-delete-exception" type="button" onclick={() => removeException(entry.key)}>刪除</button>
            </div>
          {/each}
        </div>
      {:else}
        <p class="spike-empty-setting">目前沒有休假或容量例外。</p>
      {/if}
    </section>

    <section class="spike-delivery-settings" aria-labelledby="delivery-settings-title">
      <h3 id="delivery-settings-title">交付日</h3>
      <div class="spike-delivery-controls">
        <label><span>排他截止時間</span><input type="datetime-local" bind:value={deliveryValue} oninput={markPending}></label>
        <label class="spike-delivery-reason"><span>修改原因（不填敏感原文）</span><input maxlength="500" bind:value={deliveryReason} oninput={markPending} placeholder="例如：配合里程碑調整"></label>
        <button class="spike-subtle-button" type="button" onclick={() => { deliveryValue = ""; markPending(); }}>設為未指定</button>
      </div>
    </section>

    <div class="spike-time-settings-actions">
      <button type="button" onclick={recalculate}>重新計算預覽</button>
      {#if error}<p class="spike-field-error" role="alert">{error}</p>{/if}
    </div>
  </div>
</section>
