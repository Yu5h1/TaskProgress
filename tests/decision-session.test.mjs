// D-02 draft isolation and D-03 ambiguous-response behavior.
import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createDecisionSession} from "../viewer/assets/decision-session.js";
const fixture = JSON.parse(readFileSync(new URL("./fixtures/decision-example.decisions",import.meta.url)));
const initial = () => ({ok:true, document:structuredClone(fixture), revision:"a"});
test("clear all is serialized, locks edits and removes every draft only on success",()=>{
  const s=createDecisionSession(initial());
  s.edit("input",{choice:"batch"}); s.begin("input");
  assert.throws(()=>s.beginClearAll()); s.complete({ok:false});
  s.edit("next",{choice:"__other",other:"未保存理由"});
  const sent=s.beginClearAll();
  assert.deepEqual(Object.keys(sent).sort(),["expected_revision","operation","payload","request_id"]);
  assert.equal(sent.expected_revision,"a");
  s.edit("next",{other:"不應寫入"});
  assert.equal(s.view().drafts.next.other,"未保存理由");
  s.failed(); assert.deepEqual(s.retry(),sent);
  const response=initial(); response.revision="b"; s.complete(response);
  assert.equal(s.view().dirty,false); assert.equal(s.view().pending,null);
  assert.equal(s.saveOperation("input"),null);
  s.edit("input",{choice:"short"}); assert.equal(s.begin("input").expected_revision,"b");
});
test("rejected clear retains drafts; retry acknowledgement uses latest answers",()=>{
  const s=createDecisionSession(initial()); s.edit("input",{choice:"__other",other:"保留理由"});
  s.beginClearAll(); s.complete({ok:false});
  assert.equal(s.view().drafts.input.other,"保留理由");
  s.beginClearAll(); s.failed(); s.retry();
  const latest=initial(); latest.revision="new"; latest.status="already_applied";
  latest.document.decisions[1].answer={kind:"option",option_id:"ui"};
  latest.document.decisions[1].status="decided";
  s.complete(latest);
  assert.equal(s.view().snapshot.document.decisions[1].answer.option_id,"ui");
  assert.equal(s.view().dirty,false);
});
test("typing during a save keeps newest text and uses the acknowledged revision",()=>{
  const s=createDecisionSession(initial());
  s.edit("input",{choice:"__other",other:"第"});
  const first=s.begin("input");
  s.edit("input",{other:"第一段完整文字"});
  assert.equal(s.saveOperation("input"),null);
  const response=initial(); response.revision="b";
  Object.assign(response.document.decisions[0],{status:"decided",answer:{...first.payload,confirmed_at:"now"}});
  s.complete(response);
  assert.equal(s.view().drafts.input.other,"第一段完整文字");
  assert.equal(s.view().drafts.input.conflict,false);
  const next=s.begin("input");
  assert.equal(next.expected_revision,"b");
  assert.equal(next.payload.text,"第一段完整文字");
  s.edit("input",{other:""});
  response.revision="c"; response.document.decisions[0].answer.text=next.payload.text;
  s.complete(response);
  assert.equal(s.saveOperation("input"),"reopen");
});
test("ambiguous saves retry original payload without losing later typing",()=>{
  const s=createDecisionSession(initial());
  s.edit("input",{choice:"__other",other:"原文"}); const sent=s.begin("input");
  s.edit("input",{other:"後續文字"}); s.failed();
  assert.deepEqual(s.retry(),sent);
  const response=initial(); response.revision="b";
  Object.assign(response.document.decisions[0],{status:"decided",answer:sent.payload});
  s.complete(response);
  assert.equal(s.begin("input").payload.text,"後續文字");
});
test("saved answers remain editable and clearing other retains the incomplete selection",()=>{
  const data=initial(); Object.assign(data.document.decisions[0],{status:"decided",answer:{kind:"other",text:"原理由"}});
  const s=createDecisionSession(data);
  s.edit("input",{other:"新理由"});
  assert.equal(s.view().drafts.input.choice,"__other");
  assert.equal(s.saveOperation("input"),"confirm");
  assert.equal(s.begin("input").payload.text,"新理由");
  const updated=structuredClone(data); updated.revision="b"; updated.document.decisions[0].answer.text="新理由";
  s.complete(updated);
  s.edit("input",{other:" "}); assert.equal(s.saveOperation("input"),"reopen");
  s.begin("input","reopen"); const cleared=initial(); cleared.revision="c"; s.complete(cleared);
  assert.equal(s.view().drafts.input.choice,"__other");
  assert.equal(s.view().drafts.input.conflict,false);
  assert.equal(s.saveOperation("input"),null);
  s.edit("input",{choice:"short"}); assert.equal(s.begin("input").payload.option_id,"short");
});
test("selection is ready without confirmation; other requires nonblank text",()=>{
  const s=createDecisionSession(initial());
  assert.equal(s.canConfirm("input"),false);
  s.edit("input",{choice:"batch"}); assert.equal(s.canConfirm("input"),true);
  s.edit("input",{choice:"__other",other:"　 \n"}); assert.equal(s.canConfirm("input"),false);
  s.edit("input",{other:"需要支援離線"}); assert.equal(s.canConfirm("input"),true);
  assert.deepEqual(s.begin("input").payload,{kind:"other",text:"需要支援離線"});
  s.edit("next",{choice:"ui"}); assert.equal(s.canConfirm("next"),false);
  s.failed(); assert.equal(s.canConfirm("input"),false);
  s.complete({ok:false}); assert.equal(s.canConfirm("input"),true);
  const fresh=initial(); fresh.document.decisions[0].version++;
  s.merge(fresh); assert.equal(s.canConfirm("input"),false);
  s.rebase("input"); assert.equal(s.canConfirm("input"),true);
});
test("prototype property names are valid decision ids",()=>{
  const data=initial(); data.document.decisions[0].id="constructor";
  const s=createDecisionSession(data); s.edit("constructor",{choice:"batch"});
  assert.equal(s.view().dirty,true); assert.equal(s.begin("constructor").decision_id,"constructor");
});
test("confirm clears only its draft and advances unchanged sibling",()=>{
  const s=createDecisionSession(initial()); s.edit("input",{choice:"batch"}); s.edit("next",{choice:"__other",other:"中文草稿"});
  s.begin("input"); const response=initial(); response.revision="b"; response.document.decisions[0].status="decided";
  s.complete(response); assert.equal(s.view().drafts.next.other,"中文草稿"); assert.equal(s.view().drafts.next.conflict,false);
  assert.equal(s.begin("next").expected_revision,"b");
});
test("external sibling receipt invalidates draft even if still pending",()=>{
  const s=createDecisionSession(initial()); s.edit("next",{choice:"ui"}); const fresh=initial();
  fresh.document.decisions[1].last_request = {request_id:"reopen",fingerprint:"changed"}; s.merge(fresh);
  assert.equal(s.view().drafts.next.conflict,true); assert.throws(()=>s.begin("next"));
  s.rebase("next"); assert.equal(s.view().drafts.next.conflict,false);
});
test("uncertain request retains identity and latest retry snapshot wins",()=>{
  const s=createDecisionSession(initial()); s.edit("input",{choice:"batch"}); const sent=s.begin("input"); s.failed();
  assert.deepEqual(s.retry(),sent); const response=initial(); response.status="already_applied"; response.revision="c";
  s.complete(response); assert.equal(s.view().snapshot.document.decisions[0].status,"pending"); assert.equal(s.view().pending,null);
});
test("removed option needs a new explicit selection",()=>{
  const s=createDecisionSession(initial()); s.edit("input",{choice:"batch"}); const next=initial(); next.document.decisions[0].options.shift();
  s.merge(next); s.rebase("input"); assert.equal(s.view().drafts.input.choice,""); assert.throws(()=>s.begin("input"));
  next.document.decisions[0].answer={kind:"option",option_id:"short"};
  next.document.decisions[0].status="decided";
  s.merge(next); s.rebase("input");
  assert.equal(s.saveOperation("input"),null);
});
test("blank other cannot submit and rejected request keeps draft",()=>{
  const s=createDecisionSession(initial()); s.edit("input",{choice:"__other",other:" "}); assert.throws(()=>s.begin("input"));
  s.edit("input",{other:"方案"}); s.begin("input"); s.complete({ok:false});
  assert.equal(s.view().drafts.input.other,"方案"); assert.equal(s.view().pending,null);
});
