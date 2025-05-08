import { useEffect, useState } from "react";
import "../../Common/styles/courses.css";
import "../../Common/styles/home.css";
import { TextField } from "@mui/material";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Footer from "src/Layout/Footer";
import { getCategories } from "src/Services/category_api";
import chess from "../../Assets/Images/chess(blue).png"

export default function Category() {
    const [Categories, setCategories] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const { t, i18n } = useTranslation();

    const navigate = useNavigate();

    const handleCategoryClick = (course: any) => {

        // navigate(`/course`, {
        //     state: {
        //         id: course.id,
        //         name: course.name,
        //         description: course.description,
        //         thumbnail: course.thumbnail,
        //         level: course.level,
        //         totalDuration: course.totalDuration,
        //         price: course.price,
        //         sectionCount: course.sectionCount,
        //         transactionStatus: course.transactionStatus
        //     }
        // });
    };


    useEffect(() => {
        handleGetCategories();

        AOS.init({
            duration: 1000,
            once: true
        });
    }, []);

    const handleGetCategories = async () => {
        try {
            const response = await getCategories();
            const activeCategories = response.data.filter((course: any) => course.activeStatus === 1);
            setCategories(activeCategories);
        } catch (error) {
            console.error(error);
        }
    };

    // Filter Categories based on searchTerm
    const filteredCategories = Categories.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="courses-main-outer">
            <div className="courses-header" style={{ textAlign: "center", marginBottom: "1rem" }}>
                <div className="bg"></div>
                <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{t("Categories")}</h1>
                <TextField
                    variant="outlined"
                    placeholder="Search Categories..."
                    fullWidth
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                    sx={{
                        maxWidth: "500px",
                        width: "90%",
                        backgroundColor: "#fff",
                        borderRadius: "8px"
                    }}
                />
            </div>

            <div className="cmi">

                <div className="courses-main-inner">
                    {filteredCategories.length > 0 ? filteredCategories.map((course, index) => (
                        <div
                            className="course-card"
                            data-aos="fade-up"
                            data-aos-delay="100"
                            onClick={() => handleCategoryClick(course)}
                            key={index}
                            style={{ cursor: "pointer" }}
                        >
                            <div className="course-thumbnail6">
                            <h3 className="course-title">{course.name}</h3>
                            </div>

                            <div className="course-info">                                
                                <span className="course-level">Courses: {course.courseCount}</span>
                            </div>
                        </div>
                    )) : (
                        <p style={{ textAlign: "center", width: "100%" }}>No Categories found.</p>
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
