const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
    userId: String,
    pokemonId: Number,
    name: String,
    isShiny: Boolean
});

module.exports = mongoose.model("Favorite", favoriteSchema);