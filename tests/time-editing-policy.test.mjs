import assert from "node:assert/strict";
import test from "node:test";

await import("../experiments/time-reference/demo/editing-policy.js");

const policy = globalThis.TimeEditingPolicy;

test("local file demos allow estimate editing", () => {
  assert.equal(
    policy.canEditFromLocation({ protocol: "file:", hostname: "" }),
    true,
  );
  assert.equal(
    policy.canEditFromLocation({ protocol: "file:", hostname: "shared-server" }),
    false,
  );
});

test("loopback HTTP and HTTPS allow estimate editing", () => {
  assert.equal(
    policy.canEditFromLocation({ protocol: "http:", hostname: "localhost" }),
    true,
  );
  assert.equal(
    policy.canEditFromLocation({ protocol: "https:", hostname: "127.0.0.1" }),
    true,
  );
  assert.equal(
    policy.canEditFromLocation({ protocol: "http:", hostname: "[::1]" }),
    true,
  );
});

test("non-local and lookalike hosts remain read-only", () => {
  assert.equal(
    policy.canEditFromLocation({ protocol: "https:", hostname: "taskprogress.example" }),
    false,
  );
  assert.equal(
    policy.canEditFromLocation({ protocol: "https:", hostname: "localhost.example" }),
    false,
  );
  assert.equal(
    policy.canEditFromLocation({ protocol: "data:", hostname: "" }),
    false,
  );
});
