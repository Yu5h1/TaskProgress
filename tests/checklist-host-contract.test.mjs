// Verifies the pinned WebView2 dependency and the no-localhost Checklist host boundary.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const project = readFileSync(
  new URL("../src/TaskProgress.Cli/TaskProgress.Cli.csproj", import.meta.url),
  "utf8",
);
const lock = JSON.parse(
  readFileSync(
    new URL("../src/TaskProgress.Cli/packages.lock.json", import.meta.url),
    "utf8",
  ),
);
const command = readFileSync(
  new URL("../src/TaskProgress.Cli/ChecklistCommand.cs", import.meta.url),
  "utf8",
);
const host = readFileSync(
  new URL("../src/TaskProgress.Cli/ChecklistDesktopHost.cs", import.meta.url),
  "utf8",
);
const errorDialog = readFileSync(
  new URL("../src/TaskProgress.Cli/ChecklistErrorDialog.cs", import.meta.url),
  "utf8",
);
const bridge = readFileSync(
  new URL("../src/TaskProgress.Cli/ChecklistBridge.cs", import.meta.url),
  "utf8",
);

test("WebView2 is exact-pinned with a content hash", () => {
  assert.match(project, /<UseWPF>true<\/UseWPF>/u);
  assert.match(
    project,
    /<PackageReference Include="Microsoft\.Web\.WebView2" Version="\[1\.0\.4078\.44\]" \/>/u,
  );
  const dependency = lock.dependencies["net9.0-windows7.0"]["Microsoft.Web.WebView2"];
  assert.equal(dependency.requested, "[1.0.4078.44, 1.0.4078.44]");
  assert.equal(dependency.resolved, "1.0.4078.44");
  assert.ok(dependency.contentHash.length > 20);
});

test("Checklist command stays outside LocalWebService", () => {
  for (const source of [command, host]) {
    assert.doesNotMatch(source, /LocalWebService|LauncherSettings|localhost|127\.0\.0\.1/u);
  }
  assert.match(command, /ChecklistDocumentStore/u);
  assert.match(host, /WebView2RuntimeNotFoundException/u);
  assert.match(host, /SetApartmentState\(ApartmentState\.STA\)/u);
});

test("Checklist host keeps a stable per-user WebView profile", () => {
  // The persistence-mode preference lives in this profile's storage, so it must
  // not follow the working directory or the published location.
  assert.match(host, /ResolveUserProfileDirectory\(\)/u);
  assert.match(host, /Environment\.SpecialFolder\.LocalApplicationData/u);
  assert.match(host, /userDataFolder: profileDirectory/u);
  assert.match(host, /EnsureCoreWebView2Async\(webViewEnvironment\)/u);
});

test("Checklist bridge is exact-file and allowlists load and save", () => {
  assert.match(bridge, /"load" => Load\(root\)/u);
  assert.match(bridge, /"save" => Save\(root\)/u);
  assert.match(bridge, /RejectUnknown\(payload, "save payload", "revision", "results"\)/u);
  assert.doesNotMatch(bridge, /LocalWebService|LauncherSettings|localhost/u);
});

test("a Checklist failure reaches the reader instead of an empty exit", () => {
  // The document is parsed before the window opens, and the command is normally
  // launched from a shortcut with no console, so stderr alone is invisible.
  assert.match(command, /reportError\(error\.Message\)/u);
  assert.match(command, /Console\.Error\.WriteLine/u, "a console run still prints");
  assert.match(command, /ChecklistErrorDialog\.Show/u);
  assert.match(errorDialog, /MessageBox\.Show/u);
  assert.match(errorDialog, /SetApartmentState\(ApartmentState\.STA\)/u);
  // The dialog is its own file so it carries no WebView2 dependency.
  assert.doesNotMatch(errorDialog, /WebView2/u);
});
