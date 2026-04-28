const CACHE_NAME = 'smart-khata-v1';
const assetsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest',
  'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap'
];

// সার্ভিস ওয়ার্কার ইনস্টল করার সময় ফাইলগুলো ক্যাশ করা
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching assets...');
      return cache.addAll(assetsToCache);
    })
  );
});

// অফলাইনে ফাইলগুলো মেমোরি (Cache) থেকে খুঁজে বের করা
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      // যদি ক্যাশে ফাইল থাকে তবে সেটাই দাও, না থাকলে নেটওয়ার্ক থেকে আনো
      return response || fetch(e.request);
    })
  );
});

// পুরনো ক্যাশ ডিলিট করা (যদি ভার্সন আপডেট হয়)
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
});
