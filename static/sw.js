// Service Worker for OnlyFlans
// Basic caching strategy for static assets

const CACHE_NAME = 'onlyflans-v1.0.0';
const STATIC_CACHE = 'onlyflans-static-v1.0.0';
const DYNAMIC_CACHE = 'onlyflans-dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/static/web/css/base.css',
    '/static/web/css/theme.css',
    '/static/web/css/components.css',
    '/static/web/css/layout.css',
    '/static/web/css/navbar.css',
    '/static/web/css/hero.css',
    '/static/web/css/forms.css',
    '/static/web/css/modals.css',
    '/static/web/css/gallery.css',
    '/static/web/js/main.js',
    '/static/web/js/performance.js',
    '/static/OnlyFlans.png',
    '/static/flan.ico'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('[SW] Installing service worker');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .catch(error => {
                console.error('[SW] Error caching static assets:', error);
            })
    );
    // Force activation
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[SW] Activating service worker');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Take control of all clients
    self.clients.claim();
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return;
    }

    // Cache-first strategy for static assets
    if (STATIC_ASSETS.includes(url.pathname) || request.destination === 'style' || request.destination === 'script') {
        event.respondWith(
            caches.match(request)
                .then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    return fetch(request)
                        .then(response => {
                            // Cache successful responses
                            if (response.status === 200) {
                                const responseClone = response.clone();
                                caches.open(STATIC_CACHE)
                                    .then(cache => cache.put(request, responseClone));
                            }
                            return response;
                        })
                        .catch(() => {
                            // Return offline fallback for critical assets
                            if (request.destination === 'document') {
                                return caches.match('/');
                            }
                        });
                })
        );
    }
    // Network-first strategy for dynamic content
    else {
        event.respondWith(
            fetch(request)
                .then(response => {
                    // Cache successful responses
                    if (response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(DYNAMIC_CACHE)
                            .then(cache => cache.put(request, responseClone));
                    }
                    return response;
                })
                .catch(() => {
                    // Return cached version if available
                    return caches.match(request);
                })
        );
    }
});

// Background sync for failed requests (future enhancement)
self.addEventListener('sync', event => {
    console.log('[SW] Background sync triggered:', event.tag);

    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

function doBackgroundSync() {
    // Implement background sync logic here
    // This could retry failed form submissions, etc.
    console.log('[SW] Performing background sync');
}

// Push notifications (future enhancement)
self.addEventListener('push', event => {
    console.log('[SW] Push notification received');

    const options = {
        body: event.data ? event.data.text() : 'Nueva notificación de OnlyFlans',
        icon: '/static/flan.ico',
        badge: '/static/flan.ico',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Ver productos',
                icon: '/static/OnlyFlans.png'
            },
            {
                action: 'close',
                title: 'Cerrar'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('OnlyFlans', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
    console.log('[SW] Notification clicked:', event.action);

    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});