<script>
  // Developer overlay, matching the Viewer's structure: Next Step is always
  // visible directly under the task summary, and only approach/direction
  // detail collapses behind the disclosure.
  export let developer = null;

  $: legacySteps = developer?.next_steps ?? [];
  $: nextAction = developer?.next_step ?? legacySteps[0] ?? "尚未指定下一步";
  $: followupSteps = developer?.next_step ? legacySteps : legacySteps.slice(1);
  $: hasDiscussion = Boolean(
    followupSteps.length
    || developer?.blockers?.length
    || developer?.decisions?.length
    || developer?.routes?.length
    || developer?.claim,
  );
</script>

{#if developer}
  <svelte:element this={hasDiscussion ? "details" : "section"} class="developer-details">
    <svelte:element this={hasDiscussion ? "summary" : "div"} class="developer-summary">
      <span class="developer-next-label">Next Step :</span>
      <span class="developer-next-action">{nextAction}</span>
      {#if hasDiscussion}
        <span class="developer-expand-hint">展開作法與方向</span>
      {/if}
    </svelte:element>

    {#if hasDiscussion}
      <div class="developer-body">
        <h4 class="developer-body-title">作法與方向</h4>

        {#if followupSteps.length}
          <section class="detail-section next-steps">
            <h4 class="detail-heading">後續動作</h4>
            <ul class="detail-list">
              {#each followupSteps as step}<li>{step}</li>{/each}
            </ul>
          </section>
        {/if}

        {#if developer.blockers?.length}
          <section class="detail-section blockers">
            <h4 class="detail-heading">Blockers</h4>
            <ul class="detail-list">
              {#each developer.blockers as blocker}<li>{blocker}</li>{/each}
            </ul>
          </section>
        {/if}

        {#if developer.decisions?.length}
          <section class="detail-section">
            <h4 class="detail-heading">Decisions</h4>
            <div class="decision-list">
              {#each developer.decisions as decision}
                <article class="decision-item">
                  <p>{decision.summary}</p>
                  {#if decision.reference}<code class="reference">{decision.reference}</code>{/if}
                </article>
              {/each}
            </div>
          </section>
        {/if}

        {#if developer.routes?.length}
          <section class="detail-section">
            <h4 class="detail-heading">Routes</h4>
            <div class="route-list">
              {#each developer.routes as route}
                <article class="route-item">
                  <div class="route-heading">
                    <strong>{route.title}</strong>
                    <span class={`route-state route-${route.state}`}>{route.state}</span>
                  </div>
                  {#if route.reason}<p>{route.reason}</p>{/if}
                </article>
              {/each}
            </div>
          </section>
        {/if}

        {#if developer.claim}
          <section class="detail-section claim-section">
            <h4 class="detail-heading">Claim</h4>
            <p>Agent: {developer.claim.agent}</p>
            {#if developer.claim.worktree}<p>Worktree: {developer.claim.worktree}</p>{/if}
            {#if developer.claim.source_paths?.length}
              <div class="path-list">
                {#each developer.claim.source_paths as path}<code class="reference">{path}</code>{/each}
              </div>
            {/if}
          </section>
        {/if}
      </div>
    {/if}
  </svelte:element>
{/if}
