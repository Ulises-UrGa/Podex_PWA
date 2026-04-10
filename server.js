const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// CONEXIÓN BD
mongoose.connect("mongodb://localhost:27017/pokedex", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB conectado"))
  .catch(err => console.log(err));

// RUTAS
app.use("/api/favorites", require("./"));

app.listen(3000, () => {
    console.log("Servidor en http://localhost:3000");
});
