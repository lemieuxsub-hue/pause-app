// Pause service worker: receives push notifications and opens the app when one is tapped. No caching.
self.addEventListener('install', function (e) { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { title: 'Pause', body: e.data ? e.data.text() : '' }; }
  var title = d.title || 'Pause';
  var opts = { body: d.body || '', data: { url: d.url || './' }, icon: 'icon-180.png', badge: 'icon-180.png' };
  if (d.tag) opts.tag = String(d.tag);
  e.waitUntil(self.registration.showNotification(title, opts));
});

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (cs) {
    for (var i = 0; i < cs.length; i++) {
      if ('focus' in cs[i]) { cs[i].postMessage({ type: 'open', url: url }); return cs[i].focus(); }  // the page switches to that person
    }
    return self.clients.openWindow(url);
  }));
});
