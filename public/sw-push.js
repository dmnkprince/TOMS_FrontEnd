// public/sw-push.js
// This file is imported by the generated service worker to handle push events.
// vite-plugin-pwa injects the precache manifest; this handles runtime push.

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
      // Focus existing window if open
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
