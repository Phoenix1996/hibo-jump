const CACHE_NAME = "hibo-jump-shell-20261013-5";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./styles.css?v=20261013-6",
  "./game.js?v=20261013-13",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];
const THEME_ASSETS = [
  "./assets/themes/pokemon-2/10662101-a808-4b0b-80e0-83e38c90b9ca.webp",
  "./assets/themes/pokemon-2/32dfc1c7-085d-462a-a9ab-502df96fd390.webp",
  "./assets/themes/pokemon-2/340914f4-d72f-4568-b705-46a3c206f744.webp",
  "./assets/themes/pokemon-2/677d193c-1e67-44b5-a854-1e5eae5970bf.webp",
  "./assets/themes/pokemon-2/74ea19f1-43bc-496f-965d-6f4472eda4c5.webp",
  "./assets/themes/pokemon-2/7695ac6b-e28d-4404-8bb9-e6e5ed611fbd.webp",
  "./assets/themes/pokemon-2/d7a28cea-f41a-4579-9e25-ee6070c7429c.webp",
  "./assets/themes/digimon/01c6440d-c38e-4a00-ba88-f68bc7a3ffc1.webp",
  "./assets/themes/digimon/0cbedb23-3712-4f74-8bbf-31f2116362eb.webp",
  "./assets/themes/digimon/8baa6bc8-d4a5-492f-bec5-5721c9a1985c.webp",
  "./assets/themes/digimon/932aab38-b902-4451-9689-8dde7b6ce3a7.webp",
  "./assets/themes/digimon/9b8da726-e7d9-44f9-8832-f5fcdcd962b2.webp",
  "./assets/themes/digimon/b78e61e2-7d47-45ef-8467-a1c6163931fe.webp",
  "./assets/themes/digimon/ff3a266e-fcbc-40e2-9615-666a457124c3.webp",
  "./assets/themes/pokemon/%E5%8F%AF%E8%BE%BE%E9%B8%AD.webp",
  "./assets/themes/pokemon/%E5%A6%99%E8%9B%99%E7%A7%8D%E5%AD%90%20(2).webp",
  "./assets/themes/pokemon/%E5%B0%8F%E7%81%AB%E9%BE%99.webp",
  "./assets/themes/pokemon/%E4%BB%99%E5%AD%90%E4%BC%8A%E5%B8%83.webp",
  "./assets/themes/pokemon/%E6%9D%B0%E5%B0%BC%E9%BE%9F.webp",
  "./assets/themes/pokemon/%E7%9A%AE%E5%8D%A1%E4%B8%98.webp",
  "./assets/themes/pokemon/%E8%B6%85%E6%A2%A6.webp"
];

self.addEventListener("install", function (event) {
  event.waitUntil((async function () {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
    await Promise.all(THEME_ASSETS.map(function (assetUrl) {
      return cache.add(assetUrl).catch(function () {});
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", function (event) {
  event.waitUntil((async function () {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.filter(function (cacheName) {
      return cacheName.startsWith("hibo-jump-") && cacheName !== CACHE_NAME;
    }).map(function (cacheName) {
      return caches.delete(cacheName);
    }));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", function (event) {
  const request = event.request;
  if (request.method !== "GET") return;

  const requestUrl = new URL(request.url);
  const scopeUrl = new URL(self.registration.scope);
  if (requestUrl.origin !== scopeUrl.origin || !requestUrl.pathname.startsWith(scopeUrl.pathname)) return;

  if (request.mode === "navigate") {
    event.respondWith((async function () {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(new URL("./index.html", scopeUrl).href, response.clone());
        }
        return response;
      } catch (error) {
        const cache = await caches.open(CACHE_NAME);
        return await cache.match(request) || await cache.match(new URL("./index.html", scopeUrl).href);
      }
    })());
    return;
  }

  event.respondWith((async function () {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok && response.type === "basic") await cache.put(request, response.clone());
      return response;
    } catch (error) {
      return new Response("Offline", { status: 503, statusText: "Offline" });
    }
  })());
});
