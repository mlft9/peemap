import Link from "next/link";
import "./BottomNavBar.css";

export default function BottomNavBar() {
    return (
        <nav className="bottom-nav">
            <ul>
                <li>
                    <Link href="/" className="nav-link">
                        Carte 🗺️
                    </Link>
                </li>
                <li>
                    <Link href="/create" className="nav-link">
                        Créer un Pipi 🚽
                    </Link>
                </li>
                <li>
                    <Link href="/user" className="nav-link">
                        Profil 🦹
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
