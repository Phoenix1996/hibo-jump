"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const source = fs.readFileSync(require.resolve("../game.js"), "utf8");
function extract(name) {
  const match = new RegExp("  (?:async )?function " + name + "\\(").exec(source);
  assert(match);
  return source.slice(match.index, source.indexOf("\n  }", match.index) + 4);
}
const images = [], timers = new Map(), locks = [], renders = [], announcements = [];
let timerId = 0;
const picker = { classList: { add() {}, remove() {} } };
const select = { value: "ocean", closest: () => picker, setAttribute() {}, removeAttribute() {} };
const window = {
  Image: class {
    constructor() { images.push(this); this.naturalWidth = 256; }
    decode() { return Promise.resolve(); }
  },
  setTimeout(fn) { timers.set(++timerId, fn); return timerId; },
  clearTimeout(id) { timers.delete(id); }
};
const themes = { ocean: { patterns: [] }, art: { patterns: [
  { image: "assets/a b.webp" }, { image: "assets/c.webp" }, { image: "assets/c.webp" }
] } };
const factory = new Function("window", "THEMES", "ui", "setBoardCreationControlsDisabled", "announce",
  "persistLocalData", "onRender", "let currentThemeId = 'ocean', isAnimating = false; const themeAssetPromises = new Map();" +
  "function getTheme() { return {name:currentThemeId}; } function render() { onRender(currentThemeId); }\n" +
  extract("preloadThemeAssets") + "\n" + extract("applyTheme") +
  "\nreturn {applyTheme, state:()=>({currentThemeId,isAnimating})};");
const api = factory(window, themes, { themeSelect: select }, value => locks.push(value),
  message => announcements.push(message), () => {}, theme => renders.push(theme));
async function main() {
  const first = api.applyTheme("art");
  assert.deepEqual(api.state(), { currentThemeId: "ocean", isAnimating: true });
  assert.equal(images.length, 2, "Deduplicate repeated image URLs");
  assert.equal(images[0].src, "assets/a%20b.webp");
  assert.equal(renders.length, 0, "Keep the old board visible until assets are ready");
  await api.applyTheme("ocean");
  images.forEach(image => image.onload());
  await first;
  assert.deepEqual(api.state(), { currentThemeId: "art", isAnimating: false });
  assert.deepEqual(locks, [true, false]);
  assert.equal(timers.size, 0);
  await api.applyTheme("ocean");
  await api.applyTheme("art");
  assert.equal(images.length, 2, "Reuse decoded themes");
  themes.broken = { patterns: [{ image: "missing.webp" }] };
  const failed = api.applyTheme("broken");
  images.at(-1).onerror();
  await failed;
  assert.deepEqual(api.state(), { currentThemeId: "art", isAnimating: false });
  const retry = api.applyTheme("broken");
  assert.equal(images.length, 4, "Retry failed loads instead of caching rejection");
  [...timers.values()].forEach(fn => fn());
  await retry;
  assert.deepEqual(api.state(), { currentThemeId: "art", isAnimating: false });
  assert.equal(timers.size, 0);
  assert(announcements.at(-1).includes("请稍后重试"));
  console.log("Passed: parallel preload, URL deduplication, decode-before-switch, input lock, cache reuse, load failure, timeout and retry.");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
