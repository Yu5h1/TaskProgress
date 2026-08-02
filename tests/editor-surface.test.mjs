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
      dispatch(type) {
        (this.listeners[type] ?? []).forEach((handler) => handler());
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
  assert.equal(production.card.className, "task-card status-active");
  assert.equal(production.header.className, "task-header");
  assert.equal(production.titleGroup.className, "task-title-group");
  assert.equal(production.statusIndicator.className, "status-badge status-active");
  assert.equal(production.statusIndicator.textContent, "進行中");

  const demo = demoSurface().createTaskCardShell(sampleTask, {
    completed: 0,
    total: 0,
    showPriority: false,
  });
  assert.equal(demo.card.className, "task-card status-active");
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
    assert.equal(shell.card.className, "task-card");
    assert.equal(shell.statusIndicator.children[0].className, "task-state-dot state-muted");
  });
  const production = productionSurface().createTaskCardShell(
    { ...sampleTask, status: "planned" },
    {},
  );
  assert.equal(production.card.className, "task-card status-neutral");
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

test("setTaskFraction keeps the fraction label and accessible text together", () => {
  const surface = productionSurface();
  const shell = surface.createTaskCardShell(sampleTask, { completed: 1, total: 3 });
  surface.setTaskFraction(shell.fraction, 3, 3);
  assert.equal(shell.fraction.textContent, "3 / 3");
  assert.equal(shell.fraction.getAttribute("aria-label"), "子項目完成 3，共 3");
});

test("production Viewer and Demo build task cards through the shared surface", async () => {
  const [viewerApp, demoApp, demoHtml] = await Promise.all([
    readFile(new URL("../viewer/assets/app.js", import.meta.url), "utf8"),
    readFile(new URL("../experiments/time-reference/demo/app.js", import.meta.url), "utf8"),
    readFile(new URL("../experiments/time-reference/demo/index.html", import.meta.url), "utf8"),
  ]);

  assert.match(viewerApp, /from "\.\/editor-surface\.js"/);
  assert.match(viewerApp, /const shell = createTaskCardShell\(task, \{/);
  assert.match(demoHtml, /editor-surface-runtime\.js/);
  assert.match(demoApp, /editorSurfaceRuntime\.createEditorSurface\(\{/);
  assert.match(demoApp, /const shell = editorSurface\.createTaskCardShell\(/);

  // Neither host may rebuild the shared card markup on its own again.
  [viewerApp, demoApp].forEach((source) => {
    assert.doesNotMatch(source, /"task-header-meta"/);
    assert.doesNotMatch(source, /"task-fraction"/);
    assert.doesNotMatch(source, /task-state-dot/);
    assert.doesNotMatch(source, /status-badge status-/);
    assert.doesNotMatch(source, /priority-badge priority-/);
  });
});
