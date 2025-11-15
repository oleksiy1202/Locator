// Service Worker для PWA
const CACHE_NAME = 'location-app-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Файли для кешування при встановленні
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
];

// Встановлення Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Встановлення...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Кешування статичних файлів');
      return cache.addAll(STATIC_FILES);
    })
  );
  self.skipWaiting();
});

// Активація Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Активація...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('[SW] Видалення старого кешу:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Стратегія кешування: Network First, потім Cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Пропускаємо non-GET запити
  if (request.method !== 'GET') return;

  // Для API запитів (геокодування) - завжди мережа
  if (request.url.includes('nominatim.openstreetmap.org')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(JSON.stringify({ error: 'Офлайн режим' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // Для тайлів карти - Cache First
  if (request.url.includes('tile.openstreetmap.org')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return cachedResponse || fetch(request).then((response) => {
          return caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, response.clone());
            return response;
          });
        });
      })
    );
    return;
  }

  // Для всього іншого - Network First, fallback to Cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Клонуємо відповідь для кешування
        const responseClone = response.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Якщо мережа недоступна, шукаємо в кеші
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback для навігації
          if (request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Повідомлення від клієнта
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

