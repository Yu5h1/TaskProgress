import test from "node:test";
import assert from "node:assert/strict";
import {evaluateModuleDependencies, projectionMetadataErrors} from "../viewer/assets/module-freshness.js";
const hash = n => "sha256:" + String(n).repeat(64);
const entry = (type, dependsOn = [], receipts = []) => ({type, dependsOn, data: {content_revision:hash(1), input_modules:receipts}});
const read = (type, value=1) => ({module_type:type,content_revision:hash(value)});
test("same upstream current; changed upstream stale transitively", () => {
 const a=entry("test.a"), b=entry("test.b",["test.a"],[read("test.a")]), c=entry("test.c",["test.b"],[read("test.b")]);
 assert.equal(evaluateModuleDependencies([c,b,a]).get("test.c").stale,false);
 a.data.content_revision=hash(2); const result=evaluateModuleDependencies([c,b,a]);
 assert.equal(result.get("test.b").stale,true); assert.equal(result.get("test.c").stale,true);
});
test("missing dependency can be omitted with visible coverage, appearance invalidates", () => {
 const b=entry("test.b",["test.a"]);
 let state=evaluateModuleDependencies([b]).get("test.b"); assert.equal(state.stale,false); assert.deepEqual(state.excluded,["test.a"]);
 assert.equal(evaluateModuleDependencies([entry("test.a"),b]).get("test.b").stale,true);
});
test("cycles disabled; downstream without those inputs continues", () => {
 const a=entry("test.a",["test.b"]),b=entry("test.b",["test.a"]),c=entry("test.c",["test.a"]);
 const result=evaluateModuleDependencies([c,b,a]); assert.equal(result.get("test.a").reason,"cycle");
 assert.equal(result.get("test.c").stale,false);assert.deepEqual(result.get("test.c").excluded,["test.a"]);
});
test("legacy independent projections remain readable; dependent legacy is unknown", () => {
 assert.equal(evaluateModuleDependencies([{type:"test.a",data:{}}]).get("test.a").stale,false);
 assert.equal(evaluateModuleDependencies([{type:"test.a",data:{},dependsOn:["test.b"]}]).get("test.a").stale,true);
});
test("malformed provenance cannot claim freshness", () => {
 for(const data of [{input_modules:{}},{input_modules:[null]},{content_revision:3},{input_modules:[read("test.a"),read("test.a")]}])
 assert.ok(projectionMetadataErrors(data).length);
});
