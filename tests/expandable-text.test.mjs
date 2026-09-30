import test from "node:test";
import assert from "node:assert/strict";
import { expandableText } from "../viewer/assets/expandable-text.js";

function fixture(text = "long") {
  const frames = new Map();
  let nextFrame = 0;
  let observer;
  class Element extends EventTarget {
    style = {};
    attributes = {};
    classList = { add() {}, remove() {} };
    children = [];
    clientWidth = 100;
    scrollHeight = 60;
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
  const [content, button] = host.children;
  function flush() {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach(callback => callback());
  }
  return { control, content, button, observer, fonts, frames, flush };
}

test("overflow, expansion, updates and shrink reset without modifying input text", () => {
  const f = fixture("<b>plain</b>");
  f.flush();
  assert.equal(f.content.textContent, "<b>plain</b>");
  assert.equal(f.button.hidden, false);
  f.button.dispatchEvent(new Event("click"));
  assert.equal(f.button.attributes["aria-expanded"], "true");
  f.control.update({ text: "<b>plain</b>" });
  assert.equal(f.button.attributes["aria-expanded"], "true");
  f.content.scrollHeight = 40;
  f.flush();
  assert.equal(f.button.hidden, true);
  assert.equal(f.button.attributes["aria-expanded"], "false");
  f.control.update({ text: "new", lines: 3 });
  f.content.scrollHeight = 80;
  f.flush();
  assert.equal(f.button.hidden, false);
  assert.equal(f.content.style.webkitLineClamp, "3");
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
  assert.equal(f.button.removed, true);
  f.fonts.dispatchEvent(new Event("loadingdone"));
  f.observer.callback();
  assert.equal(f.frames.size, 0);
});
