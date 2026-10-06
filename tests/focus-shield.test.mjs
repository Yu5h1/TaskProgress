// Activation is consumed even when focus returns before the first pointer event.
import test from "node:test";
import assert from "node:assert/strict";
import { installFocusShield } from "../viewer/assets/focus-shield.js";
function fixture(cache = new Map()) {
  const win = new EventTarget(), doc = new EventTarget();
  let focused = true, blocked;
  doc.visibilityState = "visible";
  doc.hasFocus = () => focused;
  const storage = { getItem:k=>cache.get(k), setItem:(k,v)=>cache.set(k,v), removeItem:k=>cache.delete(k) };
  const dispose = installFocusShield({ windowTarget:win, documentTarget:doc, storage, key:"test", onChange:v=>blocked=v });
  function event(type, fields = {}) {
    const e = new Event(type,{cancelable:true}); Object.assign(e, fields); win.dispatchEvent(e); return e.defaultPrevented;
  }
  return {cache, win, doc, dispose, event, blocked:()=>blocked, focus:v=>focused=v};
}
test("blur shields writes and consumes a returning click, next click works",()=>{
  const f=fixture(); assert.equal(f.blocked(),false);
  let saves=0;
  f.win.addEventListener("click",()=>saves++);
  f.focus(false); f.event("blur"); assert.equal(f.blocked(),true);
  assert.equal(f.event("input"),true);
  f.focus(true); f.event("focus"); assert.equal(f.blocked(),true);
  assert.equal(f.event("pointerdown",{button:0}),true);
  assert.equal(f.event("pointerup",{button:0}),true);
  assert.equal(f.event("click",{button:0}),true);
  assert.equal(saves,0);
  assert.equal(f.blocked(),false);
  assert.equal(f.event("click",{button:0}),false);
  assert.equal(saves,1);
  f.dispose();
});
test("keyboard activation is consumed through keyup, hidden clicks cannot unlock",()=>{
  const f=fixture(); f.doc.visibilityState="hidden"; f.doc.dispatchEvent(new Event("visibilitychange"));
  f.event("click",{button:0}); assert.equal(f.blocked(),true);
  f.doc.visibilityState="visible";
  assert.equal(f.event("keydown",{key:"a"}),true); assert.equal(f.blocked(),true);
  assert.equal(f.event("keydown",{key:"Enter"}),true); assert.equal(f.blocked(),true);
  assert.equal(f.event("keyup",{key:"Enter"}),true); assert.equal(f.blocked(),false);
  f.dispose();
});
test("foreground reload keeps shield armed; disposal removes listeners",()=>{
  const f=fixture(); f.event("blur"); f.dispose();
  const next=fixture(f.cache); assert.equal(next.blocked(),true);
  next.event("click",{button:0}); assert.equal(next.blocked(),false);
  next.dispose(); assert.equal(next.event("blur"),false); assert.equal(next.blocked(),false);
});
