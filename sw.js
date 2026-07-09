const CACHE_NAME = 'mirzapur-mandal-v40';

// Ye files offline ke liye cache hongi (Sirf app ka dhancha)
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// 1. Install Event: Cache set karna
self.addEventListener('install', event => {
  self.skipWaiting(); // Naya version aate hi turant activate kare
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Activate Event: Purane kachre (Cache) ko delete karna
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Turant naye service worker ko control de
});

// 3. Fetch Event: Network first, then Cache (Advance App ke liye best)
self.addEventListener('fetch', event => {
  // Google Script aur external API calls ko cache nahi karna hai
  if (event.request.url.includes('script.google.com') || event.request.url.includes('googleapis.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
