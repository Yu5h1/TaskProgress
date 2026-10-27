import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const indexUrl = new URL("../viewer/index.html", import.meta.url);
const appUrl = new URL("../viewer/assets/app.js", import.meta.url);
const styleUrl = new URL("../viewer/assets/styles.css", import.meta.url);
const modeToggle = await readFile(
  new URL("../ui/web-workflow/viewer.mjs", import.meta.url),
  "utf8",
);
const saveBar = await readFile(
  new URL("../ui/web-workflow/common.mjs", import.meta.url),
  "utf8",
);
const presentationUrl = new URL("../viewer/assets/editor-presentation.css", import.meta.url);

test("production Viewer discovers local editing through the shared edit-host client, with no iframe", async () => {
  const [html, app] = await Promise.all([readFile(indexUrl, 'utf8'), readFile(appUrl, 'utf8')]);
  assert.match(html, /id="view-mode-toggle"/u);
  assert.match(modeToggle, /p\.hideWhenUnavailable && !p\.available/u);
  assert.match(modeToggle, /p\.onToggle\(p\.mode === 'edit' \? 'preview' : 'edit'\)/u);
  assert.match(app, /state\.editor\.client = createEditHostClient\(\{ scope \}\)/u);
  assert.match(app, /const capability = await state\.editor\.client\.discover\(\)/u);
  assert.doesNotMatch(html + app, /editor-surface-overlay|editor-surface-frame|editorSurfaceOverlay|editorSurfaceFrame|editor_surface_url/u);
});

test("local editor opens a dual-revision session and saves through the shared edit-host client", async () => {
  const [app, client, adapter, persistence] = await Promise.all([
    readFile(appUrl, "utf8"),
    readFile(new URL("../viewer/assets/edit-host-client.js", import.meta.url), "utf8"),
    readFile(new URL("../viewer/assets/report-editor-adapter.js", import.meta.url), "utf8"),
    readFile(new URL("../viewer/assets/persistence-mode.js", import.meta.url), "utf8"),
  ]);
  assert.match(app, /createReportEditorAdapter\(state\.persistedReport/);
  assert.match(app, /createPersistenceController\(\{/);
  assert.match(app, /state\.editor\.persistence\.dispatch\(command\)/);
  assert.match(adapter, /function prepareSave\(/);
  assert.match(adapter, /timeDraft\?\.replacements\(\)/);
  assert.match(persistence, /const saved = await save\(payload\)/);
  // A second draft opens alongside the report session: config/estimates,
  // seeded from whatever the session already carries as defaults.
  assert.match(app, /createTimeInputDraft\(hostSession\.inputs, state\.editor\.scope/);
  assert.match(app, /await state\.editor\.client\.start\(\)/);
  assert.match(app, /await state\.editor\.client\.save\(\{ \.\.\.payload, report: recordUserActivity\(state\.persistedReport, payload\.report\) \}\)/);
  assert.match(app, /await state\.editor\.client\?\.close\(\)/);
  // The token/revision precondition lives inside the shared client now, not
  // duplicated as raw fetch headers in the host.
  assert.match(client, /X-TaskProgress-Editor/);
  assert.match(client, /Authorization: `Bearer \$\{session\.token\}`/);
  assert.match(client, /"If-Match": `"\$\{session\.revision\}"`/);
  assert.doesNotMatch(app, /window\.location\.reload\(\)/);
  assert.doesNotMatch(app, /state\.report\.tasks\.(?:push|splice)\(/);
  assert.doesNotMatch(app, /editableTask\.(?:title|summary|status|priority)\s*=/);
  assert.doesNotMatch(app, /localStorage\.setItem\([^)]*token/i);
  assert.doesNotMatch(app, /state\.editor\.token\b/);
  assert.match(app, /createUiView\("mode-toggle", elements\.viewModeToggle/);
  // The toggle reports the requested mode; the host decides what it means.
  assert.match(app, /onToggle: \(\) => \{/);
  assert.match(app, /nextMode === "edit" \? startEditing\(\) : cancelEditing\(\)/);
  assert.doesNotMatch(app, /viewModeToggle\.addEventListener\("click"/);
});

test("editing routes add, save, discard and history through the host controller", async () => {
  const app = await readFile(appUrl, 'utf8');
  assert.match(app, /function addTaskItem\(taskId, draftTitle, priority\)/u);
  assert.match(app, /createUiView\("add-control", elements\.taskAddShell/u);
  assert.match(app, /createUiView\("save-bar", elements\.editSaveBar/u);
  assert.match(saveBar, /@click=\$\{p\.onDiscard\}/u);
  assert.match(saveBar, /@click=\$\{p\.onSave\}/u);
  assert.match(app, /onUndo: \(\) => applyEditorHistory\("undo"\)/u);
  assert.match(app, /onRedo: \(\) => applyEditorHistory\("redo"\)/u);
  assert.match(app, /onDiscard: \(\) => \{\s*state\.editor\.persistence\?\.discard\(\)/u);
  assert.match(app, /bindHistoryShortcuts\(document, \{/u);
});

test("Viewer mode toggle consumes the shared presentation class", async () => {
  assert.match(modeToggle, /view-mode-toggle editor-mode-dock/u);
  const presentation = await readFile(presentationUrl, 'utf8');
  assert.match(presentation, /\.editor-mode-dock\s*\{/u);
});
