import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const indexUrl = new URL("../viewer/index.html", import.meta.url);
const appUrl = new URL("../viewer/assets/app.js", import.meta.url);
const styleUrl = new URL("../viewer/assets/styles.css", import.meta.url);
const presentationUrl = new URL("../viewer/assets/editor-presentation.css", import.meta.url);

test("production Viewer keeps local editing hidden until the host grants capability", async () => {
  const [html, app] = await Promise.all([
    readFile(indexUrl, "utf8"),
    readFile(appUrl, "utf8"),
  ]);
  assert.match(html, /id="view-mode-toggle"[\s\S]*?aria-pressed="false"[\s\S]*?hidden/);
  assert.match(html, /id="edit-save-bar"[^>]*hidden/);
  assert.match(app, /\/__taskprogress\/v1\/capabilities\//);
  assert.match(app, /if \(!response\.ok\) return;/);
  assert.match(app, /capability\.editor_surface_url/);
  assert.match(app, /surfaceUrl\.pathname\.startsWith\("\/__taskprogress\/v1\/editor\/"\)/);
  assert.match(html, /id="editor-surface-overlay"[\s\S]*?id="editor-surface-frame"/);
  assert.match(app, /editorUrl\.searchParams\.set\("embedded", "1"\)/);
  assert.match(app, /elements\.editorSurfaceFrame\.src = editorUrl\.href/);
  assert.match(app, /event\.data\?\.type !== "taskprogress:editor-close"/);
  assert.doesNotMatch(app, /window\.location\.assign\(editorUrl\.href\)/);
  assert.match(app, /Public\/static hosting intentionally has no editor capability/);
});

test("local editor uses a memory-only session, revision precondition, and explicit save", async () => {
  const app = await readFile(appUrl, "utf8");
  assert.match(app, /createReportEditorSession\(state\.persistedReport/);
  assert.match(app, /state\.editor\.session\.dispatch\(command\)/);
  assert.match(app, /state\.editor\.session\.prepareSave\(/);
  assert.match(app, /state\.editor\.session\.derived\.progress\.project/);
  assert.match(app, /state\.editor\.session\.validate\(reportToSave\)/);
  assert.match(app, /X-TaskProgress-Editor/);
  assert.match(app, /Authorization: `Bearer \$\{state\.editor\.token\}`/);
  assert.match(app, /"If-Match": `"\$\{state\.editor\.revision\}"`/);
  assert.match(app, /window\.location\.reload\(\)/);
  assert.doesNotMatch(app, /state\.report\.tasks\.(?:push|splice)\(/);
  assert.doesNotMatch(app, /editableTask\.(?:title|summary|status|priority)\s*=/);
  assert.doesNotMatch(app, /localStorage\.setItem\([^)]*token/i);
  assert.match(app, /createModeController\(elements\.viewModeToggle/);
  assert.match(app, /onRequest: \(mode\) => \(mode === "edit" \? startEditing\(\) : cancelEditing\(\)\)/);
  assert.doesNotMatch(app, /viewModeToggle\.addEventListener\("click"/);
});

test("editing exposes global task and child controls with a panel-aligned save bar", async () => {
  const [html, app, styles] = await Promise.all([
    readFile(indexUrl, "utf8"),
    readFile(appUrl, "utf8"),
    readFile(styleUrl, "utf8"),
  ]);
  assert.match(app, /增加工作項目/);
  assert.match(app, /增加待處理子任務/);
  assert.match(app, /createAddControl\(elements\.taskAddShell/);
  assert.match(app, /saveBarControl = createSaveBar\(elements\.editSaveBar/);
  assert.match(app, /statusId: "edit-save-status"/);
  assert.match(app, /buttonId: "edit-save-button"/);
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
  assert.match(html, /class="theme-close"[\s\S]*?<span aria-hidden="true">×<\/span>/);
  assert.match(styles, /\.theme-close\s*\{[\s\S]*display:\s*grid[\s\S]*place-items:\s*center/);
});

test("Viewer mode toggle stays centered at the viewport top", async () => {
  const [html, presentation] = await Promise.all([
    readFile(indexUrl, "utf8"),
    readFile(presentationUrl, "utf8"),
  ]);
  assert.match(html, /class="view-mode-toggle editor-mode-dock"/);
  assert.match(
    presentation,
    /\.editor-mode-dock\s*\{[\s\S]*?position:\s*fixed;[\s\S]*?top:\s*calc\(12px \+ env\(safe-area-inset-top, 0px\)\);[\s\S]*?left:\s*50%;[\s\S]*?transform:\s*translateX\(-50%\);/,
  );
  assert.match(presentation, /\.editor-mode-dock\s*\{[\s\S]*?z-index:\s*45;/);
});
