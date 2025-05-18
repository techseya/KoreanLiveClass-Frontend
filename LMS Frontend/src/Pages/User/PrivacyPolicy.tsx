import "../../Common/styles/privacy.css"
import "../../Common/styles/courses.css"
import { useTranslation } from "react-i18next";

export default function PrivacyPolicy(){
    const { t } = useTranslation();
    return(
        <div className="p-outer">
            <div className="courses-header" style={{ textAlign: "center", marginBottom: "1rem" }}>
                <div className="bg"></div>
                <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", zIndex:10 }}>{t("SignUp")}</h1>
            </div>
        </div>
    )
}