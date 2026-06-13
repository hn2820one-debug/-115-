/* FoundationLearn Service Worker — 網路優先、快取備援（離線可用、預存 App shell 與 CDN 函式庫，唔會卡舊版）。 */
const CACHE = 'fl-cache-v2';

// App 自身檔案（same-origin、相對路徑，配合 GitHub Pages 子路徑）
const SHELL = [
  './', './index.html', './tool.html', './style.css',
  './app.js', './debug.js', './manifest.webmanifest', './icon.svg',
];
// CDN 函式庫（跨域 no-cors → opaque；必須預存先至離線可用。URL 要同 index.html 完全一致）
const CDN = [
  'https://cdn.jsdelivr.net/npm/marked@15.0.12/marked.min.js',
  'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
  'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js',
  'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
  'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.all(SHELL.map(u =>                                         // 逐個預存 App shell（單一檔 404 唔會拖冧成個 shell）
      c.add(u).catch(e => console.warn('SW precache miss:', u))));
    await Promise.all(CDN.map(u =>                                           // 預存 CDN（no-cors，存 opaque）
      c.add(new Request(u, { mode: 'no-cors' })).catch(() => {})));
    self.skipWaiting();                                                      // 新版立即接手
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))  // 清走舊版快取
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  e.respondWith(
    // 網路優先：有網路就攞最新（順手更新快取），離線則回快取
    fetch(req)
      .then(res => {
        if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req).then(hit => {
        if (hit) return hit;
        // 離線又未快取：課堂 JSON 回「JSON 錯誤」而非 index.html（否則 r.json() 會爆）；導航請求才回 App shell
        if (/\.json($|\?)/.test(req.url)) {
          return new Response(JSON.stringify({ error: 'offline', url: req.url }),
            { status: 503, headers: { 'Content-Type': 'application/json' } });
        }
        if (req.mode === 'navigate') return caches.match('./index.html');
        return Response.error();
      }))
  );
});
