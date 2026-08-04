/* ELITE 3K service worker.
   Same-origin files use stale-while-revalidate: the cached copy is served
   immediately (so the game launches offline and instantly) while a fresh copy
   is fetched in the background for next time. That means a deploy reaches
   players on their following launch WITHOUT anyone having to remember to bump
   the cache name — the failure mode that would otherwise pin people to a stale
   build indefinitely, with no error to diagnose.
   The three.js CDN is version-pinned in the import map and therefore
   immutable, so it stays pure cache-first. */
const CACHE='e3k-v7';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
const CDN='cdn.jsdelivr.net';

self.addEventListener('install',e=>{
  e.waitUntil(
    caches.open(CACHE)
      // one unreachable URL must not abort the entire install
      .then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{}))))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const u=new URL(req.url);
  const sameOrigin=u.origin===location.origin;
  if(!sameOrigin&&u.hostname!==CDN)return;

  e.respondWith((async()=>{
    const c=await caches.open(CACHE);
    // ignoreSearch: ?headless=1 and similar must still resolve to the cached
    // page rather than missing entirely and failing when offline
    const hit=await c.match(req,{ignoreSearch:sameOrigin});

    if(!sameOrigin){                      // CDN: immutable, cache-first
      if(hit)return hit;
      try{
        const res=await fetch(req);
        if(res&&res.ok)c.put(req,res.clone());
        return res;
      }catch(err){
        return new Response('',{status:504,statusText:'Offline and not cached'});
      }
    }

    // same-origin: serve what we have now, refresh it in the background
    const network=fetch(req).then(res=>{
      if(res&&res.ok)c.put(req,res.clone());
      return res;
    }).catch(()=>null);

    if(hit){e.waitUntil(network);return hit;}
    const res=await network;
    if(res)return res;
    // offline with nothing cached: fall back to the app shell for navigations
    if(req.mode==='navigate'){
      const shell=await c.match('./index.html');
      if(shell)return shell;
    }
    return new Response('',{status:504,statusText:'Offline and not cached'});
  })());
});
