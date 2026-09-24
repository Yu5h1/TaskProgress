// D-02 draft isolation and D-03 ambiguous-response behavior.
import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createDecisionSession} from "../viewer/assets/decision-session.js";
const fixture = JSON.parse(readFileSync(new URL("./fixtures/decision-example.decisions",import.meta.url)));
const initial = () => ({ok:true, document:structuredClone(fixture), revision:"a"});
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
test("external sibling history invalidates draft even if still pending",()=>{
  const s=createDecisionSession(initial()); s.edit("next",{choice:"ui"}); const fresh=initial();
  fresh.document.decisions[1].history.push({operation:"reopen"}); s.merge(fresh);
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
});
test("blank other cannot submit and rejected request keeps draft",()=>{
  const s=createDecisionSession(initial()); s.edit("input",{choice:"__other",other:" "}); assert.throws(()=>s.begin("input"));
  s.edit("input",{other:"方案"}); s.begin("input"); s.complete({ok:false});
  assert.equal(s.view().drafts.input.other,"方案"); assert.equal(s.view().pending,null);
});
