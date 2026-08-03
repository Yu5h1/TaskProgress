(function initializeTaskProgressEditorSurfaceRuntime(global) {
// Framework-neutral Editor Surface. It owns task-card structure, ordering, and
// accessibility text so the production Viewer and the file/loopback Demo cannot
// drift apart. Host-specific class strings and presentation choices stay in the
// `presentation` adapter until the parity matrix retires them; hosts keep their
// own persistence, editing commands, and time sidecar UI.
function createEditorSurface({
  document,
  priorityPolicy,
  statusMeta,
  presentation = {},
}) {
  if (!document || typeof document.createElement !== "function") {
    throw new TypeError("Editor Surface 需要可建立元素的 document。");
  }
  if (
    !priorityPolicy
    || typeof priorityPolicy.format !== "function"
    || typeof priorityPolicy.normalize !== "function"
    || !Array.isArray(priorityPolicy.levels)
  ) {
    throw new TypeError("Editor Surface 需要 priority policy。");
  }
  if (!statusMeta || typeof statusMeta !== "object" || Array.isArray(statusMeta)) {
    throw new TypeError("Editor Surface 需要 status metadata。");
  }

  const style = {
    headerClass: "task-header",
    titleGroupClass: "task-title-group",
    statusStyle: "badge",
    priorityOptionMarker: "",
    priorityOptionTone: false,
    cardStatusClass: (status, meta) => (meta ? `status-${meta.tone}` : ""),
    itemRowClass: "time-work-item",
    itemEditingClass: "editable-work-item",
    itemCopyClass: "",
    itemTitleClass: "time-work-title",
    itemInputClass: "inline-edit-input",
    itemDeleteClass: "inline-delete-button",
    itemPrioritySelectClass: "inline-priority-select",
    itemEditOrder: ["delete", "priority", "title", "content", "trailing"],
    itemPreviewWrap: false,
    addItemFormClass: "inline-add-form",
    addTaskFormClass: "task-add-form",
    addItemTriggerClass: "inline-add-trigger",
    addTaskTriggerClass: "task-add-trigger",
    addTitleInputClass: "inline-edit-input",
    addSummaryInputClass: "task-summary-input",
    addItemPriorityClass: "inline-priority-select",
    addTaskPriorityClass: "inline-priority-select",
    addCancelClass: "secondary-button inline-add-cancel",
    addSubmitClass: "secondary-button",
    addErrorClass: "inline-add-error",
    addActionsClass: "inline-add-actions",
    addContractClass: "task-add-contract",
    saveBarStatusClass: "edit-save-status",
    saveBarHistoryClass: "edit-history-actions",
    saveBarHistoryButtonClass: "secondary-button edit-history-button",
    saveBarButtonClass: "primary-button edit-save-button",
    ...presentation,
  };
  const validationResetFields = new WeakSet();

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function resolveStatusMeta(status) {
    return statusMeta[status] ?? null;
  }

  function dotToneClass(tone) {
    return `state-${tone === "neutral" ? "muted" : tone}`;
  }

  function createStatusIndicator(status) {
    const meta = resolveStatusMeta(status);
    if (!meta) return null;
    if (style.statusStyle === "dot") {
      const state = el("span", "time-task-state");
      const dot = el("span", `task-state-dot ${dotToneClass(meta.tone)}`);
      dot.setAttribute("aria-hidden", "true");
      state.append(dot, meta.label);
      return state;
    }
    return el("span", `status-badge status-${meta.tone}`, meta.label);
  }

  function createPriorityBadge(priority, className) {
    const normalized = priorityPolicy.normalize(priority, priorityPolicy.fallbackValue);
    const meta = priorityPolicy.metadata(normalized);
    if (!meta || (priorityPolicy.labelsValid && meta.hidden)) return null;
    const label = priorityPolicy.format(normalized);
    const badge = el("span", `${className} priority-badge priority-${meta.tone}`, label);
    badge.title = `${label}；同一狀態內依優先級排序`;
    badge.setAttribute("aria-label", `優先級：${label}`);
    return badge;
  }

  function applyPrioritySelectTone(select) {
    if (!style.priorityOptionTone) return;
    priorityPolicy.levels.forEach((level) => {
      select.classList.remove(`priority-${level.tone}`);
    });
    const meta = priorityPolicy.metadata(
      priorityPolicy.normalize(select.value, priorityPolicy.fallbackValue),
    );
    if (meta) select.classList.add(`priority-${meta.tone}`);
  }

  function createPrioritySelect(value, { className, ariaLabel, onChange } = {}) {
    const select = el("select", className ?? "inline-priority-select");
    if (ariaLabel) select.setAttribute("aria-label", ariaLabel);
    priorityPolicy.levels.forEach((level) => {
      const label = priorityPolicy.format(level.value);
      const marker = style.priorityOptionMarker && !(priorityPolicy.labelsValid && level.hidden)
        ? style.priorityOptionMarker
        : "";
      const option = el(
        "option",
        style.priorityOptionTone ? `priority-${level.tone}` : "",
        `${marker}${label}`,
      );
      option.value = String(level.value);
      select.append(option);
    });
    select.value = String(priorityPolicy.normalize(value, priorityPolicy.fallbackValue));
    applyPrioritySelectTone(select);
    select.addEventListener("change", () => {
      applyPrioritySelectTone(select);
      if (typeof onChange === "function") {
        onChange(priorityPolicy.normalize(select.value, priorityPolicy.fallbackValue));
      }
    });
    return select;
  }

  function appendNodes(parent, nodes) {
    (Array.isArray(nodes) ? nodes : [nodes])
      .filter(Boolean)
      .forEach((node) => parent.append(node));
  }

  function normalizeMode(value) {
    return value === "edit" ? "edit" : "preview";
  }

  // Shared global-mode state projection. Hosts still own permission checks,
  // draft creation/discard, and persistence; this controller keeps the toggle,
  // root mode marker, busy state, labels, and ARIA semantics in sync.
  function createModeController(control, {
    root = document.documentElement,
    initialMode = "preview",
    available = true,
    hideWhenUnavailable = false,
    unavailableTitle = "",
    onRequest,
    onError,
  } = {}) {
    if (!control || typeof control.addEventListener !== "function") {
      throw new TypeError("Editor Surface 需要模式切換按鈕。");
    }
    let mode = normalizeMode(initialMode);
    let modeAvailable = Boolean(available);
    let busy = false;

    function sync() {
      const editing = mode === "edit";
      const currentLabel = editing ? "編輯模式" : "預覽模式";
      const nextLabel = editing ? "預覽模式" : "編輯模式";
      control.textContent = currentLabel;
      control.setAttribute("aria-pressed", editing ? "true" : "false");
      control.setAttribute("aria-label", `目前為${currentLabel}；按下切換到${nextLabel}`);
      control.disabled = busy || !modeAvailable;
      control.hidden = hideWhenUnavailable && !modeAvailable;
      control.title = !modeAvailable ? unavailableTitle : "";
      if (root?.dataset) root.dataset.viewMode = mode;
    }

    function setMode(value) {
      mode = normalizeMode(value);
      sync();
      return mode;
    }

    function setAvailable(value) {
      modeAvailable = Boolean(value);
      if (!modeAvailable) mode = "preview";
      sync();
      return modeAvailable;
    }

    function setBusy(value) {
      busy = Boolean(value);
      sync();
      return busy;
    }

    async function requestMode(value) {
      const nextMode = normalizeMode(value);
      if (!modeAvailable || busy || nextMode === mode) return false;
      busy = true;
      sync();
      try {
        const result = typeof onRequest === "function"
          ? await onRequest(nextMode, mode)
          : true;
        if (result === false) return false;
        mode = normalizeMode(typeof result === "string" ? result : nextMode);
        return true;
      } catch (error) {
        if (typeof onError === "function") onError(error);
        return false;
      } finally {
        busy = false;
        sync();
      }
    }

    control.addEventListener("click", () => {
      void requestMode(mode === "edit" ? "preview" : "edit");
    });
    sync();

    return Object.freeze({
      get mode() { return mode; },
      get available() { return modeAvailable; },
      get busy() { return busy; },
      requestMode,
      setAvailable,
      setBusy,
      setMode,
      sync,
    });
  }

  function setFieldError(field, message = "") {
    if (!field || typeof field.setAttribute !== "function") {
      throw new TypeError("Field validation 需要表單欄位。");
    }
    const stableMessage = String(message ?? "");
    if (stableMessage && !validationResetFields.has(field)) {
      validationResetFields.add(field);
      field.addEventListener?.("input", () => clearFieldError(field));
    }
    field.setCustomValidity?.(stableMessage);
    field.setAttribute("aria-invalid", stableMessage ? "true" : "false");
    return stableMessage;
  }

  function clearFieldError(field) {
    return setFieldError(field, "");
  }

  function reportFieldError(field, message) {
    const stableMessage = setFieldError(field, message);
    if (!stableMessage) return false;
    field.focus?.();
    field.reportValidity?.();
    return true;
  }

  // Shared global save projection. Hosts own dirty derivation and persistence;
  // the Surface owns clean/dirty/saving/error labels, disabled state, ARIA,
  // and the stable status/button structure.
  function createSaveBar(host, {
    statusId = "",
    buttonId = "",
    buttonLabel = "儲存",
    cleanLabel = "尚未修改",
    dirtyLabel = "有尚未儲存的修改",
    savingLabel = "正在儲存…",
    undoLabel = "復原",
    redoLabel = "重做",
    onUndo,
    onRedo,
    onSave,
  } = {}) {
    if (!host || typeof host.replaceChildren !== "function") {
      throw new TypeError("SaveBar 需要可替換內容的 host。");
    }
    const status = el("span", style.saveBarStatusClass, cleanLabel);
    if (statusId) status.id = statusId;
    status.setAttribute("role", "status");
    const history = el("span", style.saveBarHistoryClass);
    const undoButton = el("button", style.saveBarHistoryButtonClass, undoLabel);
    undoButton.type = "button";
    undoButton.setAttribute("aria-label", `${undoLabel}上一個修改`);
    const redoButton = el("button", style.saveBarHistoryButtonClass, redoLabel);
    redoButton.type = "button";
    redoButton.setAttribute("aria-label", `${redoLabel}下一個修改`);
    history.append(undoButton, redoButton);
    const button = el("button", style.saveBarButtonClass, buttonLabel);
    button.type = "button";
    if (buttonId) button.id = buttonId;
    host.setAttribute("aria-live", "polite");
    host.replaceChildren(status, history, button);

    let state = Object.freeze({
      editing: false,
      dirty: false,
      saving: false,
      canUndo: false,
      canRedo: false,
      tone: "clean",
      message: cleanLabel,
    });

    function sync(next = {}) {
      const editing = next.editing ?? state.editing;
      const dirty = next.dirty ?? state.dirty;
      const saving = next.saving ?? state.saving;
      const canUndo = next.canUndo ?? state.canUndo;
      const canRedo = next.canRedo ?? state.canRedo;
      const tone = next.tone ?? (
        saving ? "saving" : (dirty ? "dirty" : "clean")
      );
      const message = next.message ?? (
        saving ? savingLabel : (dirty ? dirtyLabel : cleanLabel)
      );
      state = Object.freeze({
        editing: Boolean(editing),
        dirty: Boolean(dirty),
        saving: Boolean(saving),
        canUndo: Boolean(canUndo),
        canRedo: Boolean(canRedo),
        tone: String(tone),
        message: String(message),
      });
      host.hidden = !state.editing;
      host.dataset.state = state.tone;
      host.setAttribute("aria-busy", state.saving ? "true" : "false");
      status.textContent = state.message;
      button.textContent = state.saving ? savingLabel : buttonLabel;
      button.disabled = !state.dirty || state.saving;
      undoButton.disabled = !state.canUndo || state.saving;
      redoButton.disabled = !state.canRedo || state.saving;
      return state;
    }

    function showError(message) {
      return sync({
        editing: true,
        saving: false,
        tone: "error",
        message: String(message ?? "儲存失敗。"),
      });
    }

    button.addEventListener("click", () => {
      if (!state.editing || !state.dirty || state.saving) return;
      if (typeof onSave === "function") onSave(state);
    });
    undoButton.addEventListener("click", () => {
      if (!state.editing || !state.canUndo || state.saving) return;
      if (typeof onUndo === "function") onUndo(state);
    });
    redoButton.addEventListener("click", () => {
      if (!state.editing || !state.canRedo || state.saving) return;
      if (typeof onRedo === "function") onRedo(state);
    });
    sync();

    return Object.freeze({
      host,
      status,
      history,
      undoButton,
      redoButton,
      button,
      get state() { return state; },
      clearError: () => sync({ tone: state.dirty ? "dirty" : "clean" }),
      setState: sync,
      showError,
    });
  }

  function bindHistoryShortcuts(target, {
    isActive = () => true,
    onUndo,
    onRedo,
  } = {}) {
    if (!target || typeof target.addEventListener !== "function") {
      throw new TypeError("History shortcuts 需要事件 target。");
    }
    const handleKeydown = (event) => {
      if (!isActive() || event.altKey || !(event.ctrlKey || event.metaKey)) return;
      const key = String(event.key ?? "").toLowerCase();
      const redo = (key === "z" && event.shiftKey) || key === "y";
      const undo = key === "z" && !event.shiftKey;
      if (!undo && !redo) return;
      const handled = redo
        ? (typeof onRedo === "function" && onRedo())
        : (typeof onUndo === "function" && onUndo());
      if (handled !== false) event.preventDefault();
    };
    target.addEventListener("keydown", handleKeydown);
    return Object.freeze({
      dispose() {
        target.removeEventListener?.("keydown", handleKeydown);
      },
    });
  }

  // Shared add-control structure. Hosts own validation, stable IDs, Editor Core
  // commands, and the expanded state; the Surface owns field order, labels,
  // keyboard cancellation, error projection, and presentation hooks.
  function createAddControl(host, {
    kind = "item",
    expanded = false,
    triggerAriaLabel = kind === "task" ? "新增最外層任務卡" : "新增待處理子任務",
    titlePlaceholder = kind === "task" ? "任務名稱" : "輸入任務描述",
    titleAriaLabel = kind === "task" ? "新任務名稱" : "新增子任務描述",
    titleMaxLength = kind === "task" ? 160 : 300,
    summaryPlaceholder = "任務描述（必填）",
    summaryAriaLabel = "新任務描述",
    summaryMaxLength = 1000,
    priorityAriaLabel = kind === "task" ? "新任務優先級" : "新子任務優先級",
    defaultPriority = priorityPolicy.creationDefaultValue,
    contractText = "",
    submitLabel = kind === "task" ? "新增任務" : "新增",
    cancelLabel = "取消",
    onOpen,
    onCancel,
    onSubmit,
  } = {}) {
    if (!host || typeof host.replaceChildren !== "function") {
      throw new TypeError("AddControl 需要可替換內容的 host。");
    }
    const taskControl = kind === "task";

    if (!expanded) {
      const trigger = el(
        "button",
        taskControl ? style.addTaskTriggerClass : style.addItemTriggerClass,
        "+",
      );
      trigger.type = "button";
      trigger.setAttribute("aria-label", triggerAriaLabel);
      trigger.addEventListener("click", () => {
        if (typeof onOpen === "function") onOpen();
      });
      host.replaceChildren(trigger);
      return Object.freeze({
        host,
        trigger,
        form: null,
        titleInput: null,
        summaryInput: null,
        prioritySelect: null,
        contract: null,
        error: null,
        cancelButton: null,
        submitButton: null,
        showError: () => {},
        clearError: () => {},
      });
    }

    const form = el("form", taskControl ? style.addTaskFormClass : style.addItemFormClass);
    const titleInput = el("input", style.addTitleInputClass);
    titleInput.type = "text";
    titleInput.maxLength = titleMaxLength;
    titleInput.placeholder = titlePlaceholder;
    titleInput.setAttribute("aria-label", titleAriaLabel);

    let summaryInput = null;
    if (taskControl) {
      summaryInput = el("textarea", style.addSummaryInputClass);
      summaryInput.rows = 2;
      summaryInput.maxLength = summaryMaxLength;
      summaryInput.placeholder = summaryPlaceholder;
      summaryInput.setAttribute("aria-label", summaryAriaLabel);
    }

    const prioritySelect = createPrioritySelect(defaultPriority, {
      className: taskControl ? style.addTaskPriorityClass : style.addItemPriorityClass,
      ariaLabel: priorityAriaLabel,
    });
    const contract = taskControl && contractText
      ? el("span", style.addContractClass, contractText)
      : null;
    const error = el("span", style.addErrorClass);
    error.hidden = true;
    error.setAttribute("role", "alert");
    const cancelButton = el("button", style.addCancelClass, cancelLabel);
    cancelButton.type = "button";
    const submitButton = el("button", style.addSubmitClass, submitLabel);
    submitButton.type = "submit";
    const actions = taskControl ? el("div", style.addActionsClass) : null;
    if (actions) actions.append(cancelButton, submitButton);

    const fields = taskControl
      ? [titleInput, summaryInput, prioritySelect, contract, error, actions]
      : [titleInput, prioritySelect, cancelButton, submitButton, error];
    appendNodes(form, fields);
    host.replaceChildren(form);

    function clearError() {
      error.textContent = "";
      error.hidden = true;
    }

    function showError(message) {
      error.textContent = String(message ?? "");
      error.hidden = !error.textContent;
    }

    const api = Object.freeze({
      host,
      trigger: null,
      form,
      titleInput,
      summaryInput,
      prioritySelect,
      contract,
      error,
      cancelButton,
      submitButton,
      showError,
      clearError,
    });
    cancelButton.addEventListener("click", () => {
      if (typeof onCancel === "function") onCancel(api);
    });
    form.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      if (typeof onCancel === "function") onCancel(api);
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearError();
      if (typeof onSubmit === "function") {
        onSubmit({
          title: titleInput.value,
          summary: summaryInput?.value ?? "",
          priority: priorityPolicy.normalize(
            prioritySelect.value,
            priorityPolicy.creationDefaultValue,
          ),
        }, api);
      }
    });
    global.queueMicrotask?.(() => titleInput.focus?.());
    return api;
  }

  // One child-item row shared by both hosts. The Surface owns field ordering,
  // controls, and accessibility; hosts inject time/status extensions and map
  // callbacks to their own Editor Core session.
  function createItemRow(item, {
    editing = false,
    showPriority = true,
    rowClass,
    titleClass,
    contentNodes = [],
    trailingNodes = [],
    inputDataset = {},
    titleAriaLabel = "子任務描述",
    priorityAriaLabel,
    deleteAriaLabel,
    onTitleInput,
    onTitleCommit,
    onDelete,
    onPriorityChange,
  } = {}) {
    const stableItem = item !== null && typeof item === "object" && !Array.isArray(item);
    const itemTitle = stableItem ? String(item.title ?? "") : String(item ?? "");
    const isEditing = editing && stableItem;
    const classes = ["editor-item-row", rowClass ?? style.itemRowClass];
    if (isEditing && style.itemEditingClass) classes.push(style.itemEditingClass);
    const row = el("li", classes.filter(Boolean).join(" "));
    if (stableItem && item.id !== undefined) row.dataset.itemId = String(item.id);

    if (!isEditing) {
      const priorityBadge = showPriority && stableItem
        ? createPriorityBadge(item.priority, "item-priority-badge")
        : null;
      const title = el("span", titleClass ?? style.itemTitleClass, itemTitle);
      let copy = null;
      if (style.itemPreviewWrap) {
        copy = el("div", style.itemCopyClass);
        appendNodes(copy, [priorityBadge, title, ...contentNodes]);
        row.append(copy);
      } else {
        appendNodes(row, [priorityBadge, title, ...contentNodes]);
      }
      appendNodes(row, trailingNodes);
      return {
        row,
        copy,
        priorityBadge,
        title,
        input: null,
        deleteButton: null,
        prioritySelect: null,
      };
    }

    const input = el("input", style.itemInputClass);
    input.type = "text";
    input.maxLength = 300;
    input.value = itemTitle;
    input.setAttribute("aria-label", titleAriaLabel);
    Object.entries(inputDataset).forEach(([key, value]) => {
      if (value !== undefined && value !== null) input.dataset[key] = String(value);
    });
    input.addEventListener("input", () => {
      input.setCustomValidity?.("");
      if (typeof onTitleInput === "function") onTitleInput(input.value, input);
    });
    input.addEventListener("change", () => {
      if (typeof onTitleCommit !== "function") return;
      const committedValue = onTitleCommit(input.value, input);
      if (typeof committedValue === "string") input.value = committedValue;
    });

    const deleteButton = el("button", style.itemDeleteClass, "刪除");
    deleteButton.type = "button";
    deleteButton.setAttribute("aria-label", deleteAriaLabel ?? `刪除 ${itemTitle}`);
    deleteButton.addEventListener("click", () => {
      if (typeof onDelete === "function") onDelete(item);
    });

    const prioritySelect = createPrioritySelect(item.priority, {
      className: style.itemPrioritySelectClass,
      ariaLabel: priorityAriaLabel ?? `${itemTitle} 優先級`,
      onChange: onPriorityChange,
    });
    const slots = {
      title: [input],
      delete: [deleteButton],
      priority: [prioritySelect],
      content: contentNodes,
      trailing: trailingNodes,
    };
    style.itemEditOrder.forEach((slot) => appendNodes(row, slots[slot] ?? []));

    return {
      row,
      copy: null,
      priorityBadge: null,
      title: null,
      input,
      deleteButton,
      prioritySelect,
    };
  }

  // Preview-mode skeleton shared by both hosts. Callers receive every insertion
  // point so editing controls, developer details, work columns, and time
  // capsules remain host responsibilities in this slice.
  function createTaskCardShell(task, { completed = 0, total = 0, showPriority = true } = {}) {
    const meta = resolveStatusMeta(task.status);
    const cardStatusClass = style.cardStatusClass(task.status, meta);
    const card = el("article", `task-card editor-task-card ${cardStatusClass}`.trim());
    card.dataset.taskId = task.id;
    card.dataset.status = task.status;
    card.dataset.priority = String(
      priorityPolicy.normalize(task.priority, priorityPolicy.fallbackValue),
    );

    const header = el("header", style.headerClass);
    const titleGroup = el("div", style.titleGroupClass);
    const statusLine = el("div", "time-task-status-line");
    const titleLine = el("div", "time-task-title-line");

    const statusIndicator = createStatusIndicator(task.status);
    if (statusIndicator) statusLine.append(statusIndicator);
    const priorityBadge = showPriority
      ? createPriorityBadge(task.priority, "task-priority-badge")
      : null;
    if (priorityBadge) statusLine.append(priorityBadge);

    const title = el("h3", "", task.title);
    const duration = el("span", "task-duration");
    duration.hidden = true;
    titleLine.append(title, duration);
    titleGroup.append(statusLine, titleLine);

    const headerMeta = el("div", "task-header-meta");
    const fraction = el("strong", "task-fraction", `${completed} / ${total}`);
    fraction.setAttribute("aria-label", `子項目完成 ${completed}，共 ${total}`);
    const taskId = el("code", "task-id", task.id);
    headerMeta.append(fraction, taskId);

    header.append(titleGroup, headerMeta);

    const summary = el("p", "task-summary", task.summary);
    card.append(header, summary);

    return {
      card,
      header,
      titleGroup,
      statusLine,
      statusIndicator,
      priorityBadge,
      titleLine,
      title,
      duration,
      headerMeta,
      fraction,
      taskId,
      summary,
    };
  }

  function setTaskFraction(fraction, completed, total) {
    fraction.textContent = `${completed} / ${total}`;
    fraction.setAttribute("aria-label", `子項目完成 ${completed}，共 ${total}`);
  }

  return Object.freeze({
    bindHistoryShortcuts,
    clearFieldError,
    createAddControl,
    createItemRow,
    createModeController,
    createPriorityBadge,
    createPrioritySelect,
    createStatusIndicator,
    createTaskCardShell,
    createSaveBar,
    reportFieldError,
    setFieldError,
    setTaskFraction,
  });
}

global.TaskProgressEditorSurfaceRuntime = Object.freeze({ createEditorSurface });
}(globalThis));
