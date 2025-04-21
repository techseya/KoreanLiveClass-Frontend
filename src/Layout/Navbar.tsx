import "../Common/styles/navbar.css";
import { useState } from "react";
import lms_logo from "../Assets/Images/lms_logo.png"

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const cartCount = 3;

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleDropdown = (menu: string) =>
        setOpenDropdown(openDropdown === menu ? null : menu);

    return (
        <div className="homepage">
            <nav className="navbar">
                <img className="logo" src={lms_logo} alt="" />

                <button className="menu-toggle" onClick={toggleMenu}>
                    ☰
                </button>

                <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
                    <li className="search-bar">
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="search-input"
                        />
                        <button className="search-button">Search</button>
                    </li>
                    <li className="dropdown">
                        <span onClick={() => toggleDropdown("courses")}>Courses ▾</span>
                        {openDropdown === "courses" && (
                            <ul className="dropdown-menu">
                                <li><a href="#">All Courses</a></li>
                                <li><a href="#">My Courses</a></li>
                            </ul>
                        )}
                    </li>

                    <li><a href="#">Korean Words</a></li>

                    <li className="cart-icon">
                        <a href="#">
                            🛒
                            {cartCount > 0 && (
                                <span className="cart-count">{cartCount}</span>
                            )}
                        </a>
                    </li>

                    <li className="auth-buttons">
                        <button className="login">Login</button>
                        <button className="signup">Sign Up</button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
