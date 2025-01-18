"use client";

import "leaflet/dist/leaflet.css";
import BottomNavBar from "@/components/BottomNavBar";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Désactiver le rendu côté serveur pour les composants Leaflet
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

export default function MapPage({ children }) {
    const [entries, setEntries] = useState([]);
    const [icons, setIcons] = useState({});

    // Charger les icônes côté client uniquement
    useEffect(() => {
        if (typeof window !== "undefined") {
            const L = require("leaflet");

            setIcons({
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
            });
        }
    }, []);

    // Charger les entrées existantes depuis l'API
    useEffect(() => {
        fetch("https://api.maxlft.tech/api/pee-entries")
            .then((res) => res.json())
            .then((data) => setEntries(data))
            .catch((err) => console.error("Erreur :", err));
    }, []);

    return (
        <div>
            <BottomNavBar />

            <h1>Carte des Aventures</h1>

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
