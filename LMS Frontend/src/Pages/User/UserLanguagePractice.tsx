import { useEffect, useState } from "react";
import "../../Common/styles/courses.css";
import "../../Common/styles/home.css";
import { getAllCourses } from "src/Services/course_api";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Tooltip, TextField } from "@mui/material";
import insImg from "../../Assets/Images/ins.jpg";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import Footer from "src/Layout/Footer";
import thumb from "../../Assets/Images/klc-thumb.png"
import { getLanguagePractices } from "src/Services/lang_practice_api";

export default function UserLanguagePractice() {
    const [langs, setLangs] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const { t, i18n } = useTranslation();

    const navigate = useNavigate();
    const token = localStorage.getItem("token") || "";

    const handleCourseClick = (course: any) => {

        navigate(`/course`, {
            state: {
                id: course.id,
                name: course.name,
                description: course.description,
                thumbnail: (course.thumbnail === null || course.thumbnail === "") ? thumb : course.thumbnail,
                level: course.level,
                totalDuration: course.totalDuration,
                price: course.price,
                sectionCount: course.sectionCount,
                transactionStatus: course.transactionStatus
            }
        });
    };

    useEffect(() => {
        handleGetLangPractices();

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

            <div className="cmi">

                <div className="courses-main-inner">
                    {filteredLangs.length > 0 ? filteredLangs.map((lang, index) => (
                        <Link to={`/course/${lang.id}`}
                            style={{ textDecoration: "none" }}>
                            <div
                                className="course-card"
                                data-aos="fade-up"
                                data-aos-delay="100"
                                key={index}
                                style={{ cursor: "pointer" }}
                            >
                                <div className="course-thumbnail">
                                    <img src={thumb} alt="Course Thumbnail" />
                                </div>

                                <div className="course-info">
                                    <h3 className="course-title">{lang.name}</h3>
                                    <span className="course-level">{lang.difficultyLevel === 1 ? <span>Easy</span> : lang.difficultyLevel === 2 ? <span>Medium</span> : <span>Hard</span>}</span>
                                </div>
                            </div>
                        </Link>
                    )) : (
                        <p style={{ textAlign: "center", width: "100%" }}>No Language Practices Found.</p>
                    )}
                </div>
            </div>

            <div className="space1"></div>
            <div className="space1"></div>
            <div className="space1"></div>

            <Footer />
        </div>
    );
}
