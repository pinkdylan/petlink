/* 宠相随 PWA Service Worker - 离线缓存 */
const CACHE_NAME = "petlink-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(["/", "/manifest.webmanifest", "/icons/icon-192.svg", "/icons/icon-512.svg"]);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate" && !event.request.url.match(/\.(js|css|svg|png|jpg|webp)$/)) {
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const clone = res.clone();
        if (res.ok && event.request.mode === "navigate") {
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(event.request).then((r) => r || caches.match("/")))
  );
});
