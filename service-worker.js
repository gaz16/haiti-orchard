var cacheName = 'haitiOrchardPWA-2';
var dataCacheName = 'haitiOrchardData-1';
var dataUrl = 'https://haiti-orchard.firebaseio.com/assignments/123456';
var userUrl = 'https://haiti-orchard.firebaseio.com/users';
var filesToCache = [
  '/',
  '/index.html',
  '/src/haiti-orchard-app/orchard-survey.html',
  '/src/haiti-orchard-app/tree-survey.html',
  '/src/haiti-orchard-app/supervisor-home.html',
  '/src/haiti-orchard-app/add-user.html',
  '/src/haiti-orchard-app/add-orchard.html',
  '/src/haiti-orchard-app/add-assignment.html',
  '/images/clipboards.png',
  '/images/employees.png',
  '/images/forest.png',
  '/fetchassignments.js',
  '/orchardsurvey.js',
  '/treesurvey.js',
  '/users.js',
  '/orchards.js',
  '/assignments.js'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if(key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  if (e.request.url.startsWith(dataUrl) || e.request.url.startsWith(userUrl)) {
    e.respondWith(
      fetch(e.request)
        .then(function(response) {
          return caches.open(dataCacheName).then(function(cache) {
            if (cache.match(e.request)) {
              console.log("this request already exists in cache: " + e.request.url);
            }
            cache.put(e.request.url, response.clone());
            console.log('[ServiceWorker] Fetched&Cached Data');
            return response;
          });
        }).catch(function(reponse) {
          console.log("request failed!");
          caches.match(e.request).then(function(response) {
            return response;
          })
        })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});
