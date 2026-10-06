// Checks that both local surfaces carry the host's required authorization marker.
import test from "node:test";
import assert from "node:assert/strict";
import {createDecisionHttpTransport} from "../viewer/assets/decision-transport.js";
import {loadDecisionSummary} from "../viewer/assets/decision-summary.js";
import {createDecisionSession} from "../viewer/assets/decision-session.js";
import {readFileSync} from "node:fs";

test("old host rejection releases pending clear and preserves answers and drafts",async()=>{
  const previous=globalThis.fetch;
  globalThis.fetch=async()=>({ok:false,status:422,text:async()=>JSON.stringify({
    type:"https://task-progress.local/problems/invalid_operation",code:"invalid_operation",title:"unsupported"
  })});
  try {
    const document=JSON.parse(readFileSync(new URL("./fixtures/decision-example.decisions",import.meta.url)));
    document.decisions[0].answer={kind:"option",option_id:"batch"}; document.decisions[0].status="decided";
    const session=createDecisionSession({ok:true,document,revision:"a"});
    session.edit("input",{choice:"__other",other:"保留文字"});
    const request=session.beginClearAll();
    const result=await createDecisionHttpTransport("test","task").request(request);
    assert.equal(result.ok,false); assert.equal(result.request_id,request.request_id);
    assert.match(result.error.message,/更新並重啟/);
    session.complete(result);
    assert.equal(session.view().pending,null); assert.equal(session.view().busy,false);
    assert.equal(session.view().drafts.input.other,"保留文字");
    assert.equal(session.view().snapshot.document.decisions[0].answer.option_id,"batch");
    assert.equal(session.saveOperation("input"),"confirm");
  } finally {globalThis.fetch=previous;}
});

test("possible post-write failures retain the original clear request for retry",async()=>{
  const previous=globalThis.fetch;
  try {
    for (const [status,body] of [[422,JSON.stringify({type:"https://task-progress.local/problems/decision_request_failed",code:"decision_request_failed",title:"timeout"})],
      [502,"bad gateway"],[422,"invalid json"]]) {
      globalThis.fetch=async()=>({ok:false,status,text:async()=>body});
      const document=JSON.parse(readFileSync(new URL("./fixtures/decision-example.decisions",import.meta.url)));
      const session=createDecisionSession({ok:true,document,revision:"a"}); const request=session.beginClearAll();
      await assert.rejects(createDecisionHttpTransport("test","task").request(request));
      session.failed(); assert.deepEqual(session.retry(),request);
    }
  } finally {globalThis.fetch=previous;}
});
test("HTTP load and confirm send the editor marker and preserve request",async()=>{
  const previous=globalThis.fetch, calls=[];
  globalThis.fetch=async (url,options)=>{ calls.push({url,options}); return {ok:true,json:async()=>({ok:true})}; };
  try {
    const transport=createDecisionHttpTransport("test","task"); await transport.load();
    const request={operation:"confirm",request_id:"same"}; await transport.request(request);
    for (const call of calls) assert.equal(call.options.headers["X-TaskProgress-Editor"],"1");
    assert.deepEqual(JSON.parse(calls[1].options.body),request);
  } finally {globalThis.fetch=previous;}
});
test("summary preserves per-file error and sends editor marker",async()=>{
  const result=await loadDecisionSummary("test",async (_,options)=>{
    assert.equal(options.headers["X-TaskProgress-Editor"],"1");
    return {ok:true,json:async()=>({ok:true,files:[{task_id:"a",pending:2},{task_id:"b",error:"invalid"}]})};
  });
  assert.equal(result.a.label,"待決策 2"); assert.equal(result.b.error,"invalid");
});
test("HTTP target rejects traversal",()=>assert.throws(()=>createDecisionHttpTransport("test","../other")));
