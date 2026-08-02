<script>
  import { onMount } from "svelte";

  import { createTimeIndex } from "../../../viewer/assets/time-model.js";
  import TaskCard from "./TaskCard.svelte";
  import { loadSvelteEditorData } from "./data-loader.js";
  import { createSvelteEditorAdapter } from "./editor-adapter.js";
  import { fixtureReport } from "./fixture.js";

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

  $: tasks = view?.report.tasks ?? [];
  $: effectiveTimeIndex = view?.derived.timeInvalidation.stale
    ? emptyTimeIndex()
    : timeIndex;
  $: timeState = view?.derived.timeInvalidation.stale
    ? "資料已變更，等待重新分析"
    : timeAnalysis
      ? "已載入時間分析"
      : "沒有時間分析";

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
      statusMessage = "已唯讀載入真實資料；編輯仍只存在記憶體。";
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

  function toggleMode() {
    if (editing) {
      view = adapter.discard();
      statusMessage = "已放棄草稿並回到預覽模式。";
    } else {
      statusMessage = "編輯模式：所有變更只存在記憶體草稿。";
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

  function save() {
    const invalidatesTime = view.derived.timeInvalidation.stale;
    const result = adapter.save(new Date().toISOString());
    view = result.snapshot;
    if (result.errors.length) {
      statusMessage = result.errors[0].message;
      return;
    }
    if (invalidatesTime) {
      timeAnalysis = null;
      timeIndex = emptyTimeIndex();
      diagnostics = [
        ...diagnostics,
        { level: "warning", message: "任務結構已變更；時間資料等待重新分析。" },
      ];
    }
    editing = false;
    statusMessage = "實驗草稿已提交到記憶體基準；沒有寫入檔案。";
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
      disabled={loading || Boolean(loadError)}
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
        />
      {/each}
    </section>

    {#if editing}
      <footer class="spike-savebar" aria-busy="false">
        <p role="status" aria-live="polite">{statusMessage}</p>
        <div class="spike-save-actions">
          <button type="button" onclick={undo} disabled={!view.history.canUndo}>復原</button>
          <button type="button" onclick={redo} disabled={!view.history.canRedo}>重做</button>
          <button class="spike-save-button" type="button" onclick={save} disabled={!view.dirty}>儲存</button>
        </div>
      </footer>
    {:else}
      <p class="spike-status" role="status" aria-live="polite">{statusMessage}</p>
    {/if}
  {/if}
</main>
