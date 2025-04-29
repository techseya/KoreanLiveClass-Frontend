import { useState } from "react";
import "../Common/styles/navbar.css";

interface Props {
  children?: React.ReactElement;
}

export default function Navbar({ children }: Readonly<Props>) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const toggleDropdown = (label: string) => {
    setDropdownOpen((prev) => (prev === label ? null : label));
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">MyLogo</div>

        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <ul>
            <li><a href="#">Home</a></li>

            <li className="dropdown" onClick={() => toggleDropdown("company")}>
              <span>Our Company ▾</span>
              {dropdownOpen === "company" && (
                <ul className="dropdown-menu">
                  <li><a href="#">Our Services</a></li>
                  <li><a href="#">Our Products</a></li>
                  <li><a href="#">Our Book Store</a></li>
                </ul>
              )}
            </li>

            <li><a href="#">Gallery</a></li>
            <li><a href="#">Partners and Reviews</a></li>
            <li><a href="#">Latest News</a></li>

            <li className="dropdown" onClick={() => toggleDropdown("links")}>
              <span>Useful Links ▾</span>
              {dropdownOpen === "links" && (
                <ul className="dropdown-menu">
                  <li><a href="#">Example 1</a></li>
                  <li><a href="#">Example 2</a></li>
                  <li><a href="#">Example 3</a></li>
                </ul>
              )}
            </li>

            <li><a href="#">Contact</a></li>
            <li><a href="#">My Account</a></li>
          </ul>

          <div className="navbar-auth">
            <a href="#" className="login-btn">Login</a>
            <a href="#" className="signup-btn">Sign Up</a>
          </div>
        </div>

        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span><span></span><span></span>
        </div>
      </nav>

      {children}
    </>
  );
}
