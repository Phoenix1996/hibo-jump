"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const source = fs.readFileSync(require.resolve("../game.js"), "utf8");
function extract(name) {
  const start = source.indexOf("  function " + name + "(");
  assert(start >= 0, name);
  return source.slice(start, source.indexOf("\n  }", start) + 4);
}
const names = ["actualPatternId","isBlankToken","isMysteryToken","isFixedToken","cloneBoard","hasLegacyGuessCells",
  "countPatternTiles","countBlankTiles","migrateMissingBlankTiles","normalizeBoard","normalizeSettings",
  "normalizeMoveHistory","normalizeSnapshot","currentSnapshot","restoreSnapshot","columnIsSortedForCapacity",
  "columnIsSorted","isVictory","undoMove","isValidDateKey","campaignSettingsForLevel"];
const cfg = { difficulty:"custom",patternCount:2,capacity:2,reserveCount:1,shuffleSteps:10,mysteryCount:1,fixedCount:0 };
const initial = {columns:[["?p1","p2"],["p2","p1"],[]],reserve:[null]};
const current = {columns:[["p1"],["p2","p1"],[]],reserve:["p2"]};
const factory = new Function("cfg","original","current","history","count", `
  const PRESETS={},DEFAULT_SETTINGS=cfg,THEMES={ocean:{}},CAMPAIGN_LEVEL_COUNT=30,BOARD_GENERATION_VERSION=4,SAVED_UNDO_LIMIT=50;
  let settings=cfg,currentThemeId='ocean',board=current,initialBoard=original,moveHistory=history,moveCount=count,
    campaignMode=false,campaignLevel=1,dailyMode=false,dailyChallengeDate='',selected=null,victoryCelebrated=false,isAnimating=false;
  const render=()=>{},persistLocalData=()=>{},announce=()=>{},clearCelebration=()=>{},dateSeed=()=>0,
    buildSolvableBoard=()=>{throw new Error('Unexpected regeneration');};
  ${names.map(extract).join("\n")}
  return {currentSnapshot,restoreSnapshot,undoMove,normalizeMoveHistory,state:()=>({board,moveCount,moveHistory})};
`);
const copy = value => JSON.parse(JSON.stringify(value));
const api = factory(cfg,copy(initial),copy(current),[{board:copy(initial),moveCount:0}],1);
const saved = JSON.parse(JSON.stringify(api.currentSnapshot()));
assert.equal(saved.moveHistory.length,1);
assert(api.restoreSnapshot(saved));
assert.equal(api.state().moveHistory.length,1);
api.undoMove();
assert.deepEqual(api.state().board,initial,"Undo after reload must restore mystery faces and reserve contents");
assert.equal(api.state().moveCount,0);
assert.equal(api.state().moveHistory.length,0);
const history = Array.from({length:75},(_,i)=>({board:copy(initial),moveCount:i}));
const bounded = factory(cfg,copy(initial),copy(current),history,75);
const truncated = bounded.currentSnapshot();
assert.equal(truncated.moveHistory.length,50);
assert.equal(truncated.moveHistory[0].moveCount,25);
assert.equal(truncated.moveHistory.at(-1).moveCount,74);
assert.equal(bounded.state().moveHistory.length,75,"Saving must not truncate the live session");
assert.equal(bounded.normalizeMoveHistory(history,current,cfg,75).length,50);
truncated.moveHistory[0].board.columns[0].pop();
assert.equal(history[25].board.columns[0].length,2,"Stored snapshots must not alias live history");
const legacy=copy(saved); delete legacy.moveHistory;
assert(api.restoreSnapshot(legacy));
assert.deepEqual(api.state().board,current);
assert.equal(api.state().moveHistory.length,0);
assert.deepEqual(api.normalizeMoveHistory([{board:initial,moveCount:99}],current,cfg,1),[]);
const broken = {columns:[["p1"],["p1","p1"],[]],reserve:["p2"]};
assert.deepEqual(api.normalizeMoveHistory([{board:broken,moveCount:0}],current,cfg,1),[]);
const whiteCfg={patternCount:2,capacity:3,reserveCount:1};
const whiteBoard={columns:[["blank","p1"],["p2","p2","p2"],["p1"]],reserve:[null]};
const movedWhite={columns:[["p1"],["p2","p2","p2"],["blank","p1"]],reserve:[null]};
assert.deepEqual(api.normalizeMoveHistory([{board:movedWhite,moveCount:0}],whiteBoard,whiteCfg,1),[]);
console.log("Passed: saved undo round trip, question and reserve restoration, 50-step bound, clone isolation, legacy saves and corrupted inventory/fixed-layout/count rejection.");
