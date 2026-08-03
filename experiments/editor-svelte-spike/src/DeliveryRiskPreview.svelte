<script>
  export let preview;
  export let heading = "交付日草稿預覽";

  const number = new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 1 });

  function deliveryLabel(value) {
    if (!value?.present) return "未指定";
    const date = new Date(value.value);
    if (Number.isNaN(date.getTime())) return value.value;
    return new Intl.DateTimeFormat("zh-TW", {
      dateStyle: "medium",
      timeStyle: "short",
      hour12: false,
    }).format(date);
  }

  function hours(minutes) {
    return minutes == null ? "—" : `${number.format(minutes / 60)} hr`;
  }

  function delta(minutes) {
    if (minutes == null) return "無法比較";
    const prefix = minutes > 0 ? "+" : "";
    return `${prefix}${number.format(minutes / 60)} hr`;
  }
</script>

<section class="spike-risk-preview" aria-labelledby="delivery-risk-preview-title">
  <div class="spike-risk-preview-heading">
    <div>
      <p class="spike-editor-kicker">尚未寫入</p>
      <h3 id="delivery-risk-preview-title">{heading}</h3>
    </div>
    <span class="spike-preview-badge">預覽</span>
  </div>

  {#if preview.deliveryChanged}
    <dl class="spike-delivery-diff">
      <div>
        <dt>原交付日</dt>
        <dd>{deliveryLabel(preview.before)}</dd>
      </div>
      <div>
        <dt>草稿交付日</dt>
        <dd>{deliveryLabel(preview.after)}</dd>
      </div>
    </dl>
  {:else if preview.capacityChanged}
    <p class="spike-capacity-preview-note">交付日未變更；以下比較只反映工作容量草稿。</p>
  {/if}

  <div class="spike-risk-comparison">
    <article>
      <span>目前分析</span>
      <strong>{preview.current.label}</strong>
      <small>剩餘容量 {hours(preview.current.remainingCapacityMinutes)}</small>
    </article>
    <span class="spike-risk-arrow" aria-hidden="true">→</span>
    <article class={`risk-${preview.next.urgency ?? "none"}`}>
      <span>草稿分析</span>
      <strong>{preview.next.label}</strong>
      <small>剩餘容量 {hours(preview.next.remainingCapacityMinutes)}</small>
    </article>
  </div>

  <dl class="spike-risk-deltas">
    <div><dt>容量變化</dt><dd>{delta(preview.capacityDelta)}</dd></div>
    <div><dt>餘裕／缺口變化</dt><dd>{delta(preview.balanceDelta)}</dd></div>
  </dl>
  {#if preview.reason}
    <p class="spike-preview-reason"><strong>修改原因：</strong>{preview.reason}</p>
  {/if}
</section>
