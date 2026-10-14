const CACHE_NAME = 'promptforge-cache-v6';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/custom.css',
  './js/schema.js',
  './js/app.js',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/webfonts/fa-solid-900.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/webfonts/fa-solid-900.ttf',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/webfonts/fa-regular-400.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/webfonts/fa-regular-400.ttf',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/webfonts/fa-brands-400.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/webfonts/fa-brands-400.ttf'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching offline assets');
      return Promise.allSettled(
        STATIC_ASSETS.map((asset) => cache.add(asset).catch((err) => {
          console.warn('[SW] Failed to cache asset:', asset, err);
        }))
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Purging old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests with http/https protocols
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (!url.protocol.startsWith('http')) return;

  // Navigation requests (launching the PWA or navigating pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Attempt network fetch first to get the most recent page
          const networkResponse = await fetch(event.request);
          if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (fetchError) {
          console.warn('[SW] Navigation fetch failed, falling back to cache:', fetchError);
          // Fall back to cached index.html or root, ignoring any launch search parameters
          const cached = await caches.match(event.request, { ignoreSearch: true })
            || await caches.match('./index.html', { ignoreSearch: true })
            || await caches.match('./', { ignoreSearch: true });
          if (cached) {
            return cached;
          }
          throw fetchError;
        }
      })()
    );
    return;
  }

  // Stale-While-Revalidate caching strategy for static and external app assets
  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(event.request, { ignoreSearch: true });

      const networkFetchPromise = fetch(event.request).then(async (networkResponse) => {
        if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      }).catch((err) => {
        console.warn('[SW] Asset fetch failed:', event.request.url, err);
        return null;
      });

      // If cached response exists, return it immediately and update cache in background
      if (cachedResponse) {
        event.waitUntil(networkFetchPromise);
        return cachedResponse;
      }

      // If not cached, wait for network response
      const networkResponse = await networkFetchPromise;
      if (networkResponse) {
        return networkResponse;
      }

      // Fallback if network failed and not cached
      return new Response('Network error occurred', {
        status: 408,
        headers: { 'Content-Type': 'text/plain' }
      });
    })()
  );
});
