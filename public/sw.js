// Minimal PWA shell. Never pin a Next.js JavaScript bundle across deployments.
const CACHE = "realm-shell-v2";
const SHELL = ["/offline.html", "/realm-icon.svg"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  // App bundles always come from the network to avoid serving outdated modules.
  // Next.js immutable assets have content-hashed URLs and are safely cached by
  // the browser itself, not by this service worker.
  if (url.pathname.startsWith("/_next/")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request, { cache: "no-store" })
        .catch(() => caches.match("/offline.html"))
    );
    return;
  }

  if (url.pathname === "/realm-icon.svg" || url.pathname === "/offline.html") {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
  }
});