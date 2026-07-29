import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const indexUrl = new URL("../viewer/index.html", import.meta.url);
const appUrl = new URL("../viewer/assets/app.js", import.meta.url);
const styleUrl = new URL("../viewer/assets/styles.css", import.meta.url);

test("production Viewer keeps local editing hidden until the host grants capability", async () => {
  const [html, app] = await Promise.all([
    readFile(indexUrl, "utf8"),
    readFile(appUrl, "utf8"),
  ]);
  assert.match(html, /id="view-mode-toggle"[\s\S]*?aria-pressed="false"[\s\S]*?hidden/);
  assert.match(html, /id="edit-save-bar"[^>]*hidden/);
  assert.match(app, /\/__taskprogress\/v1\/capabilities\//);
  assert.match(app, /if \(!response\.ok\) return;/);
  assert.match(app, /Public\/static hosting intentionally has no editor capability/);
});

test("local editor uses a memory-only session, revision precondition, and explicit save", async () => {
  const app = await readFile(appUrl, "utf8");
  assert.match(app, /createReportEditorSession\(state\.persistedReport/);
  assert.match(app, /state\.editor\.session\.dispatch\(command\)/);
  assert.match(app, /state\.editor\.session\.prepareSave\(/);
  assert.match(app, /X-TaskProgress-Editor/);
  assert.match(app, /Authorization: `Bearer \$\{state\.editor\.token\}`/);
  assert.match(app, /"If-Match": `"\$\{state\.editor\.revision\}"`/);
  assert.match(app, /window\.location\.reload\(\)/);
  assert.doesNotMatch(app, /state\.report\.tasks\.(?:push|splice)\(/);
  assert.doesNotMatch(app, /editableTask\.(?:title|summary|status|priority)\s*=/);
  assert.doesNotMatch(app, /localStorage\.setItem\([^)]*token/i);
  assert.match(app, /viewModeToggle\.addEventListener\("click"/);
});

test("editing exposes global task and child controls with a panel-aligned save bar", async () => {
  const [html, app, styles] = await Promise.all([
    readFile(indexUrl, "utf8"),
    readFile(appUrl, "utf8"),
    readFile(styleUrl, "utf8"),
  ]);
  assert.match(app, /增加工作項目/);
  assert.match(app, /增加待處理子任務/);
  assert.match(app, /任務描述（必填）/);
  assert.match(styles, /\.edit-save-bar\s*\{[\s\S]*position:\s*fixed/);
  assert.match(styles, /right:\s*max\(16px,\s*calc\(\(100% - 960px\) \/ 2\)\)/);
  assert.match(styles, /\.edit-save-button\s*\{[\s\S]*color:\s*#fff/);
  assert.match(styles, /\.edit-save-button\s*\{[\s\S]*background:\s*#245fcb/);
  assert.doesNotMatch(app, /inline-delete-button", "×"/);
  assert.match(html, /class="theme-close"[\s\S]*?<span aria-hidden="true">×<\/span>/);
  assert.match(styles, /\.theme-close\s*\{[\s\S]*display:\s*grid[\s\S]*place-items:\s*center/);
});
