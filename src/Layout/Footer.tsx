import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../Common/styles/footer.css"
import fLogo from "../Assets/Images/logo-light.png"
import sm1 from "../Assets/Images/facebook.png"
import sm2 from "../Assets/Images/linkedin.png"
import sm3 from "../Assets/Images/twitter.png"

const Footer: React.FC = () => {

    const navigate = useNavigate()

    const handleNavAbout = () => {
        navigate("/about-us")
    }

    const handleNavContact = () => {
        navigate("/contact-us")
    }

    return (
        <footer className="footer">
            <div className="f-container">
                <div className="footer-grid">
                    <div style={{ paddingRight: '5px' }}>
                        <div className='f-main'>
                            <img className='fLogo' src={fLogo} alt="" />
                            <div style={{fontSize: '18px', fontWeight: 'bold' ,color: 'white'}}>KoreanLC</div>
                        </div>
                        <p className='f-para'>Join live Korean classes anytime, anywhere. Build your skills with expert teacher, interactive lessons, and a supportive community. Start your journey today!</p>
                    </div>
                    <div>
                        <h3>Quick Services</h3>
                        <ul className="footer-links">
                            <li><Link to="/" className="footer-link">Courses</Link></li>
                            <li><Link to="/" className="footer-link">Categories</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3>Help & Support</h3>
                        <div className="footer-links">
                            <p className="footer-link">Contact Us</p>
                            <p className="footer-link">About Us</p>
                            <p className="footer-link">Whatsapp</p>
                        </div>
                    </div>
                    <div>
                        <h3>Help</h3>
                        <div className="footer-links">
                            <p className="footer-link">Privacy Policy</p>
                            <p className="footer-link">Terms & Conditions</p>
                            <p className="footer-link">Refund Policy</p>
                        </div>
                        <div className="social-media-outer">
                            <a href='https://www.facebook.com/KoreanLiveClass/' target="_blank" rel="noopener noreferrer" className="img-outer io"><img className='media-icon' src={sm1} alt="" /></a>
                            <a href='https://www.linkedin.com/company/koreanlc' target="_blank" rel="noopener noreferrer" className="img-outer"><img className='media-icon' src={sm2} alt="" /></a>
                            <a href='https://x.com/KoreanLiveClass' target="_blank" rel="noopener noreferrer" className="img-outer"><img className='media-icon' src={sm3} alt="" /></a>
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