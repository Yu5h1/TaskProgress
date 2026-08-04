import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import "../viewer/assets/priority-policy.js";
import "../viewer/assets/editor-surface-runtime.js";

const priorityPolicy = globalThis.TaskProgressPriorityPolicy;
const surfaceRuntime = globalThis.TaskProgressEditorSurfaceRuntime;

// Minimal DOM stub: the Editor Surface is framework-neutral, so it must build
// task cards without a browser. Only the node API the surface actually uses is
// implemented, which keeps the shared contract explicit.
function createDocumentStub() {
  function createElement(tag) {
    const node = {
      tagName: tag,
      className: "",
      children: [],
      attributes: {},
      dataset: {},
      listeners: {},
      hidden: false,
      title: "",
      value: "",
      _text: null,
      parent: null,
      get textContent() {
        if (this._text !== null) return this._text;
        return this.children
          .map((child) => (typeof child === "string" ? child : child.textContent))
          .join("");
      },
      set textContent(value) {
        this.children = [];
        this._text = String(value);
      },
      get classList() {
        return {
          add: (name) => {
            const names = new Set(node.className.split(" ").filter(Boolean));
            names.add(name);
            node.className = Array.from(names).join(" ");
          },
          remove: (name) => {
            node.className = node.className
              .split(" ")
              .filter((candidate) => candidate && candidate !== name)
              .join(" ");
          },
          contains: (name) => node.className.split(" ").includes(name),
        };
      },
      append(...nodes) {
        this._text = null;
        nodes.forEach((child) => {
          if (child && typeof child === "object") child.parent = this;
          this.children.push(child);
        });
      },
      replaceChildren(...nodes) {
        this.children = [];
        this._text = null;
        this.append(...nodes);
      },
      prepend(...nodes) {
        this._text = null;
        nodes.forEach((child) => {
          if (child && typeof child === "object") child.parent = this;
        });
        this.children.unshift(...nodes);
      },
      replaceWith(replacement) {
        const index = this.parent?.children.indexOf(this) ?? -1;
        if (index >= 0) {
          this.parent.children[index] = replacement;
          replacement.parent = this.parent;
        }
      },
      setAttribute(name, value) {
        this.attributes[name] = String(value);
      },
      getAttribute(name) {
        return this.attributes[name] ?? null;
      },
      addEventListener(type, handler) {
        (this.listeners[type] ??= []).push(handler);
      },
      dispatch(type, event = {}) {
        const stableEvent = {
          key: undefined,
          preventDefault() {},
          ...event,
        };
        (this.listeners[type] ?? []).forEach((handler) => handler(stableEvent));
      },
      focus() {
        this.focused = true;
      },
      setCustomValidity(message) {
        this.validationMessage = String(message);
      },
      reportValidity() {
        this.validityReported = true;
        return !this.validationMessage;
      },
      querySelector(className) {
        const target = className.replace(".", "");
        for (const child of this.children) {
          if (typeof child === "string") continue;
          if (child.className.split(" ").includes(target)) return child;
          const found = child.querySelector(className);
          if (found) return found;
        }
        return null;
      },
    };
    return node;
  }
  return { createElement };
}

const PRODUCTION_STATUS_META = {
  planned: { label: "待處理", tone: "neutral" },
  in_progress: { label: "進行中", tone: "active" },
  blocked: { label: "受阻", tone: "danger" },
  done: { label: "已完成", tone: "success" },
  archive: { label: "已封存", tone: "muted" },
};

function productionSurface() {
  return surfaceRuntime.createEditorSurface({
    document: createDocumentStub(),
    priorityPolicy,
    statusMeta: PRODUCTION_STATUS_META,
  });
}

function demoSurface() {
  return surfaceRuntime.createEditorSurface({
    document: createDocumentStub(),
    priorityPolicy,
    statusMeta: {
      planned: { label: "待處理", tone: "muted" },
      in_progress: { label: "進行中", tone: "active" },
      blocked: { label: "受阻", tone: "danger" },
      done: { label: "已完成", tone: "success" },
      archive: { label: "已封存", tone: "muted" },
    },
    presentation: {
      headerClass: "task-header time-task-header",
      titleGroupClass: "time-task-copy",
      statusStyle: "dot",
      priorityOptionMarker: "● ",
      priorityOptionTone: true,
      cardStatusClass: (status, meta) => (
        ["active", "success", "danger"].includes(meta?.tone) ? `status-${meta.tone}` : ""
      ),
      itemRowClass: "time-work-item",
      itemEditingClass: "",
      itemCopyClass: "time-work-copy",
      itemTitleClass: "time-work-title",
      itemInputClass: "task-item-title-input",
      itemDeleteClass: "task-item-delete",
      itemPrioritySelectClass: "task-item-priority-select",
      itemPreviewWrap: true,
      addItemFormClass: "task-item-add-form",
      addTaskFormClass: "task-card-add-form",
      addItemTriggerClass: "task-item-add",
      addTaskTriggerClass: "task-card-add",
      addTitleInputClass: "",
      addSummaryInputClass: "",
      addItemPriorityClass: "task-item-priority-select",
      addTaskPriorityClass: "task-priority-select",
      addCancelClass: "task-inline-cancel",
      addSubmitClass: "task-inline-save",
      addErrorClass: "task-inline-error",
      addActionsClass: "task-inline-actions",
      addContractClass: "task-add-contract",
    },
  });
}

const sampleTask = Object.freeze({
  id: "task-a",
  title: "共用任務卡",
  summary: "驗證共用 Editor Surface。",
  status: "in_progress",
  priority: 1,
});

test("editor surface rejects hosts without a document, priority policy, or status metadata", () => {
  assert.throws(
    () => surfaceRuntime.createEditorSurface({ priorityPolicy, statusMeta: {} }),
    /document/,
  );
  assert.throws(
    () => surfaceRuntime.createEditorSurface({
      document: createDocumentStub(),
      statusMeta: {},
    }),
    /priority policy/,
  );
  assert.throws(
    () => surfaceRuntime.createEditorSurface({
      document: createDocumentStub(),
      priorityPolicy,
    }),
    /status metadata/,
  );
});

test("both hosts share task card structure, ordering, and accessibility text", () => {
  const production = productionSurface().createTaskCardShell(sampleTask, {
    completed: 2,
    total: 5,
  });
  const demo = demoSurface().createTaskCardShell(sampleTask, {
    completed: 2,
    total: 5,
    showPriority: false,
  });

  [production, demo].forEach((shell) => {
    assert.equal(shell.card.tagName, "article");
    assert.equal(shell.card.dataset.taskId, "task-a");
    assert.equal(shell.card.dataset.status, "in_progress");
    assert.equal(shell.card.dataset.priority, "1");
    assert.deepEqual(shell.card.children, [shell.header, shell.summary]);
    assert.deepEqual(shell.header.children, [shell.titleGroup, shell.headerMeta]);
    assert.deepEqual(shell.titleGroup.children, [shell.statusLine, shell.titleLine]);
    assert.deepEqual(shell.titleLine.children, [shell.title, shell.duration]);
    assert.deepEqual(shell.headerMeta.children, [shell.fraction, shell.taskId]);
    assert.equal(shell.title.textContent, "共用任務卡");
    assert.equal(shell.summary.className, "task-summary");
    assert.equal(shell.summary.textContent, "驗證共用 Editor Surface。");
    assert.equal(shell.duration.hidden, true);
    assert.equal(shell.fraction.textContent, "2 / 5");
    assert.equal(shell.fraction.getAttribute("aria-label"), "子項目完成 2，共 5");
    assert.equal(shell.taskId.textContent, "task-a");
    assert.equal(shell.statusLine.className, "time-task-status-line");
    assert.equal(shell.titleLine.className, "time-task-title-line");
  });
});

test("presentation adapter preserves each host's status and card styling", () => {
  const production = productionSurface().createTaskCardShell(sampleTask, {
    completed: 0,
    total: 0,
  });
  assert.equal(production.card.className, "task-card editor-task-card status-active");
  assert.equal(production.header.className, "task-header");
  assert.equal(production.titleGroup.className, "task-title-group");
  assert.equal(production.statusIndicator.className, "status-badge status-active");
  assert.equal(production.statusIndicator.textContent, "進行中");

  const demo = demoSurface().createTaskCardShell(sampleTask, {
    completed: 0,
    total: 0,
    showPriority: false,
  });
  assert.equal(demo.card.className, "task-card editor-task-card status-active");
  assert.equal(demo.header.className, "task-header time-task-header");
  assert.equal(demo.titleGroup.className, "time-task-copy");
  assert.equal(demo.statusIndicator.className, "time-task-state");
  assert.equal(demo.statusIndicator.children[0].className, "task-state-dot state-active");
  assert.equal(demo.statusIndicator.textContent, "進行中");
});

test("demo keeps neutral card borders for planned and archived tasks", () => {
  const surface = demoSurface();
  ["planned", "archive"].forEach((status) => {
    const shell = surface.createTaskCardShell({ ...sampleTask, status }, {});
    assert.equal(shell.card.className, "task-card editor-task-card");
    assert.equal(shell.statusIndicator.children[0].className, "task-state-dot state-muted");
  });
  const production = productionSurface().createTaskCardShell(
    { ...sampleTask, status: "planned" },
    {},
  );
  assert.equal(production.card.className, "task-card editor-task-card status-neutral");
});

test("priority badges are shared, normalized, and hidden for the unspecified level", () => {
  const surface = productionSurface();
  const badge = surface.createPriorityBadge(0, "task-priority-badge");
  assert.equal(badge.className, "task-priority-badge priority-badge priority-urgent");
  assert.equal(badge.textContent, "立即");
  assert.equal(badge.getAttribute("aria-label"), "優先級：立即");
  assert.match(badge.title, /同一狀態內依優先級排序/);

  assert.equal(surface.createPriorityBadge(4, "task-priority-badge"), null);
  assert.equal(surface.createPriorityBadge(undefined, "task-priority-badge"), null);
  assert.equal(surface.createPriorityBadge("9", "task-priority-badge"), null);
  assert.equal(
    surface.createPriorityBadge("2", "item-priority-badge").textContent,
    "一般",
  );
});

test("shared priority select reports normalized values and keeps host option styling", () => {
  const changes = [];
  const production = productionSurface().createPrioritySelect(2, {
    className: "inline-priority-select",
    ariaLabel: "任務 優先級",
    onChange: (value) => changes.push(value),
  });
  assert.equal(production.className, "inline-priority-select");
  assert.equal(production.getAttribute("aria-label"), "任務 優先級");
  assert.equal(production.value, "2");
  assert.deepEqual(
    production.children.map((option) => option.textContent),
    ["立即", "優先", "一般", "次要", "未指定"],
  );
  assert.deepEqual(production.children.map((option) => option.className), ["", "", "", "", ""]);
  production.value = "3";
  production.dispatch("change");
  assert.deepEqual(changes, [3]);

  const demo = demoSurface().createPrioritySelect(9, {
    className: "task-priority-select",
    ariaLabel: "設定優先級",
  });
  assert.equal(demo.value, "4");
  assert.deepEqual(
    demo.children.map((option) => option.textContent),
    ["● 立即", "● 優先", "● 一般", "● 次要", "未指定"],
  );
  assert.equal(demo.children[0].className, "priority-urgent");
  assert.ok(demo.className.split(" ").includes("priority-unspecified"));
  demo.value = "0";
  demo.dispatch("change");
  assert.ok(demo.className.split(" ").includes("priority-urgent"));
  assert.ok(!demo.className.split(" ").includes("priority-unspecified"));
});

test("shared add control owns collapsed trigger and item form behavior", () => {
  const document = createDocumentStub();
  const surface = surfaceRuntime.createEditorSurface({
    document,
    priorityPolicy,
    statusMeta: PRODUCTION_STATUS_META,
  });
  const host = document.createElement("div");
  let opened = 0;
  const collapsed = surface.createAddControl(host, {
    kind: "item",
    triggerAriaLabel: "增加待處理子任務",
    onOpen: () => { opened += 1; },
  });
  assert.equal(collapsed.trigger.className, "inline-add-trigger");
  assert.equal(collapsed.trigger.textContent, "+");
  assert.equal(collapsed.trigger.getAttribute("aria-label"), "增加待處理子任務");
  collapsed.trigger.dispatch("click");
  assert.equal(opened, 1);

  let cancelled = 0;
  let submitted = null;
  const expanded = surface.createAddControl(host, {
    kind: "item",
    expanded: true,
    defaultPriority: 2,
    onCancel: () => { cancelled += 1; },
    onSubmit: (values) => { submitted = values; },
  });
  assert.equal(expanded.form.className, "inline-add-form");
  assert.deepEqual(expanded.form.children, [
    expanded.titleInput,
    expanded.prioritySelect,
    expanded.cancelButton,
    expanded.submitButton,
    expanded.error,
  ]);
  assert.equal(expanded.titleInput.maxLength, 300);
  assert.equal(expanded.prioritySelect.value, "2");
  assert.equal(expanded.error.getAttribute("role"), "alert");
  expanded.showError("描述格式錯誤");
  assert.equal(expanded.error.hidden, false);
  assert.equal(expanded.error.textContent, "描述格式錯誤");
  expanded.titleInput.value = "新增項目";
  expanded.prioritySelect.value = "1";
  expanded.form.dispatch("submit");
  assert.deepEqual(submitted, { title: "新增項目", summary: "", priority: 1 });
  assert.equal(expanded.error.hidden, true);
  expanded.form.dispatch("keydown", { key: "Escape" });
  expanded.cancelButton.dispatch("click");
  assert.equal(cancelled, 2);
});

test("shared task add control preserves Demo presentation and field contract", () => {
  const document = createDocumentStub();
  const surface = surfaceRuntime.createEditorSurface({
    document,
    priorityPolicy,
    statusMeta: PRODUCTION_STATUS_META,
    presentation: {
      addTaskFormClass: "task-card-add-form",
      addTaskTriggerClass: "task-card-add",
      addTitleInputClass: "",
      addSummaryInputClass: "",
      addTaskPriorityClass: "task-priority-select",
      addCancelClass: "task-inline-cancel",
      addSubmitClass: "task-inline-save",
      addErrorClass: "task-inline-error",
      addActionsClass: "task-inline-actions",
      addContractClass: "task-add-contract",
    },
  });
  const host = document.createElement("div");
  const control = surface.createAddControl(host, {
    kind: "task",
    expanded: true,
    contractText: "預設狀態：待處理；預設優先級：一般；ID 會獨立產生",
  });
  assert.equal(control.form.className, "task-card-add-form");
  assert.equal(control.titleInput.maxLength, 160);
  assert.equal(control.summaryInput.maxLength, 1000);
  assert.equal(control.prioritySelect.className, "task-priority-select");
  assert.equal(control.contract.className, "task-add-contract");
  assert.equal(
    control.contract.textContent,
    "預設狀態：待處理；預設優先級：一般；ID 會獨立產生",
  );
  const actions = control.form.children.at(-1);
  assert.equal(actions.className, "task-inline-actions");
  assert.deepEqual(actions.children, [control.cancelButton, control.submitButton]);
});

test("shared field validation synchronizes native validity, ARIA, and focus", () => {
  const document = createDocumentStub();
  const surface = surfaceRuntime.createEditorSurface({
    document,
    priorityPolicy,
    statusMeta: PRODUCTION_STATUS_META,
  });
  const input = document.createElement("input");
  assert.equal(surface.setFieldError(input, "描述不可為空白。"), "描述不可為空白。");
  assert.equal(input.validationMessage, "描述不可為空白。");
  assert.equal(input.getAttribute("aria-invalid"), "true");
  assert.equal(surface.reportFieldError(input, "描述格式錯誤。"), true);
  assert.equal(input.validationMessage, "描述格式錯誤。");
  assert.equal(input.focused, true);
  assert.equal(input.validityReported, true);
  input.dispatch("input");
  assert.equal(input.validationMessage, "");
  assert.equal(input.getAttribute("aria-invalid"), "false");
});

test("shared save bar projects clean, dirty, saving, and error states", () => {
  const document = createDocumentStub();
  const surface = surfaceRuntime.createEditorSurface({
    document,
    priorityPolicy,
    statusMeta: PRODUCTION_STATUS_META,
  });
  const host = document.createElement("aside");
  let saves = 0;
  let undos = 0;
  let redos = 0;
  const saveBar = surface.createSaveBar(host, {
    statusId: "save-status",
    buttonId: "save-button",
    onUndo: () => { undos += 1; },
    onRedo: () => { redos += 1; },
    onSave: () => { saves += 1; },
  });
  assert.deepEqual(host.children, [saveBar.status, saveBar.history, saveBar.button]);
  assert.equal(host.hidden, true);
  assert.equal(host.getAttribute("aria-live"), "polite");
  assert.equal(saveBar.status.getAttribute("role"), "status");
  assert.equal(saveBar.button.disabled, true);
  assert.equal(saveBar.undoButton.disabled, true);
  assert.equal(saveBar.redoButton.disabled, true);

  saveBar.setState({ editing: true, dirty: false });
  assert.equal(host.hidden, false);
  assert.equal(host.dataset.state, "clean");
  assert.equal(saveBar.status.textContent, "尚未修改");
  assert.equal(saveBar.button.disabled, true);

  saveBar.setState({ editing: true, dirty: true, canUndo: true });
  assert.equal(host.dataset.state, "dirty");
  assert.equal(saveBar.status.textContent, "有尚未儲存的修改");
  assert.equal(saveBar.button.disabled, false);
  assert.equal(saveBar.undoButton.disabled, false);
  assert.equal(saveBar.redoButton.disabled, true);
  saveBar.undoButton.dispatch("click");
  assert.equal(undos, 1);
  saveBar.setState({ canUndo: false, canRedo: true });
  saveBar.redoButton.dispatch("click");
  assert.equal(redos, 1);
  saveBar.button.dispatch("click");
  assert.equal(saves, 1);

  saveBar.setState({ saving: true });
  assert.equal(host.dataset.state, "saving");
  assert.equal(host.getAttribute("aria-busy"), "true");
  assert.equal(saveBar.button.textContent, "正在儲存…");
  assert.equal(saveBar.button.disabled, true);
  assert.equal(saveBar.redoButton.disabled, true);
  saveBar.showError("儲存衝突；草稿仍保留。");
  assert.equal(host.dataset.state, "error");
  assert.equal(host.getAttribute("aria-busy"), "false");
  assert.equal(saveBar.status.textContent, "儲存衝突；草稿仍保留。");
  assert.equal(saveBar.button.disabled, false);
});

test("shared history shortcuts handle platform undo and redo only while active", () => {
  const document = createDocumentStub();
  const surface = surfaceRuntime.createEditorSurface({
    document,
    priorityPolicy,
    statusMeta: PRODUCTION_STATUS_META,
  });
  const target = document.createElement("div");
  let active = true;
  let undos = 0;
  let redos = 0;
  let prevented = 0;
  surface.bindHistoryShortcuts(target, {
    isActive: () => active,
    onUndo: () => { undos += 1; return true; },
    onRedo: () => { redos += 1; return true; },
  });

  const event = (key, extra = {}) => ({
    key,
    ctrlKey: true,
    preventDefault: () => { prevented += 1; },
    ...extra,
  });
  target.dispatch("keydown", event("z"));
  target.dispatch("keydown", event("z", { shiftKey: true }));
  target.dispatch("keydown", event("y"));
  active = false;
  target.dispatch("keydown", event("z"));

  assert.equal(undos, 1);
  assert.equal(redos, 2);
  assert.equal(prevented, 3);
});

test("shared item rows preserve host layout while sharing preview semantics", () => {
  const item = { id: "item-a", title: "共用子項目", priority: 1 };
  const production = productionSurface().createItemRow(item, {
    contentNodes: ["2 hr"],
    trailingNodes: ["進行中"],
  });
  assert.equal(production.row.dataset.itemId, "item-a");
  assert.equal(production.row.className, "editor-item-row time-work-item");
  assert.equal(production.copy, null);
  assert.deepEqual(production.row.children, [
    production.priorityBadge,
    production.title,
    "2 hr",
    "進行中",
  ]);
  assert.equal(production.title.textContent, "共用子項目");

  const demo = demoSurface().createItemRow(item, {
    contentNodes: ["2 hr"],
    trailingNodes: ["進行中"],
  });
  assert.equal(demo.row.className, "editor-item-row time-work-item");
  assert.equal(demo.copy.className, "time-work-copy");
  assert.deepEqual(demo.copy.children, [demo.priorityBadge, demo.title, "2 hr"]);
  assert.deepEqual(demo.row.children, [demo.copy, "進行中"]);
});

test("shared item editing owns controls, ordering, datasets, and callbacks", () => {
  const events = [];
  const item = { id: "item-a", title: "原始標題", priority: 2 };
  const surface = demoSurface().createItemRow(item, {
    editing: true,
    contentNodes: ["待估"],
    trailingNodes: ["待處理"],
    inputDataset: { itemId: item.id, taskId: "task-a" },
    titleAriaLabel: "子項目描述",
    priorityAriaLabel: "設定子項目優先級",
    deleteAriaLabel: "刪除子項目：原始標題",
    onTitleInput: (value) => events.push(["input", value]),
    onTitleCommit: (value) => value.trim(),
    onDelete: () => events.push(["delete"]),
    onPriorityChange: (value) => events.push(["priority", value]),
  });

  assert.deepEqual(surface.row.children, [
    surface.prioritySelect,
    surface.input,
    "待估",
    "待處理",
    surface.deleteButton,
  ]);
  assert.equal(surface.input.className, "task-item-title-input");
  assert.equal(surface.input.dataset.itemId, "item-a");
  assert.equal(surface.input.dataset.taskId, "task-a");
  assert.equal(surface.input.getAttribute("aria-label"), "子項目描述");
  assert.equal(surface.deleteButton.textContent, "刪除");
  assert.equal(surface.deleteButton.getAttribute("aria-label"), "刪除子項目：原始標題");

  surface.input.value = "  新標題  ";
  surface.input.dispatch("input");
  surface.input.dispatch("change");
  surface.deleteButton.dispatch("click");
  surface.prioritySelect.value = "0";
  surface.prioritySelect.dispatch("change");
  assert.equal(surface.input.value, "新標題");
  assert.deepEqual(events, [
    ["input", "  新標題  "],
    ["delete"],
    ["priority", 0],
  ]);
});

// The single-order contract: an ItemRow has one sequence. Preview and edit may
// differ only in whether a field is editable, so a mode switch never moves a
// control. `刪除` is edit-only and pinned last, after every shared field.
test("item rows keep one order across both modes and both hosts", () => {
  const item = { id: "item-a", title: "共用子項目", priority: 1 };
  const options = { contentNodes: ["2 hr"], trailingNodes: ["進行中"] };

  // Shared fields, in order, regardless of host or mode.
  function sharedSequence(built) {
    const container = built.copy ?? built.row;
    const nodes = built.copy
      ? [...built.copy.children, ...built.row.children.filter((node) => node !== built.copy)]
      : [...container.children];
    return nodes
      .filter((node) => node !== built.deleteButton)
      .map((node) => {
        if (node === built.priorityBadge || node === built.prioritySelect) return "priority";
        if (node === built.title || node === built.input) return "title";
        return node;
      });
  }

  const expected = ["priority", "title", "2 hr", "進行中"];
  [productionSurface(), demoSurface()].forEach((surface) => {
    const preview = surface.createItemRow(item, options);
    const editing = surface.createItemRow(item, { ...options, editing: true });
    assert.deepEqual(sharedSequence(preview), expected);
    assert.deepEqual(sharedSequence(editing), expected);
    // Delete exists only while editing, and only after the shared fields.
    assert.equal(preview.deleteButton, null);
    assert.equal(editing.row.children.at(-1), editing.deleteButton);
  });
});

test("item row order is not host-configurable", async () => {
  const [runtime, viewerApp, demoApp] = await Promise.all([
    readFile(new URL("../viewer/assets/editor-surface-runtime.js", import.meta.url), "utf8"),
    readFile(new URL("../viewer/assets/app.js", import.meta.url), "utf8"),
    readFile(new URL("../experiments/time-reference/demo/app.js", import.meta.url), "utf8"),
  ]);
  assert.match(runtime, /const ITEM_ROW_ORDER = Object\.freeze\(\[/);
  assert.match(
    runtime,
    /ITEM_ROW_ORDER = Object\.freeze\(\[\s*"priority",\s*"title",\s*"content",\s*"trailing",\s*"delete",\s*\]\)/,
  );
  // The knob that let the two hosts drift into three different sequences.
  [runtime, viewerApp, demoApp].forEach((source) => {
    assert.doesNotMatch(source, /itemEditOrder/);
  });
});

test("legacy string items remain read-only even when the host is editing", () => {
  const item = productionSurface().createItemRow("舊格式子項目", { editing: true });
  assert.equal(item.input, null);
  assert.equal(item.deleteButton, null);
  assert.equal(item.prioritySelect, null);
  assert.equal(item.title.textContent, "舊格式子項目");
});

test("shared mode controller keeps toggle state, availability, and ARIA synchronized", async () => {
  const document = createDocumentStub();
  const control = document.createElement("button");
  const root = { dataset: {} };
  const requests = [];
  const controller = productionSurface().createModeController(control, {
    root,
    available: true,
    onRequest: (nextMode, currentMode) => {
      requests.push([currentMode, nextMode]);
      return nextMode;
    },
  });

  assert.equal(controller.mode, "preview");
  assert.equal(control.textContent, "預覽模式");
  assert.equal(control.getAttribute("aria-pressed"), "false");
  assert.equal(control.getAttribute("aria-label"), "目前為預覽模式；按下切換到編輯模式");
  assert.equal(root.dataset.viewMode, "preview");

  assert.equal(await controller.requestMode("edit"), true);
  assert.equal(controller.mode, "edit");
  assert.equal(control.textContent, "編輯模式");
  assert.equal(control.getAttribute("aria-pressed"), "true");
  assert.equal(root.dataset.viewMode, "edit");
  assert.deepEqual(requests, [["preview", "edit"]]);

  controller.setBusy(true);
  assert.equal(control.disabled, true);
  assert.equal(await controller.requestMode("preview"), false);
  controller.setBusy(false);
  controller.setAvailable(false);
  assert.equal(controller.mode, "preview");
  assert.equal(control.disabled, true);
});

test("shared mode controller preserves the current mode when a host rejects transition", async () => {
  const document = createDocumentStub();
  const control = document.createElement("button");
  const controller = productionSurface().createModeController(control, {
    available: true,
    onRequest: () => false,
  });
  assert.equal(await controller.requestMode("edit"), false);
  assert.equal(controller.mode, "preview");
  assert.equal(control.disabled, false);
  assert.equal(control.getAttribute("aria-pressed"), "false");
});

test("setTaskFraction keeps the fraction label and accessible text together", () => {
  const surface = productionSurface();
  const shell = surface.createTaskCardShell(sampleTask, { completed: 1, total: 3 });
  surface.setTaskFraction(shell.fraction, 3, 3);
  assert.equal(shell.fraction.textContent, "3 / 3");
  assert.equal(shell.fraction.getAttribute("aria-label"), "子項目完成 3，共 3");
});

test("production Viewer and Demo share cards, rows, add/save controls, validation, and mode", async () => {
  const [viewerApp, demoApp, demoHtml] = await Promise.all([
    readFile(new URL("../viewer/assets/app.js", import.meta.url), "utf8"),
    readFile(new URL("../experiments/time-reference/demo/app.js", import.meta.url), "utf8"),
    readFile(new URL("../experiments/time-reference/demo/index.html", import.meta.url), "utf8"),
  ]);

  assert.match(viewerApp, /from "\.\/editor-surface\.js"/);
  // The Viewer's task list is rendered through the UI adapter, so cards and
  // rows are no longer built here; the top-level task adder still is.
  assert.match(viewerApp, /createUiView\(elements\.taskList, props\)/);
  assert.doesNotMatch(viewerApp, /createTaskCardShell/);
  assert.doesNotMatch(viewerApp, /createItemRow/);
  assert.match(viewerApp, /createAddControl\(elements\.taskAddShell, \{/);
  assert.match(viewerApp, /saveBarControl = createSaveBar\(elements\.editSaveBar, \{/);
  assert.match(viewerApp, /bindHistoryShortcuts\(document, \{/);
  assert.match(viewerApp, /viewModeControl = createModeController\(elements\.viewModeToggle, \{/);
  assert.match(demoHtml, /editor-surface-runtime\.js/);
  assert.match(demoApp, /editorSurfaceRuntime\.createEditorSurface\(\{/);
  assert.match(demoApp, /const shell = editorSurface\.createTaskCardShell\(/);
  assert.match(demoApp, /return editorSurface\.createItemRow\(taskItem, \{/);
  assert.match(demoApp, /editorSurface\.createAddControl\(row, \{/);
  assert.match(demoApp, /editorSurface\.createAddControl\(host, \{/);
  assert.match(demoApp, /saveBarControl = editorSurface\.createSaveBar\(elements\.globalEditSave, \{/);
  assert.match(demoApp, /editorSurface\.bindHistoryShortcuts\(document, \{/);
  assert.match(demoApp, /editorSurface\.setFieldError\(input, message\)/);
  assert.match(demoApp, /editorSurface\.reportFieldError\(firstInvalid\.input, firstInvalid\.message\)/);
  assert.match(demoApp, /viewModeControl = editorSurface\.createModeController\(elements\.viewModeToggle, \{/);
  assert.match(demoHtml, /id="view-mode-toggle"[\s\S]*?aria-pressed="false"/);
  assert.doesNotMatch(demoHtml, /id="view-mode-select"/);

  // Neither host may rebuild the shared card markup on its own again.
  [viewerApp, demoApp].forEach((source) => {
    assert.doesNotMatch(source, /"task-header-meta"/);
    assert.doesNotMatch(source, /"task-fraction"/);
    assert.doesNotMatch(source, /task-state-dot/);
    assert.doesNotMatch(source, /status-badge status-/);
    assert.doesNotMatch(source, /priority-badge priority-/);
  });
  assert.doesNotMatch(viewerApp, /el\("button", "inline-delete-button"/);
  assert.doesNotMatch(demoApp, /function createTaskItemDeleteButton/);
  assert.doesNotMatch(demoApp, /function createWorkRow/);
  assert.doesNotMatch(viewerApp, /el\("form", "(?:inline|task)-add-form"/);
  assert.doesNotMatch(demoApp, /document\.createElement\("form"\)[\s\S]{0,80}(?:task-item|task-card)-add-form/);
  assert.doesNotMatch(viewerApp, /viewModeToggle\.addEventListener\("click"/);
  assert.doesNotMatch(demoApp, /viewModeToggle\.addEventListener\("click"/);
});
