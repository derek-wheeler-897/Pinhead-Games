const C='pinhead-games-v7';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.jpg','./icon-512.jpg','./apple-touch-icon.jpg','./splash-small.jpg'];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(C).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(key=>key!==C&&key.startsWith('pinhead-games-')).map(key=>caches.delete(key))
    )).then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  event.respondWith(
    fetch(event.request).then(response=>{
      const copy=response.clone();
      caches.open(C).then(cache=>cache.put(event.request,copy)).catch(()=>{});
      return response;
    }).catch(()=>caches.match(event.request).then(cached=>cached||caches.match('./index.html')))
  );
});