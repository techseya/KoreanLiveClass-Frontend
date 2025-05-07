import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

    const handleNavAbout = () => {
        navigate("/about-us")
    }

    const handleNavContact = () => {
        navigate("/contact-us")
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
                            <img className='fLogo' src={fLogo} alt=""  data-aos="fade-up" data-aos-duration="1000" />
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}  data-aos="fade-up" data-aos-duration="1000">KoreanLC</div>
                        </div>
                        <p className='f-para'  data-aos="fade-up" data-aos-duration="1000">{t('f-desc')}</p>
                    </div>
                    <div>
                        <h3 data-aos="fade-up" data-aos-duration="1000">{t('quick-services')}</h3>
                        <ul className="footer-links">
                            <li data-aos="fade-up" data-aos-duration="1000"><Link to="/courses" className="footer-link">{t('Courses')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 data-aos="fade-up" data-aos-duration="1000">{t("help")}</h3>
                        <div className="footer-links">
                            <p className="footer-link" data-aos="fade-up" data-aos-duration="1000">{t("Contact Us")}</p>
                            <p className="footer-link" data-aos="fade-up" data-aos-duration="1000">{t("About Us")}</p>
                        </div>
                    </div>
                    <div>
                        <h3 data-aos="fade-up" data-aos-duration="1000">{t("help2")}</h3>
                        <div className="footer-links">
                            <p className="footer-link" data-aos="fade-up" data-aos-duration="1000">{t("Privacy Policy")}</p>
                            <p className="footer-link" data-aos="fade-up" data-aos-duration="1000">{t("Terms of Service")}</p>
                            <p className="footer-link" data-aos="fade-up" data-aos-duration="1000">{t("Refund Policy")}</p>
                        </div>
                        <div className="social-media-outer">
                            <a data-aos="fade-up" data-aos-duration="1200" href='https://www.facebook.com/KoreanLiveClass/' target="_blank" rel="noopener noreferrer" className="img-outer io"><img className='media-icon' src={sm1} alt="" /></a>
                            <a data-aos="fade-up" data-aos-duration="1400" href='https://www.linkedin.com/company/koreanlc' target="_blank" rel="noopener noreferrer" className="img-outer"><img className='media-icon' src={sm2} alt="" /></a>
                            <a data-aos="fade-up" data-aos-duration="1600" href='https://x.com/KoreanLiveClass' target="_blank" rel="noopener noreferrer" className="img-outer"><img className='media-icon' src={sm3} alt="" /></a>
                        </div>
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