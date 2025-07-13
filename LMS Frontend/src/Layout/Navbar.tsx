import "../Common/styles/navbar.css";
import { useEffect, useState } from "react";
import lms_logo from "../Assets/Images/lms_logo.png"
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LoginDialogbox from "src/Common/Components/LoginDialog";
import userIcon from "../Assets/Images/man.png"
import Dialogbox from "src/Common/Components/DialogBox";
import useIdleTimer from "./IdleTimer";
import env from "../env"

interface Props {
    children: React.ReactElement;
}

export default function Navbar({ children }: Readonly<Props>) {
    const navigate = useNavigate()
    const { i18n, t } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [visible, setVisible] = useState(false)
    const [isOpen1, setIsOpen1] = useState(false);

    const location = useLocation();
    const isCourse = location.pathname === "/courses";
    const isCategory = location.pathname === "/categories";
    const isMyCourses = location.pathname === "/my-courses"
    const isCourse1 = useMatch("/course/:id") !== null;
    const isMyCourse = location.pathname === "/my-course"
    const isReg = location.pathname === "/register";
    const isCategoryC = location.pathname === "/category-courses"
    const isPrivacy = location.pathname === "/privacy-policy"
    const isTerms = location.pathname === "/terms-services"
    const isProfile = location.pathname === "/profile"
    const isQuiz = location.pathname === "/quizes";

    const token = localStorage.getItem("token")

    useIdleTimer({
        timeout: env.TIME_OUT,
        onIdle: () => {
            localStorage.clear();
            window.location.reload();
        },
        enabled: token !== null,
    });

    useEffect(() => {
        if (token === null) {
            setVisible(false)
        } else {
            setVisible(true)
        }
    }, [])

    const handleNavHome = () => {
        navigate("/")
    }

    const handleLogin = () => {
        navigate("/dashboard")
        setLoginOpen(false);
    };

    const handleNavCourses = () => {
        navigate("/courses")
        setMenuOpen(false)
    }

    const handleNavQuiz = () => {
        navigate("/quizes")
    }

    const handleNavMyCourses = () => {
        navigate("/my-courses")
        setMenuOpen(false)
    }

    const handleLoginOpen = () => {
        setLoginOpen(true);
        setMenuOpen(false)
    };

    const handleRegister = () => {
        navigate("/register")
        setMenuOpen(false)
    }

    const handleClose = () => {
        setLoginOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("token")
        window.location.reload()
    }

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setMenuOpen(false);
    };

    const handleMenu = () => {
        setMenuOpen(false)
    }

    const handleOpen1 = () => setIsOpen1(true);
    const handleClose1 = () => setIsOpen1(false);

    const handleNavProfile = () => {
        navigate("/profile")
        setMenuOpen(false)
    }

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
                        <img style={{ cursor: 'pointer' }} className="lms_logo" src={lms_logo} alt="" onClick={handleNavHome} />
                    </div>

                    <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                        ☰
                    </button>

                    <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
                        <a href="" onClick={handleNavCourses}>{t('Courses')}</a>
                        <a href="" onClick={handleNavQuiz}>{t("quiz")}</a>
                        {!(isQuiz || isProfile || isCourse || isCourse1 || isReg || isMyCourses || isMyCourse || isCategory || isCategoryC || isPrivacy || isTerms) && <a onClick={handleMenu} href="#korean-books">{t('kbooks')}</a>}
                        {!(isQuiz || isProfile || isCourse || isCourse1 || isReg || isMyCourses || isMyCourse || isCategory || isCategoryC || isPrivacy || isTerms) && <a onClick={handleMenu} href="#who">{t('who1')}</a>}
                        {!(isQuiz || isProfile || isCourse || isCourse1 || isReg || isMyCourses || isMyCourse || isCategory || isCategoryC || isPrivacy || isTerms) && <a onClick={handleMenu} href="#us">{t('what')}</a>}
                        {visible && (<a href="" onClick={handleNavMyCourses}>{t('myCourses')}</a>)}
                        {!(isQuiz || isProfile || isCourse || isCourse1 || isReg || isMyCourses || isMyCourse || isCategory || isCategoryC || isPrivacy || isTerms) && <a onClick={handleMenu} href="#contact">{t('Contact Us')}</a>}


                        <select
                            onChange={(e) => changeLanguage(e.target.value)}
                            defaultValue={i18n.language}
                        >
                            <option value="si">සිංහල</option>
                            <option value="en">English</option>
                        </select>

                        {!visible && (<>
                            <button onClick={handleLoginOpen} className="btn signin">{t('SignIn1')}</button>
                            <button onClick={handleRegister} className="btn signup">{t('SignUp')}</button>
                        </>
                        )}

                        {visible && (
                            <div className="user-section">
                                <img
                                    onClick={handleNavProfile}
                                    style={{ width: "30px", marginRight: "0px", cursor: 'pointer' }}
                                    src={userIcon}
                                    alt="User"
                                />
                                <button onClick={handleOpen1} className="btn signup">{t('logout')}</button>
                            </div>
                        )}

                    </div>
                </div>
            </nav>
            <>
                {children}
            </>
        </>

    );
}