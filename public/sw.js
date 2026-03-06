const CACHE_NAME = 'coolapi-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/site.webmanifest'
];

// 安裝時快取資源
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting();
});

// 攔截請求，先查快取，再查網路
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        }).catch(() => {
            return caches.match('/index.html');
        })
    );
});

// 更新時清除舊快取
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
        return Promise.all(
            cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
                return caches.delete(cacheName);
            }
            })
        );
        })
    );
});