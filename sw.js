/* Kirana Poster Maker - service worker (network-first) */
const CACHE='kirana-poster-v27';

self.addEventListener('install',e=>{
  self.skipWaiting();
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  // AI background jaisi bahar ki images cache me mat bharo (sirf app + Google font)
  const u=new URL(e.request.url);
  const own=u.origin===self.location.origin;
  if(!own&&!/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname))return;
  // apni app ki files: browser ka HTTP cache bypass (internet ho to hamesha naya version);
  // cache me ?r=… jaise query ke bina ek hi copy rakho
  const req=own?new Request(e.request.url,{cache:'no-store',credentials:'same-origin'}):e.request;
  const key=own?u.origin+u.pathname:e.request;
  e.respondWith(
    fetch(req).then(res=>{
      if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(key,copy)).catch(()=>{});}
      return res;
    }).catch(()=>caches.match(key).then(hit=>hit||caches.match(new URL('./index.html',self.registration.scope).href))
      .then(hit=>hit||caches.match(self.registration.scope)))
  );
});
