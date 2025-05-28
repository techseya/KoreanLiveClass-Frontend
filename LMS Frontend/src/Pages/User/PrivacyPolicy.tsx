import "../../Common/styles/privacy.css";
import "../../Common/styles/courses.css";
import { useTranslation } from "react-i18next";
import Footer from "src/Layout/Footer";
import { useEffect } from "react";

export default function PrivacyPolicy() {
    const { t } = useTranslation();

    useEffect(() => {
        window.scroll(0, 0);
    }, []);

    return (
        <div className="p-outer1">
            <div className="courses-header" style={{ textAlign: "center", marginBottom: "1rem" }}>
                <div className="bg"></div>
                <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", zIndex: 10 }}>{t("Privacy Policy")}</h1>
            </div>
            <div className="p-inner11">
                <p>{t("pp-p1")}</p>

                <br />
                <h2>{t("pp-h1")}</h2>
                <p>{t("pp-p2")}</p>
                <br />
                <h2>{t("pp-h2")}</h2>
                <p>{t("pp-p3")}</p>
                <br />
                <h2>{t("pp-h3")}</h2>
                <p>{t("pp-p4")}</p>
                <br />
                <h2>{t("pp-h4")}</h2>
                <p>{t("pp-p5")}</p>
                <br />
                <h2>{t("pp-h5")}</h2>
                <p>{t("pp-p6")}</p>
                <br />
                <h2>{t("pp-h6")}</h2>
                <p>{t("pp-p7")}</p>
                <br />
                <h2>{t("pp-h7")}</h2>
                <p>{t("pp-p8")}</p>
                <p>{t("pp-note1")}</p>
                <br />
                <h2>{t("pp-h8")}</h2>
                <p>{t("pp-p9")}</p>
                <br />
                <h2>{t("pp-h9")}</h2>
                <p>{t("pp-p10")}</p>
                <br />
                <h2>{t("pp-h10")}</h2>
                <p>{t("pp-p11")}</p>
                <p>{t("pp-email")}</p>
                <p>{t("pp-note2")}</p>
                <br />
                <h2>{t("pp-h11")}</h2>
                <br />
                <h3>{t("pp-h12")}</h3>
                <p>{t("pp-p12")}</p>
                <br />
                <h3>{t("pp-h13")}</h3>
                <p>{t("pp-p13")}</p>
            </div>

            <Footer />
        </div>
    );
}
