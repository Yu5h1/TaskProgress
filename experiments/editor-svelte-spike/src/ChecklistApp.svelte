<script>
  import { onMount } from "svelte";

  import { createChecklistEditorSession } from "../../../viewer/assets/checklist-editor.js";
  import SaveBar from "./SaveBar.svelte";
  import { createChecklistBridgeTransport } from "./checklist-bridge.js";

  let adapter = null;
  let view = null;
  let loading = true;
  let saving = false;
  let message = "正在載入 Checklist…";
  let tone = "clean";

  const marker = (status) => ({ pending: " ", passed: "✓", failed: "!" })[status] ?? "?";
  const statusLabel = (status) => ({ pending: "未執行", passed: "通過", failed: "失敗" })[status] ?? status;

  let bridge;
  onMount(async () => {
    try {
      bridge = createChecklistBridgeTransport();
      const document = await bridge.load();
      adapter = createChecklistEditorSession(document);
      view = adapter.snapshot();
      message = "已載入；只有未執行的人工 checks 可以修改。";
    } catch (error) {
      tone = "error";
      message = error instanceof Error ? error.message : "Checklist 載入失敗。";
    } finally {
      loading = false;
    }
  });

  function apply(command) {
    try {
      view = adapter.dispatch(command);
      tone = "clean";
      message = view.dirty ? "有尚未儲存的人工驗證結果。" : "尚未修改。";
    } catch (error) {
      tone = "error";
      message = error.message;
    }
  }

  function toggleResult(itemId, check, status) {
    apply({
      type: "set-result",
      workItemId: itemId,
      checkIndex: check.index,
      status: check.status === status ? "pending" : status,
    });
  }

  function undo() {
    view = adapter.undo();
    message = "已復原上一個變更。";
  }

  function redo() {
    view = adapter.redo();
    message = "已重做上一個變更。";
  }

  function discard() {
    view = adapter.discard();
    tone = "clean";
    message = "已放棄所有尚未儲存的變更。";
  }

  async function save() {
    const prepared = adapter.prepareSave();
    if (prepared.errors.length) {
      tone = "error";
      message = prepared.errors[0].message;
      return;
    }
    saving = true;
    tone = "saving";
    message = "正在驗證並寫入 Markdown…";
    try {
      const document = await bridge.save({
        revision: prepared.revision,
        results: prepared.results,
      });
      view = adapter.commit(document);
      tone = "clean";
      message = "已安全寫入 Checklist。";
    } catch (error) {
      tone = "error";
      message = error instanceof Error ? error.message : "Checklist 儲存失敗。";
    } finally {
      saving = false;
    }
  }
</script>

<main class="checklist-page">
  <header class="checklist-header">
    <div>
      <p class="section-kicker">Implementation Checklist</p>
      <h1>{view?.document.fileName ?? "TaskProgress Checklist"}</h1>
      {#if view}<p class="checklist-round">{view.document.roundIdentity}</p>{/if}
    </div>
  </header>

  {#if loading}
    <p class="checklist-notice" role="status">{message}</p>
  {:else if !view}
    <p class="checklist-notice checklist-error" role="alert">{message}</p>
  {:else}
    <section class="checklist-items" aria-label="Implementation checklist items">
      {#each view.document.items as item (item.id)}
        <article class={`checklist-item checklist-${item.status}`}>
          <header class="checklist-item-header">
            <span class="checklist-marker" aria-hidden="true">{marker(item.status)}</span>
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
                  <span class="checklist-marker" aria-hidden="true">{marker(check.status)}</span>
                  <strong>{check.title}</strong>
                  <span class="checklist-owner">{check.isManual ? "需人工驗證" : "Agent"}</span>
                  {#if check.isManual && check.persistedStatus === "pending"}
                    <div class="checklist-result-controls" aria-label={`${check.title} 驗證結果`}>
                      <button
                        type="button"
                        class:active={check.status === "passed"}
                        aria-pressed={check.status === "passed"}
                        onclick={() => toggleResult(item.id, check, "passed")}
                      >✓</button>
                      <button
                        type="button"
                        class="fail"
                        class:active={check.status === "failed"}
                        aria-pressed={check.status === "failed"}
                        onclick={() => toggleResult(item.id, check, "failed")}
                      >!</button>
                    </div>
                  {/if}
                </div>
                <dl>
                  <div><dt>Action</dt><dd>{check.action}</dd></div>
                  <div><dt>Expect</dt><dd>{check.expect}</dd></div>
                  {#if check.reason}<div><dt>Reason</dt><dd>{check.reason}</dd></div>{/if}
                  {#if check.observed && check.persistedStatus !== "pending"}
                    <div><dt>Observed</dt><dd>{check.observed}</dd></div>
                  {/if}
                  {#if check.resolved}<div><dt>Resolved</dt><dd>{check.resolved}</dd></div>{/if}
                </dl>
                {#if check.isManual && check.persistedStatus === "pending" && check.status === "failed"}
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
      data-state={tone}
      aria-live="polite"
      aria-busy={saving}
    >
      <SaveBar
        dirty={view.dirty}
        {saving}
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
