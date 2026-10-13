"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const levels = require("../level-generator.js");
const source = fs.readFileSync(require.resolve("../game.js"), "utf8");
const config = { difficulty: "hard", patternCount: 7, capacity: 12, reserveCount: 8, shuffleSteps: 2400, mysteryCount: 48, fixedCount: 3 };

// Execute the real game's move admission and victory functions, independently
// of the generator's solver, to catch differences between the two rule sets.
function functionSource(name) {
  const start = source.indexOf("function " + name + "(");
  assert(start >= 0, "Missing game function: " + name);
  let depth = 0, quote = "", escaped = false, line = false, block = false;
  for (let i = source.indexOf("{", start); i < source.length; i += 1) {
    const c = source[i], next = source[i + 1];
    if (line) { if (c === "\n") line = false; continue; }
    if (block) { if (c === "*" && next === "/") { block = false; i += 1; } continue; }
    if (quote) { if (escaped) escaped = false; else if (c === "\\") escaped = true; else if (c === quote) quote = ""; continue; }
    if (c === "/" && next === "/") { line = true; i += 1; continue; }
    if (c === "/" && next === "*") { block = true; i += 1; continue; }
    if (c === "\"" || c === "'" || c === "`") { quote = c; continue; }
    if (c === "{") depth += 1;
    if (c === "}" && --depth === 0) return source.slice(start, i + 1);
  }
  throw new Error("Unclosed game function: " + name);
}

const names = ["actualPatternId", "isBlankToken", "isMysteryToken", "isFixedToken", "revealTopToken", "columnIsSortedForCapacity", "columnIsSorted", "countPatternTiles", "topGroupSize", "canMoveToColumn", "targetIsValid", "createMove", "isVictory"];
const engineFactory = new Function("board", "settings", names.map(functionSource).join("\n") + "\nreturn { createMove, isVictory, revealTopToken, actualPatternId }; ");

function finish(iterator) { let step = iterator.next(); while (!step.done) step = iterator.next(); return step.value; }
function numeric(board) {
  return { columns: board.columns.map(c => c.map(t => t === "blank" ? 0 : Number(t.replace(/^[?]?[p]/, "")) + (t[0] === "?" ? 16 : 0))), reserve: [] };
}

let maxTime = 0, minMoves = Infinity, maxMoves = 0, pairTotal = 0;
const singleColumnPositions = Array(8).fill(0);
const seeds = Array.from({ length: Number(process.argv[2]) || 100 }, (_, i) => i + 1);
for (const seed of seeds) {
  const started = Date.now();
  const puzzle = finish(levels.generate(config, seed));
  const elapsed = Date.now() - started; maxTime = Math.max(maxTime, elapsed);
  assert.deepEqual(puzzle.columns.map(c => c.length).sort((a, b) => a - b), [1, 11, 12, 12, 12, 12, 12, 12]);
  singleColumnPositions[puzzle.columns.findIndex(c => c.length === 1)] += 1;
  assert(puzzle.generation.lowerBoundMoves >= 71);
  assert.equal(puzzle.columns.flat().filter(t => t === "blank").length, 3);
  assert.equal(puzzle.columns.flat().filter(t => t[0] === "?").length, 48);
  assert.deepEqual(puzzle.reserve, Array(8).fill(null));
  let pairs = 0;
  for (const column of puzzle.columns) {
    for (let i = 1; i < column.length; i += 1) {
      if (column[i] === "blank" || column[i - 1] === "blank") continue;
      const color = t => t.replace(/^\?/, "");
      if (color(column[i]) === color(column[i - 1])) pairs += 1;
      if (i >= 2 && column[i - 2] !== "blank") assert(!(color(column[i]) === color(column[i - 1]) && color(column[i]) === color(column[i - 2])), "Triple: seed " + seed);
    }
    if (column.length > 1) {
      assert(new Set(column.filter(t => t !== "blank" && t[0] !== "?")).size >= 3, "Insufficient visible variety: seed " + seed);
      const concealed = column.filter(t => t[0] === "?").length;
      assert(concealed >= 5 && concealed <= 8, "Unbalanced mystery distribution: seed " + seed);
    }
  }
  assert(pairs <= 3, "Excessive pairs: seed " + seed); pairTotal += pairs;
  const result = finish(levels.solve(numeric(puzzle), config, 12000));
  assert(result.solved, "Unsolved seed " + seed);
  minMoves = Math.min(minMoves, result.moves.length); maxMoves = Math.max(maxMoves, result.moves.length);
  const board = { columns: puzzle.columns.map(c => c.slice()), reserve: puzzle.reserve.slice() };
  const engine = engineFactory(board, config);
  assert(!engine.isVictory(), "Starts won: seed " + seed);
  for (const instruction of result.moves) {
    let from, to;
    if (instruction.kind === "column") {
      from = { kind: "column", index: instruction.from }; to = { kind: "column", index: instruction.to };
    } else if (instruction.kind === "deposit") {
      from = { kind: "column", index: instruction.from }; to = { kind: "reserve", index: board.reserve.indexOf(null) };
    } else {
      from = { kind: "reserve", index: board.reserve.indexOf("p" + instruction.color) }; to = { kind: "column", index: instruction.to };
    }
    const move = engine.createMove(from, to);
    assert(move, "Game rejects solution move: seed " + seed + " " + JSON.stringify(instruction));
    assert.equal(move.count, instruction.count, "Group mismatch: seed " + seed);
    const tokens = from.kind === "column" ? board.columns[from.index].splice(board.columns[from.index].length - move.count, move.count) : [board.reserve[from.index]];
    if (from.kind === "reserve") board.reserve[from.index] = null;
    if (to.kind === "column") board.columns[to.index].push(...tokens.map(engine.actualPatternId));
    else board.reserve[to.index] = engine.actualPatternId(tokens[0]);
    if (from.kind === "column") engine.revealTopToken(board.columns[from.index]);
  }
  assert(engine.isVictory(), "Game does not accept victory: seed " + seed);
}
assert.deepEqual(finish(levels.generate(config, 1996)), finish(levels.generate(config, 1996)), "Seed must be deterministic");
if (seeds.length >= 100) assert(singleColumnPositions.every(Boolean), "Working column must appear in all eight positions");
console.log(JSON.stringify({ verifiedSeeds: seeds.length, solutionMoveRange: [minMoves, maxMoves], averagePairs: pairTotal / seeds.length, singleColumnPositions, maxGenerationMs: maxTime, realGameReplay: "passed" }));
