const V='wikagym-v6';
const ARQ=['./','index.html','manifest.webmanifest','icon.svg','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(ARQ)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.open(V).then(async c=>{
    const guardado=await c.match(e.request,{ignoreSearch:true});
    const rede=fetch(e.request).then(n=>{if(n&&n.ok&&new URL(e.request.url).origin===location.origin)c.put(e.request,n.clone());return n;}).catch(()=>null);
    return guardado||(await rede)||c.match('index.html');
  }));
});
