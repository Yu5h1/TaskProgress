import test from "node:test";
import assert from "node:assert/strict";
import { isCardVisible, chooseVisibility } from "../viewer/assets/card-visibility.js";
import { moveVisibleCard } from "../viewer/assets/card-order.js";

test("disabled shows all; enabled applies hidden IDs; recovery reveals without clearing", () => {
  const hidden = [2];
  assert.equal(isCardVisible(2, "disabled", hidden), true);
  assert.equal(isCardVisible(2, "enabled", hidden), false);
  assert.equal(isCardVisible(1, "enabled", hidden), true);
  assert.equal(isCardVisible(2, "disabled", hidden), true);
  assert.deepEqual(hidden, [2]);
});
test("reordering visible cards preserves visibility-hidden slots", () => {
  const ids = [1, 2, 3];
  const visible = ids.filter(id => isCardVisible(id, "enabled", [2]));
  assert.deepEqual(moveVisibleCard(ids, null, visible, 3, 1, false), [3, 2, 1]);
});

test("close all preserves per-card state; reset clears it and returns to enabled", () => {
  const hidden = [2];
  assert.deepEqual(chooseVisibility("enabled", hidden, "closed"), { mode: "closed", hiddenIds: hidden });
  assert.equal(isCardVisible(1, "closed", hidden), false);
  assert.equal(isCardVisible(2, "closed", hidden), false);
  assert.deepEqual(chooseVisibility("closed", hidden, "reset"), { mode: "enabled", hiddenIds: [] });
  assert.deepEqual(hidden, [2]);
});
