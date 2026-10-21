/**
 * TaskProgress host adapter for item selection: keys are item references
 * (`scope › task › item`), the order is the visible rows across all cards, and copying writes the
 * selected references one per line. The selection model and the input mapping stay generic so a
 * Web component can replace them later without changing this contract.
 */
import { createSelection } from "./selection-model.js";
import { isSelectionIgnoredTarget, keyCommand, pointerCommand } from "./selection-input.js";
import { copyText } from "./item-reference.js";

export const SELECT_KEY_ATTRIBUTE = "data-select-key";

export function createItemSelection({ root = globalThis.document, copy = copyText } = {}) {
  const selection = createSelection();

  function order() {
    return [...root.querySelectorAll(`[${SELECT_KEY_ATTRIBUTE}]`)].map(element => element.getAttribute(SELECT_KEY_ATTRIBUTE));
  }

  function focusRow(key) {
    if (!key) return;
    [...root.querySelectorAll(`[${SELECT_KEY_ATTRIBUTE}]`)]
      .find(element => element.getAttribute(SELECT_KEY_ATTRIBUTE) === key)
      ?.focus();
  }

  /** References to copy: the selection in display order, else the given row alone. */
  function references(key) {
    const selected = selection.ordered(order());
    return selected.length && (!key || selection.has(key)) ? selected : key ? [key] : [];
  }

  async function copyReferences(key) {
    const keys = references(key);
    if (!keys.length) return false;
    return await copy(keys.join("\n"));
  }

  return Object.freeze({
    subscribe: selection.subscribe,
    references,
    copyReferences,
    clear: () => selection.clear(),
    retain: () => selection.retain(order()),
    rowClick(key, event) {
      if (event.button !== 0 || isSelectionIgnoredTarget(event.target)) return;
      const command = pointerCommand(event);
      if (command === "extend") {
        event.preventDefault();
        selection.extendTo(key, order());
      } else if (command === "toggle") {
        selection.toggle(key);
      } else {
        selection.select(key);
      }
    },
    rowKeydown(key, event) {
      if (event.target !== event.currentTarget) return;
      const action = keyCommand(event);
      if (!action) return;
      event.preventDefault();
      if (action.command === "move") {
        selection.focusOn(key);
        focusRow(selection.moveFocus(action.delta, order(), { extend: action.extend }));
      } else if (action.command === "toggle") {
        selection.toggle(key);
      } else if (action.command === "clear") {
        selection.clear();
      } else if (action.command === "all") {
        selection.selectAll(order());
      } else if (action.command === "copy") {
        void copyReferences(key);
      }
    },
    /** Focus entering a row makes it the keyboard focus without changing the selection. */
    rowFocus(key) {
      selection.focusOn(key);
    },
  });
}
