import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`)
      await navigator.serviceWorker.ready

      const assetsToCache = [
        window.location.href,
        ...performance
          .getEntriesByType('resource')
          .map((entry) => entry.name)
          .filter((url) => url.startsWith(window.location.origin)),
      ]

      registration.active?.postMessage({
        type: 'CACHE_URLS',
        urls: assetsToCache,
      })
    } catch (error) {
      console.warn('Offline support could not be started.', error)
    }
  })
}
