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

export default function Courses() {
    const [courses, setCourses] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const { t, i18n } = useTranslation();

    useEffect(() => {
        handleGetTopCourses();

        AOS.init({
            duration: 1000,
            once: true
        });
    }, []);

    const handleGetTopCourses = async () => {
        try {
            const response = await getAllCourses();
            const activeCourses = response.data.filter((course: any) => course.activeStatus === 1);
            setCourses(activeCourses);
        } catch (error) {
            console.error(error);
        }
    };

    // Filter courses based on searchTerm
    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="courses-main-outer">
            <div className="courses-header" style={{ textAlign: "center", marginBottom: "1rem" }}>
                <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{t("Courses")}</h1>
                <TextField
                    variant="outlined"
                    placeholder="Search courses..."
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
                    {filteredCourses.length > 0 ? filteredCourses.map((course, index) => (
                        <div
                            className="course-card"
                            data-aos="fade-up"
                            data-aos-delay="100"
                            key={index}
                            style={{ cursor: "pointer" }}
                        >
                            <div className="course-thumbnail">
                                <img src={course.thumbnail} alt="Course Thumbnail" />
                                <div className="price">Rs.{(course.price).toFixed(2)}</div>
                            </div>

                            <div className="course-info">
                                <span className="course-level">{course.level}</span>
                                <h3 className="course-title">{course.name}</h3>
                            </div>

                            <div className="course-info2">
                                <Tooltip title="Ven. Kalyanapura Mangala" arrow placement="top">
                                    <img className="ins-img" src={insImg} alt="Instructor" style={{ cursor: "pointer" }} />
                                </Tooltip>
                                <div className="course-duration">
                                    <ClockCircleOutlined className="clock-icon" />
                                    {course.totalDuration} Hours
                                </div>
                            </div>
                        </div>
                    )) : (
                        <p style={{ textAlign: "center", width: "100%" }}>No courses found.</p>
                    )}
                </div>
            </div>

        </div>
    );
}
