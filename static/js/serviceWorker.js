self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('revolution').then((cache) => {
      return cache.addAll([
        '/',
      ]);
    })
  );
});

self.addEventListener('fetch', async (event) => {
  if (event.request.url.endsWith('/testing.txt')) {
    event.respondWith(
      new Response('foo', {
        headers: {
          'Content-Type': 'text/plain'
        }
      })
    );
  } else {
    const response = await caches.match(event.request);
    event.respondWith(response || fetch(event.request));
  }
});

self.addEventListener('activate', async (event) => {
  const cache = await caches.open('revolution');
  const data = await (await cache.match('/static/version.json')).json();
  if (data.version !== localStorage.getItem("CACHE_VERSION")) {
    await cache.delete('/');
    await cache.addAll([
      '/',
    ]);
    localStorage.setItem("CACHE_VERSION", data.version)
    console.log('Cache cleared and updated');
  }
  event.waitUntil(Promise.resolve());
});