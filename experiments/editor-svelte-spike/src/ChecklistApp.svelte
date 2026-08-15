<script>
  import { onMount } from "svelte";

  import {
    checklistFilterCategories,
    createChecklistEditorSession,
    filterChecklist,
  } from "../../../viewer/assets/checklist-editor.js";
  import { createPersistenceController } from "../../../viewer/assets/persistence-mode.js";
  import { createThemeControl } from "../../../viewer/assets/theme-control.js";
  import FilterStrip from "./FilterStrip.svelte";
  import MarkerBox from "./MarkerBox.svelte";
  import NextStepCard from "./NextStepCard.svelte";
  import ProgressSummary from "./ProgressSummary.svelte";
  import SaveBar from "./SaveBar.svelte";
  import ThemeControl from "./ThemeControl.svelte";
  import { createChecklistBridgeTransport } from "./checklist-bridge.js";

  let persistence = null;
  let view = null;
  let loading = true;
  let failure = "";
  let message = "正在載入 Checklist…";

  const statusLabel = (status) => ({ pending: "未執行", passed: "通過", failed: "失敗" })[status] ?? status;

  // Filtering is view state only: it never touches the summary, which counts
  // the whole document, and never touches a save.
  let filter = { status: null, owner: null };

  const STATUS_FILTER_LABELS = { pending: "未執行", passed: "通過", failed: "失敗" };
  const OWNER_FILTER_LABELS = { manual: "需人工驗證", agent: "Agent" };

  // Clicking the selected capsule clears that group, so a reader never has to
  // hunt for an "all" control.
  function toggleFilter(group, id) {
    filter = { ...filter, [group]: filter[group] === id ? null : id };
  }

  function categories(group, labels, source) {
    return source[group].map((entry) => ({
      id: entry.id,
      label: labels[entry.id] ?? entry.id,
      count: entry.count,
    }));
  }

  // This screen names its own counts; the shared summary only draws them. A
  // dozen-ish checks is exactly the case the segmented bar exists for.
  function summaryStats(summary) {
    const stats = [
      { key: "total", label: "工作項目", value: summary.items.total },
      { key: "passed", label: "已完成", value: summary.items.passed, tone: "passed" },
      { key: "pending", label: "待處理", value: summary.items.pending, tone: "pending" },
    ];
    if (summary.items.failed > 0) {
      stats.push({ key: "failed", label: "失敗", value: summary.items.failed, tone: "failed" });
    }
    return stats;
  }
  const errorStates = new Set(["incomplete", "conflict", "error", "mode_blocked"]);
  const toneOf = (state) => {
    if (state === "saving") return "saving";
    return errorStates.has(state) ? "error" : "clean";
  };

  // The shared theme adapter owns storage and the document root; this screen
  // only mirrors its values into the shared control, exactly like the Viewer.
  let themeControl = null;
  let theme = { mode: "system", custom: null, systemScheme: "light" };

  function readTheme() {
    theme = {
      mode: themeControl.mode,
      custom: themeControl.custom,
      systemScheme: themeControl.systemScheme,
    };
  }

  onMount(async () => {
    themeControl = createThemeControl();
    readTheme();
    try {
      const bridge = createChecklistBridgeTransport();
      const document = await bridge.load();
      persistence = createPersistenceController({
        session: createChecklistEditorSession(document),
        save: bridge.save,
        // Only free text waits; a marker change commits at once.
        debounceCommand: (command) => command.type === "set-observed",
        onChange: (next) => {
          view = next;
          message = next.message;
        },
      });
      view = persistence.snapshot();
      message = view.message;
    } catch (error) {
      failure = error instanceof Error ? error.message : "Checklist 載入失敗。";
      message = failure;
    } finally {
      loading = false;
    }
  });

  function apply(command) {
    try {
      persistence.dispatch(command);
      view = persistence.snapshot();
      message = view.message;
    } catch (error) {
      message = error.message;
    }
  }

  // One marker per manual check, cycling [ ] → [x] → [!] → [ ].
  function cycleResult(itemId, check) {
    apply({ type: "cycle-result", workItemId: itemId, checkIndex: check.index });
  }

  function undo() {
    persistence.undo();
    view = persistence.snapshot();
  }

  function redo() {
    persistence.redo();
    view = persistence.snapshot();
  }

  function discard() {
    view = persistence.discard();
  }

  async function save() {
    await persistence.save();
    view = persistence.snapshot();
  }

  async function toggleCautious(next) {
    view = await persistence.setCautious(next);
  }
</script>

<main class="checklist-page">
  <header class="checklist-header">
    <div>
      <p class="section-kicker">Implementation Checklist</p>
      <h1>{view?.document.fileName ?? "TaskProgress Checklist"}</h1>
      {#if view}<p class="checklist-round">{view.document.roundIdentity}</p>{/if}
    </div>
    {#if themeControl}
      <ThemeControl
        mode={theme.mode}
        custom={theme.custom}
        systemScheme={theme.systemScheme}
        onModeChange={(mode) => { themeControl.setMode(mode); readTheme(); }}
        onApplyCustom={(palette) => { themeControl.applyCustom(palette); readTheme(); }}
      />
    {/if}
  </header>

  {#if loading}
    <p class="checklist-notice" role="status">{message}</p>
  {:else if !view}
    <p class="checklist-notice checklist-error" role="alert">{failure}</p>
  {:else}
    <ProgressSummary
      stats={summaryStats(view.summary)}
      bar={{ form: "segmented", cells: view.summary.cells }}
      caption={`${view.summary.checks.passed} / ${view.summary.checks.total} checks 通過`}
      note={view.summary.checks.failed > 0 ? `${view.summary.checks.failed} 個失敗` : ""}
    />

    {#if view.summary.nextStep}
      <NextStepCard
        heading={view.summary.nextStep.isManual ? "下一步 · 需人工驗證" : "下一步 · Agent"}
        title={`${view.summary.nextStep.workItemId}. ${view.summary.nextStep.itemTitle} — ${view.summary.nextStep.title}`}
        action={view.summary.nextStep.action}
        expect={view.summary.nextStep.expect}
      />
    {/if}

    {#if view}
      {@const groups = checklistFilterCategories(view.document, filter)}
      <div class="checklist-filters">
        <FilterStrip
          categories={categories("status", STATUS_FILTER_LABELS, groups)}
          activeId={filter.status}
          className="status-filter-strip"
          ariaLabel="依 check 狀態篩選"
          onSelect={(id) => toggleFilter("status", id)}
        />
        <FilterStrip
          categories={categories("owner", OWNER_FILTER_LABELS, groups)}
          activeId={filter.owner}
          className="status-filter-strip"
          ariaLabel="依負責對象篩選"
          onSelect={(id) => toggleFilter("owner", id)}
        />
      </div>
    {/if}

    <section class="checklist-items" aria-label="Implementation checklist items">
      {#each filterChecklist(view.document, filter).items as item (item.id)}
        <article class={`checklist-item checklist-${item.status}`}>
          <header class="checklist-item-header">
            <MarkerBox status={item.status} label={`工作項目 ${item.id}`} />
            <div>
              <h2>{item.id}. {item.title}</h2>
              <p>{item.outcome}</p>
              {#if item.dependsOn.length}<small>Depends on: {item.dependsOn.join(", ")}</small>{/if}
            </div>
            <span class="checklist-status">{statusLabel(item.status)}</span>
          </header>
          <div class="checklist-checks">
            {#each item.checks as check (check.index)}
              <section class={`checklist-check checklist-${check.status}`}>
                <div class="checklist-check-heading">
                  <MarkerBox
                    status={check.status}
                    interactive={check.isManual}
                    label={check.title}
                    onCycle={() => cycleResult(item.id, check)}
                  />
                  <strong>{check.title}</strong>
                  <span class="checklist-owner">{check.isManual ? "需人工驗證" : "Agent"}</span>
                </div>
                <dl>
                  <div><dt>Action</dt><dd>{check.action}</dd></div>
                  <div><dt>Expect</dt><dd>{check.expect}</dd></div>
                  {#if check.reason}<div><dt>Reason</dt><dd>{check.reason}</dd></div>{/if}
                  {#if check.observed && !(check.isManual && check.status === "failed")}
                    <div><dt>Observed</dt><dd>{check.observed}</dd></div>
                  {/if}
                  {#if check.resolved}<div><dt>Resolved</dt><dd>{check.resolved}</dd></div>{/if}
                </dl>
                {#if check.isManual && check.status === "failed"}
                  <label class="checklist-observed">
                    <span>Observed</span>
                    <textarea
                      rows="3"
                      value={check.observed ?? ""}
                      oninput={(event) => apply({
                        type: "set-observed",
                        workItemId: item.id,
                        checkIndex: check.index,
                        value: event.currentTarget.value,
                      })}
                      placeholder="記錄實際看到的結果"
                    ></textarea>
                  </label>
                {/if}
              </section>
            {/each}
          </div>
        </article>
      {/each}
    </section>

    <footer
      class="edit-save-bar"
      data-state={toneOf(view.status)}
      aria-live="polite"
      aria-busy={view.saving}
    >
      <SaveBar
        cautious={view.cautious}
        onToggleCautious={toggleCautious}
        dirty={view.dirty}
        saving={view.saving}
        canUndo={view.history.canUndo}
        canRedo={view.history.canRedo}
        {message}
        onSave={save}
        onUndo={undo}
        onRedo={redo}
        onDiscard={discard}
      />
    </footer>
  {/if}
</main>
