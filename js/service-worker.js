const CACHE_NAME = 'ferias-cache-v1';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './styles.css',
        './script.js',
        './fetch.js',
        './map.js',
        './ferias.json',
        './assets/mf-logo-192.png',
        './assets/mf-logo-512.png',
        './assets/mf-startup.png',
        './assets/mf-logo-180.png'
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
