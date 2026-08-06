<script>
  import { onMount } from "svelte";

  import { createTimeIndex } from "../../../viewer/assets/time-model.js";
  import { createThemeControl } from "../../../viewer/assets/theme-control.js";
  import { createTimeReferenceController } from "../../../viewer/assets/time-dialog-control.js";
  import DeliveryRiskPreview from "./DeliveryRiskPreview.svelte";
  import DeliverySaveConfirmation from "./DeliverySaveConfirmation.svelte";
  import ModeToggle from "./ModeToggle.svelte";
  import SaveBar from "./SaveBar.svelte";
  import TaskCard from "./TaskCard.svelte";
  import ThemeControl from "./ThemeControl.svelte";
  import TimeDialog from "./TimeDialog.svelte";
  import TimeSettingsEditor from "./TimeSettingsEditor.svelte";
  import { loadSvelteEditorData } from "./data-loader.js";
  import { buildTimeSettingsRiskPreview } from "./delivery-risk-preview.js";
  import { createEditHostClient } from "./edit-host-client.js";
  import { createSvelteEditorAdapter } from "./editor-adapter.js";
  import { fixtureReport } from "./fixture.js";
  import {
    activeEstimateIndex,
    createTimeInputDraft,
  } from "./time-input-draft.js";

  export let requireHostCapability = false;
  export let surfaceKind = "spike";
  export let embedded = false;
  export let autoStartEditing = false;

  const priorityPolicy = globalThis.TaskProgressPriorityPolicy;
  const emptyTimeIndex = () => ({ tasks: new Map(), items: new Map() });

  // Theme state lives in an adapter so this component stays free of browser
  // storage; the shared theme model owns every rule about what a mode means.
  const themeControl = createThemeControl();
  let themeMode = themeControl.mode;
  let themeCustom = themeControl.custom;

  function readThemeControl() {
    themeMode = themeControl.mode;
    themeCustom = themeControl.custom;
  }

  let adapter = createSvelteEditorAdapter(fixtureReport, {
    fallbackPriority: priorityPolicy.fallbackValue,
  });
  let editing = false;
  let view = adapter.snapshot();
  let timeAnalysis = null;
  let timeIndex = emptyTimeIndex();
  // The item time capsule opens the same shared dialog the Viewer uses — the
  // capsule itself already came from the shared ItemRow; without this, this
  // surface was the one place it rendered as an inert span with only a
  // tooltip, which is exactly the kind of second (missing) implementation
  // the one-UI-source rule exists to close.
  let timeController = null;
  let timeSnapshot = { summary: { hidden: true }, dialog: { open: false } };

  function renderTimeReference() {
    if (!timeController) return;
    timeSnapshot = timeController.snapshot();
  }

  function openItemTime(itemId, title) {
    timeController?.showItemTime(itemId, title);
    renderTimeReference();
  }
  let diagnostics = [];
  let loading = false;
  let loadError = "";
  let dataLabel = "內建 fixture";
  let statusMessage = "隔離實驗：不讀寫正式 report.json。";
  let editClient = null;
  let editSession = null;
  let hostAvailable = false;
  let timeDraft = null;
  let timeDraftView = null;
  let saving = false;
  let previewing = false;
  let timeSettingsPending = false;
  let deliveryPreview = null;
  let confirmingDeliverySave = false;

  $: tasks = view?.report.tasks ?? [];
  $: effectiveTimeIndex = view?.derived.timeInvalidation.stale
    ? emptyTimeIndex()
    : timeIndex;
  $: timeState = view?.derived.timeInvalidation.stale
    ? "資料已變更，等待重新分析"
    : timeAnalysis
      ? "已載入時間分析"
      : "沒有時間分析";
  $: activeEstimates = activeEstimateIndex(timeDraftView?.inputs ?? null);
  $: editorDirty = Boolean(view?.dirty || timeDraftView?.dirty);
  $: if (timeController) {
    timeController.setReportStructureStale(Boolean(view?.derived.timeInvalidation.stale));
    renderTimeReference();
  }

  onMount(() => {
    void loadRequestedData();
  });

  async function loadRequestedData() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has("scope") && !params.has("report")) return;
    loading = true;
    loadError = "";
    try {
      const loaded = await loadSvelteEditorData({
        params,
        baseUrl: document.baseURI,
      });
      if (!loaded) return;
      adapter = createSvelteEditorAdapter(loaded.report, {
        fallbackPriority: priorityPolicy.fallbackValue,
      });
      view = adapter.snapshot();
      timeAnalysis = loaded.timeAnalysis;
      timeIndex = timeAnalysis ? createTimeIndex(timeAnalysis) : emptyTimeIndex();
      if (timeAnalysis) {
        const projectProgress = view.derived.progress.project;
        try {
          timeController = createTimeReferenceController({
            sourceAnalysis: timeAnalysis,
            report: loaded.report,
            location: window.location,
            workProgressRatio: projectProgress.total
              ? projectProgress.completed / projectProgress.total
              : 0,
            onDraftChange: (message) => { statusMessage = message; },
          });
        } catch {
          timeController = null;
        }
      } else {
        timeController = null;
      }
      renderTimeReference();
      diagnostics = loaded.diagnostics;
      dataLabel = loaded.request.scope
        ? `真實 scope：${loaded.request.scope}`
        : "明確 report URL";
      if (loaded.request.scope) {
        editClient = createEditHostClient({ scope: loaded.request.scope });
        hostAvailable = Boolean(await editClient.discover());
      }
      statusMessage = hostAvailable
        ? "已連接本機安全編輯服務。"
        : "已唯讀載入真實資料；此來源沒有本機寫入 capability。";
      if (autoStartEditing && hostAvailable && !editing) await toggleMode();
    } catch (error) {
      loadError = error instanceof Error ? error.message : "資料載入失敗。";
    } finally {
      loading = false;
    }
  }

  function invalidateDeliveryPreview() {
    deliveryPreview = null;
    confirmingDeliverySave = false;
  }

  function apply(command) {
    view = adapter.dispatch(command);
    invalidateDeliveryPreview();
    statusMessage = view.dirty ? "有尚未儲存的變更。" : "尚未修改。";
  }

  function addItem(taskId, title, priority) {
    const result = adapter.addPendingItem(taskId, title, priority);
    view = result.snapshot;
    if (!result.error) invalidateDeliveryPreview();
    statusMessage = result.error || "已加入草稿；尚未儲存。";
    return result;
  }

  async function toggleMode() {
    if (saving) return;
    if (editing) {
      view = adapter.discard();
      timeDraftView = timeDraft?.discard() ?? null;
      timeDraft = null;
      timeDraftView = null;
      timeSettingsPending = false;
      invalidateDeliveryPreview();
      editSession = null;
      await editClient?.close();
      statusMessage = "已放棄草稿並回到預覽模式。";
    } else {
      if (hostAvailable) {
        try {
          editSession = await editClient.start();
          timeDraft = createTimeInputDraft(editSession.inputs, view.report.scope_id, {
            configTemplate: editSession.input_defaults?.config ?? null,
          });
          timeDraftView = timeDraft.snapshot();
          timeSettingsPending = false;
          invalidateDeliveryPreview();
          statusMessage = "編輯模式：report 與時間輸入都在暫存草稿，儲存時才寫入。";
        } catch (error) {
          statusMessage = error instanceof Error ? error.message : "無法進入編輯模式。";
          return;
        }
      } else {
        statusMessage = "編輯模式：所有變更只存在記憶體草稿。";
      }
    }
    editing = !editing;
    timeController?.setEditing(editing);
    renderTimeReference();
    if (embedded && !editing) notifyViewer(false);
  }

  function notifyViewer(saved) {
    if (!embedded || window.parent === window) return;
    window.parent.postMessage(
      { type: "taskprogress:editor-close", saved },
      window.location.origin,
    );
  }

  function undo() {
    view = adapter.undo();
    invalidateDeliveryPreview();
    statusMessage = "已復原上一個動作。";
  }

  function redo() {
    view = adapter.redo();
    invalidateDeliveryPreview();
    statusMessage = "已重做下一個動作。";
  }

  function setTimeSettings(settings) {
    const result = timeDraft.setTimeSettings(settings);
    timeDraftView = result.snapshot;
    if (!result.error) invalidateDeliveryPreview();
    statusMessage = result.error || "時間設定已套用到草稿。";
    return result;
  }

  function initializeTimeConfig() {
    const result = timeDraft.initializeConfig();
    timeDraftView = result.snapshot;
    if (!result.error) invalidateDeliveryPreview();
    const timezone = result.snapshot.inputs.config?.timezone ?? "UTC";
    statusMessage = result.error
      || `已建立 ${timezone} 的 8/8/8 預設草稿；儲存前仍可放棄。`;
  }

  function setManualEstimate(change) {
    const result = timeDraft.setManualEstimate(change);
    timeDraftView = result.snapshot;
    if (!result.error) invalidateDeliveryPreview();
    statusMessage = result.error
      || `人工工時與依據已套用到草稿（${result.estimate.human_confirmed ? "已人工確認" : "尚未人工確認"}）。`;
    return result;
  }

  async function requestRiskPreview() {
    if (!hostAvailable || !editClient || !timeDraft) {
      statusMessage = "期限風險預覽需要本機安全編輯服務。";
      return null;
    }
    if (timeSettingsPending) {
      statusMessage = "時間設定仍有未套用內容；請先按重新計算預覽。";
      return null;
    }
    const settingsChange = timeDraft.timeSettingsChangePreview();
    if (!settingsChange) {
      statusMessage = "時間設定沒有變更，不需要重新計算。";
      return null;
    }
    const prepared = adapter.prepareSave(new Date().toISOString());
    if (prepared.errors.length) {
      statusMessage = prepared.errors[0].message;
      return null;
    }
    previewing = true;
    statusMessage = "正在隔離環境重新計算草稿風險…";
    try {
      const response = await editClient.preview({
        report: prepared.report,
        inputs: timeDraft.replacements(),
      });
      deliveryPreview = buildTimeSettingsRiskPreview(
        timeAnalysis,
        response.analysis,
        settingsChange,
      );
      statusMessage = settingsChange.after.present && !deliveryPreview.next.available
        ? "草稿無法建立期限分析，請調整交付日後重新計算。"
        : "時間設定草稿已重新計算；預覽沒有修改任何檔案。";
      return deliveryPreview;
    } catch (error) {
      deliveryPreview = null;
      statusMessage = error instanceof Error
        ? error.message
        : "草稿風險重新計算失敗；原始檔案未變更。";
      return null;
    } finally {
      previewing = false;
    }
  }

  async function requestSave() {
    if (timeSettingsPending) {
      statusMessage = "時間設定仍有未套用內容；請先按重新計算預覽。";
      return;
    }
    const deliveryChange = timeDraft?.deliveryChangePreview() ?? null;
    if (!deliveryChange) {
      await persistSave();
      return;
    }
    const preview = deliveryPreview ?? await requestRiskPreview();
    if (!preview) return;
    if (preview.after.present && !preview.next.available) {
      statusMessage = "交付日草稿尚無有效期限分析，不能進入儲存確認。";
      return;
    }
    confirmingDeliverySave = true;
  }

  async function persistSave() {
    const invalidatesTime = view.derived.timeInvalidation.stale || Boolean(timeDraftView?.dirty);
    const prepared = adapter.prepareSave(new Date().toISOString());
    if (prepared.errors.length) {
      statusMessage = prepared.errors[0].message;
      return;
    }
    saving = true;
    statusMessage = hostAvailable
      ? "正在驗證、儲存並重新分析…"
      : "正在提交記憶體草稿…";
    try {
      if (hostAvailable) {
        const saved = await editClient.save({
          report: prepared.report,
          inputs: timeDraft?.replacements() ?? {},
          changes: timeDraft?.changes() ?? [],
        });
        view = adapter.commit(saved.report);
        timeDraftView = timeDraft.commit(saved.inputs);
        editSession = null;
        await editClient.close();
        statusMessage = "已安全寫入 canonical files；重新開啟可載入最新分析。";
      } else {
        view = adapter.commit(prepared.report);
        statusMessage = "實驗草稿已提交到記憶體基準；沒有寫入檔案。";
      }
      if (invalidatesTime) {
        timeAnalysis = null;
        timeIndex = emptyTimeIndex();
        diagnostics = [
          ...diagnostics,
          { level: "warning", message: "資料已變更；畫面上的舊時間分析已隱藏。" },
        ];
      }
      editing = false;
      timeDraft = null;
      timeDraftView = null;
      timeSettingsPending = false;
      deliveryPreview = null;
      confirmingDeliverySave = false;
      notifyViewer(hostAvailable);
    } catch (error) {
      statusMessage = error instanceof Error
        ? error.message
        : "儲存失敗；原始檔案未變更。";
    } finally {
      saving = false;
    }
  }

  function handleKeyboard(event) {
    if (!editing || !(event.ctrlKey || event.metaKey)) return;
    if (event.key.toLowerCase() === "z" && event.shiftKey && view.history.canRedo) {
      event.preventDefault();
      redo();
      return;
    }
    if (event.key.toLowerCase() === "y" && view.history.canRedo) {
      event.preventDefault();
      redo();
      return;
    }
    if (event.key.toLowerCase() === "z" && view.history.canUndo) {
      event.preventDefault();
      undo();
    }
  }
</script>

<svelte:window onkeydown={handleKeyboard} />

<main class="spike-page editor-layout-shell" data-view-mode={editing ? "edit" : "preview"}>
  <header class="spike-heading">
    <div>
      <p class="spike-eyebrow">{surfaceKind === "viewer" ? "Local editor" : "Framework parity spike"}</p>
      <h1>{view?.report.title ?? "Svelte × TaskProgress Editor Core"}</h1>
      <p>{dataLabel} · {timeState}</p>
    </div>
    <div class="spike-header-actions">
      <ThemeControl
        mode={themeMode}
        custom={themeCustom}
        systemScheme={themeControl.systemScheme}
        onModeChange={(mode) => { themeControl.setMode(mode); readThemeControl(); }}
        onApplyCustom={(palette) => { themeControl.applyCustom(palette); readThemeControl(); }}
      />
    </div>
    <ModeToggle
      mode={editing ? "edit" : "preview"}
      available={!requireHostCapability || hostAvailable}
      hideWhenUnavailable={true}
      disabled={loading || saving || previewing || confirmingDeliverySave || Boolean(loadError)}
      onToggle={toggleMode}
    />
  </header>

  {#if loading}
    <p class="spike-loading" role="status">正在載入並驗證真實報告…</p>
  {:else if loadError}
    <section class="spike-load-error" role="alert">
      <h2>報告無法載入</h2>
      <p>{loadError}</p>
    </section>
  {:else}
    {#if diagnostics.length}
      <section class="spike-diagnostics" aria-label="資料診斷">
        {#each diagnostics as diagnostic}
          <p class={`diagnostic diagnostic-${diagnostic.level ?? "warning"}`}>
            {diagnostic.message}
          </p>
        {/each}
      </section>
    {/if}

    {#if editing && timeDraftView?.inputs.config}
      <TimeSettingsEditor
        config={timeDraftView.inputs.config}
        onApply={setTimeSettings}
        onPreview={requestRiskPreview}
        onPendingChange={(pending) => {
          timeSettingsPending = pending;
          if (pending) invalidateDeliveryPreview();
        }}
      />
      {#if deliveryPreview}
        <DeliveryRiskPreview preview={deliveryPreview} />
      {/if}
    {:else if editing && hostAvailable}
      <section class="spike-time-config-missing" aria-labelledby="missing-time-config-title">
        <div>
          <strong id="missing-time-config-title">尚未建立工作容量設定</strong>
          <p>建立後採單人、平日 09:00–17:00、睡眠 8h／生活 8h／工作 8h；只是草稿，仍由全域儲存決定是否寫入。</p>
        </div>
        <button type="button" onclick={initializeTimeConfig}>建立 8/8/8 預設設定</button>
      </section>
    {/if}

    <section class="task-list editor-task-list" aria-label="Svelte 任務卡實驗">
      {#each tasks as task (task.id)}
        <TaskCard
          {task}
          progress={view.derived.progress.tasks[task.id]}
          {editing}
          policy={priorityPolicy}
          onCommand={apply}
          onAddItem={(title, priority) => addItem(task.id, title, priority)}
          timeTask={effectiveTimeIndex.tasks.get(task.id) ?? null}
          timeItems={effectiveTimeIndex.items}
          {activeEstimates}
          onManualEstimate={timeDraft ? setManualEstimate : null}
          onTimeClick={timeController ? openItemTime : null}
        />
      {/each}
    </section>

    {#if editing}
      <footer
        class="edit-save-bar"
        data-state={saving ? "saving" : editorDirty ? "dirty" : "clean"}
        aria-live="polite"
        aria-busy={saving}
      >
        <SaveBar
          dirty={editorDirty}
          saving={saving || previewing}
          canUndo={view.history.canUndo}
          canRedo={view.history.canRedo}
          message={statusMessage}
          savingLabel={previewing ? "重新計算中…" : "正在儲存…"}
          onSave={requestSave}
          onUndo={undo}
          onRedo={redo}
        />
      </footer>
    {:else}
      <p class="spike-status" role="status" aria-live="polite">{statusMessage}</p>
    {/if}
  {/if}
</main>

<TimeDialog
  {...timeSnapshot.dialog}
  onClose={() => { timeController?.closeDialog(); renderTimeReference(); }}
  onToggleDetails={() => { timeController?.toggleDetails(); renderTimeReference(); }}
  onSetTab={(name) => { timeController?.setActiveTab(name); renderTimeReference(); }}
  onSubmitCapacity={(values) => { timeController?.submitCapacityForm(values); renderTimeReference(); }}
/>

{#if confirmingDeliverySave && deliveryPreview}
  <DeliverySaveConfirmation
    preview={deliveryPreview}
    busy={saving}
    onBack={() => {
      if (!saving) confirmingDeliverySave = false;
    }}
    onConfirm={persistSave}
  />
{/if}
