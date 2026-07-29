const CACHE_NAME = 'mirzapur-mandal-v2'; // Version बदल दिया गया है ताकि ब्राउज़र नया अपडेट ले

// GitHub Pages के लिए relative paths (./) का इस्तेमाल ज़रुरी है
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// 1. Install Event: नए वर्शन को इंस्टॉल करेगा
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting(); // नए सर्विस वर्कर को तुरंत एक्टिव करने के लिए
});

// 2. Activate Event: पुराने 'v1' वाले Cache को हमेशा के लिए डिलीट करेगा (Zero Deletion Rule Fixed)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Event (Network First Strategy): 
// अब यह हमेशा पहले इंटरनेट से नया कोड लाएगा। इंटरनेट बंद होने पर ही कैश (Cache) का इस्तेमाल करेगा।
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
