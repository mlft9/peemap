"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

export default function MapPage() {
    const [entries, setEntries] = useState([]);
    const [formData, setFormData] = useState({
        lat: "",
        lng: "",
        description: "",
        icon: "heureux", // Icône par défaut
    });

    const icons = {
        heureux: L.icon({
            iconUrl: "/icons/heureux.png",
            iconSize: [32, 32],
        }),
        classe: L.icon({
            iconUrl: "/icons/classe.png",
            iconSize: [32, 32],
        }),
        amoureux: L.icon({
            iconUrl: "/icons/amoureux.png",
            iconSize: [32, 32],
        }),
        malade: L.icon({
            iconUrl: "/icons/malade.png",
            iconSize: [32, 32],
        }),
        triste: L.icon({
            iconUrl: "/icons/triste.png",
            iconSize: [32, 32],
        }),
    };

    // Charger les entrées existantes depuis l'API
    useEffect(() => {
        fetch("http://localhost:4000/api/pee-entries")
            .then((res) => res.json())
            .then((data) => setEntries(data))
            .catch((err) => console.error("Erreur :", err));
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
                const newEntry = await res.json();
                setEntries((prev) => [...prev, { ...formData, id: newEntry.id }]);
                setFormData({ lat: "", lng: "", description: "", icon: "default" }); // Réinitialise le formulaire
            } else {
                console.error("Erreur lors de l'ajout du pipi");
            }
        } catch (err) {
            console.error("Erreur :", err);
        }
    };

    return (
        <div>
            <h1>Carte des Aventures</h1>

            {/* Formulaire pour ajouter un pipi */}
            <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Latitude"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Longitude"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                ></textarea>

                {/* Sélection du logo */}
                <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                >
                    <option value="heureux">Pipi heureux</option>
                    <option value="amoureux">Pipi amoureux</option>
                    <option value="malade">Pipi malade</option>
                    <option value="triste">Pipi triste</option>
                    <option value="classe">Pipi classe</option>
                </select>

                <button type="submit">Ajouter</button>
            </form>

            {/* Carte avec les marqueurs */}
            <MapContainer center={[48.8566, 2.3522]} zoom={2} style={{ height: "80vh", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                {/* Afficher les marqueurs avec l'icône correspondante */}
                {entries.map((entry) => (
                    <Marker
                        key={entry.id}
                        position={[entry.lat, entry.lng]}
                        icon={icons[entry.icon] || icons.heureux} // Icône personnalisée ou icône par défaut
                    >
                        <Popup>
                            <p>{entry.description}</p>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
