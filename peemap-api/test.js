const mysql = require("mysql2/promise");

// Exemple de configuration
const pool = mysql.createPool({
    host: "127.0.0.1", // Adresse de la base de données
    user: "peemap",// Nom d'utilisateur
    password: "U^xKrk601hmYSLsE0F#MJz#Y^j",// Mot de passe
    database: "peemap",// Nom de la base
    port: 3306, // Port MySQL (par défaut : 3306)
});

// Exemple de requête
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("Connexion réussie !");
        connection.release();
    } catch (error) {
        console.error("Erreur de connexion :", error);
    }
}
testConnection();

