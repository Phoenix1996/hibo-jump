"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const source = fs.readFileSync(require.resolve("../game.js"), "utf8");
function extract(name) {
  const start = source.indexOf("  function " + name + "(");
  assert(start >= 0);
  return source.slice(start,source.indexOf("\n  }",start)+4);
}
const factory = new Function(`
  let selected=null,activeDragSource=null,isAnimating=false,suppressClickUntil=0;
  const board={columns:[['p1'],['p2']],reserve:[null]},renders=[],drops=[],messages=[];
  const render=()=>renders.push(selected?{...selected}:null),announce=message=>messages.push(message),nudgeTarget=()=>{},
    columnIsSorted=c=>c.length===2&&c.every(t=>t===c[0]),topGroupSize=c=>c.length,
    handleTarget=(kind,index)=>drops.push({source:{...selected},target:{kind,index}});
  ${["setDragSource","handleDrop","handleDragOver","handleDragEnd"].map(extract).join("\n")}
  return {setDragSource,handleDrop,handleDragOver,handleDragEnd,board,renders,drops,messages,
    lock:value=>isAnimating=value,state:()=>({selected,activeDragSource,suppressClickUntil})};
`);
const element = kind => ({dataset:{kind,index:"0"}});
function event(payload="") {
  return {prevented:false,preventDefault(){this.prevented=true;},dataTransfer:{
    effectAllowed:"none",dropEffect:"none",value:payload,setData(type,value){assert.equal(type,"text/plain");this.value=value;},
    getData(type){assert.equal(type,"text/plain");return this.value;}
  }};
}
const api=factory(),start=event();
api.setDragSource(start,element("column"));
assert.deepEqual(api.renders.at(-1),{kind:"column",index:0},"Show the selected source while dragging");
assert.equal(start.dataTransfer.effectAllowed,"move");
assert.equal(start.dataTransfer.value,"column:0");
const over=event();api.handleDragOver(over);assert(over.prevented);assert.equal(over.dataTransfer.dropEffect,"move");
api.handleDrop(event(),"reserve",0);
assert.deepEqual(api.drops,[{source:{kind:"column",index:0},target:{kind:"reserve",index:0}}],"An internal drag may use its tracked source when browser data is empty");
assert.equal(api.state().activeDragSource,null);
api.handleDragEnd();assert.equal(api.drops.length,1);
assert(api.state().suppressClickUntil>Date.now());
const cancelled=factory();cancelled.setDragSource(event(),element("column"));cancelled.handleDragEnd();
assert.equal(cancelled.state().selected,null);assert.equal(cancelled.state().activeDragSource,null);assert.equal(cancelled.drops.length,0);
assert(cancelled.messages.at(-1).includes("取消"));
const foreign=factory();foreign.handleDrop(event("column:0"),"reserve",0);assert.equal(foreign.drops.length,0);
foreign.setDragSource(event(),element("column"));foreign.handleDrop(event("column:99"),"reserve",0);
assert.equal(foreign.drops.length,0);foreign.handleDragEnd();assert.equal(foreign.state().selected,null);
const locked=factory();locked.lock(true);const blocked=event();locked.setDragSource(blocked,element("column"));assert(blocked.prevented);
locked.handleDrop(event("column:0"),"reserve",0);assert.equal(locked.drops.length,0);
locked.handleDragOver(over);assert.equal(over.dataTransfer.dropEffect,"none");
const finished=factory();finished.board.columns[0].push("p1");const completed=event();finished.setDragSource(completed,element("column"));assert(completed.prevented);
const empty=event();finished.setDragSource(empty,element("reserve"));assert(empty.prevented);
console.log("Passed: drag source feedback, internal empty-data fallback, drop validation, cancellation cleanup, click suppression, animation lock, completed column and empty reserve rejection.");
