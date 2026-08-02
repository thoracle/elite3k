/* ELITE 3K service worker — cache-first for the game shell and the three.js CDN */
const CACHE='e3k-v4';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET')return;
  if(u.origin!==location.origin&&u.hostname!=='cdn.jsdelivr.net')return;
  e.respondWith(
    caches.open(CACHE).then(async c=>{
      const hit=await c.match(e.request);
      if(hit)return hit;
      const res=await fetch(e.request);
      if(res.ok)c.put(e.request,res.clone());
      return res;
    })
  );
});
