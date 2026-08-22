import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("standalone Editor build is retired while Viewer bundle verification remains", async () => {
  const [packageText, publishScript, workflowText, viteText] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../Publish.cmd", import.meta.url), "utf8"),
    readFile(new URL("../.github/workflows/notify-docs.yml", import.meta.url), "utf8"),
    readFile(new URL("../experiments/editor-svelte-spike/vite.config.js", import.meta.url), "utf8"),
  ]);
  const packageJson = JSON.parse(packageText);

  assert.equal(packageJson.scripts["editor:svelte:build"], undefined);
  assert.equal(packageJson.scripts["spike:svelte:build"], undefined);
  assert.doesNotMatch(publishScript, /BuildEditor|npm\.cmd/u);
  assert.match(publishScript, /dotnet publish/u);
  assert.doesNotMatch(viteText, /editor\.html|rollupOptions/u);
  for (const path of [
    "../BuildEditor.cmd",
    "../scripts/verify-editor-build.mjs",
    "../experiments/editor-svelte-spike/editor.html",
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
  // The committed bundle is a build product, so the dispatch must be gated on
  // rebuilding it and finding no difference — reporting staleness after the
  // deployment has gone out would not prevent shipping a stale UI.
  assert.match(workflowText, /npm run viewer:ui:build/u);
  assert.match(workflowText, /git diff --quiet -- viewer\/assets\/viewer-ui\.js/u);
  assert.match(workflowText, /needs: verify-bundle/u);
});
