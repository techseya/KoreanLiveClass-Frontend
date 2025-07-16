import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "../Common/styles/footer.css"
import fLogo from "../Assets/Images/logo-light.png"
import sm1 from "../Assets/Images/facebook.png"
import sm2 from "../Assets/Images/linkedin.png"
import sm3 from "../Assets/Images/twitter.png"
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
    const { t, i18n } = useTranslation();

    const navigate = useNavigate()
    const location = useLocation();
    const isCourse = location.pathname === "/courses";
    const isCategory = location.pathname === "/categories";
    const isMyCourses = location.pathname === "/my-courses"
    const isCourse1 = location.pathname === "/course";
    const isMyCourse = location.pathname === "/my-course"
    const isReg = location.pathname === "/register";
    const isCategoryC = location.pathname === "/category-courses"
    const isPrivacy = location.pathname === "/privacy-policy"
    const isTerms = location.pathname === "/terms-services"
    const isProfile = location.pathname === "/profile"    
    const isQuiz = location.pathname === "/quizes";

    const handleNavTerms = () => {
        navigate("/terms-services")
    }

    const handleNavPrivacy = () => {
        navigate("/privacy-policy")
    }

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true
        });
    }, []);

    return (
        <footer id='contact' className="footer" data-aos="fade-up" data-aos-duration="1000">
            <div className="f-container">
                <div className="footer-grid">
                    <div style={{ paddingRight: '5px' }}>
                        <div className='f-main'>
                            <img className='fLogo' src={fLogo} alt="" data-aos="fade-up" data-aos-duration="1000" />
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }} data-aos="fade-up" data-aos-duration="1000">Korean Live Class</div>
                        </div>
                        <p className='f-para' data-aos="fade-up" data-aos-duration="1000">{t('f-desc')}</p>
                    </div>
                    <div>
                        <h3 data-aos="fade-up" data-aos-duration="1000">{t('quick-services')}</h3>
                        <ul className="footer-links">
                            <li data-aos="fade-up" data-aos-duration="1000"><Link to="/courses" className="footer-link">{t('Courses')}</Link></li>
                            <li data-aos="fade-up" data-aos-duration="1000"><Link to="/categories" className="footer-link">{t('Categories')}</Link></li>
                            {!(isQuiz || isProfile || isCourse || isCourse1 || isReg || isMyCourses || isMyCourse || isCategory || isCategoryC || isPrivacy || isTerms) && <li data-aos="fade-up" data-aos-duration="1000"><a href="#korean-books" className="footer-link">{t('kbooks')}</a></li>}
                            {!(isQuiz || isProfile || isCourse || isCourse1 || isReg || isMyCourses || isMyCourse || isCategory || isCategoryC || isPrivacy || isTerms) && <li data-aos="fade-up" data-aos-duration="1000"><a href="#who" className="footer-link">{t('who1')}</a></li>}
                            {!(isQuiz || isProfile || isCourse || isCourse1 || isReg || isMyCourses || isMyCourse || isCategory || isCategoryC || isPrivacy || isTerms) && <li data-aos="fade-up" data-aos-duration="1000"><a href="#us" className="footer-link">{t('what')}</a></li>}
                        </ul>
                    </div>
                    <div>
                        <h3 data-aos="fade-up" data-aos-duration="1000">{t("cNo")}</h3>
                        <div className="footer-links">
                            <p className="footer-link sans" data-aos="fade-up" data-aos-duration="1000">+9477-455-4007</p>
                            <p className="footer-link sans" data-aos="fade-up" data-aos-duration="1000">+9471-567-5588</p>
                            <p className="footer-link sans" data-aos="fade-up" data-aos-duration="1000">+8210-9073-6674</p>
                            <div className="space"></div>
                        </div>
                        <h3 data-aos="fade-up" data-aos-duration="1000">{t("email")}</h3>
                        <div className="footer-links">
                            <p className="footer-link sans" data-aos="fade-up" data-aos-duration="1000">mangalathero788@gmail.com</p>
                        </div>
                    </div>
                    <div>
                        <h3 data-aos="fade-up" data-aos-duration="1000">{t("help2")}</h3>
                        <div className="footer-links">
                            <p onClick={handleNavPrivacy} className="footer-link" data-aos="fade-up" data-aos-duration="1000">{t("Privacy Policy")}</p>
                            <p onClick={handleNavTerms} className="footer-link" data-aos="fade-up" data-aos-duration="1000">{t("Terms of Service")}</p>
                        </div>
                        {/* <div className="social-media-outer">
                            <a data-aos="fade-up" data-aos-duration="1200" href='https://www.facebook.com/KoreanLiveClass/' target="_blank" rel="noopener noreferrer" className="img-outer io"><img className='media-icon' src={sm1} alt="" /></a>
                            <a data-aos="fade-up" data-aos-duration="1400" href='https://www.linkedin.com/company/koreanlc' target="_blank" rel="noopener noreferrer" className="img-outer"><img className='media-icon' src={sm2} alt="" /></a>
                            <a data-aos="fade-up" data-aos-duration="1600" href='https://x.com/KoreanLiveClass' target="_blank" rel="noopener noreferrer" className="img-outer"><img className='media-icon' src={sm3} alt="" /></a>
                        </div> */}
                    </div>
                </div>
                <div className="footer-border">
                    <p>&copy; {new Date().getFullYear()} Korean Live Class - Study Portal, All rights reserved</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;