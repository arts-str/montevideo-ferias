const CACHE_NAME = 'myapp-cache-v1';
const OFFLINE_URL = '/offline.html'; // optional

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/script.js',
        '/fetch.js',
        '/map.js',
        '/ferias.json',
        '/assets/mf-logo-192.png',
        '/assets/mf-logo-512.png',
        '/assets/mf-startup.png',
        '/assets/mf-logo-180.png',
        OFFLINE_URL
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
