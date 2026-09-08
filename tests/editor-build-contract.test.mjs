import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("standalone Editor is retired while every committed UI bundle is guarded", async () => {
  const [packageText, publishScript, workflowText] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../Publish.cmd", import.meta.url), "utf8"),
    readFile(new URL("../.github/workflows/notify-docs.yml", import.meta.url), "utf8"),
  ]);
  const packageJson = JSON.parse(packageText);

  assert.equal(packageJson.scripts["editor:svelte:build"], undefined);
  assert.equal(packageJson.scripts["spike:svelte:build"], undefined);
  assert.equal(packageJson.scripts["spike:svelte:dev"], undefined);
  assert.doesNotMatch(publishScript, /BuildEditor|npm\.cmd/u);
  assert.match(publishScript, /dotnet publish/u);
  for (const path of [
    "../BuildEditor.cmd",
    "../scripts/verify-editor-build.mjs",
    "../experiments/editor-svelte-spike/editor.html",
    "../experiments/editor-svelte-spike/index.html",
    "../experiments/editor-svelte-spike/vite.config.js",
    "../experiments/editor-svelte-spike/src/App.svelte",
    "../experiments/editor-svelte-spike/src/data-loader.js",
    "../experiments/editor-svelte-spike/src/fixture.js",
    "../experiments/editor-svelte-spike/src/main.js",
    "../experiments/editor-svelte-spike/src/styles.css",
    "../experiments/editor-svelte-spike/src/viewer-main.js",
  ]) {
    await assert.rejects(access(new URL(path, import.meta.url)));
  }
  // The bundle is built from sources outside viewer/, and the whole suite gates
  // the dispatch, so the job must run for every push. A path filter can only
  // name the paths someone remembered, and the ones that can turn this job red
  // are not the ones such a list would name — which is how a broken test once
  // landed green and blocked the dispatch two releases later.
  assert.doesNotMatch(workflowText, /^\s*paths:/mu);
  assert.doesNotMatch(workflowText, /BuildEditor|editor:svelte:build/u);
  // Committed bundles are build products, so the dispatch must be gated on
  // rebuilding every host surface and finding no difference.
  assert.match(workflowText, /npm run viewer:ui:build/u);
  assert.match(workflowText, /npm run checklist:ui:build/u);
  assert.match(workflowText, /npm run checklist:browser:build/u);
  assert.match(workflowText, /git diff --quiet -- "\$\{bundles\[@\]\}"/u);
  assert.match(workflowText, /src\/TaskProgress\.Cli\/checklist-ui\/checklist-ui\.js/u);
  assert.match(workflowText, /src\/TaskProgress\.Cli\/checklist-ui\/checklist-ui\.css/u);
  assert.match(workflowText, /viewer\/checklist\/checklist-ui\.js/u);
  assert.match(workflowText, /viewer\/checklist\/checklist-ui\.css/u);
  assert.match(workflowText, /needs: verify-bundle/u);
});
