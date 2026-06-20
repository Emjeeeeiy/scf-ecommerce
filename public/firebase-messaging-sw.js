importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyABOyaQ2XE-VVDwk2E36GonmKLkgQphwT0',
  authDomain: 'scf-app-4b684.firebaseapp.com',
  projectId: 'scf-app-4b684',
  storageBucket: 'scf-app-4b684.firebasestorage.app',
  messagingSenderId: '470973606342',
  appId: '1:470973606342:web:7c8411fe4e149dd6162ac7',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || 'New Order!';
  const notificationOptions = {
    body: payload.notification?.body || 'A new order has been placed in your shop.',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click to focus or open the admin orders page
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = new URL('/admin/orders', self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
