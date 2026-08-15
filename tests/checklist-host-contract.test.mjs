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

test("Checklist bridge is exact-file and allowlists load and save", () => {
  assert.match(bridge, /"load" => Load\(root\)/u);
  assert.match(bridge, /"save" => Save\(root\)/u);
  assert.match(bridge, /RejectUnknown\(payload, "save payload", "revision", "results"\)/u);
  assert.doesNotMatch(bridge, /LocalWebService|LauncherSettings|localhost/u);
});
