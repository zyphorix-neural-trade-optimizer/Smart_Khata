const CACHE_NAME = 'bakir-khata-v1';
const assetsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest',
  'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap'
];

// ইনস্টল করার সময় সব ফাইল ক্যাশ করা
self.addEventListener('install', e => {
  self.skipWaiting(); // নতুন সার্ভিস ওয়ার্কারকে সাথে সাথে একটিভ করা
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assetsToCache);
    })
  );
});

// একটিভ করার সময় পুরনো ক্যাশ পরিষ্কার করা
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  return self.clients.claim();
});

// মেইন ফিক্স: ক্যাশ থেকে ফাইল আগে লোড করা
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      // যদি ক্যাশে থাকে তবে সেটাই দাও (অফলাইনের জন্য পারফেক্ট)
      // সাথে সাথে নেটওয়ার্ক থেকেও আপডেট আনার চেষ্টা করো
      const fetchPromise = fetch(e.request).then(networkResponse => {
        caches.open(CACHE_NAME).then(cache => {
          cache.put(e.request, networkResponse.clone());
        });
        return networkResponse;
      }).catch(() => {
        // নেট না থাকলে কোনো এরর দেখাবে না, শুধু ক্যাশ ফাইলটাই থাকবে
      });

      return cachedResponse || fetchPromise;
    })
  );
});
