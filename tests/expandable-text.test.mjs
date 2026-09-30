import test from "node:test";
import assert from "node:assert/strict";
import { expandableText } from "../viewer/assets/expandable-text.js";

function fixture(text = "a".repeat(60)) {
  const frames = new Map();
  let nextFrame = 0;
  let observer;
  class Element extends EventTarget {
    style = {};
    attributes = {};
    classList = { add() {}, remove() {} };
    children = [];
    clientWidth = 100;
    get scrollHeight() {
      if (!this.children.length) return 0;
      const [text, button] = this.children;
      return Math.ceil((Array.from(text.textContent ?? "").length + (button.hidden || button.style.position === "absolute" ? 0 : 5)) / (this.clientWidth / 5)) * 20;
    }
    getClientRects() { return this.clientWidth ? [{}] : []; }
    append(...children) { this.children.push(...children); }
    setAttribute(key, value) { this.attributes[key] = value; }
    remove() { this.removed = true; }
  }
  const fonts = new EventTarget();
  const host = new Element();
  host.ownerDocument = {
    fonts,
    createElement: () => new Element(),
    defaultView: {
      getComputedStyle: () => ({ lineHeight: "20px" }),
      requestAnimationFrame(callback) { frames.set(++nextFrame, callback); return nextFrame; },
      cancelAnimationFrame(id) { frames.delete(id); },
      ResizeObserver: class {
        constructor(callback) { this.callback = callback; observer = this; }
        observe() {}
        disconnect() { this.disconnected = true; }
      },
    },
  };
  const control = expandableText(host, { text });
  const [content] = host.children;
  const [textNode, button] = content.children;
  function flush() {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach(callback => callback());
  }
  return { control, content, textNode, button, observer, fonts, frames, flush };
}

test("inline truncation reserves control width, expands full text and resets on resize/update", () => {
  const text = "<b>plain</b>".repeat(6);
  const f = fixture(text);
  f.flush();
  assert.equal(f.textNode.textContent, text.slice(0, 35));
  assert.equal(f.button.hidden, false);
  assert.ok(f.content.scrollHeight <= 40);
  f.button.dispatchEvent(new Event("click"));
  f.flush();
  assert.equal(f.textNode.textContent, text);
  assert.equal(f.button.attributes["aria-expanded"], "true");
  f.control.update({ text });
  assert.equal(f.button.attributes["aria-expanded"], "true");
  f.content.clientWidth = 500;
  f.flush();
  assert.equal(f.button.hidden, true);
  assert.equal(f.button.attributes["aria-expanded"], "false");
  f.control.update({ text: "new" });
  f.flush();
  assert.equal(f.textNode.textContent, "new");
  assert.equal(f.button.hidden, true);
  f.control.destroy();
});
test("hidden reveal, resize/font notifications and disposal", () => {
  const f = fixture();
  f.content.clientWidth = 0;
  f.flush();
  assert.equal(f.button.hidden, true);
  f.content.clientWidth = 100;
  f.observer.callback();
  f.fonts.dispatchEvent(new Event("loadingdone"));
  assert.equal(f.frames.size, 1);
  f.flush();
  assert.equal(f.button.hidden, false);
  f.observer.callback();
  f.control.destroy();
  assert.equal(f.frames.size, 0);
  assert.equal(f.observer.disconnected, true);
  assert.equal(f.content.removed, true);
  assert.equal(f.button.attributes["aria-expanded"], "false");
  f.fonts.dispatchEvent(new Event("loadingdone"));
  f.observer.callback();
  assert.equal(f.frames.size, 0);
});
