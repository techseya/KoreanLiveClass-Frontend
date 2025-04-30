import React, { useEffect, useState } from "react";
import "../Common/styles/main.css";
import { useTranslation } from "react-i18next";
import k1 from "../Assets/Images/k1.jpg";
import k2 from "../Assets/Images/k2.jpg";
import k3 from "../Assets/Images/k3.jpg";
import logo from "../Assets/Images/logo.jpeg"
import { AccessTime, Adjust, CheckCircleOutline, Facebook, Instagram, Verified, X, YouTube } from "@mui/icons-material";
import AOS from 'aos';
import 'aos/dist/aos.css';
import phoneTemp from "../Assets/Images/phone-template.png"
import b1 from "../Assets/Images/b1.png"
import b2 from "../Assets/Images/b2.png"
import b3 from "../Assets/Images/b3.png"
import b4 from "../Assets/Images/b4.png"
import b5 from "../Assets/Images/b5.png"
import b6 from "../Assets/Images/b6.png"
import b7 from "../Assets/Images/b7.png"
import b8 from "../Assets/Images/b8.png"
import b9 from "../Assets/Images/b9.png"
import b10 from "../Assets/Images/b10.png"
import b11 from "../Assets/Images/b11.png"
import monkImage from "../Assets/Images/monk.png"


export default function Landing() {
  const { t, i18n } = useTranslation();
  const [bgIndex, setBgIndex] = useState(0);

  const [fabOpen, setFabOpen] = useState(false);

  const toggleFab = () => setFabOpen(!fabOpen);


  const images = [k1, k2, k3];
  const koreanLetters = [""];

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div
      className="main-outer"
      style={{ backgroundImage: `url(${images[bgIndex]})` }}
    >
      <div className="bg-overlay"></div>

      <div className="floating-letters">
        {koreanLetters.map((letter, index) => (
          <span key={index} className={`floating-letter letter-${index}`}>
            {letter}
          </span>
        ))}
      </div>

      <div className="banner-strip">
        <span className="banner-text">
          {t("Korean Live Class Student Portal")}
        </span>
      </div>

      <div className="main-banner-strip">
        <div className="mbs">
          <div className="main-banner-desc">{t("HeroDesc")}</div>
        </div>
      </div>

      <div className="red-outer">
        <div className="red-inner">
          <div className="red-text">
            {t("red-text")}
          </div>
          <button style={{ zIndex: 10 }} className="btn signup">{t('SignUp')}</button>
        </div>
      </div>

      <div className="second-outer">
        <div className="animated-shapes">
          <span className="shape shape1"></span>
          <span className="shape shape2"></span>
          <span className="shape shape3"></span>
          <span className="shape shape4"></span>
          <span className="shape shape5"></span>
          <span className="shape shape6"></span>
        </div>
        <div className="second-inner-wrapper">
          <div className="second-inner" data-aos="fade-up">
            <div className="second-title" data-aos="fade-up" data-aos-delay="100">
              {t("who")}
            </div>
            <div className="second-desc">
              {t("who-desc")}
            </div>
            <div className="space"></div>
            <div className="space"></div>
            <div className="second-content" data-aos="fade-up" data-aos-delay="200">
              <Verified style={{ color: "#4caf50", marginRight: '10px' }} />{t("who-content1")}
            </div>
            <div className="second-content" data-aos="fade-up" data-aos-delay="200">
              <Verified style={{ color: "#4caf50", marginRight: '10px' }} />{t("who-content2")}
            </div>
            <div className="second-content" data-aos="fade-up" data-aos-delay="200">
              <Verified style={{ color: "#4caf50", marginRight: '10px' }} />{t("who-content3")}
            </div>
            <div className="second-content" data-aos="fade-up" data-aos-delay="200">
              <Verified style={{ color: "#4caf50", marginRight: '10px' }} />{t("who-content4")}
            </div>
            <div className="second-content" data-aos="fade-up" data-aos-delay="200">
              <Verified style={{ color: "#4caf50", marginRight: '10px' }} />{t("who-content5")}
            </div>
            <div className="second-content" data-aos="fade-up" data-aos-delay="200">
              <Verified style={{ color: "#4caf50", marginRight: '10px' }} />{t("who-content6")}
            </div>
          </div>
        </div>
        <div className="second-inner1">
          <div className="phone-outer">
            <img src={phoneTemp} alt="Phone" className="phone-bg" />
            <div className="phone-inner">
              <img className="phone-logo" src={logo} alt="Logo" />
              <div className="phone-title">Korean Live Class</div>
              <div className="space"></div>
              <div className="space"></div>
              <div className="space"></div>
              <div className="pcard-inner">
                <div className="pcard">
                  <Adjust className="picon" />
                  <div className="ptext">17 {t('ptext1')}</div>
                </div>
              </div>
              <div className="pcard-inner">
                <div className="pcard">
                  <CheckCircleOutline className="picon" />
                  <div className="ptext">{t('ptext2')}</div>
                </div>
              </div>
              <div className="pcard-inner">
                <div className="pcard">
                  <AccessTime className="picon" />
                  <div className="ptext">{t('ptext3')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space"></div>
      <div className="space"></div>
      <div className="space"></div>

      <div className="third-outer">
        <div className="third-inner">
          <div className="ti">
            <div className="third-inner-title">
              {t("benefits")}
            </div>
          </div>
        </div>

        <div className="space"></div>
        <div className="space"></div>
        <div className="third-inner1" data-aos="fade-up">
          <div className="ti1">
            <div className="third-inner-content" data-aos="fade-up">

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="100">
                <img className="tic-img" src={b1} alt="" />
                <div className="tic-title">{t("benefits-content1")}</div>
              </div>

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="120">
                <img className="tic-img" src={b2} alt="" />
                <div className="tic-title">{t("benefits-content1")}</div>
              </div>

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="140">
                <img className="tic-img" src={b3} alt="" />
                <div className="tic-title">{t("benefits-content1")}</div>
              </div>

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="160">
                <img className="tic-img" src={b4} alt="" />
                <div className="tic-title">{t("benefits-content1")}</div>
              </div>

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="100">
                <img className="tic-img" src={b5} alt="" />
                <div className="tic-title">{t("benefits-content1")}</div>
              </div>

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="120">
                <img className="tic-img" src={b6} alt="" />
                <div className="tic-title">{t("benefits-content1")}</div>
              </div>

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="140">
                <img className="tic-img" src={b7} alt="" />
                <div className="tic-title">{t("benefits-content1")}</div>
              </div>

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="160">
                <img className="tic-img" src={b8} alt="" />
                <div className="tic-title">{t("benefits-content1")}</div>
              </div>

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="100">
                <img className="tic-img" src={b9} alt="" />
                <div className="tic-title">{t("benefits-content1")}</div>
              </div>

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="120">
                <img className="tic-img" src={b10} alt="" />
                <div className="tic-title">{t("benefits-content1")}</div>
              </div>

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="140">
                <img className="tic-img" src={b11} alt="" />
                <div className="tic-title">{t("benefits-content1")}</div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="space"></div>
      <div className="space"></div>
      <div className="space"></div>

      <div className="third-outer">
        <div className="third-inner">
          <div className="ti">
            <div className="third-inner-title">
              {t("services")}
            </div>
          </div>
        </div>

        <div className="space"></div>
        <div className="space"></div>

        <div className="fourth-inner">
          <div className="fourth-inner1">
          <div className="monk-wrapper">
      <img src={monkImage} alt="Monk" className="monk-img" />
    </div>

            <div className="corner-box top-left">Service 1</div>
            <div className="corner-box top-right">Service 2</div>
            <div className="corner-box bottom-left">Service 3</div>
            <div className="corner-box bottom-right">Service 4</div>
          </div>
        </div>
      </div>


      <div className="fab-container">
        <a href="https://facebook.com" target="_blank" className="fab fab-icon facebook"><Facebook /></a>
        <a href="https://twitter.com" target="_blank" className="fab fab-icon twitter"><X /></a>
        <a href="https://instagram.com" target="_blank" className="fab fab-icon instagram"><Instagram /></a>
        <a href="https://youtube.com" target="_blank" className="fab fab-icon youtube"><YouTube /></a>
      </div>
    </div>
  );
}