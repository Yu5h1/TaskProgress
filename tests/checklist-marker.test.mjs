// One marker per manual check, in the left marker column, and nothing clickable
// on Agent checks or derived work-item markers.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const app = await readFile(
  new URL("../experiments/editor-svelte-spike/src/ChecklistApp.svelte", import.meta.url),
  "utf8",
);
const styles = await readFile(
  new URL("../experiments/editor-svelte-spike/src/checklist-styles.css", import.meta.url),
  "utf8",
);
const markerBox = await readFile(
  new URL("../experiments/editor-svelte-spike/src/MarkerBox.svelte", import.meta.url),
  "utf8",
);
const shared = await readFile(
  new URL("../viewer/assets/styles.css", import.meta.url),
  "utf8",
);

const template = app.slice(app.indexOf("</script>"));
const checkHeading = template.slice(
  template.indexOf("checklist-check-heading"),
  template.indexOf("<dl>"),
);

test("the marker box is one component with three states", () => {
  // Interactive and read-only are the same box, not two implementations.
  assert.equal((markerBox.match(/marker-box/gu) ?? []).length > 1, true);
  assert.match(markerBox, /export let status = "pending";/u);
  assert.match(markerBox, /export let interactive = false;/u);
  assert.match(markerBox, /GLYPH = \{ pending: "", passed: "✓", failed: "!" \}/u);
  assert.match(markerBox, /\{#if interactive\}[\s\S]*<button/u);
  assert.match(markerBox, /\{:else\}[\s\S]*<span/u);
  // The square is the bracket: a bordered box, never a circle.
  assert.match(shared, /\.marker-box \{[^}]*border-radius: 5px;/u);
  assert.match(shared, /\.marker-box \{[^}]*border: 1\.5px solid/u);
  assert.doesNotMatch(shared, /\.marker-box \{[^}]*border-radius: 50%/u);
  assert.doesNotMatch(styles, /\.checklist-marker/u, "the checklist keeps no marker of its own");
});

test("a manual check has exactly one interactive marker", () => {
  const buttons = checkHeading.match(/<button/gu) ?? [];
  assert.equal(buttons.length, 0, "the marker is the shared component, not a local button");
  assert.match(checkHeading, /<MarkerBox[\s\S]*interactive=\{check\.isManual\}/u);
  assert.match(checkHeading, /onCycle=\{\(\) => cycleResult\(item\.id, check\)\}/u);
  assert.match(app, /type: "cycle-result"/u);
  assert.doesNotMatch(template, /checklist-result-controls/u);
  assert.doesNotMatch(styles, /checklist-result-controls/u);
});

test("Agent checks and work-item markers stay read-only", () => {
  // `interactive` is bound to isManual, so an Agent check gets the plain box.
  assert.match(checkHeading, /interactive=\{check\.isManual\}/u);
  const itemHeader = template.slice(
    template.indexOf("checklist-item-header"),
    template.indexOf("checklist-checks"),
  );
  assert.doesNotMatch(itemHeader, /<button|interactive/u, "a derived work-item marker is never clickable");
  assert.match(itemHeader, /<MarkerBox status=\{item\.status\}/u);
});

test("a failure draft exposes one inline Observed field", () => {
  const observed = template.slice(template.indexOf("{#if check.isManual && check.status === \"failed\"}"));
  assert.match(observed, /class="checklist-observed"/u);
  assert.equal((observed.match(/<textarea/gu) ?? []).length, 1);
  assert.match(observed, /type: "set-observed"/u);
  // The read-only Observed line steps aside for the editable field.
  assert.match(template, /\{#if check\.observed && !\(check\.isManual && check\.status === "failed"\)\}/u);
});

test("the marker box sits in the left marker column", () => {
  assert.match(styles, /\.checklist-check-heading \{[^}]*grid-template-columns: 22px minmax\(0, 1fr\) auto;/u);
  assert.match(styles, /\.checklist-item-header \{[^}]*grid-template-columns: 24px minmax\(0, 1fr\) auto;/u);
});

test("the Checklist uses the shared theme control and claims no scheme of its own", () => {
  assert.match(app, /import ThemeControl from "\.\/ThemeControl\.svelte"/u);
  assert.match(app, /createThemeControl/u);
  assert.match(app, /<ThemeControl[\s\S]*onModeChange=/u);
  assert.doesNotMatch(app, /localStorage/u, "storage stays in the shared theme adapter");
  assert.doesNotMatch(styles, /color-scheme:/u, "the saved preference decides the scheme");
});
