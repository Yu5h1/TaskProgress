import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { compile } from "svelte/compiler";

test("history tools compile with accessible controls and no compiler warnings", async () => {
  const source = await readFile(new URL("../experiments/editor-svelte-spike/src/HistoryTools.svelte", import.meta.url), "utf8");
  const compiled = compile(source, { name: "HistoryTools" });
  assert.deepEqual(compiled.warnings, []);
});

test("history theme fallbacks resolve to declared shared theme tokens", async () => {
  const source = await readFile(new URL("../experiments/editor-svelte-spike/src/HistoryTools.svelte", import.meta.url), "utf8");
  const theme = await readFile(new URL("../viewer/assets/styles.css", import.meta.url), "utf8");
  const declared = new Set([...theme.matchAll(/(--[\w-]+)\s*:/g)].map(match => match[1]));
  const referenced = [...source.matchAll(/var\((--[\w-]+)/g)].map(match => match[1]);
  for (const token of referenced.filter(token => !token.startsWith("--history-"))) {
    assert.ok(declared.has(token), `${token} must be provided by the shared theme`);
  }
});
