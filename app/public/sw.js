// Permet d'ouvrir Newday sans internet.
// La page est toujours redemandée en ligne d'abord (pour avoir la dernière version),
// et on garde une copie pour les moments sans réseau.
const CACHE = 'newday-v1';
self.addEventListener('install', (e) => {
  // On garde tout de suite la page et le code de l'app (lu dans la page).
  e.waitUntil(caches.open(CACHE).then(async (c) => {
    await c.addAll(['/Newday/', '/Newday/manifest.webmanifest', '/Newday/icon-192.png']);
    const html = await (await c.match('/Newday/')).text();
    const js = [...html.matchAll(/src="(\/Newday\/_expo\/[^"]+)"/g)].map((m) => m[1]);
    await c.addAll(js);
  }).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin + '/Newday/')) return;
  // Les fichiers de l'app ont un nom unique à chaque version : la copie suffit.
  if (req.url.includes('/_expo/')) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    })));
    return;
  }
  // Le reste : d'abord en ligne, sinon la copie.
  e.respondWith(fetch(req).then((res) => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req).then((hit) => hit || caches.match('/Newday/'))));
});
