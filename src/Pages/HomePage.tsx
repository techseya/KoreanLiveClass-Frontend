import { useState } from "react";
import Navbar from "src/Layout/Navbar";

export default function HomePage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleDropdown = (menu: string) =>
        setOpenDropdown(openDropdown === menu ? null : menu);

    return (
        <div className="homepage">
            <Navbar/>
            <main className="main-content">
                
            </main>
        </div>
    );
}
