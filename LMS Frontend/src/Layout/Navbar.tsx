import "../Common/styles/navbar.css";
import { useState } from "react";
import lms_logo from "../Assets/Images/lms_logo.png"
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


interface Props {
    children: React.ReactElement;
}

export default function Navbar({ children }: Readonly<Props>) {
    const { i18n, t } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="logo">
                        <img className="lms_logo" src={lms_logo} alt="" />
                    </div>

                    <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                        ☰
                    </button>

                    <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
                        <a href="#courses">{t('Courses')}</a>
                        <a href="#categories">{t('Categories')}</a>
                        <a href="#contact">{t('Contact Us')}</a>
                        <a href="#about">{t('About Us')}</a>

                        <select
                            onChange={(e) => changeLanguage(e.target.value)}
                            defaultValue={i18n.language}
                        >
                            <option value="si">සිංහල</option>
                            <option value="en">English</option>
                        </select>

                        <button className="btn login">{t('SignIn')}</button>
                        <button className="btn signup">{t('SignUp')}</button>
                    </div>
                </div>
            </nav>
            <>
                {children}
            </>
        </>

    );
}
