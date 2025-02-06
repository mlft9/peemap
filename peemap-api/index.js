const express = require("express");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

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
app.use(express.json({ limit: "10mb" }));

// Chemin du répertoire de stockage des photos
const PHOTO_DIRECTORY = "/opt/cdn/photodesgens";

// Vérifier si le répertoire existe, sinon le créer
if (!fs.existsSync(PHOTO_DIRECTORY)) {
  console.log(`Le répertoire ${PHOTO_DIRECTORY} n'existe pas. Création en cours...`);
  fs.mkdirSync(PHOTO_DIRECTORY, { recursive: true });
  console.log(`Répertoire ${PHOTO_DIRECTORY} créé avec succès.`);
} else {
  console.log(`Le répertoire ${PHOTO_DIRECTORY} existe déjà.`);
}

// Configuration de multer pour l'upload des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Destination du fichier définie : ", PHOTO_DIRECTORY);
    cb(null, PHOTO_DIRECTORY); // Répertoire pour stocker les fichiers
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    console.log(`Nom du fichier généré : ${uniqueName}`);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fieldSize: 10 * 1024 * 1024, // Taille maximale par champ texte (10 Mo)
    fileSize: 5 * 1024 * 1024,  // Taille maximale pour les fichiers (5 Mo)
    fields: 10,                 // Nombre maximal de champs non fichier
    files: 1,                   // Nombre maximal de fichiers
  },
});

// Endpoint pour récupérer les entrées
app.get("/api/pee-entries", async (req, res) => {
  try {
    console.log("Récupération des entrées depuis la base de données...");
    const [rows] = await db.query("SELECT * FROM pee_entries");
    console.log(`Entrées récupérées : ${rows.length} enregistrements trouvés.`);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données" });
  }
});

// Endpoint pour ajouter une nouvelle entrée avec photo
app.post("/api/pee-entries", upload.single("photo"), async (req, res) => {
  console.log("Requête POST reçue pour ajouter une entrée...");
  console.log("Données reçues (req.body) : ", req.body);

  const { lat, lng, description, icon } = req.body;

  // Validation des champs
  if (!lat || isNaN(lat)) {
    return res.status(400).json({ error: "Latitude invalide ou manquante." });
  }
  if (!lng || isNaN(lng)) {
    return res.status(400).json({ error: "Longitude invalide ou manquante." });
  }

  const photoUrl = req.file ? `/cdn/photodesgens/${req.file.filename}` : null;

  if (req.file) {
    console.log("Fichier reçu (req.file) : ", req.file);
    console.log(`Photo enregistrée avec succès à l'emplacement : ${photoUrl}`);
  } else {
    console.log("Aucun fichier reçu avec la requête.");
  }

  try {
    console.log("Insertion de l'entrée dans la base de données...");
    const [result] = await db.query(
      "INSERT INTO pee_entries (lat, lng, description, icon, photo_url) VALUES (?, ?, ?, ?, ?)",
      [parseFloat(lat), parseFloat(lng), description, icon, photoUrl]
    );
    console.log("Insertion réussie. ID généré : ", result.insertId);

    res.status(201).json({ id: result.insertId, photoUrl });
  } catch (error) {
    console.error("Erreur lors de l'insertion dans la base de données :", error);
    res.status(500).json({ error: "Erreur lors de l'ajout de l'entrée" });
  }
});

// Middleware global pour gérer les erreurs
app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    console.error("Erreur : Taille du fichier trop grande.");
    res.status(413).json({ error: "Le fichier est trop volumineux. Taille maximale : 5 Mo." });
  } else if (err.code === "LIMIT_FIELD_VALUE") {
    console.error("Erreur : Un champ texte dépasse la taille maximale autorisée.");
    res.status(413).json({ error: "Un champ texte est trop long." });
  } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
    console.error("Erreur : Trop de fichiers uploadés.");
    res.status(400).json({ error: "Un seul fichier est autorisé par requête." });
  } else {
    console.error("Erreur inconnue : ", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur API en cours d'exécution sur le port : ${PORT}`);
});
