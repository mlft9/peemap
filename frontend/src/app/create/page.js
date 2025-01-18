"use client";

import BottomNavBar from "@/components/BottomNavBar";
import { useState, useEffect } from "react";
import "./CreatePage.css"; // Nouveau fichier CSS pour le style

export default function CreatePage() {
    const [formData, setFormData] = useState({
        lat: "",
        lng: "",
        description: "",
        icon: "heureux", // Icône par défaut
    });
    const [error, setError] = useState(""); // Pour afficher des messages d'erreur
    const [loading, setLoading] = useState(false); // Gestion du chargement
    const ALLOWED_INTERVAL = 3600000; // 1 heure en millisecondes (ajuster selon besoin)

    const emojiOptions = [
        { name: "heureux", src: "/icons/heureux.png" },
        { name: "amoureux", src: "/icons/amoureux.png" },
        { name: "malade", src: "/icons/malade.png" },
        { name: "triste", src: "/icons/triste.png" },
        { name: "classe", src: "/icons/classe.png" },
    ];

    // Obtenir la position de l'utilisateur
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData((prev) => ({
                        ...prev,
                        lat: position.coords.latitude.toString(),
                        lng: position.coords.longitude.toString(),
                    }));
                },
                (error) => {
                    console.error("Erreur de géolocalisation :", error);
                    alert("Impossible de récupérer votre position.");
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        } else {
            console.error("La géolocalisation n'est pas prise en charge par ce navigateur.");
            alert("Votre navigateur ne supporte pas la géolocalisation.");
        }
    }, []);

    // Vérifier si un pipi peut être soumis
    const canSubmitPee = () => {
        const lastPeeTime = localStorage.getItem("lastPeeTime");
        if (!lastPeeTime) return true; // Si aucun pipi précédent enregistré

        const timeSinceLastPee = Date.now() - parseInt(lastPeeTime, 10);
        if (timeSinceLastPee < ALLOWED_INTERVAL) {
            const minutesRemaining = Math.ceil((ALLOWED_INTERVAL - timeSinceLastPee) / 60000);
            setError(`Vous devez attendre encore ${minutesRemaining} minute(s) avant de faire un autre pipi.`);
            return false;
        }

        return true;
    };

    // Gérer la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Réinitialise les erreurs
        if (!canSubmitPee()) return; // Vérifie si l'utilisateur peut soumettre un pipi
        setLoading(true);

        try {
            const res = await fetch("https://api.maxlft.tech/api/pee-entries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert("Pipi ajouté avec succès !");
                setFormData({ lat: "", lng: "", description: "", icon: "heureux" }); // Réinitialise le formulaire
                localStorage.setItem("lastPeeTime", Date.now().toString()); // Stocke l'heure du dernier pipi
            } else {
                console.error("Erreur lors de l'ajout du pipi");
                setError("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
            }
        } catch (err) {
            console.error("Erreur :", err);
            setError("Une erreur réseau est survenue. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-page">
            <BottomNavBar />
            <main className="form-container">
                <h1>Créer un Pipi</h1>
                <p>Utilisez ce formulaire pour enregistrer un nouveau pipi sur la carte.</p>
                {error && <p className="error-message">{error}</p>} {/* Affichage des erreurs */}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            placeholder="Ajoutez une description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Choisissez une icône :</label>
                        <div className="emoji-options">
                            {emojiOptions.map((emoji) => (
                                <div
                                    key={emoji.name}
                                    role="button"
                                    tabIndex={0}
                                    aria-selected={formData.icon === emoji.name}
                                    className={`emoji-option ${
                                        formData.icon === emoji.name ? "selected" : ""
                                    }`}
                                    onClick={() => setFormData({ ...formData, icon: emoji.name })}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            setFormData({ ...formData, icon: emoji.name });
                                        }
                                    }}
                                >
                                    <img src={emoji.src} alt={emoji.name} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? "Envoi en cours..." : "Ajouter le Pipi"}
                    </button>
                </form>
            </main>
        </div>
    );
}
