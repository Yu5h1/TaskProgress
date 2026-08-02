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
    ...presentation,
  };

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
    const classes = [rowClass ?? style.itemRowClass];
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
    const card = el("article", `task-card ${cardStatusClass}`.trim());
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
    createItemRow,
    createPriorityBadge,
    createPrioritySelect,
    createStatusIndicator,
    createTaskCardShell,
    setTaskFraction,
  });
}

global.TaskProgressEditorSurfaceRuntime = Object.freeze({ createEditorSurface });
}(globalThis));
