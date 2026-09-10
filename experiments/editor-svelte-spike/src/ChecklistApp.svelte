<script>
  import { onMount, tick } from "svelte";

  import {
    checklistFilterCategories,
    createChecklistEditorSession,
    filterChecklistBySelection,
    orderChecklistItems,
  } from "../../../viewer/assets/checklist-editor.js";
  import {
    createFilterSelection,
    isDefaultLit,
    toggleDefault,
    toggleTag,
  } from "../../../viewer/assets/filter-selection.js";
  import { DEFAULT_CAPSULE_ID } from "../../../viewer/assets/filter-selection.js";
  import { createPersistenceController } from "../../../viewer/assets/persistence-mode.js";
  import { createChecklistFilterOrder } from "../../../viewer/assets/checklist-filter-order.js";
  import { createThemeControl } from "../../../viewer/assets/theme-control.js";
  import DialogShell from "./DialogShell.svelte";
  import FilterStrip from "./FilterStrip.svelte";
  import MarkerBox from "./MarkerBox.svelte";
  import ProgressSummary from "./ProgressSummary.svelte";
  import SaveBar from "./SaveBar.svelte";
  import ThemeControl from "./ThemeControl.svelte";
  /*
   * The host supplies the transport. This screen never reaches for a global
   * WebView object, so the same screen can run over the desktop bridge, over a
   * local HTTP endpoint, or over a substitute in a test, and cannot tell which
   * it is on.
  */
  export let transport = null;
  export let onPersistenceChange = () => {};

  let persistence = null;
  let view = null;
  let loading = true;
  let failure = "";
  let message = "正在載入 Checklist…";

  let resetOpen = false;
  let resetBusy = false;
  let resetTargets = [];
  $: manualTargets = view?.document.items.flatMap(item => item.checks
    .filter(check => check.isManual)
    .map(check => ({ workItemId: item.id, checkIndex: check.index }))) ?? [];
  $: canReset = !!view && !view.dirty && !view.saving && !view.pending && !view.blocked
    && !resetBusy && manualTargets.length > 0;
  // Protect the confirmation and request from foreground-triggered reloads.
  $: onPersistenceChange(view ? { ...view, pending: view.pending || resetOpen || resetBusy } : view);

  function installDocument(document) {
    persistence = createPersistenceController({
      session: createChecklistEditorSession(document),
      save: transport.save,
      debounceCommand: command => command.type === "set-observed",
      onChange: next => { view = next; message = next.message; },
    });
    view = persistence.snapshot();
    message = view.message;
  }

  function openReset() {
    if (!canReset) return;
    resetTargets = manualTargets.map(target => ({ ...target }));
    resetOpen = true;
  }

  async function confirmReset() {
    if (!canReset || resetBusy) return;
    resetBusy = true;
    const cautious = view.cautious;
    message = "正在清空人工結果…";
    try {
      const document = await transport.reset({ targets: resetTargets });
      // Reset deliberately starts a new session: old results cannot be undone back in.
      installDocument(document);
      view = await persistence.setCautious(cautious);
      message = "人工結果已清空；Agent 結果保留。";
    } catch (error) {
      message = error instanceof Error ? error.message : "清空失敗，請重新載入確認結果。";
    } finally {
      resetBusy = false;
    }
  }

  const statusLabel = (status) => ({ pending: "待驗證", passed: "通過", failed: "失敗" })[status] ?? status;

  // Filtering is view state only: it never touches the summary, which counts
  // the whole document, and never touches a save.
  const STATUS_LABELS = { pending: "未執行", passed: "通過", failed: "失敗" };
  const FILTER_TAGS = ["pending", "passed", "failed"];

  let selection = createFilterSelection(FILTER_TAGS);
  const filterOrder = createChecklistFilterOrder({
    supportedIds: [DEFAULT_CAPSULE_ID, ...FILTER_TAGS],
  });
  let capsuleOrder = filterOrder.order;

  function selectTag(id) {
    selection = toggleTag(selection, id);
  }

  function selectDefault() {
    selection = toggleDefault(selection);
  }

  function reorderFilter(id, targetId, placeAfter) {
    capsuleOrder = [...filterOrder.move(id, targetId, placeAfter)];
  }

  // Capsule order drives the strip; the selected set drives visibility.
  function filterCategories(document, order) {
    const counts = new Map(checklistFilterCategories(document).map((e) => [e.id, e.count]));
    return order
      .filter((id) => FILTER_TAGS.includes(id))
      .map((id) => ({
        id,
        label: STATUS_LABELS[id] ?? id,
        count: counts.get(id) ?? 0,
        title: "拖曳可調整順序；排在「預設」左邊的標籤會分組到最前面",
      }));
  }

  async function showNextStep(event) {
    event.preventDefault();
    const next = view.summary.nextStep;
    if (!next) return;
    selection = createFilterSelection(FILTER_TAGS);
    await tick();
    const target = document.getElementById(`check-${next.workItemId}-${next.checkIndex}`);
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: "start" });
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
      if (!transport) throw new Error("Checklist 介面需要由 host 提供 transport。");
      const document = await transport.load();
      installDocument(document);
    } catch (error) {
      failure = error instanceof Error ? error.message : "Checklist 載入失敗。";
      message = failure;
    } finally {
      loading = false;
    }
  });

  function apply(command) {
    if (resetBusy) return;
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
    if (resetBusy) return;
    persistence.undo();
    view = persistence.snapshot();
  }

  function redo() {
    if (resetBusy) return;
    persistence.redo();
    view = persistence.snapshot();
  }

  function discard() {
    if (resetBusy) return;
    view = persistence.discard();
  }

  async function save() {
    if (resetBusy) return;
    await persistence.save();
    view = persistence.snapshot();
  }

  async function toggleCautious(next) {
    if (resetBusy) return;
    view = await persistence.setCautious(next);
  }
</script>

<main class="checklist-page">
  <header class="checklist-header">
    <div>
      <h1>{view?.document.fileName ?? "TaskProgress Checklist"}</h1>
      {#if view}<details class="checklist-round"><summary>本輪依據</summary><p>{view.document.roundIdentity}</p></details>{/if}
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
      bar={{ form: "segmented", cells: view.summary.cells }}
      caption={`${view.summary.checks.passed} / ${view.summary.checks.total} checks 通過`}
      note={view.summary.checks.failed > 0 ? `${view.summary.checks.failed} 個失敗` : ""}
    />

    {#if view.summary.nextStep}
      <a class="checklist-next-step"
        href={`#check-${view.summary.nextStep.workItemId}-${view.summary.nextStep.checkIndex}`}
        onclick={showNextStep}
        title={view.summary.nextStep.title}>
        <span>{view.summary.nextStep.isManual ? "需人工驗證" : "下一步 · Agent"}：</span>
        <strong>{view.summary.nextStep.title}</strong>
      </a>
    {/if}

    <div class="checklist-toolbar">
    <FilterStrip
      categories={filterCategories(view.document, capsuleOrder)}
      order={capsuleOrder}
      selected={selection.selected}
      defaultLit={isDefaultLit(selection)}
      className="status-filter-strip"
      ariaLabel="依 check 狀態篩選；可拖曳調整順序"
      reorderable={true}
      onSelect={selectTag}
      onSelectDefault={selectDefault}
      onReorder={reorderFilter}
    />

    {#if typeof transport?.reset === "function"}
      <div class="checklist-reset-actions">
        <button type="button" class="secondary-button" disabled={!canReset} onclick={openReset}>
          清空人工結果
        </button>
        {#if view.dirty || view.pending || view.saving}<span>請先儲存或捨棄變更，再清空。</span>{/if}
      </div>
    {/if}

    </div>

    <section class="checklist-items" aria-label="Implementation checklist items">
      {#each filterChecklistBySelection(orderChecklistItems(view.document, capsuleOrder), selection.selected).items as item (item.id)}
        <article class={`checklist-item checklist-${item.status}`}>
          <header class="checklist-item-header">
            <MarkerBox status={item.status} label={`工作項目 ${item.id}`} />
            <div>
              <h2>{item.id}. {item.title}</h2>
              <p>{item.outcome}</p>
              {#if item.dependsOn.length}
                <p class="checklist-chips">
                  <span class="checklist-chip">Depends on {item.dependsOn.join(", ")}</span>
                </p>
              {/if}
            </div>
            <span class="checklist-status">{statusLabel(item.status)}</span>
          </header>
          <div class="checklist-checks">
            {#each item.checks as check (check.index)}
              <section
                id={`check-${item.id}-${check.index}`}
                tabindex="-1"
                class={`checklist-check checklist-${check.status}${check.isManual ? " checklist-manual" : ""}`}
              >
                <div class="checklist-check-heading">
                  <MarkerBox
                    status={check.status}
                    interactive={check.isManual && !resetBusy}
                    label={check.title}
                    onCycle={() => cycleResult(item.id, check)}
                  />
                  <strong>{check.title}</strong>
                  <span class={`checklist-owner${check.isManual ? " checklist-owner-manual" : ""}`}
                  >{check.isManual ? "manual" : "Agent"}</span>
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
                      disabled={resetBusy}
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
      aria-busy={view.saving || resetBusy}
    >
      <SaveBar
        cautious={view.cautious}
        onToggleCautious={toggleCautious}
        dirty={view.dirty}
        saving={view.saving || resetBusy}
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


<DialogShell open={resetOpen} title="清空人工結果？" titleId="checklist-reset-title"
  kicker="Checklist" onClose={() => { resetOpen = false; }}>
  <p>將 {resetTargets.length} 個人工檢查重設為未執行，並清除 Observed／Resolved，包含篩選後隱藏的項目。Agent 結果不受影響。</p>
  <p>此操作無法復原；如需回復，請使用 Git 歷史。</p>
  <form method="dialog" class="theme-dialog-actions">
    <button type="submit" class="secondary-button">取消</button>
    <button type="submit" class="primary-button" disabled={resetBusy} onclick={confirmReset}>確認清空</button>
  </form>
</DialogShell>
