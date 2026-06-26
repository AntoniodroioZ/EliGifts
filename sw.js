const CACHE_NAME = 'eli-gifts-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './icon-192.png',
  './icon-512.png',
  './manifest.json',
  './projects/tulip-field.html',
  './projects/airbnb-weekend.html',
  './projects/vinyl-player.html',
  './projects/scratch-card.html',
  './projects/gallery-wall.html',
  './projects/gift-boxes.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Si la red responde correctamente, actualizamos la caché con la nueva versión
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
        }
        return networkResponse;
      })
      .catch(() => {
        // Si la red falla (está sin internet), servimos desde la caché
        return caches.match(event.request);
      })
  );
});
