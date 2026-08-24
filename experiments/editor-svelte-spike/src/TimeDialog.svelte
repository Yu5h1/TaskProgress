<script>
  import { tick } from "svelte";
  import ManualEstimateEditor from "./ManualEstimateEditor.svelte";
  import TimeSettingsEditor from "./TimeSettingsEditor.svelte";
  import DeliveryRiskPreview from "./DeliveryRiskPreview.svelte";

  /*
   * The shared progress-report dialog: project detail (evaluation flow,
   * engineering estimate, work capacity tabs) and item detail (estimate
   * rationale plus technical detail), driven entirely by
   * `viewer/assets/time-dialog-control.js`. One dialog element serves both
   * subjects — only the content inside changes — matching the Viewer's
   * original single-dialog contract.
   *
   * `timeSettings` is the one project-level editing surface: the delivery
   * date, daily allocation, working weekdays and capacity exceptions. It
   * replaces the read-only flow/engineering/capacity tabs while a global
   * edit session is open, rather than nesting inside one of them — the
   * displayed and edited fields must stay in the same place, and delivery
   * date is not specific to the 工作容量 tab. `deliveryPreview` renders
   * alongside it so recalculating stays inside this same dialog instead of
   * surfacing a panel the reader can't see behind the open modal.
   */
  export let open = false;
  export let kind = null; // 'project' | 'item' | null
  export let kicker = "";
  export let title = "";
  export let project = null;
  export let item = null;
  export let onClose = () => {};
  export let onToggleDetails = () => {};
  export let onSetTab = (name) => {};
  export let editing = false;
  export let activeEstimate = null;
  export let onManualEstimate = null;
  export let timeSettings = null;
  export let deliveryPreview = null;

  let dialogEl;
  let tabRefs = [];
  let returnFocusEl = null;
  let closeNotified = false;

  // The dialog element itself is structurally conditional on `open` (see the
  // `{#if open}` below) rather than a permanently-mounted element toggled via
  // an imperative `showModal()`/`close()` call reacting to a prop change.
  //
  // That is deliberate, not a style choice. This component is mounted
  // imperatively (see `viewer-adapter.svelte.js`) with props coming from an
  // externally mutated `$state` object, and in that setup a `$:` block or an
  // action's `update(open)` parameter reading the `open` prop only
  // re-evaluates once after mount — later changes are silently missed, even
  // though the same prop correctly drives ordinary template bindings
  // elsewhere in this file (confirmed by comparing against a `data-open`
  // attribute, which kept updating correctly every time). Structural `{#if}`
  // toggling does not have that gap: Svelte's own block (dis)connection is
  // what fires the action's `mount`, so this always gets a fresh call.
  function openOnMount(node) {
    returnFocusEl = node.ownerDocument.activeElement;
    closeNotified = false;
    node.showModal();
  }

  function notifyClose() {
    if (closeNotified) return;
    closeNotified = true;
    const focusTarget = returnFocusEl;
    returnFocusEl = null;
    onClose();
    queueMicrotask(() => {
      if (focusTarget?.isConnected) focusTarget.focus();
    });
  }

  // The close button and the backdrop click call `onClose` directly rather
  // than relying solely on the native `close` event that `dialogEl.close()`
  // fires. Both still call `.close()` too, for the native visual dismissal,
  // but the direct call is what actually notifies the host — these are
  // user-initiated actions we already have a synchronous JS hook for, so
  // routing them exclusively through an event round-trip is unnecessary
  // indirection. `onclose={onClose}` below stays wired as a fallback for a
  // close this component didn't initiate itself (ESC, a `<form
  // method="dialog">` submit).
  function requestClose() {
    dialogEl?.close();
    notifyClose();
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) requestClose();
  }

  async function handleTabKeydown(event, index, tabs) {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + tabs.length) % tabs.length;
    onSetTab(tabs[nextIndex].name);
    await tick();
    tabRefs[nextIndex]?.focus();
  }
</script>

{#snippet evalNode(node, className)}
  <div class={`time-evaluation-node ${className}`.trim()}>
    <span>{node.label}</span>
    <strong>{node.value}</strong>
    <small>{node.note}</small>
  </div>
{/snippet}

{#snippet metricGrid(metrics)}
  <div class="time-metric-grid">
    {#each metrics as m}
      <div class="time-metric"><span>{m.label}</span><strong>{m.value}</strong></div>
    {/each}
  </div>
{/snippet}

{#snippet sourceList(rows)}
  <div class="time-source-list">
    {#each rows as row}
      <div class="time-source-row">
        <div><strong>{row.label}</strong><p>{row.note}</p></div>
        <span>{row.value}</span>
      </div>
    {/each}
  </div>
{/snippet}

{#snippet compositionSection(composition)}
  <section class="time-composition">
    <h3>估算組成</h3>
    {@render sourceList(composition)}
  </section>
{/snippet}

{#snippet flowPanel(flow, active)}
  <section
    class="time-tab-panel time-flow-panel"
    id="time-flow-panel"
    role="tabpanel"
    aria-labelledby="time-flow-tab"
    hidden={!active}
  >
    <p class="time-flow-intro">{flow.intro}</p>
    <div class="time-flow-lanes">
      <section class="time-flow-lane" aria-label="工程估算路徑">
        {@render evalNode(flow.engineeringLane.source, "")}
        <span class="time-flow-arrow">→</span>
        {@render evalNode(flow.engineeringLane.result, "time-evaluation-result")}
      </section>
      <section class="time-flow-lane" aria-label="工作容量路徑">
        {@render evalNode(flow.capacityLane.source, "")}
        <span class="time-flow-arrow">→</span>
        {@render evalNode(flow.capacityLane.result, "time-evaluation-result")}
      </section>
    </div>
    <div class="time-flow-merge">
      <span class="time-flow-arrow">↓</span>
      {@render evalNode(flow.merge, flow.merge.className)}
    </div>
    <div class="time-flow-lane time-flow-risk">
      {@render evalNode(flow.risk.trend, "")}
      <span class="time-flow-arrow">→</span>
      {@render evalNode(flow.risk.result, flow.risk.result.className)}
    </div>
    <p class="time-flow-note">{flow.note}</p>
  </section>
{/snippet}

{#snippet engineeringPanel(eng, active)}
  <section
    class="time-tab-panel"
    id="time-engineering-panel"
    role="tabpanel"
    aria-labelledby="time-engineering-tab"
    hidden={!active}
  >
    {@render metricGrid(eng.metrics)}
    <section class="time-explanation-card">
      <h3 class="time-formula-heading">
        <span class="time-risk-dot {eng.explanation.className}" aria-hidden="true"></span>
        風險評估公式
      </h3>
      <p>{eng.explanation.text}</p>
      <code class="time-formula">{eng.explanation.formula}</code>
    </section>
    <section class="time-explanation-card">
      <h3>執行校準</h3>
      <p>{eng.calibrationText}</p>
    </section>
    {@render compositionSection(eng.composition)}
  </section>
{/snippet}

{#snippet capacityPanel(cap, active)}
  <section
    class="time-tab-panel"
    id="time-capacity-panel"
    role="tabpanel"
    aria-labelledby="time-capacity-tab"
    hidden={!active}
  >
    <div class="time-capacity-toolbar">
      <p>工作容量由每日分配、工作日及休假例外共同產生。</p>
    </div>
    {@render metricGrid(cap.metrics)}
    <section class="time-explanation-card">
      <h3>每日容量公式</h3>
      <p>固定不可工作時間只在產生容量時間線時扣除一次；週末依工作日設定排除。</p>
      <code class="time-formula">{cap.formulaCode}</code>
    </section>
    <section class="time-composition">
      <h3>{cap.exceptionsHeading}</h3>
      <div class="time-source-list">
        {#if cap.exceptions}
          {#each cap.exceptions as row}
            <div class="time-source-row">
              <div><strong>{row.label}</strong><p>{row.note}</p></div>
              <span>{row.value}</span>
            </div>
          {/each}
        {:else}
          <p class="time-empty-note">目前沒有休假或其他容量例外。</p>
        {/if}
      </div>
    </section>
  </section>
{/snippet}

{#snippet estimateOnlyPanel(estimateOnly)}
  <section class="time-tab-panel time-estimate-only-panel">
    <p class="time-flow-intro">{estimateOnly.intro}</p>
    {@render metricGrid(estimateOnly.metrics)}
    <section class="time-explanation-card">
      <h3>執行校準</h3>
      <p>{estimateOnly.calibrationText}</p>
    </section>
    {@render compositionSection(estimateOnly.composition)}
  </section>
{/snippet}

{#if open}
<dialog
  class="theme-dialog time-dialog"
  id="time-dialog"
  aria-labelledby="time-dialog-title"
  bind:this={dialogEl}
  use:openOnMount
  onclose={notifyClose}
  onclick={handleBackdropClick}
>
  <div class="theme-dialog-heading">
    <div>
      <p class="section-kicker">{kicker}</p>
      <h2 id="time-dialog-title">{title}</h2>
    </div>
    <button class="theme-close" type="button" aria-label={`關閉${kicker}`} onclick={requestClose}>
      <span aria-hidden="true">×</span>
    </button>
  </div>
  <div class="time-dialog-content">
    {#if kind === "item" && item}
      <div>
        <div class="time-detail-toolbar">
          <span class={item.confidenceClass}>{item.confidenceLabel}</span>
          <button class="time-small-button" type="button" onclick={onToggleDetails}>{item.toggleLabel}</button>
        </div>
        {#if editing && onManualEstimate}
          {#key `${item.itemId}:${activeEstimate?.estimate_id ?? "analysis"}`}
            <ManualEstimateEditor item={{ ...item, title }} {activeEstimate} onApply={onManualEstimate} />
          {/key}
        {:else}
          <section class="time-estimate-readout">
            <div class="time-estimate-meta">
              <span>預估工時</span>
              {#each item.sourceBadges as badge (badge.kind)}
                <span class="time-source-badge source-{badge.kind}">{badge.label}</span>
              {/each}
            </div>
            <strong>{item.likelyHoursLabel}</strong>
          </section>
          <section class="time-explanation-card time-item-rationale">
            <h3>估算依據</h3>
            <p>{item.rationale}</p>
          </section>
        {/if}
        <section class="time-item-technical" hidden={!item.detailsExpanded}>
          {@render metricGrid(item.technical.metrics)}
          {#if item.technical.analysisMethod}
            <div class="time-source-row">
              <div>
                <strong>{item.technical.analysisMethod.name}</strong>
                <p>{item.technical.analysisMethod.note}</p>
              </div>
              <span>{item.technical.analysisMethod.version}</span>
            </div>
          {/if}
          {#if item.technical.formula}
            <section class="time-explanation-card">
              <h3>固定公式</h3>
              <code class="time-formula">{item.technical.formula}</code>
            </section>
          {/if}
          {#if item.technical.reference}
            <code class="time-reference">{item.technical.reference}</code>
          {/if}
        </section>
      </div>
    {:else if kind === "project" && project}
      <div>
        <div class="time-detail-toolbar">
          <span class="time-report-caption">{project.captionLabel}</span>
          <button
            class="time-small-button"
            type="button"
            aria-expanded={project.detailsExpanded}
            onclick={onToggleDetails}
          >{project.toggleLabel}</button>
        </div>
        <section class="time-report-overview">
          <div class="time-report-grid">
            {#each project.overview as field}
              <div class="time-report-field">
                <span>{field.label}</span>
                <strong>
                  {#if field.urgencyClassName}
                    <span class="time-risk-dot {field.urgencyClassName}" aria-hidden="true"></span>
                  {/if}
                  {field.value}
                </strong>
              </div>
            {/each}
          </div>
          <p class="time-report-updated">{project.updatedLabel}</p>
        </section>
        <section class="time-project-details" hidden={!project.detailsExpanded}>
          {#if editing && timeSettings}
            {#if timeSettings.hasConfig}
              <TimeSettingsEditor
                config={timeSettings.config}
                onApply={timeSettings.onApply}
                onPreview={timeSettings.onPreview}
                onPendingChange={timeSettings.onPendingChange}
              />
              {#if deliveryPreview}
                <DeliveryRiskPreview preview={deliveryPreview} />
              {/if}
            {:else}
              <section class="time-missing-config" aria-labelledby="time-missing-config-title">
                <h3 id="time-missing-config-title">尚未建立工作容量設定</h3>
                <p>建立後採單人、平日 09:00–17:00、睡眠 8h／生活 8h／工作 8h；只是草稿，仍由全域儲存決定是否寫入。</p>
                <button type="button" onclick={timeSettings.onInitializeConfig}>建立 8/8/8 預設設定</button>
              </section>
            {/if}
          {:else if project.hasDeadline}
            <div class="time-tab-list" role="tablist" aria-label="進度報告詳細資訊">
              {#each project.tabs as tab, index (tab.name)}
                <button
                  class="time-tab"
                  id={`time-${tab.name}-tab`}
                  type="button"
                  role="tab"
                  aria-controls={`time-${tab.name}-panel`}
                  aria-selected={project.activeTab === tab.name}
                  tabindex={project.activeTab === tab.name ? 0 : -1}
                  bind:this={tabRefs[index]}
                  onclick={() => onSetTab(tab.name)}
                  onkeydown={(event) => handleTabKeydown(event, index, project.tabs)}
                >{tab.label}</button>
              {/each}
            </div>
            {@render flowPanel(project.flow, project.activeTab === "flow")}
            {@render engineeringPanel(project.engineering, project.activeTab === "engineering")}
            {@render capacityPanel(project.capacity, project.activeTab === "capacity")}
          {:else}
            {@render estimateOnlyPanel(project.estimateOnly)}
          {/if}
        </section>
      </div>
    {/if}
  </div>
</dialog>
{/if}
