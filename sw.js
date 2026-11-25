const AUDIO_CACHE = 'isekai-audio-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const audioBase = new URL('./audio/', self.registration.scope);
  if (!url.href.startsWith(audioBase.href)) return;
  event.respondWith((async () => {
    const cache = await caches.open(AUDIO_CACHE);
    const hit = await cache.match(event.request);
    if (hit) return hit;
    const response = await fetch(event.request);
    if (response.ok) await cache.put(event.request, response.clone());
    return response;
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || data.type !== 'notify') return;
  event.waitUntil(self.registration.showNotification(data.title, { body: data.body, icon: new URL('./favicon.svg', self.registration.scope).href }));
});

// Hook for a future server: Web Push / FCM should land here. No server is configured.
self.addEventListener('push', (event) => {
  const payload = event.data ? event.data.json() : { title: '异世界勇者', body: '' };
  event.waitUntil(self.registration.showNotification(payload.title, { body: payload.body, icon: new URL('./favicon.svg', self.registration.scope).href }));
});
