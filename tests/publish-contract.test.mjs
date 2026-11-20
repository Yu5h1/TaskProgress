import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const project = readFileSync(
  new URL("../src/TaskProgress.Cli/TaskProgress.Cli.csproj", import.meta.url),
  "utf8",
);
const publish = readFileSync(new URL("../Publish.cmd", import.meta.url), "utf8");
const initialize = readFileSync(new URL("../Initialize.cmd", import.meta.url), "utf8");
const profile = readFileSync(
  new URL("../src/TaskProgress.Cli/Properties/PublishProfiles/WinX64.pubxml", import.meta.url),
  "utf8",
);

test("normal builds do not inherit publish-only runtime settings", () => {
  for (const property of [
    "RuntimeIdentifier",
    "SelfContained",
    "PublishSingleFile",
    "PublishTrimmed",
    "EnableCompressionInSingleFile",
    "IncludeNativeLibrariesForSelfExtract",
    "IncludeAllContentForSelfExtract",
  ]) {
    assert.doesNotMatch(project, new RegExp(`<${property}>`, "u"));
  }
});

test("initialization and publishing share the Windows single-file profile", () => {
  for (const [property, value] of Object.entries({
    RuntimeIdentifier: "win-x64",
    SelfContained: "true",
    PublishSingleFile: "true",
    PublishTrimmed: "false",
    EnableCompressionInSingleFile: "true",
    IncludeNativeLibrariesForSelfExtract: "true",
    IncludeAllContentForSelfExtract: "true",
  })) {
    assert.ok(profile.includes(`<${property}>${value}</${property}>`), `Missing ${property}=${value}`);
  }
  assert.match(initialize, /dotnet build .* -p:PublishProfile=WinX64/u);
  assert.match(publish, /dotnet publish .* -p:PublishProfile=WinX64 --no-restore/u);
  assert.match(initialize, /call npm\.cmd run ui:build/u);
  assert.doesNotMatch(publish, /\bnpm\b|RestoreConfigFile/u);
});
