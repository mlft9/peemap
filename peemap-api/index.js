const express = require("express");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const cors = require("cors");

// Charger les variables d'environnement
dotenv.config();

const app = express(); // Initialisation de `app` avant son utilisation
const PORT = process.env.PORT || 4000;

// Configurer la connexion à la base de données
const db = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "peemap",
  password: process.env.DB_PASSWORD || "U^xKrk601hmYSLsE0F#MJz#Y^j",
  database: process.env.DB_NAME || "peemap",
});

// Activer CORS pour toutes les origines
app.use(cors());

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Endpoint pour récupérer les entrées
app.get("/api/pee-entries", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM pee_entries");
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des données" });
  }
});

// Endpoint pour ajouter une nouvelle entrée
app.post("/api/pee-entries", async (req, res) => {
    const { lat, lng, description, icon } = req.body;
    try {
      const [result] = await db.query(
        "INSERT INTO pee_entries (lat, lng, description, icon) VALUES (?, ?, ?, ?)",
        [lat, lng, description, icon]
      );
      res.status(201).json({ id: result.insertId }); // Retourne l'ID généré
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de l'ajout de l'entrée" });
    }
  });

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur API en cours d'exécution sur le port : ${PORT}`);
});
