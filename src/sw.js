// src/sw.js  — Custom service worker (injectManifest mode)
// vite-plugin-pwa injects the precache manifest into this file at build time.
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// 1. Precache all build assets (HTML, JS, CSS, icons)
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// 2. SPA Navigation Route (Fixes blank page when opening PWA in standalone mode)
// Serves index.html for all page navigations, allowing React Router to handle routing offline & online.
try {
  const handler = createHandlerBoundToURL('/index.html');
  const navigationRoute = new NavigationRoute(handler, {
    denylist: [/^\/api\//],
  });
  registerRoute(navigationRoute);
} catch (e) {
  console.warn('[SW] NavigationRoute registration warning:', e);
}

// 3. Runtime caching: API calls — NetworkFirst with 24h cache fallback
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
