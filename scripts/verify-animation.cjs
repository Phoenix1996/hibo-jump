"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const source = fs.readFileSync(require.resolve("../game.js"), "utf8");
function extract(name) {
  const marker = (["animateGroupMove", "animateMove"].includes(name) ? "async function " : "function ") + name + "(";
  const start = source.indexOf(marker);
  assert(start >= 0, name);
  let depth = 0, quote = "", escaped = false, line = false, block = false;
  for (let i = source.indexOf("{", start); i < source.length; i += 1) {
    const c = source[i], n = source[i + 1];
    if (line) { if (c === "\n") line = false; continue; }
    if (block) { if (c === "*" && n === "/") { block = false; i += 1; } continue; }
    if (quote) { if (escaped) escaped = false; else if (c === "\\") escaped = true; else if (c === quote) quote = ""; continue; }
    if (c === "/" && n === "/") { line = true; i += 1; continue; }
    if (c === "/" && n === "*") { block = true; i += 1; continue; }
    if (c === "\"" || c === "'" || c === "`") { quote = c; continue; }
    if (c === "{") depth += 1;
    if (c === "}" && --depth === 0) return source.slice(start, i + 1);
  }
  throw new Error("Unclosed " + name);
}
const functions = ["actualPatternId", "isBlankToken", "isMysteryToken", "revealTopToken", "centeredFlightRect", "columnRouteKeyframes", "animateGroupMove"].map(extract).join("\n");

async function checkGroup(count, reducedMotion) {
  const board = { columns: [Array(count).fill("p1"), []], reserve: [] };
  const departures = [], frames = [], delays = [], notes = [];
  function cell(level, column) {
    return {
      classList: { add: name => { if (name === "is-flight-source") departures.push(level); }, remove() {} },
      getBoundingClientRect: () => ({ left: column ? 400 : 100, top: 700 - level * 50, width: 48, height: 48 }),
      closest: () => ({ getBoundingClientRect: () => ({ top: 100 }) }),
      querySelector: () => null
    };
  }
  const cells = [Array.from({ length: count }, (_, i) => cell(i, 0)), Array.from({ length: count }, (_, i) => cell(i, 1))];
  const scope = {
    board,
    window: { matchMedia: () => ({ matches: reducedMotion }), setTimeout: (fn, ms) => { delays.push(ms); fn(); } },
    elementsForColumnLevels: (col, start, n) => cells[col].slice(start, start + n),
    createFlightTile: (token, rect) => ({ style: {}, querySelector: () => null, remove() {}, animate: (keyframes, options) => { frames.push({ rect, keyframes, options }); return { finished: Promise.resolve() }; } }),
    render() {},
    playSound: (kind, token, sequence) => {
      assert.equal(frames.length, sequence, "Each sound must start with departure, before its flight begins");
      notes.push({ kind, token, sequence });
    },
    vibrateOnLanding: short => assert(short),
    animateSourceReveal: async () => {},
    revealFlightTile: async () => {},
    animateFlightTile: async () => { throw new Error("Unexpected fallback"); }
  };
  const run = new Function("scope", "with (scope) { " + functions + "\nreturn animateGroupMove; }")(scope);
  await run({ source: { index: 0 }, target: { index: 1 }, count });
  assert.deepEqual(departures, Array.from({ length: count }, (_, i) => count - 1 - i));
  assert.deepEqual(notes.map(n => n.sequence), Array.from({ length: count }, (_, i) => i));
  assert.equal(board.columns[0].length, 0); assert.equal(board.columns[1].length, count);
  if (!reducedMotion) {
    assert(delays.every((ms, i) => ms > 0 && (!i || ms > delays[i - 1])));
    assert((delays.at(-1) || 0) + frames[0].options.duration < 650);
    frames.forEach((flight, order) => {
      assert.equal(flight.rect.top, 700 - (count - 1 - order) * 50);
      assert(flight.keyframes[1].transform.startsWith("translate3d(0,"), "Must leave vertically through source rim");
      assert(flight.keyframes[3].transform.includes("300px,"), "Must enter above target column");
      const destinationY = (700 - order * 50) - flight.rect.top;
      assert.equal(flight.keyframes.at(-1).transform, "translate3d(300px," + destinationY + "px,0) scale(1)");
    });
  }
}

async function main() {
  for (const count of [1, 3, 12]) await checkGroup(count, false);
  await checkGroup(3, true);
  const stashBoard = { columns: [["p1", "p1"], []], reserve: [null] };
  const events = [], routes = [];
  const rim = { getBoundingClientRect: () => ({ top: 100 }) };
  const columnCell = { classList: { add() {}, remove() {} }, querySelector: () => null,
    closest: () => rim, getBoundingClientRect: () => ({left:100,top:600,width:44,height:50}) };
  const reserveCell = { classList: { add() {}, remove() {} }, querySelector: () => null,
    closest: () => null, getBoundingClientRect: () => ({left:150,top:760,width:34,height:34}) };
  const stashScope = {
    board: stashBoard, window: {matchMedia:()=>({matches:false})},
    ui: {reserveSlots:{querySelector:()=>reserveCell}},
    sourceElements: move => [move.source.kind === "column" ? columnCell : reserveCell],
    destinationElements: move => [move.target.kind === "column" ? columnCell : reserveCell],
    createFlightTile: () => ({querySelector:()=>null,remove(){}}), render(){},
    elementsForColumnLevels:()=>[columnCell],
    animateFlightTile:async (tile,source,target,reduced,route)=>{events.push("flight");routes.push(route);},
    revealFlightTile:async()=>{}, animateSourceReveal:async()=>{},
    playSound:()=>events.push("sound"),vibrateOnLanding:()=>events.push("land")
  };
  const stash = new Function("scope", "with(scope){" + ["actualPatternId","isBlankToken","isMysteryToken",
    "revealTopToken","centeredFlightRect","animateMove"].map(extract).join("\n") + "\nreturn animateMove;}")(stashScope);
  assert(await stash({source:{kind:"column",index:0},target:{kind:"reserve",index:0},patternIds:["p1"]}));
  assert.deepEqual(stashBoard, {columns:[["p1"],[]],reserve:["p1"]});
  assert.equal(routes[0].sourceRim,100,"Deposit must leave through column rim even when the top tile is low");
  assert(await stash({source:{kind:"reserve",index:0},target:{kind:"column",index:0},patternIds:["p1"]}));
  assert.deepEqual(stashBoard, {columns:[["p1","p1"],[]],reserve:[null]});
  assert.equal(routes[1].targetRim,100,"Pickup must enter through destination column rim");
  assert.deepEqual(events,["sound","flight","land","sound","flight","land"]);
  const frequencies = [], volumes = [];
  const context = {
    currentTime: 0, destination: {},
    createOscillator: () => ({ frequency: { setValueAtTime: value => frequencies.push(value) }, connect() {}, start() {}, stop() {} }),
    createGain: () => ({ gain: { setValueAtTime() {}, exponentialRampToValueAtTime: value => { if (value > 0.001) volumes.push(value); } }, connect() {} })
  };
  const audio = new Function("soundEnabled", "prepareAudioContext", "getTheme", "actualPatternId", extract("playSound") + "\nreturn playSound;")(true, () => context, () => ({ patterns: [{ id: "p1" }] }), t => t);
  for (let i = 0; i < 12; i += 1) audio("tile", "p1", i);
  assert.equal(frequencies.length, 12);
  assert(frequencies.every((value, i) => !i || value > frequencies[i - 1]));
  assert(volumes.every(value => value === volumes[0]), "Pitch progression must not just increase volume");
  const muted = new Function("soundEnabled", "prepareAudioContext", extract("playSound") + "\nreturn playSound;")(
    false, () => { throw new Error("Muted sound must not create or resume audio"); });
  muted("tile", "p1", 1);
  console.log("Passed: top-first stagger, rim route, destination order, atomic group state, reduced motion, per-tile ascending pitch.");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
