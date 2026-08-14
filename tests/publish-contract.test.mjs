import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const project = readFileSync(
  new URL("../src/TaskProgress.Cli/TaskProgress.Cli.csproj", import.meta.url),
  "utf8",
);
const publish = readFileSync(new URL("../Publish.cmd", import.meta.url), "utf8");

test("normal builds do not inherit publish-only runtime settings", () => {
  for (const property of [
    "RuntimeIdentifier",
    "SelfContained",
    "PublishSingleFile",
    "PublishTrimmed",
    "EnableCompressionInSingleFile",
    "IncludeNativeLibrariesForSelfExtract",
  ]) {
    assert.doesNotMatch(project, new RegExp(`<${property}>`, "u"));
  }
});

test("Publish.cmd owns the complete single-file contract", () => {
  for (const argument of [
    "-r win-x64",
    "--self-contained true",
    "-p:PublishSingleFile=true",
    "-p:PublishTrimmed=false",
    "-p:EnableCompressionInSingleFile=true",
    "-p:IncludeNativeLibrariesForSelfExtract=true",
  ]) {
    assert.ok(publish.includes(argument), `Publish.cmd is missing ${argument}`);
  }
});
