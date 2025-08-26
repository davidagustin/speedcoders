const CACHE_NAME = 'speedcoders-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/offline',
  '/manifest.json',
  '/_next/static/css/app.css',
  '/_next/static/js/app.js',
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache.map(url => {
        return new Request(url, { cache: 'reload' });
      })).catch(err => {
        console.error('Failed to cache:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip Chrome extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle API requests differently
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone the response before caching
          const responseToCache = response.clone();
          
          // Cache successful API responses
          if (response.status === 200) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
          }
          
          return response;
        })
        .catch(() => {
          // Try to serve from cache if network fails
          return caches.match(request).then(response => {
            if (response) {
              return response;
            }
            // Return offline API response
            return new Response(
              JSON.stringify({ 
                error: 'You are offline. This feature requires an internet connection.' 
              }),
              {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                  'Content-Type': 'application/json'
                })
              }
            );
          });
        })
    );
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => {
          return caches.match('/offline').then(response => {
            if (response) {
              return response;
            }
            // Fallback offline page
            return new Response(
              `<!DOCTYPE html>
              <html>
                <head>
                  <title>Offline - SpeedCoders</title>
                  <style>
                    body {
                      font-family: system-ui, -apple-system, sans-serif;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      height: 100vh;
                      margin: 0;
                      background: #111827;
                      color: white;
                    }
                    .offline-container {
                      text-align: center;
                      padding: 2rem;
                    }
                    h1 { font-size: 2rem; margin-bottom: 1rem; }
                    p { color: #9ca3af; margin-bottom: 2rem; }
                    button {
                      background: #3b82f6;
                      color: white;
                      border: none;
                      padding: 0.75rem 1.5rem;
                      border-radius: 0.5rem;
                      font-size: 1rem;
                      cursor: pointer;
                    }
                    button:hover { background: #2563eb; }
                  </style>
                </head>
                <body>
                  <div class="offline-container">
                    <h1>You're Offline</h1>
                    <p>Please check your internet connection and try again.</p>
                    <button onclick="window.location.reload()">Try Again</button>
                  </div>
                </body>
              </html>`,
              {
                headers: { 'Content-Type': 'text/html' }
              }
            );
          });
        })
    );
    return;
  }

  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        // Cache static assets
        if (
          request.url.includes('/_next/static/') ||
          request.url.includes('/images/') ||
          request.url.includes('/fonts/')
        ) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }

        return response;
      });
    })
  );
});

// Background sync for offline quiz submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-quiz-results') {
    event.waitUntil(syncQuizResults());
  }
});

async function syncQuizResults() {
  const cache = await caches.open('quiz-submissions');
  const requests = await cache.keys();
  
  for (const request of requests) {
    try {
      const cachedResponse = await cache.match(request);
      const data = await cachedResponse.json();
      
      const response = await fetch(request, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        await cache.delete(request);
      }
    } catch (error) {
      console.error('Failed to sync quiz result:', error);
    }
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from SpeedCoders',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open SpeedCoders',
        icon: '/icon-check.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-close.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('SpeedCoders', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});