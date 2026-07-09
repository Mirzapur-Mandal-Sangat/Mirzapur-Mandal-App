const CACHE_NAME = 'mirzapur-mandal-v2';

self.addEventListener('install', event => { 
  self.skipWaiting(); 
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(cacheNames.map(cache => {
        if (cache !== CACHE_NAME) return caches.delete(cache);
      }));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Google Script aur non-GET requests ko bilkul touch na kare
  if (event.request.method !== 'GET' || event.request.url.includes('script.google.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Response milne par usse cache mein save karein
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      })
      .catch(() => {
        // Agar internet nahi hai, tabhi cache se uthaye
        return caches.match(event.request);
      })
  );
});
