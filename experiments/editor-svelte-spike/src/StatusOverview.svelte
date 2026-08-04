<script>
  // Status summary cards. The host supplies counts and the reader's status
  // order; labels and tones are presentation and belong here.
  export let counts = {};
  export let statusOrder = [];

  const cardMeta = {
    in_progress: { label: "目前進行", tone: "active" },
    done: { label: "已完成", tone: "success" },
    blocked: { label: "受阻", tone: "danger" },
    archive: { label: "已封存", tone: "muted" },
  };

  $: cards = statusOrder
    .filter((status) => cardMeta[status])
    .map((status) => ({ status, value: counts[status] ?? 0, ...cardMeta[status] }));
</script>

{#each cards as card (card.status)}
  <article class={`overview-card overview-${card.tone}`} data-status={card.status}>
    <span class="overview-value">{card.value}</span>
    <span class="overview-label">{card.label}</span>
  </article>
{/each}
