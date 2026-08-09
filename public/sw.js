const CACHE_NAME = 'desa-narmada-pwa-v12';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/tailwind.css',
  '/script_warga.js',
  '/script_admin.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache v12');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Hanya proses request GET
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Jangan pernah cache request API atau request ke Google Script
  if (url.pathname.startsWith('/api/') || url.hostname === 'script.google.com') {
    return;
  }

  // Stale-while-revalidate strategy untuk aset eksternal dan lokal
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200 && (networkResponse.type === 'basic' || networkResponse.type === 'cors')) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            if (event.request.url.startsWith('http')) {
              cache.put(event.request, responseToCache);
            }
          });
        }
        return networkResponse;
      }).catch(() => {
        // Abaikan error fetch, biarkan cachedResponse yang direturn jika ada
      });

      return cachedResponse || fetchPromise;
    })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});
