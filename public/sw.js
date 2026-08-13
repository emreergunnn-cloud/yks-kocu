self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
});

self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received.');
  const notificationData = event.data ? event.data.json() : {};
  const { title, body, icon, badge } = notificationData.notification;

  const options = {
    body: body,
    icon: icon,
    badge: badge,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
