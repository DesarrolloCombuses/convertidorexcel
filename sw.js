// Service worker: funcionamiento sin internet + recibir archivos compartidos
const VERSION = "csv-excel-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./xlsx.full.min.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];
const SHARE_CACHE = "archivo-compartido";

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION && k !== SHARE_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Archivo recibido desde "Compartir" en Android
  if (e.request.method === "POST" && url.pathname.endsWith("/compartir")) {
    e.respondWith((async () => {
      try {
        const form = await e.request.formData();
        const file = form.get("archivo");
        if (file) {
          const cache = await caches.open(SHARE_CACHE);
          await cache.put("compartido", new Response(file, {
            headers: { "X-Nombre": encodeURIComponent(file.name || "informe.csv") }
          }));
        }
      } catch (err) { /* se abre la app igual */ }
      return Response.redirect("./?compartido=1", 303);
    })());
    return;
  }

  if (e.request.method !== "GET") return;

  // Fuentes de Google: guardar en caché la primera vez
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(
      caches.open(VERSION).then(async (c) => {
        const hit = await c.match(e.request);
        if (hit) return hit;
        try {
          const res = await fetch(e.request);
          if (res.ok || res.type === "opaque") c.put(e.request, res.clone());
          return res;
        } catch (err) { return new Response("", { status: 504 }); }
      })
    );
    return;
  }

  // Archivos propios: primero caché, luego red
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).catch(() => caches.match("./index.html")))
    );
  }
});
