"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const source = fs.readFileSync(require.resolve("../game.js"), "utf8");
function extract(name) {
  const start = source.indexOf("  function " + name + "(");
  assert(start >= 0);
  return source.slice(start, source.indexOf("\n  }", start) + 4);
}
const names = ["actualPatternId", "isBlankToken", "isMysteryToken", "columnIsSortedForCapacity",
  "columnIsSorted", "countPatternTiles", "isVictory", "normalizeCampaignProgress", "recordCampaignVictory"];
const factory = new Function("board", "settings", "campaignLevel", "campaignMode", "stored",
  "const CAMPAIGN_LEVEL_COUNT = 30; let campaignUnlockedLevel = 1, campaignCompletedLevels = new Set();\n" +
  names.map(extract).join("\n") +
  "\nconst p = normalizeCampaignProgress(stored.completed, stored.unlocked); campaignUnlockedLevel=p.unlocked; campaignCompletedLevels=p.completed;" +
  "\nreturn {recordCampaignVictory,normalizeCampaignProgress,isVictory,state:()=>({unlocked:campaignUnlockedLevel,completed:[...campaignCompletedLevels]})};");
const cfg = { patternCount: 2, capacity: 2 };
const solved = () => ({ columns: [["p1", "p1"], ["p2", "p2"], []], reserve: [null] });
const levels = Array.from({ length: 29 }, (_, i) => i + 1);
const api = factory(solved(), cfg, 30, true, { unlocked: 30, completed: levels });
assert(api.recordCampaignVictory());
assert.equal(api.state().unlocked, 30);
assert.equal(api.state().completed.length, 30);
assert(!api.recordCampaignVictory(), "Completion must be idempotent");
assert.equal(api.state().completed.length, 30);
const reloaded = factory(solved(), cfg, 30, true, { unlocked: api.state().unlocked, completed: api.state().completed });
assert.deepEqual(reloaded.state(), api.state());
assert.equal(api.normalizeCampaignProgress(undefined, 30).completed.size, 29, "Migrate older unlock-only progress");
assert.deepEqual([...api.normalizeCampaignProgress([0, -1, 31, 2, 2, "3", null], 1).completed], [2]);
assert.equal(api.normalizeCampaignProgress([30], 1).unlocked, 30);
for (const mutate of [
  board => { board.columns[0][0] = "?p1"; },
  board => { board.reserve[0] = "p1"; },
  board => { board.columns[0] = ["p1", "p2"]; }
]) {
  const board = solved(); mutate(board);
  const pending = factory(board, cfg, 1, true, { unlocked: 1, completed: [] });
  assert(!pending.recordCampaignVictory(), "Incomplete puzzle must not unlock a level");
  assert.deepEqual(pending.state(), { unlocked: 1, completed: [] });
}
const first = factory(solved(), cfg, 1, true, { unlocked: 1, completed: [] });
assert(first.recordCampaignVictory());
assert.deepEqual(first.state(), { unlocked: 2, completed: [1] });
const free = factory(solved(), cfg, 1, false, { unlocked: 1, completed: [] });
assert(!free.recordCampaignVictory());
console.log("Passed: level 30 completion, persistence round trip, migration, deduplication, unlock bounds, mystery/reserve/mixed-board gates and free-mode isolation.");
