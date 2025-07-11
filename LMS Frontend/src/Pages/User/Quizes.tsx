import { useEffect, useState } from "react";
import "../../Common/styles/courses.css";
import "../../Common/styles/quiz.css";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { getAllCourses } from "src/Services/course_api";
import Footer from "src/Layout/Footer";

export default function UserQuizes() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState("default");

    const token = localStorage.getItem("token");

    useEffect(() => {
        handleGetTopCourses();
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

    const handleSelectChange = (event: any) => {
        setSelectedCourse(event.target.value);
    };

    return (
        <div className="courses-main-outer">
            <div className="courses-header" style={{ textAlign: "center", marginBottom: "1rem" }}>
                <div className="bg"></div>
                <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", zIndex: 10 }}>{t("quiz")}</h1>

                <FormControl
                    sx={{
                        maxWidth: "500px",
                        width: "90%",
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        textAlign: "left",
                    }}
                    fullWidth
                >
                    <Select
                        labelId="course-select-label"
                        id="course-select"
                        value={selectedCourse}
                        onChange={handleSelectChange}
                    >
                        <MenuItem value="default" disabled>
                            Select a course
                            </MenuItem>
                        {courses.map((course) => (
                            <MenuItem key={course.id} value={course.id}>
                                {course.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <div className="cmi">

                <div className="courses-main-inner">
                    {/* {filteredCourses.length > 0 ? filteredCourses.map((course, index) => (
                        <Link to={`/course/${course.id}`}
                            style={{ textDecoration: "none" }}>
                            <div
                                className="course-card"
                                data-aos="fade-up"
                                data-aos-delay="100"
                                key={index}
                                style={{ cursor: "pointer" }}
                            >
                                <div className="course-thumbnail">
                                    {course.thumbnail === null || course.thumbnail === "" ? (<img src={thumb} alt="Course Thumbnail" />)
                                        : (<img src={course.thumbnail.replace("dl=0", "raw=1")} alt="Course Thumbnail" />)}
                                    {course.transactionStatus === 1 ?
                                        (<div className="price">Rs.{(course.price).toFixed(2)}</div>) :
                                        (<div className="price">FREE</div>)}
                                </div>

                                <div className="course-info">
                                    <span className="course-level">{course.level}</span>
                                    <h3 className="course-title">{course.name}</h3>
                                </div>
                            </div>
                        </Link>
                    )) : (
                        <p style={{ textAlign: "center", width: "100%" }}>No courses found.</p>
                    )} */}
                </div>
            </div>

            <div className="space1"></div>
            <div className="space1"></div>
            <div className="space1"></div>

            <Footer />
        </div>
    );
}
