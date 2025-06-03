import { useEffect, useState } from "react";
import "../../Common/styles/courses.css";
import "../../Common/styles/home.css";
import { getAllCourses, getCourseByUserId } from "src/Services/course_api";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Tooltip, TextField, IconButton, Modal } from "@mui/material";
import insImg from "../../Assets/Images/ins.jpg";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Footer from "src/Layout/Footer";
import thumb from "../../Assets/Images/klc-thumb.png"
import { getAllWords } from "src/Services/word_api";
import { ArrowBackIos, ArrowForwardIos, AutoStories, Book, Close } from "@mui/icons-material";

export default function MyCourses() {
    const [courses, setCourses] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [rows, setRows] = useState<any[]>([]);
    const { t, i18n } = useTranslation();
    const [modalOpen, setModalOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageLoading, setImageLoading] = useState(true);

    const navigate = useNavigate();
    const token = localStorage.getItem("token")
    const id = localStorage.getItem("id")

    const handleOpenModal = () => {
        if (rows.length > 0) {
            setModalOpen(true);
            setCurrentIndex(0);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % rows.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + rows.length) % rows.length);
    };

    const handleCourseClick = (course: any) => {

        navigate(`/my-course`, {
            state: {
                id: course.id,
                name: course.name,
                description: course.description,
                thumbnail: (course.thumbnail === null || course.thumbnail === "") ? thumb : course.thumbnail,
                level: course.level,
                totalDuration: course.totalDuration,
                price: course.price,
                sectionCount: course.sectionCount,
            }
        });
    };

    useEffect(() => {
        if (token === null) {
            navigate("/")
        }
        handleGetCourses();
        handleGetLessons();
        setImageLoading(true);

        AOS.init({
            duration: 1000,
            once: true
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentIndex]);

    const handleGetLessons = async () => {
        try {
            const response = await getAllWords(token);
            const allWords = response.data;

            if (allWords.length === 0) {
                setRows([]);
                return;
            }

            const baseDate = new Date(allWords[0].createdAt).toISOString().split("T")[0];

            const filteredWords = allWords
                .map((word: any) => ({
                    ...word,
                    createdAtDate: new Date(word.createdAt).toISOString().split("T")[0]
                }))
                .filter((word: any) => word.createdAtDate === baseDate)
                .map((word: any) => ({
                    ...word,
                    active: "Yes"
                }));

            setRows(filteredWords);
        } catch (error: any) {
            console.error(error);
        }
    };


    const handleGetCourses = async () => {
        try {
            const response = await getCourseByUserId(id, token);
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
                <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", zIndex: 10 }}>{t("myCourses")}</h1>
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
                                {course.thumbnail === null || course.thumbnail === "" ? (<img src={thumb} alt="Course Thumbnail" />)
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

            <div className="tl-outer" onClick={handleOpenModal} style={{ cursor: "pointer" }}>
                <AutoStories />
                {t("extra")}
            </div>

            <Modal open={modalOpen} onClose={handleCloseModal}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: '500px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '2rem',
                    textAlign: 'center',
                    outline: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}>
                    <IconButton onClick={handleCloseModal} style={{ position: 'absolute', top: 10, right: 10 }}>
                        <Close />
                    </IconButton>

                    {rows.length > 0 && (
                        <>
                            {rows[currentIndex].imageUrl && (
                                <div style={{ position: "relative", width: "100%", minHeight: "150px" }}>
                                    {imageLoading && (
                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
                                            <span className="loader" /> {/* You can use a spinner or any loading icon here */}
                                        </div>
                                    )}
                                    <img
                                        src={rows[currentIndex].imageUrl.replace("dl=0", "raw=1")}
                                        alt="word"
                                        onLoad={() => setImageLoading(false)}
                                        style={{
                                            width: "30%",
                                            height: "auto",
                                            borderRadius: "8px",
                                            marginTop: "1rem",
                                            display: imageLoading ? "none" : "inline-block"
                                        }}
                                    />
                                </div>
                            )}
                            <h2>{rows[currentIndex].korean}</h2>
                            <p>{rows[currentIndex].sinhala}</p>

                            {/* Display index */}
                            <p style={{ marginTop: "1rem", color: "#888" }}>
                                {currentIndex + 1} / {rows.length}
                            </p>

                            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between" }}>
                                <IconButton onClick={handlePrev}>
                                    <ArrowBackIos />
                                </IconButton>
                                <IconButton onClick={handleNext}>
                                    <ArrowForwardIos />
                                </IconButton>
                            </div>
                        </>
                    )}
                </div>
            </Modal>


            <Footer />
        </div>
    );
}
