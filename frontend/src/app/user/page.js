"use client";

import BottomNavBar from "@/components/BottomNavBar";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

export default function UserPage({ children }) {
    return (
        <div>
            <BottomNavBar />
            <h1>Page Utilisateur</h1>
            <p>Bienvenue sur la page utilisateur.</p>
        </div>
    );
}
