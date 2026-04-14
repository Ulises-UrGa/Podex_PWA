const container = document.getElementById("pokemon-container");
const searchInput = document.getElementById("search");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeModal = document.getElementById("close");

// 🔥 NUEVO
const offlineBanner = document.getElementById("offlineBanner");

let allPokemon = [];
let currentPokemon = null;
let shinyActive = false;


// =========================
// 🔌 DETECTAR CONEXIÓN
// =========================
window.addEventListener("offline", () => {
    offlineBanner.style.display = "block";
});

window.addEventListener("online", () => {
    offlineBanner.style.display = "none";
});

if (!navigator.onLine) {
    offlineBanner.style.display = "block";
}


// =========================
// CARGAR POKEMON
// =========================
async function loadGeneration(startId, endId) {

container.innerHTML = "Cargando Pokémon...";
allPokemon = [];

const requests = [];

for (let i = startId; i <= endId; i++) {

requests.push(
fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
.then(res => res.json())
);

}

try {

allPokemon = await Promise.all(requests);

} catch (error) {

container.innerHTML = `
<h2>⚠️ Sin conexión</h2>
<p>No se pudieron cargar los Pokémon</p>
`;

return;

}

renderPokemon(allPokemon);

}


// =========================
// RENDER
// =========================
function renderPokemon(list) {

container.innerHTML = "";

list.forEach(pokemon => {

const card = document.createElement("div");
card.className = "card";

const typesHTML = pokemon.types
.map(t => `<span class="type ${t.type.name}">${t.type.name}</span>`)
.join("");

card.innerHTML = `
<img src="${pokemon.sprites.front_default}">
<h3>#${pokemon.id} ${pokemon.name}</h3>
${typesHTML}
`;

card.onclick = () => showDetails(pokemon);

container.appendChild(card);

});

}


// =========================
// MODAL
// =========================
function showDetails(pokemon) {

currentPokemon = pokemon;
shinyActive = false;

renderModal();

modal.classList.remove("hidden");

}

function renderModal() {

const sprite = shinyActive
? currentPokemon.sprites.front_shiny
: currentPokemon.sprites.front_default;

const statsHTML = currentPokemon.stats.map(stat =>
`<p>${stat.stat.name}: ${stat.base_stat}</p>`
).join("");

modalBody.innerHTML = `

<h2>${currentPokemon.name}</h2>

<img src="${sprite}">

<button class="shiny-btn" onclick="toggleShiny()">
${shinyActive ? "Normal" : "Shiny"}
</button>

<button onclick="saveFavoriteLocal(currentPokemon)">
⭐ Guardar favorito
</button>

${statsHTML}

`;

}

function toggleShiny() {

shinyActive = !shinyActive;

renderModal();

}


// =========================
// MODAL EVENTS
// =========================
closeModal.onclick = () => modal.classList.add("hidden");

modal.onclick = e => {
if (e.target === modal)
modal.classList.add("hidden");
};


// =========================
// BUSCADOR
// =========================
searchInput.addEventListener("input", () => {

const value = searchInput.value.toLowerCase();

const filtered = allPokemon.filter(p =>
p.name.includes(value) ||
p.id.toString() === value
);

renderPokemon(filtered);

});


// =========================
// FAVORITOS
// =========================
function saveFavoriteLocal(pokemon){

if (!navigator.onLine) {
    alert("⚠️ Estás sin conexión, pero se guardará localmente");
}

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

favorites.push({

id: pokemon.id,
name: pokemon.name,
shiny: shinyActive

});

localStorage.setItem("favorites", JSON.stringify(favorites));

alert("Pokémon guardado ⭐");

}


// =========================
// PWA INSTALL
// =========================
let deferredPrompt;

const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e)=>{

e.preventDefault();

deferredPrompt = e;

installBtn.style.display="block";

});

installBtn.addEventListener("click", async()=>{

if(!deferredPrompt) return;

deferredPrompt.prompt();

const result = await deferredPrompt.userChoice;

deferredPrompt=null;

});


// =========================
// INICIO
// =========================
loadGeneration(1,151);


// =========================
// SW REGISTER
// =========================
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js");
}