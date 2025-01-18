"use client";

import "leaflet/dist/leaflet.css"; // Importation des styles Leaflet
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";

export default function MapPage() {
  const [entries, setEntries] = useState([]);

  // Récupérer les données depuis l'API externe
  useEffect(() => {
    fetch("http://localhost:4000/api/pee-entries") // Remplace par l'URL de ton API externe
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erreur HTTP : ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setEntries(data))
      .catch((err) => {
        console.error("Erreur lors de la récupération des données :", err.message);
      });
  }, []);

  return (
    <div style={{ height: "90vh", width: "100%" }}>
      <h1>Carte des Aventures</h1>
      <MapContainer center={[48.8566, 2.3522]} zoom={2} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {entries.map((entry) => (
          <Marker key={entry.id} position={[entry.lat, entry.lng]}>
            <Popup>{entry.description}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
