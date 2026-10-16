import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const indexUrl = new URL("../viewer/index.html", import.meta.url);
const appUrl = new URL("../viewer/assets/app.js", import.meta.url);
const styleUrl = new URL("../viewer/assets/styles.css", import.meta.url);

test("top-left header displays report title and removes duplicate hero title and scope eyebrow", async () => {
  const [html, app] = await Promise.all([
    readFile(indexUrl, "utf8"),
    readFile(appUrl, "utf8"),
  ]);

  // Top-left header hosts #report-title with home navigation and full-title tooltip.
  assert.match(
    html,
    /<header class="site-header">\s*<a class="brand" id="report-title" href="\.\/" title="正在載入報告…">正在載入報告…<\/a>/u,
  );

  // Hero keeps summary, module dock, metadata, and progress without #scope-label or duplicate h1.
  assert.doesNotMatch(html, /id="scope-label"/u);
  assert.doesNotMatch(html, /<p class="eyebrow"/u);
  const heroBlock = html.match(/<section class="hero"[\s\S]*?<\/section>/u)?.[0] ?? "";
  assert.ok(heroBlock.length > 0, "hero section must exist");
  assert.doesNotMatch(heroBlock, /<h1\b/u, "hero must not repeat the project title");
  assert.match(heroBlock, /id="report-summary"/u);
  assert.match(heroBlock, /id="time-summary-dock"/u);
  assert.match(heroBlock, /id="report-meta"/u);
  assert.match(heroBlock, /id="project-progress"/u);

  // App updates both textContent and title attribute across report load and scope changes.
  assert.doesNotMatch(app, /#scope-label|elements\.scope\b/u);
  assert.match(
    app,
    /function setReportTitle\(title\)\s*\{\s*elements\.title\.textContent = title;\s*elements\.title\.title = title;\s*\}/u,
  );
  assert.match(app, /setReportTitle\(report\.title\)/u);
  assert.match(app, /setReportTitle\("TaskProgress Viewer"\)/u);
  assert.match(app, /setReportTitle\("TaskProgress Scopes"\)/u);
  assert.match(app, /setReportTitle\("報告無法載入"\)/u);
  assert.match(app, /window\.addEventListener\("popstate"/u);
});

test("bottom-left footer pairs the existing TaskProgress brand-mark icon with TaskProgress Viewer", async () => {
  const [html, styles] = await Promise.all([
    readFile(indexUrl, "utf8"),
    readFile(styleUrl, "utf8"),
  ]);

  const footerBlock = html.match(/<footer>[\s\S]*?<\/footer>/u)?.[0] ?? "";
  assert.match(
    footerBlock,
    /<span class="footer-brand">\s*<span class="brand-mark" aria-hidden="true"><span><\/span><span><\/span><span><\/span><\/span>\s*<span>TaskProgress Viewer<\/span>\s*<\/span>/u,
  );
  assert.match(footerBlock, /id="viewer-mode-label"/u);
  assert.match(styles, /\.footer-brand\s*\{[\s\S]*?display:\s*inline-flex;[\s\S]*?align-items:\s*center;/u);
});

test("header report title truncates with ellipsis and protects header controls on narrow viewports", async () => {
  const styles = await readFile(styleUrl, "utf8");

  assert.match(
    styles,
    /#report-title\.brand\s*\{[\s\S]*?overflow:\s*hidden;[\s\S]*?color:\s*var\(--color-heading\);[\s\S]*?text-overflow:\s*ellipsis;[\s\S]*?white-space:\s*nowrap;/u,
  );
  assert.match(
    styles,
    /\.site-header:has\(\.editor-mode-dock:not\(\[hidden\]\)\) #report-title\.brand\s*\{\s*max-width:\s*calc\(50% - 56px\);\s*\}/u,
  );
  assert.match(
    styles,
    /\.header-actions\s*\{[\s\S]*?flex:\s*0 0 auto;/u,
  );
});

test("switching scopes updates top-left #report-title textContent and title attribute", async () => {
  const elements = new Map();
  const getElement = (selector) => {
    if (!elements.has(selector)) {
      elements.set(selector, {
        textContent: "",
        title: "",
        hidden: false,
        dataset: {},
        attributes: new Map(),
        setAttribute(name, value) {
          this.attributes.set(name, value);
        },
        replaceChildren() {},
        append() {},
      });
    }
    return elements.get(selector);
  };

  const windowListeners = new Map();
  const currentLocation = new URL("http://127.0.0.1:4173/?scope=alpha");

  const reports = {
    "http://127.0.0.1:4173/reports/alpha/report.json": {
      schema_version: "1.0",
      report_id: "alpha-report",
      scope_id: "alpha",
      title: "Alpha Project With A Very Long Report Title For Ellipsis Verification",
      summary: "Alpha summary",
      updated_at: "2026-10-16T12:00:00Z",
      tasks: [],
    },
    "http://127.0.0.1:4173/reports/beta/report.json": {
      schema_version: "1.0",
      report_id: "beta-report",
      scope_id: "beta",
      title: "Beta Project Title",
      summary: "Beta summary",
      updated_at: "2026-10-16T13:00:00Z",
      tasks: [],
    },
  };

  const prevWindow = globalThis.window;
  const prevDocument = globalThis.document;
  const prevLocation = globalThis.location;
  const prevFetch = globalThis.fetch;
  const prevUiHost = globalThis.TaskProgressUiHost;
  const prevPriorityPolicy = globalThis.TaskProgressPriorityPolicy;
  const prevEditorSurface = globalThis.TaskProgressEditorSurfaceRuntime;
  const prevEditorCore = globalThis.TaskProgressEditorCoreRuntime;

  await import("../viewer/assets/priority-policy.js");
  await import("../viewer/assets/editor-surface-runtime.js");
  await import("../viewer/assets/editor-core-runtime.js");
  const { registerUiAdapter, resetUiAdapters } = await import("../viewer/assets/ui-host.js");
  resetUiAdapters();
  registerUiAdapter({
    id: "test-stub",
    regions: [
      "report-summary",
      "theme-control",
      "mode-toggle",
      "save-bar",
      "diagnostics",
      "project-progress",
      "task-list",
      "add-control",
      "scope-directory",
      "project-module-strip",
      "delivery-save-confirmation",
    ],
    mount(_region, _target, props) {
      return { props };
    },
    update(instance, props) {
      instance.props = props;
    },
    destroy() {},
  });

  const loc = {
    get href() { return currentLocation.href; },
    get origin() { return currentLocation.origin; },
    get hostname() { return currentLocation.hostname; },
    get pathname() { return currentLocation.pathname; },
    get search() { return currentLocation.search; },
    reload() {},
  };

  globalThis.location = loc;
  globalThis.window = {
    location: loc,
    matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
    addEventListener(type, fn) {
      const list = windowListeners.get(type) ?? [];
      list.push(fn);
      windowListeners.set(type, list);
    },
    removeEventListener() {},
  };
  globalThis.document = {
    title: "",
    get baseURI() { return currentLocation.href; },
    visibilityState: "visible",
    documentElement: {
      dataset: {},
      style: { setProperty() {}, removeProperty() {} },
    },
    querySelector: (selector) => getElement(selector),
    createElement: () => getElement(`created-${Math.random()}`),
    addEventListener() {},
    removeEventListener() {},
  };
  globalThis.fetch = async (input) => {
    const href = new URL(String(input), currentLocation.href).href;
    if (reports[href]) {
      return {
        ok: true,
        status: 200,
        async json() {
          return structuredClone(reports[href]);
        },
      };
    }
    return { ok: false, status: 404, async json() { return {}; } };
  };

  try {
    await import(`../viewer/assets/app.js?scope-switch-test=${Date.now()}`);
    await new Promise((resolve) => setTimeout(resolve, 30));

    const titleEl = getElement("#report-title");
    assert.equal(
      titleEl.textContent,
      "Alpha Project With A Very Long Report Title For Ellipsis Verification",
    );
    assert.equal(
      titleEl.title,
      "Alpha Project With A Very Long Report Title For Ellipsis Verification",
    );
    assert.equal(
      globalThis.document.title,
      "Alpha Project With A Very Long Report Title For Ellipsis Verification — TaskProgress",
    );

    // Switch scope to beta and trigger popstate.
    currentLocation.search = "?scope=beta";
    for (const handler of windowListeners.get("popstate") ?? []) {
      handler();
    }
    await new Promise((resolve) => setTimeout(resolve, 30));

    assert.equal(titleEl.textContent, "Beta Project Title");
    assert.equal(titleEl.title, "Beta Project Title");
    assert.equal(globalThis.document.title, "Beta Project Title — TaskProgress");
  } finally {
    globalThis.window = prevWindow;
    globalThis.document = prevDocument;
    globalThis.location = prevLocation;
    globalThis.fetch = prevFetch;
    globalThis.TaskProgressUiHost = prevUiHost;
    globalThis.TaskProgressPriorityPolicy = prevPriorityPolicy;
    globalThis.TaskProgressEditorSurfaceRuntime = prevEditorSurface;
    globalThis.TaskProgressEditorCoreRuntime = prevEditorCore;
  }
});
