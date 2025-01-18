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
                    console.log("Latitude :", position.coords.latitude);
                    console.log("Longitude :", position.coords.longitude);
                },
                (error) => {
                    console.error("Erreur de géolocalisation :", error);
            
                    // Message d'erreur détaillé
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            console.error("L'utilisateur a refusé la demande de géolocalisation.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            console.error("Les informations de localisation ne sont pas disponibles.");
                            break;
                        case error.TIMEOUT:
                            console.error("La demande de localisation a expiré.");
                            break;
                        default:
                            console.error("Une erreur inconnue est survenue.");
                    }
                },
                {
                    enableHighAccuracy: true, // Améliore la précision
                    timeout: 10000, // Temps d'attente avant expiration
                    maximumAge: 0, // Toujours récupérer une position fraîche
                }
            );
            
        } else {
            console.error("La géolocalisation n'est pas prise en charge par ce navigateur.");
        }
    }, []);

    // Gérer la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:4000/api/pee-entries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert("Pipi ajouté avec succès !");
                setFormData({ lat: "", lng: "", description: "", icon: "heureux" }); // Réinitialise le formulaire
            } else {
                console.error("Erreur lors de l'ajout du pipi");
            }
        } catch (err) {
            console.error("Erreur :", err);
        }
    };

    return (
        <div className="create-page">
            <BottomNavBar />
            <main className="form-container">
                <h1>Créer un Pipi</h1>
                <p>Utilisez ce formulaire pour enregistrer un nouveau pipi sur la carte.</p>
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
                                    className={`emoji-option ${
                                        formData.icon === emoji.name ? "selected" : ""
                                    }`}
                                    onClick={() =>
                                        setFormData({ ...formData, icon: emoji.name })
                                    }
                                >
                                    <img src={emoji.src} alt={emoji.name} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="submit-button">Ajouter le Pipi</button>
                </form>
            </main>
        </div>
    );
}
