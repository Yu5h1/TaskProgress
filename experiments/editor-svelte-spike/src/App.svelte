<script>
  import TaskCard from "./TaskCard.svelte";
  import { createSvelteEditorAdapter } from "./editor-adapter.js";
  import { fixtureReport } from "./fixture.js";

  const priorityPolicy = globalThis.TaskProgressPriorityPolicy;
  const adapter = createSvelteEditorAdapter(fixtureReport, {
    fallbackPriority: priorityPolicy.fallbackValue,
  });

  let editing = false;
  let view = adapter.snapshot();
  let statusMessage = "隔離實驗：不讀寫正式 report.json。";

  $: task = view.report.tasks[0];
  $: progress = view.derived.progress.tasks[task.id];

  function apply(command) {
    view = adapter.dispatch(command);
    statusMessage = view.dirty ? "有尚未儲存的變更。" : "尚未修改。";
  }

  function addItem(title, priority) {
    const result = adapter.addPendingItem(task.id, title, priority);
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
    const result = adapter.save(new Date().toISOString());
    view = result.snapshot;
    if (result.errors.length) {
      statusMessage = result.errors[0].message;
      return;
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
      <h1>Svelte × TaskProgress Editor Core</h1>
      <p>使用正式命令核心，驗證 TaskCard／ItemRow 元件化，不取代目前 Viewer。</p>
    </div>
    <button
      class="spike-mode-toggle"
      type="button"
      aria-pressed={editing}
      onclick={toggleMode}
    >{editing ? "編輯模式" : "預覽模式"}</button>
  </header>

  <section class="task-list" aria-label="Svelte 任務卡實驗">
    <TaskCard
      {task}
      {progress}
      {editing}
      policy={priorityPolicy}
      onCommand={apply}
      onAddItem={addItem}
    />
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
</main>
