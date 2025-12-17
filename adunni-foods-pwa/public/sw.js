const CACHE_NAME = "adunni-foods-v1"
const urlsToCache = ["/", "/products", "/track", "/offline", "/manifest.json", "/icon-192x192.png", "/icon-512x512.png"]

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

// Fetch event - serve from cache when offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      if (response) {
        return response
      }
      return fetch(event.request).catch(() => {
        // If both cache and network fail, show offline page
        if (event.request.destination === "document") {
          return caches.match("/offline")
        }
      })
    }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})
