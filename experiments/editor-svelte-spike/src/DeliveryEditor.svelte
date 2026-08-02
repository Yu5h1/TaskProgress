<script>
  export let config;
  export let onChange;

  const initialDelivery = config?.project?.delivery_at ?? "";
  let localValue = initialDelivery.slice(0, 16);
  let error = "";

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
        const shown = Date.UTC(
          parts.year,
          parts.month - 1,
          parts.day,
          parts.hour,
          parts.minute,
        );
        return Math.round((shown - instant) / 60000);
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

  function applyDelivery() {
    if (!localValue) {
      const result = onChange("");
      error = result.error;
      return;
    }
    const existingOffset = initialDelivery.match(/(Z|[+-]\d{2}:\d{2})$/)?.[1];
    const result = onChange(
      `${localValue}:00${existingOffset ?? zoneOffset(localValue, config.timezone)}`,
    );
    error = result.error;
  }
</script>

<section class="spike-time-editor" aria-labelledby="delivery-editor-title">
  <div>
    <p class="spike-editor-kicker">時間設定</p>
    <h2 id="delivery-editor-title">交付日</h2>
    <p>使用 {config.timezone}；全域儲存時才會寫入並重新分析。</p>
  </div>
  <div class="spike-delivery-controls">
    <label>
      <span>排他截止時間</span>
      <input type="datetime-local" bind:value={localValue}>
    </label>
    <button type="button" onclick={applyDelivery}>套用草稿</button>
    <button
      class="spike-subtle-button"
      type="button"
      onclick={() => {
        localValue = "";
        applyDelivery();
      }}
    >設為未指定</button>
    {#if error}<p class="spike-field-error" role="alert">{error}</p>{/if}
  </div>
</section>
