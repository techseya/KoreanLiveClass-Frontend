import { useEffect } from "react";
import "../../Common/styles/courses.css";
import "../../Common/styles/quiz.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function UserQuizes() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const token = localStorage.getItem("token");

    const handleNavQuiz = () => {
        navigate("/quiz");
    };

    useEffect(() => {
            // if (token === null) {
            //     navigate("/")
            // }
        }, []);

    return (
        <div className="quizes-container">
            <h1>{t("Quizes")}</h1>
            <button onClick={handleNavQuiz}>{t("Start Quiz")}</button>
        </div>
    );
}