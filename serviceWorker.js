const CACHE_NAME = "PWA"
const urlsToCache = ["/"]


// INSTALL SW
self.addEventListener("install",  (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache")
      cache.addAll(urlsToCache)
      return console.log("Cached all urls." + urlsToCache)
    })
  )
})

// Wait for any occuring caching and listen for requests.
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
    .then(() => {
      return fetch(event.request).catch(() => caches.match(urlsToCache))
    }))
})

// ACTIVATE THE SW
self.addEventListener('activate', (event) => {console.log("Activated the serviceWorker successfully.")})