<script>
  import { onMount } from "svelte";

  import { createTimeIndex } from "../../../viewer/assets/time-model.js";
  import DeliveryEditor from "./DeliveryEditor.svelte";
  import TaskCard from "./TaskCard.svelte";
  import { loadSvelteEditorData } from "./data-loader.js";
  import { createEditHostClient } from "./edit-host-client.js";
  import { createSvelteEditorAdapter } from "./editor-adapter.js";
  import { fixtureReport } from "./fixture.js";
  import {
    activeEstimateIndex,
    createTimeInputDraft,
  } from "./time-input-draft.js";

  const priorityPolicy = globalThis.TaskProgressPriorityPolicy;
  const emptyTimeIndex = () => ({ tasks: new Map(), items: new Map() });

  let adapter = createSvelteEditorAdapter(fixtureReport, {
    fallbackPriority: priorityPolicy.fallbackValue,
  });
  let editing = false;
  let view = adapter.snapshot();
  let timeAnalysis = null;
  let timeIndex = emptyTimeIndex();
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
    } catch (error) {
      loadError = error instanceof Error ? error.message : "資料載入失敗。";
    } finally {
      loading = false;
    }
  }

  function apply(command) {
    view = adapter.dispatch(command);
    statusMessage = view.dirty ? "有尚未儲存的變更。" : "尚未修改。";
  }

  function addItem(taskId, title, priority) {
    const result = adapter.addPendingItem(taskId, title, priority);
    view = result.snapshot;
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
      editSession = null;
      await editClient?.close();
      statusMessage = "已放棄草稿並回到預覽模式。";
    } else {
      if (hostAvailable) {
        try {
          editSession = await editClient.start();
          timeDraft = createTimeInputDraft(editSession.inputs, view.report.scope_id);
          timeDraftView = timeDraft.snapshot();
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
  }

  function undo() {
    view = adapter.undo();
    statusMessage = "已復原上一個動作。";
  }

  function redo() {
    view = adapter.redo();
    statusMessage = "已重做下一個動作。";
  }

  function setDeliveryAt(value) {
    const result = timeDraft.setDeliveryAt(value);
    timeDraftView = result.snapshot;
    statusMessage = result.error || "交付日已套用到草稿。";
    return result;
  }

  function setManualEstimate(change) {
    const result = timeDraft.setManualEstimate(change);
    timeDraftView = result.snapshot;
    statusMessage = result.error || "人工工時與依據已套用到草稿。";
    return result;
  }

  async function save() {
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

<main class="spike-page" data-view-mode={editing ? "edit" : "preview"}>
  <header class="spike-heading">
    <div>
      <p class="spike-eyebrow">Framework parity spike</p>
      <h1>{view?.report.title ?? "Svelte × TaskProgress Editor Core"}</h1>
      <p>{dataLabel} · {timeState}</p>
    </div>
    <button
      class="spike-mode-toggle"
      type="button"
      aria-pressed={editing}
      disabled={loading || saving || Boolean(loadError)}
      onclick={toggleMode}
    >{editing ? "編輯模式" : "預覽模式"}</button>
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
      <DeliveryEditor
        config={timeDraftView.inputs.config}
        onChange={setDeliveryAt}
      />
    {:else if editing && hostAvailable}
      <p class="spike-time-config-missing" role="status">
        此 scope 尚無 time.config.json；交付日需先建立工作容量設定。人工工時仍可建立 estimates 草稿。
      </p>
    {/if}

    <section class="task-list" aria-label="Svelte 任務卡實驗">
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
        />
      {/each}
    </section>

    {#if editing}
      <footer class="spike-savebar" aria-busy={saving}>
        <p role="status" aria-live="polite">{statusMessage}</p>
        <div class="spike-save-actions">
          <button type="button" onclick={undo} disabled={!view.history.canUndo}>復原</button>
          <button type="button" onclick={redo} disabled={!view.history.canRedo}>重做</button>
          <button class="spike-save-button" type="button" onclick={save} disabled={!editorDirty || saving}>儲存</button>
        </div>
      </footer>
    {:else}
      <p class="spike-status" role="status" aria-live="polite">{statusMessage}</p>
    {/if}
  {/if}
</main>
