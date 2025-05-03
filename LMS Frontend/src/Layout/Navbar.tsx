import "../Common/styles/navbar.css";
import { useState } from "react";
import lms_logo from "../Assets/Images/lms_logo.png"
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LoginDialogbox from "src/Common/Components/LoginDialog";


interface Props {
    children: React.ReactElement;
}

export default function Navbar({ children }: Readonly<Props>) {
    const navigate = useNavigate()
    const { i18n, t } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);

    const location = useLocation();
    const isCourse = location.pathname === "/courses";

    const handleNavHome = () => {
        navigate("/")
    }

    const handleLogin = () => {
        navigate("/dashboard")
        setLoginOpen(false);
    };

    const handleNavCourses = () => {
        navigate("/courses")
    }

    const handleLoginOpen = () => {
        setLoginOpen(true);
    };

    const handleClose = () => {
        setLoginOpen(false);
    };

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setMenuOpen(false);
    };

    return (
        <>
            <LoginDialogbox
                open={loginOpen}
                onAgree={handleLogin}
                onClose={handleClose}
            />
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="logo">
                        <img style={{cursor: 'pointer'}} className="lms_logo" src={lms_logo} alt="" onClick={handleNavHome} />
                    </div>

                    <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                        ☰
                    </button>

                    <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
                        <a href="" onClick={handleNavCourses}>{t('Courses')}</a>
                        {!isCourse && (<a href="#categories">{t('Categories')}</a>)}
                        <a href="#contact">{t('Contact Us')}</a>
                        <a href="#about">{t('About Us')}</a>

                        <select
                            onChange={(e) => changeLanguage(e.target.value)}
                            defaultValue={i18n.language}
                        >
                            <option value="si">සිංහල</option>
                            <option value="en">English</option>
                        </select>

                        <button onClick={handleLoginOpen} className="btn signup">{t('SignIn')}</button>
                    </div>
                </div>
            </nav>
            <>
                {children}
            </>
        </>

    );
}
