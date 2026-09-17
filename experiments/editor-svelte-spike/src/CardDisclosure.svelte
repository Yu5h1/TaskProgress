<script>
  // Shared presentation only; each list owns expansion by stable card identity.
  export let expanded = true;
  export let contentId;
  export let label = "卡片";
  export let onToggle = () => {};
</script>

<div class="card-disclosure-heading" class:card-disclosure-collapsed={!expanded}>
  <button type="button" class="card-disclosure-toggle"
    aria-expanded={expanded} aria-controls={contentId}
    aria-label={`${expanded ? "收合" : "展開"} ${label}`}
    title={expanded ? "收合" : "展開"}
    onclick={() => onToggle(!expanded)}><span aria-hidden="true">{expanded ? "▼" : "▶"}</span></button>
  <slot name="header" />
</div>
<div id={contentId} class="card-disclosure-body" hidden={!expanded}>
  <slot />
</div>
