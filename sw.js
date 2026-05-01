const CACHE_NAME = 'document-generator-v3'
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/tenderH.jpg',
  '/favicon.svg',
  '/icons.svg',
  '/templates/chemistry-page-1.png',
  '/templates/chemistry-page-2.png',
  '/templates/demicrobiology-page-1.png',
  '/templates/microbiology-drug-page-1.png',
  '/templates/hematology-page-1.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse

      return fetch(event.request)
        .then((networkResponse) => {
          const responseCopy = networkResponse.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseCopy))
          return networkResponse
        })
        .catch(() => caches.match('/index.html'))
    }),
  )
})
