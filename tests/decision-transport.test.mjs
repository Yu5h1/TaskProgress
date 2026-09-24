// Checks that both local surfaces carry the host's required authorization marker.
import test from "node:test";
import assert from "node:assert/strict";
import {createDecisionHttpTransport} from "../viewer/assets/decision-transport.js";
import {loadDecisionSummary} from "../viewer/assets/decision-summary.js";
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
