// ======================================
// SERVICE WORKER POKEDEX
// ======================================
 
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
 
 
// =============================
// 1. INSTALL
// Guarda archivos de la app
// =============================
self.addEventListener("install", event => {
 
    console.log("Service Worker instalado");
 
    event.waitUntil(
 
        caches.open(CACHE_NAME)
        .then(cache => {
 
            console.log("Cacheando archivos estáticos");
 
            return cache.addAll(STATIC_ASSETS);
 
        })
 
    );
 
});
 
 
// =============================
// 2. ACTIVATE
// Limpia caches antiguos
// =============================
self.addEventListener("activate", event => {
 
    console.log("Service Worker activado");
 
    event.waitUntil(
 
        caches.keys().then(keys => {
 
            return Promise.all(
 
                keys.map(key => {
 
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
 
                })
 
            );
 
        })
 
    );
 
});
 
 
// =============================
// 3. FETCH
// Manejo de peticiones
// =============================
self.addEventListener("fetch", event => {
 
    const url = event.request.url;
 
 
    // -------------------------
    // API POKEMON
    // Cache dinámico
    // -------------------------
    if (url.includes("pokeapi.co")) {
 
        event.respondWith(
 
            caches.open("pokemon-api-cache")
            .then(cache =>
 
                cache.match(event.request)
                .then(response => {
 
                    if (response) {
                        return response;
                    }
 
                    return fetch(event.request)
                    .then(networkResponse => {
 
                        cache.put(event.request, networkResponse.clone());
 
                        return networkResponse;
 
                    });
 
                })
 
            )
 
        );
 
        return;
 
    }
 
 
    // -------------------------
    // ARCHIVOS DE LA APP
    // Cache first
    // -------------------------
    event.respondWith(
 
        caches.match(event.request)
        .then(response => {
 
            if (response) {
                return response;
            }
 
            return fetch(event.request)
            .catch(() => {
 
                if (event.request.mode === "navigate") {
                    return caches.match("./offline.html");
                }
 
            });
 
        })
 
    );
 
});