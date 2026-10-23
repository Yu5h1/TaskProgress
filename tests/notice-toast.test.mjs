// The action notice carries one icon for its tone and replaces, never stacks,
// both the icon and the message.
import test from "node:test";
import assert from "node:assert/strict";

import { createNoticeToast } from "../viewer/assets/notice-toast.js";

function fakeElement(tagName) {
  const attributes = new Map();
  const classes = new Set();
  return {
    tagName,
    children: [],
    dataset: {},
    hidden: false,
    textContent: "",
    offsetWidth: 0,
    set className(value) { classes.clear(); value.split(/\s+/u).filter(Boolean).forEach((name) => classes.add(name)); },
    get className() { return [...classes].join(" "); },
    classList: { add: (name) => classes.add(name), remove: (name) => classes.delete(name) },
    setAttribute(name, value) { attributes.set(name, String(value)); },
    getAttribute(name) { return attributes.get(name) ?? null; },
    append(...nodes) { this.children.push(...nodes); },
    replaceChildren(...nodes) { this.children = [...nodes]; },
    addEventListener() {},
  };
}

function fakeDocument() {
  const body = fakeElement("body");
  return {
    body,
    createElement: (tag) => fakeElement(tag),
    createElementNS: (_ns, tag) => fakeElement(tag),
  };
}

const silent = { error() {}, warn() {}, info() {} };

function iconOf(document) {
  const host = document.body.children[0];
  const [slot] = host.children;
  assert.equal(slot.children.length, 1, "one icon at a time");
  const [svg] = slot.children;
  const [shape, glyph] = svg.children;
  return { host, shape: shape.tagName, glyph: glyph.getAttribute("d") };
}

test("each tone shows its own icon: ? info, ! warning in a triangle, x error", () => {
  const document = fakeDocument();
  const toast = createNoticeToast(document, { logger: silent });
  const seen = {};
  for (const level of ["info", "warning", "error"]) {
    toast.show({ level, message: level });
    const { host, shape, glyph } = iconOf(document);
    assert.equal(host.dataset.level, level);
    seen[level] = { shape, glyph };
  }
  assert.equal(seen.info.shape, "circle");
  assert.equal(seen.warning.shape, "path");
  assert.equal(seen.error.shape, "circle");
  assert.equal(new Set(Object.values(seen).map((icon) => icon.glyph)).size, 3, "three different glyphs");
  assert.equal(document.body.children.length, 1, "the notice host is reused");
});

test("an unknown level falls back to the error icon", () => {
  const document = fakeDocument();
  const toast = createNoticeToast(document, { logger: silent });
  toast.show({ level: "error", message: "a" });
  const error = iconOf(document).glyph;
  toast.show({ level: "surprise", message: "b" });
  assert.equal(iconOf(document).glyph, error);
});
