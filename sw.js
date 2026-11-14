// Mus sin conexión: primero red y, si no hay, la copia guardada.
// Los datos (rest/v1) no pasan por aquí: los guarda la propia app en el móvil.
const CACHE = 'mus-v1';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.pathname.includes('/rest/v1/') || !url.protocol.startsWith('http')) return;
  e.respondWith(
    fetch(e.request)
      .then(r => { if (r.ok || r.type === 'opaque') { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); } return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match(e.request, { ignoreSearch: true })))
  );
});
