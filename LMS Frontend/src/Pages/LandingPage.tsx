import React, { useEffect, useState } from "react";
import "../Common/styles/main.css";
import { useTranslation } from "react-i18next";
import k1 from "../Assets/Images/k1.jpg";
import k2 from "../Assets/Images/k2.jpg";
import k3 from "../Assets/Images/k3.jpg";
import logo from "../Assets/Images/logo.jpeg"
import { AccessTime, Adjust, CheckCircleOutline, Facebook, Instagram, X, YouTube } from "@mui/icons-material";

export default function Landing() {
  const { t, i18n } = useTranslation();
  const [bgIndex, setBgIndex] = useState(0);

  const [fabOpen, setFabOpen] = useState(false);

  const toggleFab = () => setFabOpen(!fabOpen);


  const images = [k1, k2, k3];
  const koreanLetters = [""];

  useEffect(() => {
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

      <div className="second-outer">
        <div className="second-inner"></div>
        <div className="second-inner1">
          <div className="phone-outer">
            <div className="phone-inner">
              <img className="phone-logo" src={logo} alt="" />
              <div className="phone-title">
                Korean Live Class 
              </div>
              <div className="space"></div>
              <div className="space"></div>
              <div className="space"></div>
              <div className="pcard-inner">
                <div className="pcard">
                  <Adjust className="picon"/>
                  <div className="ptext">17 {t('ptext1')}</div>
                </div>
              </div>
              <div className="pcard-inner">
                <div className="pcard">
                  <CheckCircleOutline className="picon"/>
                  <div className="ptext">{t('ptext2')}</div>
                </div>
              </div>
              <div className="pcard-inner">
                <div className="pcard">
                  <AccessTime className="picon"/>
                  <div className="ptext">{t('ptext3')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="third-outer">
        
      </div>


      <div className={`fab-container ${fabOpen ? "open" : ""}`}>
        <button className="fab main-fab" onClick={toggleFab}>+</button>
        <a href="https://facebook.com" target="_blank" className="fab fab-icon facebook"><Facebook/></a>
        <a href="https://twitter.com" target="_blank" className="fab fab-icon twitter"><X/></a>
        <a href="https://instagram.com" target="_blank" className="fab fab-icon instagram"><Instagram/></a>
        <a href="https://youtube.com" target="_blank" className="fab fab-icon youtube"><YouTube/></a>
      </div>


    </div>
  );
}