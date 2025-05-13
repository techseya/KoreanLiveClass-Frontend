import { useEffect, useState } from "react";
import "../../Common/styles/courses.css";
import "../../Common/styles/home.css";
import { getAllCourses, getCourseByUserId } from "src/Services/course_api";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Tooltip, TextField } from "@mui/material";
import insImg from "../../Assets/Images/ins.jpg";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Footer from "src/Layout/Footer";
import thumb from "../../Assets/Images/klc-thumb.png"

export default function MyCourses() {
    const [courses, setCourses] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const { t, i18n } = useTranslation();

    const navigate = useNavigate();
    const token = sessionStorage.getItem("token")
    const id = sessionStorage.getItem("id")

    const handleCourseClick = (course: any) => {
        
        navigate(`/my-course`, {
            state: {
              id: course.id,
              name: course.name,
              description : course.description,
              thumbnail: (course.thumbnail === null || course.thumbnail === "") ? thumb : course.thumbnail,
              level: course.level,
              totalDuration: course.totalDuration,
              price: course.price,
              sectionCount: course.sectionCount,
            }
          });
    };


    useEffect(() => {
        if(token === null){
            navigate("/")
        }
        handleGetCourses();

        AOS.init({
            duration: 1000,
            once: true
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleGetCourses = async () => {
        try {
            const response = await getCourseByUserId(id,token);
            console.log(response);
            setCourses(response?.data);
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
            <div className="bg"></div>
                <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", zIndex:10 }}>{t("myCourses")}</h1>
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
                            onClick={() => handleCourseClick(course)}
                            key={index}
                            style={{ cursor: "pointer" }}
                        >
                            <div className="course-thumbnail">
                                {course.thumbnail === null || course.thumbnail === ""? (<img src={thumb} alt="Course Thumbnail" />)
                                : (<img src={course.thumbnail.replace("dl=0", "raw=1")} alt="Course Thumbnail" />)} 
                                
                            </div>

                            <div className="course-info">
                                <span className="course-level">{course.level}</span>
                                <h3 className="course-title">{course.name}</h3>
                            </div>
                        </div>
                    )) : (
                        <p style={{ textAlign: "center", width: "100%" }}>No courses found.</p>
                    )}
                </div>
            </div>
            
            <div className="space1"></div>
            <div className="space1"></div>
            <div className="space1"></div>

            <Footer/>
        </div>
    );
}
