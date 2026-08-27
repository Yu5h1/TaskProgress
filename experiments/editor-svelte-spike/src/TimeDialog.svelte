<script>
  import { tick } from "svelte";
  import AssessmentMetricGrid from "./AssessmentMetricGrid.svelte";
  import AssessmentNote from "./AssessmentNote.svelte";
  import DialogShell from "./DialogShell.svelte";
  import ManualEstimateEditor from "./ManualEstimateEditor.svelte";
  import TimeSettingsEditor from "./TimeSettingsEditor.svelte";
  import DeliveryRiskPreview from "./DeliveryRiskPreview.svelte";

  /*
   * Time's dialog content: project detail (evaluation flow, engineering
   * estimate, work capacity tabs) and item detail (estimate rationale plus
   * technical detail), driven entirely by
   * `viewer/assets/time-dialog-control.js`. One dialog element serves both
   * subjects — only the content inside changes — matching the Viewer's
   * original single-dialog contract.
   *
   * The `<dialog>` element, its heading and every close path live in
   * `DialogShell.svelte`, which knows nothing about time. What stays here is
   * only what is about time: which subject is shown, the tabs, the estimate
   * editor and the capacity settings.
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

  let tabRefs = [];

  // Roving-tabindex arrow movement for the project tabs. It reads generic,
  // but Time is the only panel with tabs today, so it stays with the panel
  // that has them rather than being promoted into the shell on one case.
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
    <AssessmentMetricGrid metrics={eng.metrics} />
    <AssessmentNote heading="風險評估公式" tone={eng.explanation.className}>
      <p>{eng.explanation.text}</p>
      <code class="time-formula">{eng.explanation.formula}</code>
    </AssessmentNote>
    <AssessmentNote heading="執行校準"><p>{eng.calibrationText}</p></AssessmentNote>
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
    <AssessmentMetricGrid metrics={cap.metrics} />
    <AssessmentNote heading="每日容量公式">
      <p>固定不可工作時間只在產生容量時間線時扣除一次；週末依工作日設定排除。</p>
      <code class="time-formula">{cap.formulaCode}</code>
    </AssessmentNote>
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
    <AssessmentMetricGrid metrics={estimateOnly.metrics} />
    <AssessmentNote heading="執行校準"><p>{estimateOnly.calibrationText}</p></AssessmentNote>
    {@render compositionSection(estimateOnly.composition)}
  </section>
{/snippet}

<DialogShell
  {open}
  {kicker}
  {title}
  id="time-dialog"
  dialogClass="time-dialog"
  titleId="time-dialog-title"
  closeLabel={`關閉${kicker}`}
  {onClose}
>
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
                <span class="assessment-source-badge source-{badge.kind}">{badge.label}</span>
              {/each}
            </div>
            <strong>{item.likelyHoursLabel}</strong>
          </section>
          <div class="time-item-rationale">
            <AssessmentNote heading="估算依據"><p>{item.rationale}</p></AssessmentNote>
          </div>
        {/if}
        <section class="time-item-technical" hidden={!item.detailsExpanded}>
          <AssessmentMetricGrid metrics={item.technical.metrics} />
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
            <AssessmentNote heading="固定公式">
              <code class="time-formula">{item.technical.formula}</code>
            </AssessmentNote>
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
</DialogShell>
