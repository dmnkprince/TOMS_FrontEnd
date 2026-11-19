// src/sw.js  — Custom service worker (injectManifest mode)
// vite-plugin-pwa injects the precache manifest into this file at build time.
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Precache all build assets (injected by vite-plugin-pwa)
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Runtime caching: API calls — NetworkFirst with 24h cache fallback
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/v1'),
  new NetworkFirst({
    cacheName: 'toms-api-cache',
    networkTimeoutSeconds: 10,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24,
      }),
    ],
  })
);

// ── Push Notifications ───────────────────────────────────────────────────

self.addEventListener('push', (event) => {
  if (!event.data) return;

  let data = {};
  try {
    data = event.data.json();
  } catch {
    data = { title: 'TOMS Alert', body: event.data.text(), url: '/dashboard' };
  }

  const { title = 'TOMS', body = 'You have a new notification', url = '/dashboard' } = data;

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icons.png',
      badge: '/icons.png',
      tag: 'toms-push',
      renotify: true,
      data: { url },
      actions: [{ action: 'open', title: 'Open TOMS' }],
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// ── Skip waiting so updates activate immediately ─────────────────────────
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
