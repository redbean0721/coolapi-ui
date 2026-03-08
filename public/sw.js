const CACHE_NAME = 'coolapi-v1';
const urlsToCache = [
    '/',
    '/index.html',
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

// 攔截請求，快取優先策略
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    
    const url = new URL(event.request.url);
    
    // 只快取同個網域的資源
    if (url.origin !== self.location.origin) return;
    
    // API 請求（真實 API 路由 /api/* 或 /api/）不快取，直接走網路
    // 但允許 /assets/ 下的資源被快取
    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
        event.respondWith(fetch(event.request));
        return;
    }
    
    event.respondWith(
        caches.match(event.request).then(response => {
            // 如果有快取，直接返回快取，同時在背景更新
            if (response) {
                // Stale-While-Revalidate: 返回快取，同時背景更新
                fetch(event.request).then(fetchResponse => {
                    if (fetchResponse && fetchResponse.status === 200) {
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, fetchResponse);
                        });
                    }
                }).catch(() => {});
                return response;
            }
            
            // 沒快取，從網路取得並快取
            return fetch(event.request).then(fetchResponse => {
                if (fetchResponse && fetchResponse.status === 200) {
                    const responseToCache = fetchResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return fetchResponse;
            }).catch(() => {
                // 導航請求失敗時，返回 index.html（處理 SPA 路由）
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
                throw new Error('Network request failed');
            });
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