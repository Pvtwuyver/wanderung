// Verhoog VERSIE na elke wijziging zodat telefoons de nieuwe versie ophalen
const VERSIE = 'glasgow-v7';
const BESTANDEN = ['programma.html', 'manifest.webmanifest', 'images/glasgow/header.jpg', 'images/icons/icon-192.png', 'images/icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSIE).then(c => c.addAll(BESTANDEN)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSIE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Eerst netwerk (altijd de nieuwste versie), offline terugvallen op de cache
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok && new URL(e.request.url).origin === location.origin) {
        const kopie = res.clone();
        caches.open(VERSIE).then(c => c.put(e.request, kopie));
      }
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
