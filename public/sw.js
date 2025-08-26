// Service Worker for LeetCode Quiz Master PWA
const CACHE_NAME = "leetcode-quiz-master-v1.0.0";
const STATIC_CACHE = "leetcode-quiz-static-v1.0.0";
const RUNTIME_CACHE = "leetcode-quiz-runtime-v1.0.0";

// Files to cache on install
const STATIC_FILES = [
	"/",
	"/index.html",
	"/manifest.json",
	"/icons/icon-192x192.png",
	"/icons/icon-512x512.png",
];

// Install event - cache static files
self.addEventListener("install", (event) => {
	console.log("[SW] Install event");

	event.waitUntil(
		caches
			.open(STATIC_CACHE)
			.then((cache) => {
				console.log("[SW] Pre-caching static files");
				return cache.addAll(STATIC_FILES);
			})
			.then(() => {
				console.log("[SW] Skip waiting");
				return self.skipWaiting();
			}),
	);
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
	console.log("[SW] Activate event");

	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) => {
				return Promise.all(
					cacheNames.map((cacheName) => {
						if (cacheName !== STATIC_CACHE && cacheName !== RUNTIME_CACHE) {
							console.log("[SW] Deleting old cache:", cacheName);
							return caches.delete(cacheName);
						}
					}),
				);
			})
			.then(() => {
				console.log("[SW] Claiming clients");
				return self.clients.claim();
			}),
	);
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Handle different types of requests
	if (request.method === "GET") {
		// Handle navigation requests
		if (request.mode === "navigate") {
			event.respondWith(
				caches.match("/index.html").then((response) => {
					return response || fetch(request);
				}),
			);
			return;
		}

		// Handle static assets
		if (
			url.pathname.startsWith("/assets/") ||
			url.pathname.startsWith("/icons/") ||
			url.pathname === "/manifest.json"
		) {
			event.respondWith(
				caches.match(request).then((response) => {
					if (response) {
						return response;
					}

					return fetch(request).then((fetchResponse) => {
						// Cache successful responses
						if (fetchResponse && fetchResponse.status === 200) {
							const responseClone = fetchResponse.clone();
							caches.open(RUNTIME_CACHE).then((cache) => {
								cache.put(request, responseClone);
							});
						}
						return fetchResponse;
					});
				}),
			);
			return;
		}

		// Handle API or other requests with network-first strategy
		event.respondWith(
			fetch(request)
				.then((response) => {
					// Cache successful responses
					if (response && response.status === 200) {
						const responseClone = response.clone();
						caches.open(RUNTIME_CACHE).then((cache) => {
							cache.put(request, responseClone);
						});
					}
					return response;
				})
				.catch(() => {
					// Fallback to cache on network failure
					return caches.match(request);
				}),
		);
	}
});

// Handle background sync for offline data
self.addEventListener("sync", (event) => {
	if (event.tag === "quiz-results-sync") {
		event.waitUntil(syncQuizResults());
	}

	if (event.tag === "user-progress-sync") {
		event.waitUntil(syncUserProgress());
	}
});

// Sync quiz results when online
async function syncQuizResults() {
	try {
		const offlineResults = await getOfflineData("pending-quiz-results");
		if (offlineResults && offlineResults.length > 0) {
			// Process offline results
			console.log("[SW] Syncing quiz results:", offlineResults.length);

			// Clear offline data after successful sync
			await clearOfflineData("pending-quiz-results");
		}
	} catch (error) {
		console.error("[SW] Error syncing quiz results:", error);
	}
}

// Sync user progress when online
async function syncUserProgress() {
	try {
		const offlineProgress = await getOfflineData("pending-user-progress");
		if (offlineProgress && offlineProgress.length > 0) {
			console.log("[SW] Syncing user progress:", offlineProgress.length);

			// Clear offline data after successful sync
			await clearOfflineData("pending-user-progress");
		}
	} catch (error) {
		console.error("[SW] Error syncing user progress:", error);
	}
}

// Helper functions for offline data management
async function getOfflineData(key) {
	return new Promise((resolve) => {
		// Use IndexedDB or localStorage for offline data
		const data = localStorage.getItem(`offline-${key}`);
		resolve(data ? JSON.parse(data) : []);
	});
}

async function clearOfflineData(key) {
	return new Promise((resolve) => {
		localStorage.removeItem(`offline-${key}`);
		resolve();
	});
}

// Handle push notifications (for future use)
self.addEventListener("push", (event) => {
	const options = {
		body: event.data ? event.data.text() : "New coding challenge available!",
		icon: "/icons/icon-192x192.png",
		badge: "/icons/badge-72x72.png",
		vibrate: [100, 50, 100],
		data: {
			dateOfArrival: Date.now(),
			primaryKey: 1,
		},
		actions: [
			{
				action: "explore",
				title: "Start Quiz",
				icon: "/icons/action-quiz.png",
			},
			{
				action: "close",
				title: "Close",
				icon: "/icons/action-close.png",
			},
		],
	};

	event.waitUntil(
		self.registration.showNotification("LeetCode Quiz Master", options),
	);
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
	event.notification.close();

	if (event.action === "explore") {
		event.waitUntil(clients.openWindow("/quiz"));
	} else if (event.action === "close") {
		// Just close the notification
	} else {
		// Default action - open the app
		event.waitUntil(clients.openWindow("/"));
	}
});

// Handle messages from the main app
self.addEventListener("message", (event) => {
	if (event.data && event.data.type === "CACHE_QUIZ_DATA") {
		// Cache quiz data for offline use
		event.waitUntil(cacheQuizData(event.data.data));
	}

	if (event.data && event.data.type === "GET_CACHE_SIZE") {
		// Return cache size information
		event.waitUntil(
			getCacheSize().then((size) => {
				event.ports[0].postMessage({ cacheSize: size });
			}),
		);
	}
});

// Cache quiz data for offline use
async function cacheQuizData(data) {
	try {
		const cache = await caches.open(RUNTIME_CACHE);
		const response = new Response(JSON.stringify(data), {
			headers: { "Content-Type": "application/json" },
		});
		await cache.put("/offline-quiz-data", response);
		console.log("[SW] Cached quiz data for offline use");
	} catch (error) {
		console.error("[SW] Error caching quiz data:", error);
	}
}

// Get total cache size
async function getCacheSize() {
	try {
		const cacheNames = await caches.keys();
		let totalSize = 0;

		for (const cacheName of cacheNames) {
			const cache = await caches.open(cacheName);
			const keys = await cache.keys();

			for (const request of keys) {
				const response = await cache.match(request);
				if (response) {
					const blob = await response.blob();
					totalSize += blob.size;
				}
			}
		}

		return totalSize;
	} catch (error) {
		console.error("[SW] Error calculating cache size:", error);
		return 0;
	}
}

console.log("[SW] Service Worker registered successfully");
