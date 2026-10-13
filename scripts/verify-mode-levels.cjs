"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const levels = require("../level-generator.js");
const source = fs.readFileSync(require.resolve("../game.js"), "utf8");
function extract(name) {
  const match = new RegExp("  function\\*? " + name + "\\(").exec(source);
  assert(match, "Missing " + name);
  const end = source.indexOf("\n  }", match.index);
  assert(end > match.index);
  return source.slice(match.index, end + 4);
}
const helpers = ["actualPatternId", "isBlankToken", "isMysteryToken", "isFixedToken",
  "revealTopToken", "columnIsSortedForCapacity", "createSeededRandom", "randomIndex",
  "wouldCompleteColumnAfterAdding", "topGroupSize", "scrambleQuality", "generateReverseBoardSteps",
  "generateSolvableBoardSteps", "campaignSettingsForLevel"];
const api = new Function("window", "BOARD_GENERATION_VERSION", "CAMPAIGN_LEVEL_COUNT",
  helpers.map(extract).join("\n") + "\nreturn { generateSolvableBoardSteps, campaignSettingsForLevel };")(
    { HiboLevels: levels }, 3, 30);
function finish(iterator) { let step = iterator.next(); while (!step.done) step = iterator.next(); return step.value; }
const engineFactory = new Function("board", "settings", ["actualPatternId", "isBlankToken", "isMysteryToken",
  "isFixedToken", "revealTopToken", "columnIsSortedForCapacity", "columnIsSorted", "countPatternTiles",
  "topGroupSize", "canMoveToColumn", "targetIsValid", "createMove", "isVictory"].map(extract).join("\n") +
  "\nreturn { createMove, isVictory, actualPatternId, revealTopToken };");
const configs = [
  { difficulty: "easy", patternCount: 3, capacity: 4, reserveCount: 4, shuffleSteps: 20, mysteryCount: 0, fixedCount: 0 },
  { difficulty: "normal", patternCount: 4, capacity: 4, reserveCount: 2, shuffleSteps: 45, mysteryCount: 4, fixedCount: 1 },
  ...Array.from({ length: 30 }, (_, i) => api.campaignSettingsForLevel(i + 1)),
  { difficulty: "custom", patternCount: 2, capacity: 2, reserveCount: 0, shuffleSteps: 10, mysteryCount: 0, fixedCount: 0 },
  { difficulty: "custom", patternCount: 7, capacity: 12, reserveCount: 0, shuffleSteps: 2400, mysteryCount: 48, fixedCount: 3 }
];
let checked = 0, maxMs = 0;
for (const [index, cfg] of configs.entries()) {
  for (const seed of [1, 1996, 20261013]) {
    const start = Date.now();
    let puzzle;
    try { puzzle = finish(api.generateSolvableBoardSteps(cfg, seed)); }
    catch (error) { throw new Error(JSON.stringify({ index, cfg, seed, checked }) + ": " + error.message); }
    maxMs = Math.max(maxMs, Date.now() - start);
    assert(puzzle.generation.verified, "Unverified mode " + index);
    assert(puzzle.generation.solutionMoves > 0, "Starts won " + index);
    assert.equal(puzzle.columns.length, cfg.patternCount + 1);
    assert.equal(puzzle.columns.flat().length, cfg.patternCount * cfg.capacity);
    assert(puzzle.columns.every(c => c.length <= cfg.capacity));
    assert(puzzle.columns.every(c => !c.length || c.at(-1)[0] !== "?"));
    assert.equal(puzzle.columns.flat().filter(t => t === "blank").length, cfg.fixedCount);
    assert.deepEqual(puzzle.reserve, Array(cfg.reserveCount).fill(null));
    const numeric = { columns: puzzle.columns.map(c => c.map(t => t === "blank" ? 0 :
      Number(t.replace(/^[?]?[p]/, "")) + (t[0] === "?" ? 16 : 0))), reserve: [] };
    const solution = finish(levels.solve(numeric, cfg, 12000));
    const board = { columns: puzzle.columns.map(c => c.slice()), reserve: puzzle.reserve.slice() };
    const engine = engineFactory(board, cfg);
    assert(!engine.isVictory());
    for (const instruction of solution.moves) {
      const from = instruction.kind === "pickup" ? { kind: "reserve", index: board.reserve.indexOf("p" + instruction.color) } :
        { kind: "column", index: instruction.from };
      const to = instruction.kind === "deposit" ? { kind: "reserve", index: board.reserve.indexOf(null) } :
        { kind: "column", index: instruction.to };
      const move = engine.createMove(from, to);
      assert(move, "Game rejects solver move " + JSON.stringify({ index, seed, instruction }));
      assert.equal(move.count, instruction.count);
      const tokens = from.kind === "column" ? board.columns[from.index].splice(board.columns[from.index].length - move.count) :
        [board.reserve[from.index]];
      if (from.kind === "reserve") board.reserve[from.index] = null;
      if (to.kind === "column") board.columns[to.index].push(...tokens.map(engine.actualPatternId));
      else board.reserve[to.index] = engine.actualPatternId(tokens[0]);
      if (from.kind === "column") engine.revealTopToken(board.columns[from.index]);
    }
    assert(engine.isVictory(), "Replay failed " + JSON.stringify({ index, seed }));
    checked += 1;
  }
}
console.log(JSON.stringify({ checked, configs: configs.length, maxGenerationMs: maxMs }));
