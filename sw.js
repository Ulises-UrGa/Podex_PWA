const CACHE_NAME = "pokedex-cache-v1";

const STATIC_ASSETS = [
    "./",
    "./index.html",
    "./css/style.css",
    "./js/app.js",
    "./manifest.json",
    "./offline.html",
    "./img/icon-192.png",
    "./img/icon-512.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(STATIC_ASSETS))
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );
});

self.addEventListener("fetch", event => {

    // 🔥 navegación (offline page)
    if (event.request.mode === "navigate") {
        event.respondWith(
            fetch(event.request)
                .catch(() => caches.match("./offline.html"))
        );
        return;
    }

    // 🔥 API pokemon
    if (event.request.url.includes("pokeapi.co")) {
        event.respondWith(
            caches.open("pokemon-api-cache")
                .then(cache =>
                    fetch(event.request)
                        .then(res => {
                            cache.put(event.request, res.clone());
                            return res;
                        })
                        .catch(() => cache.match(event.request))
                )
        );
        return;
    }

    // 🔥 archivos
    event.respondWith(
        caches.match(event.request)
            .then(res => res || fetch(event.request))
    );

});