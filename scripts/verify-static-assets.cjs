"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");
const read = name => fs.readFileSync(path.join(root, name), "utf8");
const base = "https://example.invalid/hibo-jump/";
const context = { self: { addEventListener() {} } };
vm.runInNewContext(read("sw.js") + "\nglobalThis.shell = APP_SHELL; globalThis.assets = THEME_ASSETS;", context);
const cached = new Set([...context.shell, ...context.assets].map(ref => new URL(ref, base).href));
function verify(ref, mustCache = true) {
  if (ref.startsWith("data:")) return;
  const url = new URL(ref, base);
  assert(url.href.startsWith(base), "Asset must remain within the Pages project: " + ref);
  const relative = decodeURIComponent(url.pathname.slice(new URL(base).pathname.length));
  const file = path.resolve(root, relative || ".");
  assert(file === root || file.startsWith(root + path.sep), "Invalid asset path: " + ref);
  assert(fs.existsSync(file), "Missing published asset: " + ref);
  if (relative) assert(fs.statSync(file).isFile() && fs.statSync(file).size > 0, "Empty asset: " + ref);
  if (mustCache) assert(cached.has(url.href), "Asset/version missing from offline cache: " + ref);
}
for (const ref of [...context.shell, ...context.assets]) verify(ref);
const pageRefs = [...read("index.html").matchAll(/<(?:script|link)\b[^>]*(?:src|href)="([^"]+)"/g)].map(m => m[1]);
pageRefs.forEach(ref => verify(ref));
const game = read("game.js");
const worker = /new Worker\(new URL\("([^"]+)"/.exec(game);
assert(worker, "Missing worker entry");
verify(worker[1]);
const imports = /importScripts\(([^)]+)\)/.exec(read("level-worker.js"));
assert(imports, "Missing worker dependencies");
for (const match of imports[1].matchAll(/"([^"]+)"/g)) verify(match[1]);
const themeImages = [...game.matchAll(/image: "([^"]+)"/g)].map(m => m[1]);
themeImages.forEach(ref => verify(ref));
const manifest = JSON.parse(read("manifest.webmanifest"));
manifest.icons.forEach(icon => verify(icon.src));
for (const document of ["README.md", "CHANGELOG.md", "LICENSE"]) verify(document, false);
console.log(JSON.stringify({ shellAssets: context.shell.length, themeImages: themeImages.length, pageRefs: pageRefs.length,
  workerAndCacheVersions: "matched", requiredDocuments: "present" }));
