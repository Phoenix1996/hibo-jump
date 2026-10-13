"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const levels = require("../level-generator.js");
const source = fs.readFileSync(require.resolve("../game.js"), "utf8");
function extract(name) {
  const match = new RegExp("  function\\*? " + name + "\\(").exec(source);
  assert(match, "Missing " + name);
  const end = source.indexOf("\n  }", match.index);
  assert(end > match.index);
  return source.slice(match.index, end + 4);
}
const api = {
  generateSolvableBoardSteps: require("../board-generator.js").generate,
  campaignSettingsForLevel: new Function("CAMPAIGN_LEVEL_COUNT", extract("campaignSettingsForLevel") +
    "\nreturn campaignSettingsForLevel;")(30)
};
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
let messages = [];
const worker = vm.createContext({ self: { postMessage: message => messages.push(message) } });
worker.importScripts = (...urls) => urls.forEach(url => vm.runInContext(
  fs.readFileSync(path.join(__dirname, "..", url.split("?")[0]), "utf8"), worker));
vm.runInContext(fs.readFileSync(require.resolve("../level-worker.js"), "utf8"), worker);
let checked = 0, maxMs = 0;
for (const [index, cfg] of configs.entries()) {
  for (const seed of [1, 1996, 20261013]) {
    const start = Date.now();
    let puzzle;
    try { puzzle = finish(api.generateSolvableBoardSteps(cfg, seed)); }
    catch (error) { throw new Error(JSON.stringify({ index, cfg, seed, checked }) + ": " + error.message); }
    maxMs = Math.max(maxMs, Date.now() - start);
    assert(puzzle.generation.verified, "Unverified mode " + index);
    if (seed === 1) {
      messages = [];
      worker.self.onmessage({ data: { settings: cfg, seed } });
      const last = messages.at(-1);
      assert.equal(last.type, "complete", "Worker failed mode " + index + ": " + JSON.stringify(last));
      assert.equal(JSON.stringify(last.board), JSON.stringify(puzzle), "Worker and main-thread seed mismatch");
      assert(messages.filter(m => m.type === "progress").every(m => m.progress >= 0 && m.progress <= 100));
    }
    assert(puzzle.generation.solutionMoves > 0, "Starts won " + index);
    assert.equal(puzzle.columns.length, cfg.patternCount + 1);
    assert.equal(puzzle.columns.flat().length, cfg.patternCount * cfg.capacity);
    assert(puzzle.columns.every(c => c.length <= cfg.capacity));
    assert(puzzle.columns.every(c => !c.length || c.at(-1)[0] !== "?"));
    assert.equal(puzzle.columns.flat().filter(t => t === "blank").length, cfg.fixedCount);
    if (cfg.randomMix) {
      let pairs = 0;
      for (const column of puzzle.columns) {
        const colors = column.map(t => t.replace(/^\?/, ""));
        for (let level = 1; level < colors.length; level += 1) {
          if (colors[level] === "blank" || colors[level] !== colors[level - 1]) continue;
          pairs += 1;
          assert(level < 2 || colors[level] !== colors[level - 2], "Campaign triple at level " + (index - 1));
        }
        if (column.length > 1) assert(new Set(colors.filter(t => t !== "blank")).size >= 4);
      }
      assert(pairs <= 3);
      assert(puzzle.generation.lowerBoundMoves >= cfg.patternCount * 4);
    }
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
console.log(JSON.stringify({ checked, configs: configs.length, workerConfigs: configs.length, maxGenerationMs: maxMs }));
