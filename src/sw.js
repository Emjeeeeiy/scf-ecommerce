import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'

// vite-plugin-pwa (injectManifest strategy) replaces this with the build's asset list.
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

self.skipWaiting()
self.clients.claim()

// Firebase Messaging only understands the compat/global API inside a service
// worker, so it's loaded via importScripts rather than the modular SDK.
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'New Order!'
  const notificationOptions = {
    body: payload.notification?.body || 'A new order has been placed in your shop.',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: payload.data,
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const urlToOpen = new URL('/admin/orders', self.location.origin).href

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    }),
  )
})
