import test from "node:test";
import assert from "node:assert/strict";
import { itemReference } from "../viewer/assets/item-reference.js";

test("item reference names scope, card and item by ID only", () => {
  assert.equal(
    itemReference({ scopeId: "yu5h1lib-web", taskId: "ui-workflow", item: { id: "ux-toggle-goal-1", title: "UX-WEB-25 [animation demo](http://127.0.0.1:8015/animation-lab/) 待你核 TG02" } }),
    "yu5h1lib-web › ui-workflow › ux-toggle-goal-1",
  );
});

test("items without a stable ID are not referenced", () => {
  assert.equal(itemReference({ scopeId: "s", taskId: "t", item: { id: "legacy-t-pending_items-0", title: "x", legacy: true } }), null);
  assert.equal(itemReference({ scopeId: "s", taskId: "t", item: { title: "x" } }), null);
  assert.equal(itemReference({ scopeId: null, taskId: "t", item: { id: "i", title: "x" } }), null);
});
