import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("local Svelte Editor build is reproducible and excluded from Pages", async () => {
  const [packageText, buildScript, publishScript, ignoreText, workflowText, verifierText] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../BuildEditor.cmd", import.meta.url), "utf8"),
    readFile(new URL("../Publish.cmd", import.meta.url), "utf8"),
    readFile(new URL("../.gitignore", import.meta.url), "utf8"),
    readFile(new URL("../.github/workflows/notify-docs.yml", import.meta.url), "utf8"),
    readFile(new URL("../scripts/verify-editor-build.mjs", import.meta.url), "utf8"),
  ]);
  const packageJson = JSON.parse(packageText);

  assert.match(packageJson.scripts["editor:svelte:build"], /vite build/u);
  assert.match(packageJson.scripts["editor:svelte:build"], /verify-editor-build\.mjs/u);
  assert.match(buildScript, /npm\.cmd ci --no-audit --no-fund/u);
  assert.match(buildScript, /TASK_PROGRESS_SKIP_NPM_CI/u);
  assert.match(buildScript, /run editor:svelte:build/u);
  assert.match(buildScript, /dist\\editor\.html/u);
  assert.ok(
    publishScript.indexOf("BuildEditor.cmd") < publishScript.indexOf("dotnet publish"),
    "Publish.cmd must verify Editor assets before publishing the Launcher",
  );
  assert.match(ignoreText, /^experiments\/editor-svelte-spike\/dist\/$/mu);
  assert.match(workflowText, /- viewer\/\*\*/u);
  assert.doesNotMatch(workflowText, /editor-svelte-spike|BuildEditor/u);
  assert.match(verifierText, /must not load remote assets/u);
  assert.match(verifierText, /must use relative assets/u);
  assert.match(verifierText, /DOCS_DISPATCH_TOKEN/u);
  assert.match(verifierText, /taskprogress\\\.local\\\.json/u);
});
