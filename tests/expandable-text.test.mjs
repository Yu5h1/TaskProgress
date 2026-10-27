import test from "node:test";
import assert from "node:assert/strict";
import { expandableText } from "../viewer/assets/expandable-text.js";
import { inlineLinks, inlineUnits, parseInlineLinks } from "../viewer/assets/inline-links.js";

function fixture(text = "a".repeat(60)) {
  const frames = new Map();
  let nextFrame = 0;
  let observer;
  class Element extends EventTarget {
    style = {};
    attributes = {};
    classList = { add() {}, remove() {} };
    children = [];
    width = 100;
    get clientWidth() { return this.style.width ? parseFloat(this.style.width) : this.width; }
    set clientWidth(value) { this.width = value; }
    get textContent() { return this.children.length ? this.children.map(child => child.textContent).join("") : this.text ?? ""; }
    set textContent(value) { this.children = []; this.text = value; }
    get visibleText() { return this.hidden ? "" : this.children.length ? this.children.map(child => child.visibleText).join("") : this.text ?? ""; }
    get scrollHeight() {
      if (!this.children.length) return 0;
      const [text, button] = this.children;
      return Math.ceil((Array.from(text.visibleText ?? "").length + (button.hidden || button.style.position === "absolute" ? 0 : 5)) / (this.clientWidth / 5)) * 20;
    }
    getClientRects() { return this.clientWidth ? [{}] : []; }
    append(...children) { this.children.push(...children); }
    replaceChildren(...children) { this.children = children; }
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
  return { control, content, textNode, button, observer, fonts, frames, flush, document: host.ownerDocument };
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
  f.observer.callback();
  f.flush();
  assert.equal(f.button.hidden, true);
  assert.equal(f.button.attributes["aria-expanded"], "false");
  f.control.update({ text: "new" });
  f.flush();
  assert.equal(f.textNode.textContent, "new");
  assert.equal(f.button.hidden, true);
  f.control.destroy();
});

test("inline labels navigate to safe URLs while markup and unsafe schemes stay literal", () => {
  assert.deepEqual(parseInlineLinks("待決策 [前往](/decisions/?scope=ux&task=ux-foundation) 然後 [檢查](https://example.com/a(b)#c)"), [
    {text:"待決策 "}, {text:"前往",href:"/decisions/?scope=ux&task=ux-foundation"},
    {text:" 然後 "}, {text:"檢查",href:"https://example.com/a(b)#c"}
  ]);
  for (const value of ["[x](javascript:alert(1))", "[x](data:text/html,test)", "[x](file:///C:/test)", "![x](https://example.com)", "<a href='x'>raw</a>", "[x](java\tscript:foo)"]) {
    assert.deepEqual(parseInlineLinks(value), [{text:value}]);
  }
  assert.deepEqual(inlineUnits("👨‍👩‍👧‍👦[前往](#task)").map(part => part.units), [["👨‍👩‍👧‍👦"], ["前往"]]);
});

test("links remain atomic across truncation and anchors survive identical updates", () => {
  const f = fixture("a".repeat(34) + "[前往](/checklist/?scope=ux&task=x)" + "b".repeat(40));
  f.flush();
  const link = f.textNode.children[1];
  assert.equal(link.attributes.href, "/checklist/?scope=ux&task=x");
  assert.equal(link.hidden, true);
  assert.equal(f.textNode.visibleText, "a".repeat(34));
  f.button.dispatchEvent(new Event("click")); f.flush();
  assert.equal(link.hidden, false);
  f.control.update({text:"a".repeat(34) + "[前往](/checklist/?scope=ux&task=x)" + "b".repeat(40)});
  assert.equal(f.textNode.children[1], link);
  f.content.clientWidth = 50; f.observer.callback(); f.flush();
  assert.equal(link.hidden, false);
  f.control.destroy();
});

test("resizing preserves a focused link even when it no longer fits the collapsed prefix", () => {
  const f = fixture("a[前往](/decisions/?scope=ux&task=x)" + "b".repeat(60));
  f.flush();
  const link = f.textNode.children[1];
  assert.equal(link.hidden, false);
  f.document.activeElement = link;
  f.content.clientWidth = 5; f.observer.callback(); f.flush();
  assert.equal(link.hidden, false);
  assert.equal(f.document.activeElement, link);
  assert.equal(f.button.attributes["aria-expanded"], "true");
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

test("an expanded request opens on load and when it turns on, but never re-collapses the reader", () => {
  const f = fixture();
  f.control.update({ text: "a".repeat(60), expanded: true });
  f.flush();
  assert.equal(f.button.attributes["aria-expanded"], "true");
  assert.equal(f.textNode.textContent, "a".repeat(60));
  f.button.dispatchEvent(new Event("click")); f.flush();
  assert.equal(f.button.attributes["aria-expanded"], "false");
  f.control.update({ text: "a".repeat(60), expanded: true }); f.flush();
  assert.equal(f.button.attributes["aria-expanded"], "false");
  f.control.update({ text: "a".repeat(60), expanded: false }); f.flush();
  f.control.update({ text: "a".repeat(60), expanded: true }); f.flush();
  assert.equal(f.button.attributes["aria-expanded"], "true");
  f.control.update({ text: "a".repeat(60), expanded: false }); f.flush();
  assert.equal(f.button.attributes["aria-expanded"], "true");
  f.control.destroy();
});

test("every surface renders links through one element shape, bold only with emphasis", () => {
  const text = "a".repeat(10) + "[前往](https://example.com/x)";
  const plain = fixture(text);
  const strong = fixture("");
  strong.control.update({ text, emphasis: true });
  assert.equal(plain.textNode.children[1].className, "inline-link");
  assert.equal(strong.textNode.children[1].className, "inline-link inline-link--emphasis");
  assert.equal(strong.textNode.children[1].attributes.rel, "noopener noreferrer");

  const children = [];
  const host = {
    ownerDocument: {
      createElement: () => ({ attributes: {}, setAttribute(key, value) { this.attributes[key] = value; } }),
      createTextNode: (value) => ({ text: value }),
    },
    replaceChildren(...nodes) { children.splice(0, children.length, ...nodes); },
  };
  const action = inlineLinks(host, { text: "看 [文件](https://example.com/d) 結尾" });
  assert.deepEqual(children.map(node => node.text ?? node.className), ["看 ", "inline-link", " 結尾"]);
  const originalLink = children[1];
  action.update({ text: "看 [文件](https://example.com/d) 結尾" });
  assert.equal(children[1], originalLink, 'an unchanged update preserves the focused link node');
  action.update({ text: "看 [文件](https://example.com/d) 結尾", emphasis: true });
  assert.equal(children[1].className, "inline-link inline-link--emphasis");
  action.destroy();
  assert.equal(children.length, 0);
});

test("identical updates do not rewrite disclosure or queue layout; resize and option changes still work", () => {
  const text = "a".repeat(60);
  const f = fixture(text);
  f.flush();
  f.button.dispatchEvent(new Event("click")); f.flush();
  const nodes = [...f.textNode.children];
  f.control.update({ text });
  assert.equal(f.frames.size, 0);
  assert.deepEqual(f.textNode.children, nodes);
  assert.equal(f.button.attributes['aria-expanded'], 'true');
  f.control.update({ text, lessLabel: 'Close' });
  assert.equal(f.frames.size, 1);
  assert.equal(f.button.textContent, 'Close');
  f.flush();
  f.content.clientWidth = 1000; f.observer.callback(); f.flush();
  assert.equal(f.button.hidden, true);
  f.control.destroy();
});
