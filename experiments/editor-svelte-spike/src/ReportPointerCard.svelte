<script>
  // A Report pointer card is read-only end to end: it takes only the pointer
  // task's own stable id/title and a projected view of its target report,
  // never `editing`, `onCommand` or any other write-capable prop. There is no
  // edit-mode branch here to leave read-only — the component simply has no
  // affordance that could mutate anything.
  export let task;
  // `status` is "loading" | "ready" | "error". `card` (ready) is the frozen
  // projection from `projectPointerCard`: { status, summary, progress, rows }.
  // `message` (error) is one sentence naming what went wrong reaching the
  // target. `openHref` navigates to the target scope the same way every other
  // scope link in this Viewer already does — a plain link, not a new
  // mechanism.
  export let state = { status: "loading" };

  const STATUS_LABELS = {
    planned: { label: "待處理", tone: "neutral" },
    in_progress: { label: "進行中", tone: "active" },
    blocked: { label: "受阻", tone: "danger" },
    done: { label: "已完成", tone: "success" },
    archive: { label: "已封存", tone: "muted" },
  };

  $: card = state.status === "ready" ? state.card : null;
  $: cardStatusEntry = card
    ? (STATUS_LABELS[card.status] ?? { label: card.status, tone: "muted" })
    : null;

  function rowStatusEntry(status) {
    return status
      ? (STATUS_LABELS[status] ?? { label: status, tone: "muted" })
      : { label: "指路", tone: "muted" };
  }
</script>

<article
  class={`task-card pointer-card ${cardStatusEntry ? `status-${cardStatusEntry.tone}` : ""}`}
  aria-labelledby={`task-${task.id}-title`}
>
  <header class="task-header">
    <div class="task-title-group">
      <div class="time-task-status-line">
        {#if cardStatusEntry}
          <span class={`status-badge status-${cardStatusEntry.tone}`}>{cardStatusEntry.label}</span>
        {/if}
        {#if state.openHref}
          <a class="pointer-card-badge" href={state.openHref}>開啟專案報告 →</a>
        {/if}
      </div>
      <div class="time-task-title-line">
        <h3 id={`task-${task.id}-title`}>
          {#if state.openHref}
            <a class="pointer-card-title-link" href={state.openHref}>{task.title}</a>
          {:else}
            {task.title}
          {/if}
        </h3>
      </div>
    </div>
  </header>

  {#if state.status === "loading"}
    <p class="pointer-card-status" role="status">讀取目標報告中…</p>
  {:else if state.status === "error"}
    <p class="pointer-card-status pointer-card-error" role="alert">{state.message}</p>
  {:else if card}
    <p class="task-summary">{card.summary}</p>
    <p
      class="pointer-card-progress"
      aria-label={`子任務完成 ${card.progress.completed}，共 ${card.progress.total}`}
    >{card.progress.completed} / {card.progress.total}（{card.progress.percentage}%）</p>
    <ul class="pointer-card-rows">
      {#each card.rows as row (row.id)}
        {@const rowEntry = rowStatusEntry(row.status)}
        <li class="pointer-card-row">
          <span class="pointer-card-row-title">{row.title}</span>
          <span class={`status-badge status-${rowEntry.tone}`}>{rowEntry.label}</span>
        </li>
      {/each}
    </ul>
  {/if}
</article>
