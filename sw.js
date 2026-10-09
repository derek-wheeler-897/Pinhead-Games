const C='pinhead-games-sourced-objective-packs-v2';;
const ASSETS=['./','./index.html','./manifest.webmanifest','./pinhead-splash.webp','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./objective-packs.js','./objective-packs-2.js'];

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