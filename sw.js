self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || data.type !== 'notify') return;
  event.waitUntil(self.registration.showNotification(data.title, { body: data.body, icon: '/favicon.svg' }));
});

// Hook for a future server: Web Push / FCM should land here. No server is configured.
self.addEventListener('push', (event) => {
  const payload = event.data ? event.data.json() : { title: '异世界勇者', body: '' };
  event.waitUntil(self.registration.showNotification(payload.title, { body: payload.body, icon: '/favicon.svg' }));
});
