"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const source = fs.readFileSync(require.resolve("../game.js"), "utf8");
function extract(name) {
  const start = source.indexOf("  async function " + name + "(");
  assert(start >= 0);
  return source.slice(start, source.indexOf("\n  }", start) + 4);
}
const factory = new Function("generate", String.raw`
  const CAMPAIGN_LEVEL_COUNT=30;
  let isAnimating=false, settings={difficulty:'custom',capacity:2,patternCount:2},
      board={columns:[['p1'],['p2']],reserve:[null]}, initialBoard={columns:[['p1'],['p2']],reserve:[null]},
      selected={kind:'column',index:0}, moveCount=7, moveHistory=[{moveCount:6}],
      campaignMode=false,dailyMode=true,dailyChallengeDate='2026-10-12',campaignLevel=4,
      campaignUnlockedLevel=10,activeSaveId=0,victoryCelebrated=true;
  const renders=[],saves=[];
  const campaignSettingsForLevel=level=>({difficulty:'custom',capacity:4,patternCount:3,level});
  const selectedPresetSettings=()=>({difficulty:'hard',capacity:12,patternCount:7});
  const closeCampaignDialog=()=>{},closeSaveDialog=()=>{},setFormValues=()=>{},clearCelebration=()=>{},
    render=()=>renders.push(1),playBoardOpeningAnimation=()=>{},persistLocalData=value=>saves.push(value),announce=()=>{},
    isValidDateKey=value=>/^\d{4}-\d{2}-\d{2}$/.test(value),localDateKey=()=>'2026-10-13',dateSeed=()=>123,
    formatDateKey=value=>value,cloneBoard=value=>JSON.parse(JSON.stringify(value)),buildSolvableBoardWithProgress=generate;
  ${["startCampaignLevel", "startDailyChallenge", "createGameInSlot", "setNewGame"].map(extract).join("\n")}
  return {startCampaignLevel,startDailyChallenge,createGameInSlot,setNewGame,renders,saves,
    state:()=>({settings,board,initialBoard,selected,moveCount,moveHistory,campaignMode,dailyMode,
      dailyChallengeDate,campaignLevel,activeSaveId,victoryCelebrated})};
`);
async function check(action, expected) {
  let release;
  const api = factory(() => new Promise(resolve => { release = resolve; }));
  const before = api.state();
  const failed = action(api);
  assert.deepEqual(api.state(), before, "Do not change current context while waiting");
  release(null);
  await failed;
  assert.deepEqual(api.state(), before, "Keep board, mode, settings, selection, undo and save slot on failure");
  assert.equal(api.saves.length, 0, "Do not overwrite a save on failed generation");
  assert.equal(api.renders.length, 0, "Do not commit a partial new context");
  const success = action(api);
  const nextBoard = { columns: [["p2", "p1"], ["p1", "p2"], []], reserve: [null] };
  release(nextBoard);
  await success;
  const after = api.state();
  assert.equal(after.board, nextBoard);
  assert.deepEqual(after.initialBoard, nextBoard);
  assert.equal(after.moveCount, 0);
  assert.equal(after.selected, null);
  assert.deepEqual(after.moveHistory, []);
  assert.equal(api.saves.length, 1);
  expected(after);
}
async function main() {
  await check(api => api.startCampaignLevel(9), state => {
    assert(state.campaignMode); assert(!state.dailyMode); assert.equal(state.campaignLevel, 9); assert.equal(state.settings.level, 9);
  });
  await check(api => api.startDailyChallenge('2026-10-11'), state => {
    assert(state.dailyMode); assert(!state.campaignMode); assert.equal(state.dailyChallengeDate, '2026-10-11'); assert.equal(state.settings.difficulty,'hard');
  });
  await check(api => api.createGameInSlot(2), state => assert.equal(state.activeSaveId, 2));
  await check(api => api.setNewGame('', {settings:{difficulty:'normal',capacity:4,patternCount:4},campaignMode:false,dailyMode:false,dailyChallengeDate:''}), state => {
    assert(!state.dailyMode); assert.equal(state.settings.difficulty,'normal'); assert.equal(state.dailyChallengeDate,'');
  });
  await check(api => api.setNewGame(), state => assert.equal(state.dailyChallengeDate,'2026-10-13'));
  console.log("Passed: failed/pending campaign, daily, save-slot, difficulty and new-day generation preserves the previous game; success commits once.");
}
main().catch(error => { console.error(error); process.exitCode=1; });
