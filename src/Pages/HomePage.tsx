import "../Common/styles/home.css"
import { useState } from "react";

export default function HomePage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleDropdown = (menu: string) =>
        setOpenDropdown(openDropdown === menu ? null : menu);

    return (
        <div className="homepage">
            <main className="main-content">
                <div className="main-inner main-img"></div>
                <div className="main-inner">
                    <div className="main-sub-inner">
                        <div className="main-content-title">Korean live class</div>
                        <div className="main-content-desc">Study korean language anytime, anywhere!</div>
                    </div>
                </div>
            </main>
        </div>
    );
}
