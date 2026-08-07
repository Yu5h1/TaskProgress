import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const indexUrl = new URL("../viewer/index.html", import.meta.url);
const appUrl = new URL("../viewer/assets/app.js", import.meta.url);
const styleUrl = new URL("../viewer/assets/styles.css", import.meta.url);
const modeToggle = await readFile(
  new URL("../experiments/editor-svelte-spike/src/ModeToggle.svelte", import.meta.url),
  "utf8",
);
const saveBar = await readFile(
  new URL("../experiments/editor-svelte-spike/src/SaveBar.svelte", import.meta.url),
  "utf8",
);
const presentationUrl = new URL("../viewer/assets/editor-presentation.css", import.meta.url);

test("production Viewer discovers local editing through the shared edit-host client, with no iframe", async () => {
  const [html, app] = await Promise.all([
    readFile(indexUrl, "utf8"),
    readFile(appUrl, "utf8"),
  ]);
  // The toggle is rendered by the shared component into this mount point.
  assert.match(html, /<div class="view-mode-dock" id="view-mode-toggle"><\/div>/);
  assert.match(modeToggle, /aria-pressed=\{editing\}/);
  assert.match(modeToggle, /hidden=\{hideWhenUnavailable && !available\}/);
  assert.match(html, /id="edit-save-bar"[^>]*hidden/);
  // Discovery and capability parsing live in edit-host-client.js now; the
  // host only asks it to discover and reads back a plain boolean.
  assert.match(app, /import \{ createEditHostClient \} from "\.\/edit-host-client\.js"/);
  assert.match(app, /state\.editor\.client = createEditHostClient\(\{ scope \}\)/);
  assert.match(app, /const capability = await state\.editor\.client\.discover\(\)/);
  // Editing happens in this document; the iframe surface and its postMessage
  // handshake are gone along with the second application it used to load.
  assert.doesNotMatch(html, /editor-surface-overlay|editor-surface-frame/);
  assert.doesNotMatch(app, /editorSurfaceOverlay|editorSurfaceFrame|editor-surface-open/);
  assert.doesNotMatch(app, /taskprogress:editor-close/);
  assert.doesNotMatch(app, /editor_surface_url/);
});

test("local editor opens a dual-revision session and saves through the shared edit-host client", async () => {
  const [app, client] = await Promise.all([
    readFile(appUrl, "utf8"),
    readFile(new URL("../viewer/assets/edit-host-client.js", import.meta.url), "utf8"),
  ]);
  assert.match(app, /createReportEditorSession\(state\.persistedReport/);
  assert.match(app, /state\.editor\.session\.dispatch\(command\)/);
  assert.match(app, /state\.editor\.session\.prepareSave\(/);
  assert.match(app, /state\.editor\.session\.validate\(/);
  // A second draft opens alongside the report session: config/estimates,
  // seeded from whatever the session already carries as defaults.
  assert.match(app, /createTimeInputDraft\(session\.inputs, state\.editor\.scope/);
  assert.match(app, /await state\.editor\.client\.start\(\)/);
  assert.match(app, /await state\.editor\.client\.save\(\{/);
  assert.match(app, /await state\.editor\.client\?\.close\(\)/);
  // The token/revision precondition lives inside the shared client now, not
  // duplicated as raw fetch headers in the host.
  assert.match(client, /X-TaskProgress-Editor/);
  assert.match(client, /Authorization: `Bearer \$\{session\.token\}`/);
  assert.match(client, /"If-Match": `"\$\{session\.revision\}"`/);
  assert.match(app, /window\.location\.reload\(\)/);
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

test("editing exposes global task and child controls with a panel-aligned save bar", async () => {
  const [html, app, styles] = await Promise.all([
    readFile(indexUrl, "utf8"),
    readFile(appUrl, "utf8"),
    readFile(styleUrl, "utf8"),
  ]);
  assert.match(app, /增加工作項目/);
  // Child-item adding now lives in the card component; the host owns the command.
  assert.match(app, /function addTaskItem\(taskId, draftTitle, priority\)/);
  assert.match(app, /createUiView\("add-control", elements\.taskAddShell/);
  assert.match(app, /createUiView\("save-bar", elements\.editSaveBar/);
  // The status element id now lives in the shared SaveBar component.
  assert.match(saveBar, /id="edit-save-status"/);
  assert.match(saveBar, /class="edit-save-status"/);
  assert.match(saveBar, /class="primary-button edit-save-button"/);
  assert.match(app, /onUndo: \(\) => applyEditorHistory\("undo"\)/);
  assert.match(app, /onRedo: \(\) => applyEditorHistory\("redo"\)/);
  assert.match(app, /bindHistoryShortcuts\(document, \{/);
  assert.doesNotMatch(html, /id="edit-save-status"|id="edit-save-button"/);
  assert.match(app, /contractText: "預設狀態：待處理；預設優先級：一般；ID 會獨立產生"/);
  assert.match(styles, /\.edit-save-bar\s*\{[\s\S]*position:\s*fixed/);
  assert.match(styles, /right:\s*max\(16px,\s*calc\(\(100% - 960px\) \/ 2\)\)/);
  assert.match(styles, /\.edit-save-button\s*\{[\s\S]*color:\s*#fff/);
  assert.match(styles, /\.edit-save-button\s*\{[\s\S]*background:\s*#245fcb/);
  assert.doesNotMatch(app, /inline-delete-button", "×"/);
  // Both dialogs now render through shared components; the Viewer keeps only
  // their mount points.
  const [themeControl, timeDialog] = await Promise.all([
    readFile(new URL("../experiments/editor-svelte-spike/src/ThemeControl.svelte", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/src/TimeDialog.svelte", import.meta.url), "utf8"),
  ]);
  assert.match(themeControl, /class="theme-close"[\s\S]*?<span aria-hidden="true">×<\/span>/);
  assert.match(timeDialog, /class="theme-close"[\s\S]*?<span aria-hidden="true">×<\/span>/);
  assert.match(styles, /\.theme-close\s*\{[\s\S]*display:\s*grid[\s\S]*place-items:\s*center/);
});

test("Viewer mode toggle stays centered at the viewport top", async () => {
  const [html, presentation] = await Promise.all([
    readFile(indexUrl, "utf8"),
    readFile(presentationUrl, "utf8"),
  ]);
  assert.match(modeToggle, /class="view-mode-toggle editor-mode-dock"/);
  assert.match(
    presentation,
    /\.editor-mode-dock\s*\{[\s\S]*?position:\s*fixed;[\s\S]*?top:\s*calc\(12px \+ env\(safe-area-inset-top, 0px\)\);[\s\S]*?left:\s*50%;[\s\S]*?transform:\s*translateX\(-50%\);/,
  );
  assert.match(presentation, /\.editor-mode-dock\s*\{[\s\S]*?z-index:\s*45;/);
});
