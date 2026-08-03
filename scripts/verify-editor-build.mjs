import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const buildRoot = fileURLToPath(
  new URL("../experiments/editor-svelte-spike/dist/", import.meta.url),
);

const htmlEntries = ["index.html", "editor.html"];
const referencedAssets = new Set();

for (const entry of htmlEntries) {
  const source = await readFile(new URL(entry, `file:///${buildRoot.replaceAll("\\", "/")}/`), "utf8");
  assert.doesNotMatch(source, /https?:\/\//iu, `${entry} must not load remote assets`);
  assert.doesNotMatch(source, /<(?:script|link)\b[^>]*(?:src|href)="\//iu, `${entry} must use relative assets`);
  if (entry === "editor.html") {
    assert.match(source, /name="robots" content="noindex, nofollow"/u);
  }
  for (const match of source.matchAll(/(?:src|href)="([^"#?]+)"/gu)) {
    if (!match[1].startsWith("./assets/")) continue;
    referencedAssets.add(match[1].slice(2));
  }
}

assert.ok(referencedAssets.size >= 3, "Editor build must reference JavaScript and CSS assets");
for (const asset of referencedAssets) {
  const path = new URL(asset, `file:///${buildRoot.replaceAll("\\", "/")}/`);
  const info = await stat(path);
  assert.equal(info.isFile(), true, `Missing Editor asset: ${asset}`);
}

const assetNames = await readdir(new URL("assets/", `file:///${buildRoot.replaceAll("\\", "/")}/`));
const JavaScriptSources = await Promise.all(
  assetNames
    .filter((name) => name.endsWith(".js"))
    .map((name) => readFile(new URL(`assets/${name}`, `file:///${buildRoot.replaceAll("\\", "/")}/`), "utf8")),
);
const bundledJavaScript = JavaScriptSources.join("\n");
assert.doesNotMatch(bundledJavaScript, /\beval\s*\(|\bnew\s+Function\s*\(/u);
assert.doesNotMatch(bundledJavaScript, /DOCS_DISPATCH_TOKEN|TASK_PROGRESS_HOME|taskprogress\.local\.json/u);
assert.doesNotMatch(bundledJavaScript, /[A-Za-z]:[\\/](?:Users|Projects|Dev)[\\/]/u);

console.log(
  `Editor build verified: ${htmlEntries.length} entries, ${referencedAssets.size} referenced assets.`,
);
