const CACHE_NAME = 'document-generator-v4'
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './tenderH.jpg',
  './favicon.svg',
  './icons.svg',
  './templates/chemistry-page-1.png',
  './templates/chemistry-page-2.png',
  './templates/demicrobiology-page-1.png',
  './templates/microbiology-drug-page-1.png',
  './templates/hematology-page-1.png',
]

function fromScope(path) {
  return new URL(path, self.registration.scope).toString()
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL.map(fromScope)))
      .then(() => self.skipWaiting()),
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

self.addEventListener('message', (event) => {
  if (event.data?.type !== 'CACHE_URLS') return

  const urls = [...new Set(event.data.urls || [])]
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(
        urls.map((url) =>
          fetch(url, { cache: 'reload' }).then((response) => {
            if (response.ok) {
              return cache.put(url, response)
            }
            return undefined
          }),
        ),
      ),
    ),
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseCopy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(fromScope('./index.html'), responseCopy))
          return response
        })
        .catch(() => caches.match(fromScope('./index.html')).then((response) => response || caches.match(fromScope('./')))),
    )
    return
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse

      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            const responseCopy = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseCopy))
          }
          return networkResponse
        })
        .catch(() => caches.match(fromScope('./index.html')))
    }),
  )
})
