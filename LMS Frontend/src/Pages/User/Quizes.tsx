import { useEffect, useState } from "react";
import "../../Common/styles/courses.css";
import "../../Common/styles/quiz.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { getAllCourses } from "src/Services/course_api";

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
        </div>
    );
}
