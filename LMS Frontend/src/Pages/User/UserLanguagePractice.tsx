import { useEffect, useState } from "react";
import "../../Common/styles/courses.css";
import "../../Common/styles/home.css";
import { getAllCourses } from "src/Services/course_api";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Tooltip, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import insImg from "../../Assets/Images/ins.jpg";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import Footer from "src/Layout/Footer";
import thumb from "../../Assets/Images/klc-thumb.png"
import { getLanguagePractices } from "src/Services/lang_practice_api";
import { getAssignLanguagePractice } from "src/Services/user_api";

export default function UserLanguagePractice() {
    const [langs, setLangs] = useState<any[]>([]);
    const [assignedLangPractices, setAssignedLangPractices] = useState<any[]>([]);
    const [myLangsOnly, setMyLangsOnly] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const { t, i18n } = useTranslation();
    const [checkBoxVisibility, setCheckBoxVisibility] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem("token") || "";

    useEffect(() => {
        handleGetLangPractices();

        if (token === "") {
            setCheckBoxVisibility(false);
        } else {
            setCheckBoxVisibility(true);
        }

        AOS.init({
            duration: 1000,
            once: true
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleGetLangPractices = async () => {
        try {
            const response = await getLanguagePractices(token);
            const activel = response.data.filter((l: any) => l.activeStatus === 1);
            setLangs(activel);
        } catch (error) {
            console.error(error);
        }
    };

    const handleGetAssignLangPractices = async () => {
        try {
            const response = await getAssignLanguagePractice(localStorage.getItem("id") || "", token);
            const activel = response.data.filter((l: any) => l.languagePracticeStatus === 1);
            setAssignedLangPractices(activel);
        } catch (error) {
            console.error(error);
        }
    };

    // Filter courses based on searchTerm
    const filteredLangs = langs.filter(lang =>
        lang.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="courses-main-outer">
            <div className="courses-header" style={{ textAlign: "center", marginBottom: "1rem" }}>
                <div className="bg"></div>
                <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", zIndex: 10 }}>{t("lang")}</h1>
            </div>

            {checkBoxVisibility && (
                <div className="checkbox-out" style={{ marginTop: "15px", display: "flex", justifyContent: "left", marginLeft: "40px" }}>
                    <ToggleButtonGroup
                        value={myLangsOnly ? "my" : "all"}
                        exclusive
                        onChange={(e, newValue) => {
                            if (newValue === null) return;
                            const isMy = newValue === "my";
                            setMyLangsOnly(isMy);
                            if (isMy) {
                                handleGetAssignLangPractices();
                            } else {
                                handleGetLangPractices();
                            }
                        }}
                        aria-label="quiz toggle"
                        sx={{
                            backgroundColor: "white",
                            borderRadius: "8px",
                            '& .MuiToggleButton-root': {
                                color: "grey",
                                borderColor: "#90caf9",
                                fontWeight: 500,
                                padding: "6px 16px",
                            },
                            '& .Mui-selected': {
                                backgroundColor: "#3366cc !important",
                                color: "#fff !important",
                                '&:hover': {
                                    backgroundColor: "#1976d2",
                                },
                            },
                        }}
                    >
                        <ToggleButton value="all" aria-label="all langs">
                            {t("langall")}
                        </ToggleButton>
                        <ToggleButton value="my" aria-label="my langs">
                            {t("langpaid")}
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
            )}

            <div className="cmi">
                {!myLangsOnly && (
                    <div className="courses-main-inner">
                        {filteredLangs.length > 0 ? filteredLangs.map((lang, index) => (
                            <div
                                className="course-card"
                                data-aos="fade-up"
                                data-aos-delay="100"
                                key={index}
                                style={{ cursor: lang.isPaid ? "not-allowed" : "pointer" }}
                                onClick={() => {
                                    if (!lang.isPaid) {
                                        navigate(`/language-practice-demo/${lang.id}`);
                                    } else {
                                        // optionally show alert or redirect to payment
                                        alert("This practice is paid. Please purchase to access.");
                                    }
                                }}
                            >
                                <div style={{ position: "relative" }} className="course-thumbnail">
                                    <img src={thumb} alt="Course Thumbnail" />
                                </div>

                                {lang.isPaid ? (
                                    <div style={{ position: "absolute", top: "10px", right: "10px" }} className="price">
                                        Rs.{lang.price}
                                    </div>
                                ) : (
                                    <div style={{ position: "absolute", top: "10px", right: "10px" }} className="price">
                                        {t("free")}
                                    </div>
                                )}

                                <div className="course-info">
                                    <h3 className="course-title">{lang.name}</h3>
                                    <span className="course-level">
                                        {lang.difficultyLevel === 1 ? "Easy" : lang.difficultyLevel === 2 ? "Medium" : "Hard"}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <p style={{ textAlign: "center", width: "100%" }}>No Language Practices Found.</p>
                        )}
                    </div>
                )}

                {myLangsOnly && (
                    <div className="courses-main-inner">
                        {assignedLangPractices.length > 0 ? assignedLangPractices.map((lang, index) => (
                            <div
                                className="course-card"
                                data-aos="fade-up"
                                data-aos-delay="100"
                                key={index}
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    navigate(`/my-language-practice-demo/${lang.languagePracticeId}`);
                                }}
                            >
                                <div style={{ position: "relative" }} className="course-thumbnail">
                                    <img src={thumb} alt="Course Thumbnail" />
                                </div>

                                <div className="course-info">
                                    <h3 className="course-title">{lang.languagePracticeName}</h3>
                                </div>
                            </div>
                        )) : (
                            <p style={{ textAlign: "center", width: "100%" }}>No Assigned Language Practices Found.</p>
                        )}
                    </div>
                )}

            </div>

            <div className="space1"></div>
            <div className="space1"></div>
            <div className="space1"></div>

            <Footer />
        </div>
    );
}
