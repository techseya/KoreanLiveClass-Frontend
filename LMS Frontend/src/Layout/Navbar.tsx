import "../Common/styles/navbar.css";
import { useEffect, useState } from "react";
import lms_logo from "../Assets/Images/lms_logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LoginDialogbox from "src/Common/Components/LoginDialog";
import userIcon from "../Assets/Images/man.png";
import Dialogbox from "src/Common/Components/DialogBox";

interface Props {
    children: React.ReactElement;
}

export default function Navbar({ children }: Readonly<Props>) {
    const navigate = useNavigate();
    const { i18n, t } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [visible, setVisible] = useState(false);
    const [isOpen1, setIsOpen1] = useState(false);

    const location = useLocation();
    const isCourse = location.pathname === "/courses";
    const isCategory = location.pathname === "/categories";
    const isMyCourses = location.pathname === "/my-courses";
    const isCourse1 = location.pathname === "/course";
    const isMyCourse = location.pathname === "/my-course";
    const isReg = location.pathname === "/register";

    const token = sessionStorage.getItem("token");

    useEffect(() => {
        if (token === null) {
            setVisible(false);
        } else {
            setVisible(true);
        }
    }, []);

    const handleNavHome = () => navigate("/");
    const handleLogin = () => {
        navigate("/dashboard");
        setLoginOpen(false);
    };
    const handleNavCourses = () => navigate("/courses");
    const handleNavCategories = () => navigate("/categories");
    const handleNavMyCourses = () => navigate("/my-courses");
    const handleLoginOpen = () => setLoginOpen(true);
    const handleRegister = () => navigate("/register");
    const handleClose = () => setLoginOpen(false);
    const handleLogout = () => {
        sessionStorage.clear();
        window.location.reload();
    };
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setMenuOpen(false);
    };

    const handleOpen1 = () => setIsOpen1(true);
    const handleClose1 = () => setIsOpen1(false);

    return (
        <>
            <LoginDialogbox
                open={loginOpen}
                onAgree={handleLogin}
                onClose={handleClose}
            />

            <Dialogbox
                open={isOpen1}
                title="Logout Confirmation"
                content="Are you sure you want to logout? Logging out will end your current session and any unsaved changes may be lost."
                agreeButtonText="Yes, Logout"
                disagreeButtonText="No"
                onAgree={handleLogout}
                onDisagree={handleClose1}
                onClose={handleClose1}
            />

            <nav className="navbar">
                <div className="navbar-container">
                    <div className="logo">
                        <img
                            style={{ cursor: "pointer" }}
                            className="lms_logo"
                            src={lms_logo}
                            alt=""
                            onClick={handleNavHome}
                        />
                    </div>

                    <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                        ☰
                    </button>

                    <div className={`nav-links ${menuOpen ? "active" : ""}`}>
                        <a href="#" onClick={handleNavHome} className="nav-home">
                            <i className="fas fa-home"></i>
                        </a>
                        <a href="#" onClick={handleNavCourses} className="nav-courses">
                            <i className="fas fa-book"></i> <span>{t("Courses")}</span>
                        </a>

                        <a href="#" onClick={handleNavCategories} className="nav-categories">
                            <i className="fas fa-th-large"></i> <span>{t("Categories")}</span>
                        </a>

                        {!(isCourse || isCourse1 || isReg || isMyCourses || isMyCourse || isCategory) && (
                            <>
                                <a href="#korean-books" className="nav-books">
                                    <i className="fas fa-book-open"></i> <span>{t("kbooks")}</span>
                                </a>
                                <a href="#who" className="nav-who">
                                    <i className="fas fa-user"></i> <span>{t("who1")}</span>
                                </a>
                                <a href="#us" className="nav-us">
                                    <i className="fas fa-users"></i> <span>{t("what")}</span>
                                </a>
                            </>
                        )}

                        {visible && (
                            <a href="#" onClick={handleNavMyCourses} className="nav-my-courses">
                                <i className="fas fa-book-reader"></i> <span>{t("myCourses")}</span>
                            </a>
                        )}

                        <a href="#contact" className="nav-contact">
                            <i className="fas fa-envelope"></i> <span>{t("Contact Us")}</span>
                        </a>

                        <select onChange={(e) => changeLanguage(e.target.value)} defaultValue={i18n.language}>
                            <option value="si">සිංහල</option>
                            <option value="en">English</option>
                        </select>

                        {!visible && (
                            <>
                                <button onClick={handleLoginOpen} className="btn signin nav-login">
                                    <i className="fas fa-sign-in-alt"></i> {t("SignIn1")}
                                </button>
                                <button onClick={handleRegister} className="btn signup">
                                    {t("SignUp")}
                                </button>
                            </>
                        )}

                        {visible && (
                            <div className="user-section">
                                <img
                                    style={{ width: "30px", marginRight: "10px" }}
                                    src={userIcon}
                                    alt="User"
                                />
                                <button onClick={handleOpen1} className="btn signup nav-logout">
                                    <i className="fas fa-sign-out-alt"></i> {t("logout")}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {children}
        </>
    );
}
