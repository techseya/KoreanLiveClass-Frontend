import "../../Common/styles/privacy.css";
import "../../Common/styles/courses.css";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Footer from "src/Layout/Footer";

export default function Terms() {
    const { t } = useTranslation();

    useEffect(() => {
        window.scroll(0, 0);
    }, []);

    return (
        <div className="p-outer11">
            <div className="courses-header" style={{ textAlign: "center", marginBottom: "1rem" }}>
                <div className="bg"></div>
                <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", zIndex: 10 }}>{t("Terms of Service")}</h1>
            </div>
            <div className="p-inner11">
                <h2>{t("terms-h1")}</h2>
                <p>{t("terms-p1")}</p>
                <br />
                <h2>{t("terms-h2")}</h2>
                <p>{t("terms-p2")}</p>
                <p>{t("terms-p22")}</p>
                <p>{t("terms-p23")}</p>
                <br />

                <h2>{t("terms-h3")}</h2>
                <p>{t("terms-p3")}</p>
                <br />

                <h2>{t("terms-h4")}</h2>
                <p>{t("terms-p4")}</p>
                <br />

                <h2>{t("terms-h5")}</h2>
                <p>{t("terms-p5")}</p>
                <br />

                <h2>{t("terms-h6")}</h2>
                <p>{t("terms-p6")}</p>
                <p>{t("terms-p66")}</p>
                <br />

                <h2>{t("terms-h7")}</h2>
                <p>{t("terms-p7")}</p>
                <br />

                <h2>{t("terms-h8")}</h2>
                <p>{t("terms-p8")}</p>
                <br />

                <h2>{t("terms-h9")}</h2>
                <p>{t("terms-p9")}</p>
                <p>{t("terms-p99")}</p>
                <br />

                <h2>{t("terms-h10")}</h2>
                <p>{t("terms-p10")}</p>
                <br />

                <h2>{t("terms-h11")}</h2>
                <p>{t("terms-p11")}</p>
                <br />

                <h2>{t("terms-h12")}</h2>
                <p>{t("terms-p12")}</p>
                <br />

                <h2>{t("terms-h13")}</h2>
                <p>{t("terms-p13")}</p>
            </div>
            <Footer/>
        </div>
    );
}
