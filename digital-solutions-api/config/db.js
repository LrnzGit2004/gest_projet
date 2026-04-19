const { Pool } = require("pg");
require("dotenv").config();

// Configuration du Pool utilisant la variable d'environnement
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Écouteur d'événement pour vérifier que la connexion réussit au démarrage
pool.on("connect", () => {
  console.log("📦 Connexion au Pool PostgreSQL établie avec succès.");
});

pool.on("error", (err) => {
  console.error("❌ Erreur inattendue sur le client PostgreSQL", err);
  process.exit(-1);
});

// Nous exportons une méthode 'query' personnalisée
// Cela nous permettra d'importer directement ce fichier dans nos contrôleurs
module.exports = {
  query: (text, params) => pool.query(text, params),
};
