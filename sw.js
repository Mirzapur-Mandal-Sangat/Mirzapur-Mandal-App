const CACHE_NAME = 'mirzapur-mandal-v3';

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        return response;
      })
      .catch(error => {
        // अगर नेटवर्क फेल हुआ, तो मेन पेज को रिफ्रेश का सिग्नल भेजें
        self.clients.matchAll().then(clients => {
          clients.forEach(client => client.postMessage('reload_page'));
        });
        return caches.match(event.request);
      })
  );
});
