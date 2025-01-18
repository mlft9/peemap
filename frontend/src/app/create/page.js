"use client";

import BottomNavBar from "@/components/BottomNavBar";
import { useState, useEffect } from "react";
import "./CreatePage.css";

export default function CreatePage() {
    const [formData, setFormData] = useState({
        lat: "",
        lng: "",
        description: "",
        icon: "heureux",
        photo: null,
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
            alert("La géolocalisation n'est pas prise en charge par votre navigateur.");
        }
    }, []);

    // Gérer la sélection de la photo
    const handlePhotoCapture = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("Photo sélectionnée :", file);
            setFormData((prev) => ({ ...prev, photo: file }));
        }
    };

    // Gérer la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        console.log("Données avant soumission : ", formData);

        // Créer un FormData pour inclure les données et le fichier
        const formDataToSend = new FormData();
        formDataToSend.append("lat", formData.lat);
        formDataToSend.append("lng", formData.lng);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("icon", formData.icon);
        if (formData.photo) {
            formDataToSend.append("photo", formData.photo);
        }

        try {
            const res = await fetch("https://api.maxlft.tech/api/pee-entries", {
                method: "POST",
                body: formDataToSend, // Envoie les données sous forme de FormData
            });

            if (res.ok) {
                alert("Pipi ajouté avec succès !");
                setFormData({ lat: "", lng: "", description: "", icon: "heureux", photo: null });
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
                {error && <p className="error-message">{error}</p>}
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
                                >
                                    <img src={emoji.src} alt={emoji.name} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Photo :</label>
                        {!formData.photo ? (
                            <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={handlePhotoCapture}
                            />
                        ) : (
                            <div>
                                <img src={URL.createObjectURL(formData.photo)} alt="Prévisualisation" style={{ width: "100%" }} />
                                <button type="button" onClick={() => setFormData((prev) => ({ ...prev, photo: null }))}>
                                    Reprendre une photo
                                </button>
                            </div>
                        )}
                    </div>
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? "Envoi en cours..." : "Ajouter le Pipi"}
                    </button>
                </form>
            </main>
        </div>
    );
}
