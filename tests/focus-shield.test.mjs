import test from "node:test";
import assert from "node:assert/strict";
import { installFocusShield } from "../viewer/assets/focus-shield.js";
function fixture(initialFocus = true) {
  const win = new EventTarget(), doc = new EventTarget();
  let focused = initialFocus, time = 0;
  doc.visibilityState = "visible"; doc.hasFocus = () => focused;
  const dispose = installFocusShield({windowTarget:win, documentTarget:doc, now:()=>time});
  const event = (type, fields={}) => {
    const e=new Event(type,{cancelable:true}); Object.assign(e,fields); win.dispatchEvent(e); return e.defaultPrevented;
  };
  const click = () => [event("pointerdown",{pointerType:"mouse"}),event("mousedown"),event("pointerup",{pointerType:"mouse"}),event("mouseup"),event("click",{detail:1})];
  return {win,doc,event,click,dispose,advance:ms=>time+=ms,leave:()=>{focused=false;event("blur");},enter:()=>{focused=true;event("focus");}};
}
test("focus-first activation consumes one mouse sequence, following click works",()=>{
  const f=fixture(); f.leave(); f.enter();
  assert.deepEqual(f.click(),[true,true,true,true,true]);
  assert.deepEqual(f.click(),[false,false,false,false,false]); f.dispose();
});
test("pointer-first activation stays blocked even during a long press",()=>{
  const f=fixture(); f.leave(); assert.equal(f.event("pointerdown",{pointerType:"mouse"}),true);
  f.enter(); f.advance(1000); assert.equal(f.event("mousedown"),true);
  assert.equal(f.event("mouseup"),true); assert.equal(f.event("click",{detail:1}),true);
  assert.deepEqual(f.click(),[false,false,false,false,false]); f.dispose();
});
test("Alt-Tab return needs no unlocking; keyboard and later mouse work",()=>{
  const f=fixture(); f.leave(); f.enter();
  for (const type of ["keydown","keyup","beforeinput","input","change","submit"]) assert.equal(f.event(type,{key:"a"}),false);
  assert.deepEqual(f.click(),[false,false,false,false,false]); f.dispose();
});
test("focus window expires without swallowing the next click",()=>{
  const f=fixture(); f.leave(); f.enter(); f.advance(101);
  assert.deepEqual(f.click(),[false,false,false,false,false]); f.dispose();
});
test("Enter Space and assistive clicks are never unlock gestures",()=>{
  const f=fixture(); f.leave(); f.enter();
  assert.equal(f.event("click",{detail:0}),false);
  for (const key of ["Enter"," "]) {assert.equal(f.event("keydown",{key}),false);assert.equal(f.event("keyup",{key}),false);}
  f.dispose();
});
test("reload in focused page has no persisted lock and touch is unaffected",()=>{
  const old=fixture(); old.leave(); old.dispose(); const f=fixture();
  assert.deepEqual(f.click(),[false,false,false,false,false]);
  f.leave(); f.enter(); assert.equal(f.event("pointerdown",{pointerType:"touch"}),false);
  assert.equal(f.event("click",{pointerType:"touch",detail:1}),false); f.dispose();
});
test("background mount arms only activation, disposal removes interception",()=>{
  const f=fixture(false); f.enter(); assert.deepEqual(f.click(),[true,true,true,true,true]);
  f.leave(); f.enter(); f.dispose(); assert.deepEqual(f.click(),[false,false,false,false,false]);
});
test("cancelled pointer cannot leave subsequent mouse gestures blocked",()=>{
  const f=fixture(); f.leave(); f.enter(); assert.equal(f.event("pointerdown",{pointerType:"mouse"}),true);
  assert.equal(f.event("pointercancel",{pointerType:"mouse"}),true);
  assert.deepEqual(f.click(),[false,false,false,false,false]); f.dispose();
});
test("touch compatibility mouse events pass through",()=>{
  const f=fixture(); f.leave(); f.enter();
  assert.equal(f.event("pointerdown",{pointerType:"touch"}),false);
  for (const type of ["pointerup","mousedown","mouseup","click"]) assert.equal(f.event(type,{detail:1}),false);
  f.dispose();
});
test("activation click tail is guarded even if host omitted down",()=>{
  const f=fixture(); f.leave(); f.enter(); assert.equal(f.event("click",{detail:1}),true);
  assert.equal(f.event("click",{detail:1}),false); f.dispose();
});
test("foreground reload carries only an expiring timestamp, never a lock",()=>{
  let time=1000; const cache=new Map();
  const storage={getItem:k=>cache.get(k),setItem:(k,v)=>cache.set(k,v),removeItem:k=>cache.delete(k)};
  const win=new EventTarget(),doc=new EventTarget();doc.hasFocus=()=>true;doc.visibilityState="visible";
  const install=()=>installFocusShield({windowTarget:win,documentTarget:doc,storage,key:"test",now:()=>time});
  const click=()=>{const e=new Event("click",{cancelable:true});e.detail=1;win.dispatchEvent(e);return e.defaultPrevented;};
  let dispose=install();win.dispatchEvent(new Event("blur"));win.dispatchEvent(new Event("focus"));dispose();
  time+=20;dispose=install();assert.equal(click(),true);dispose();
  cache.set("test","1100");time=1101;dispose=install();assert.equal(click(),false);dispose();
});
