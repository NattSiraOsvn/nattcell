
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

workbox.setConfig({ debug: false });

// Cache các tài nguyên tĩnh
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'script' ||
                   request.destination === 'style' ||
                   request.destination === 'image',
  new workbox.strategies.CacheFirst()
);

// Cache các request API với StaleWhileRevalidate
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'api-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24, // 24 giờ
      }),
    ],
  })
);
