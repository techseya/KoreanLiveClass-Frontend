import React, { useEffect, useState } from "react";
import "../Common/styles/main.css";
import { useTranslation } from "react-i18next";
import k1 from "../Assets/Images/k1.jpg";
import k2 from "../Assets/Images/k2.jpg";
import k3 from "../Assets/Images/k3.jpg";

export default function Landing() {
  const { t, i18n } = useTranslation();
  const [bgIndex, setBgIndex] = useState(0);

  const images = [k1, k2, k3];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval); // cleanup
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div
      className="main-outer"
      style={{ backgroundImage: `url(${images[bgIndex]})` }}
    >
      <div className="bg-overlay"></div>
      <div className="banner-strip">
        <span className="banner-text">{t('Korean Live Class Student Portal')}</span>
      </div>
      <div className="main-banner-strip">
        <div className="main-banner-desc">{t('Learn Korean Language Online')}</div>
        <div className="main-banner-text">අපේ කොරියන් හාමුදුරුවෝ</div>
      </div>
    </div>
  );
}