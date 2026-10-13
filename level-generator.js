(function (root) {
  "use strict";

  function randomSource(seed) {
    let state = Number.isInteger(seed) ? seed >>> 0 : (Math.random() * 4294967296) >>> 0;
    return function () {
      state = (state + 0x6d2b79f5) | 0;
      let value = Math.imul(state ^ (state >>> 15), 1 | state);
      value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffled(items, rng) {
    const result = items.slice();
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function actual(token) { return token & 15; }
  function hidden(token) { return token > 15; }
  function reveal(column) {
    if (column.length && hidden(column[column.length - 1])) column[column.length - 1] = actual(column[column.length - 1]);
  }
  function group(column) {
    if (!column.length || !column[column.length - 1]) return 0;
    const top = column[column.length - 1];
    if (hidden(top)) return 1;
    let count = 1;
    while (count < column.length && column[column.length - count - 1] === top) count += 1;
    return count;
  }

  function inventories(columns, count) {
    const totals = Array(count + 1).fill(0);
    columns.forEach(c => c.forEach(t => { if (t) totals[actual(t)] += 1; }));
    return totals;
  }

  function done(column, capacity, totals) {
    if (column.length !== capacity || column.some(hidden)) return false;
    const tiles = column.filter(Boolean);
    if (!tiles.length || !tiles.every(t => t === tiles[0])) return false;
    return totals[tiles[0]] === tiles.length;
  }

  function won(state, cfg, totals) {
    return !state.reserve.length && state.columns.filter(c => done(c, cfg.capacity, totals)).length === cfg.patternCount &&
      state.columns.filter(c => !c.length).length === 1;
  }

  function key(state) {
    return state.columns.map(c => c.map(t => String.fromCharCode(65 + t)).join("")).sort().join("|") + ":" + state.reserve.slice().sort().join("");
  }

  function estimate(state, cfg, totals) {
    let segments = state.reserve.length;
    const homes = new Set();
    state.columns.forEach(c => {
      if (done(c, cfg.capacity, totals)) return;
      let previous = 0;
      c.forEach(t => {
        if (!t) return;
        if (hidden(t) || t !== previous) segments += 1;
        previous = hidden(t) ? 0 : t;
      });
      const bottom = c.find(Boolean);
      if (bottom) homes.add(actual(bottom));
    });
    return Math.max(0, segments - homes.size);
  }

  function legalMoves(state, cfg, totals) {
    const result = [];
    const complete = state.columns.map(c => done(c, cfg.capacity, totals));
    const firstEmpty = state.columns.findIndex(c => !c.length);
    state.columns.forEach((c, from) => {
      if (!c.length || !group(c) || complete[from]) return;
      const color = actual(c[c.length - 1]);
      state.columns.forEach((target, to) => {
        if (to === from || complete[to] || target.length >= cfg.capacity ||
            (target.length && actual(target[target.length - 1]) && actual(target[target.length - 1]) !== color)) return;
        if (!target.length && to !== firstEmpty) return;
        // Relocating an entire plain uniform stack to an empty tube is symmetric.
        if (!target.length && c.every(t => t === color)) return;
        result.push({ from, to, count: Math.min(group(c), cfg.capacity - target.length), kind: "column" });
      });
      if (state.reserve.length < cfg.reserveCount) result.push({ from, color, count: 1, kind: "deposit" });
    });
    const colors = new Set(state.reserve);
    colors.forEach(color => {
      state.columns.forEach((target, to) => {
        if (complete[to] || target.length >= cfg.capacity ||
            (target.length && actual(target[target.length - 1]) && actual(target[target.length - 1]) !== color)) return;
        if (!target.length && to !== firstEmpty) return;
        result.push({ color, to, count: 1, kind: "pickup" });
      });
    });
    return result;
  }

  function apply(state, move) {
    const next = { columns: state.columns.map(c => c.slice()), reserve: state.reserve.slice() };
    if (move.kind === "column") {
      const source = next.columns[move.from];
      next.columns[move.to].push(...source.splice(source.length - move.count, move.count));
      reveal(source);
    } else if (move.kind === "deposit") {
      const source = next.columns[move.from];
      next.reserve.push(actual(source.pop()));
      reveal(source);
    } else {
      next.reserve.splice(next.reserve.indexOf(move.color), 1);
      next.columns[move.to].push(move.color);
    }
    return next;
  }

  class Heap {
    constructor() { this.items = []; }
    push(node) {
      this.items.push(node);
      let i = this.items.length - 1;
      while (i) {
        const parent = (i - 1) >> 1;
        if (this.items[parent].priority <= node.priority) break;
        this.items[i] = this.items[parent]; i = parent;
      }
      this.items[i] = node;
    }
    pop() {
      const first = this.items[0], last = this.items.pop();
      if (this.items.length) {
        let i = 0;
        while (i * 2 + 1 < this.items.length) {
          let child = i * 2 + 1;
          if (child + 1 < this.items.length && this.items[child + 1].priority < this.items[child].priority) child += 1;
          if (last.priority <= this.items[child].priority) break;
          this.items[i] = this.items[child]; i = child;
        }
        this.items[i] = last;
      }
      return first;
    }
  }

  function* solve(start, cfg, maxNodes) {
    const totals = inventories(start.columns, cfg.patternCount);
    const frontier = new Heap();
    const seen = new Map();
    const stateLimit = 30000;
    const initial = { state: start, cost: 0, parent: null, move: null, priority: estimate(start, cfg, totals) * 5 };
    frontier.push(initial); seen.set(key(start), 0);
    let explored = 0;
    while (frontier.items.length && explored < maxNodes) {
      const node = frontier.pop();
      if (seen.get(key(node.state)) < node.cost) continue;
      if (won(node.state, cfg, totals)) {
        const moves = []; let current = node;
        while (current.parent) { moves.push(current.move); current = current.parent; }
        return { solved: true, moves: moves.reverse(), explored };
      }
      explored += 1;
      for (const move of legalMoves(node.state, cfg, totals)) {
        const state = apply(node.state, move), cost = node.cost + 1, stateKey = key(state);
        if ((seen.get(stateKey) ?? Infinity) <= cost) continue;
        if (seen.size >= stateLimit) return { solved: false, moves: null, explored };
        seen.set(stateKey, cost);
        const priority = estimate(state, cfg, totals) * 5 + cost * 0.25 + state.reserve.length * 1.2;
        frontier.push({ state, cost, parent: node, move, priority });
      }
      if (explored % 128 === 0) yield { explored };
    }
    return { solved: false, moves: null, explored };
  }

  function candidate(cfg, rng) {
    const blankCounts = Array(cfg.patternCount).fill(0);
    for (let i = 0; i < cfg.fixedCount; i += 1) {
      const choices = blankCounts.map((n, index) => ({ n, index })).filter(x => x.n < cfg.capacity - 1);
      const picked = choices[Math.floor(rng() * choices.length)];
      blankCounts[picked.index] += 1;
    }
    const remaining = blankCounts.map(n => cfg.capacity - n);
    const heights = Array(cfg.patternCount).fill(cfg.capacity);
    heights[Math.floor(rng() * cfg.patternCount)] -= 1;
    heights.push(1);
    const columns = heights.map((height, index) => Array(blankCounts[index] || 0).fill(0));
    let pairs = 0;
    for (let index = 0; index < columns.length; index += 1) {
      const c = columns[index];
      while (c.length < heights[index]) {
        const top = c[c.length - 1] || 0;
        let choices = remaining.map((n, color) => ({ n, color: color + 1 })).filter(x => x.n > 0);
        const different = choices.filter(x => x.color !== top);
        if (different.length && (pairs >= 3 || rng() >= 0.05)) choices = different;
        if (c.length > 1 && c[c.length - 2] === top) choices = choices.filter(x => x.color !== top);
        if (!choices.length) return null;
        const total = choices.reduce((sum, x) => sum + x.n, 0);
        let ticket = rng() * total, selected = choices[0];
        for (const x of choices) { ticket -= x.n; if (ticket < 0) { selected = x; break; } }
        if (selected.color === top) pairs += 1;
        c.push(selected.color); remaining[selected.color - 1] -= 1;
      }
    }
    if (pairs > 3 || columns.slice(0, cfg.patternCount).some(c => new Set(c.filter(Boolean)).size < 4)) return null;
    const slots = columns.map(c => shuffled(c.slice(0, -1).map((t, level) => ({ level, t })).filter(x => x.t), rng));
    const columnOrder = shuffled(columns.map((_, index) => index), rng);
    let covered = 0;
    let advanced = true;
    while (covered < cfg.mysteryCount && advanced) {
      advanced = false;
      for (const col of columnOrder) {
        if (covered >= cfg.mysteryCount) break;
        const c = columns[col];
        while (slots[col].length) {
          const slot = slots[col].pop();
          const visible = c.filter(t => t && !hidden(t));
          const unique = new Set(visible);
          if (visible.length <= 3 || (unique.size <= 3 && visible.filter(t => t === slot.t).length === 1)) continue;
          c[slot.level] += 16; covered += 1; advanced = true;
          break;
        }
      }
    }
    if (covered !== cfg.mysteryCount) return null;
    // The working column is a role, not a fixed position in the board.
    return { columns: shuffled(columns, rng), reserve: [] };
  }

  function replay(start, moves, cfg) {
    const totals = inventories(start.columns, cfg.patternCount);
    let state = start;
    for (const move of moves) {
      if (!legalMoves(state, cfg, totals).some(m => JSON.stringify(m) === JSON.stringify(move))) return false;
      state = apply(state, move);
    }
    return won(state, cfg, totals);
  }

  function difficultyLowerBound(board, cfg) {
    let segments = 0;
    board.columns.forEach(c => {
      let previous = 0;
      c.forEach(t => {
        const color = actual(t);
        if (color && color !== previous) segments += 1;
        previous = color;
      });
    });
    return Math.max(0, segments - cfg.patternCount);
  }

  function* generate(cfg, seed) {
    const rng = randomSource(seed);
    const attempts = 8, nodeLimit = 12000;
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      const board = candidate(cfg, rng);
      if (!board) continue;
      const validator = solve(board, cfg, nodeLimit);
      let step = validator.next();
      while (!step.done) {
        yield { progress: Math.round((attempt + step.value.explored / nodeLimit) / attempts * 95), phase: "正在检查棋盘" };
        step = validator.next();
      }
      const lowerBound = difficultyLowerBound(board, cfg);
      if (!step.value.solved || lowerBound < cfg.patternCount * 4 || !replay(board, step.value.moves, cfg)) continue;
      return {
        columns: board.columns.map(c => c.map(t => !t ? "blank" : (hidden(t) ? "?" : "") + "p" + actual(t))),
        reserve: Array(cfg.reserveCount).fill(null),
        generation: { version: 3, verified: true, solutionMoves: step.value.moves.length, lowerBoundMoves: lowerBound, explored: step.value.explored }
      };
    }
    throw new Error("候选棋盘尚未通过可解性检查，请重试。");
  }

  const api = { generate, solve, candidate, replay, inventories, estimate };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.HiboLevels = api;
})(typeof self !== "undefined" ? self : globalThis);
