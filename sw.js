const CACHE_NAME = 'attachment-style-v1';
const ASSETS = [
  '/attachment-style/',
  '/attachment-style/index.html',
  '/attachment-style/css/style.css',
  '/attachment-style/js/app.js',
  '/attachment-style/js/i18n.js',
  '/attachment-style/js/locales/ko.json',
  '/attachment-style/js/locales/en.json',
  '/attachment-style/js/locales/ja.json',
  '/attachment-style/js/locales/zh.json',
  '/attachment-style/js/locales/hi.json',
  '/attachment-style/js/locales/ru.json',
  '/attachment-style/js/locales/es.json',
  '/attachment-style/js/locales/pt.json',
  '/attachment-style/js/locales/id.json',
  '/attachment-style/js/locales/tr.json',
  '/attachment-style/js/locales/de.json',
  '/attachment-style/js/locales/fr.json',
  '/attachment-style/manifest.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (!event.request.url.startsWith(self.location.origin)) return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetched = fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || fetched;
    })
  );
});
