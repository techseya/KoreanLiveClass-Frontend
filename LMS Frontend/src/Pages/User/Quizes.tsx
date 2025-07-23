import { useEffect, useState } from "react";
import "../../Common/styles/courses.css";
import "../../Common/styles/quiz.css";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { TextField, FormControl, InputLabel, Select, MenuItem, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { getAllCourses } from "src/Services/course_api";
import Footer from "src/Layout/Footer";
import { getPdf, getQuiz, getQuizById } from "src/Services/quiz_api";
import thumb from "../../Assets/Images/klc-thumb.png"
import { GetAssignQuizes, getUserQuizDetails } from "src/Services/user_api";
import QuizModal from "src/Common/Components/QuizModal";

export default function UserQuizes() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState("default");
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [myQuizzesOnly, setMyQuizzesOnly] = useState(false);
    const [checkBoxVisibility, setCheckBoxVisibility] = useState(false);
    const [assignedQuizes, setAssignedQuizes] = useState<any[]>([]);
    const [quiz, setQuiz] = useState<any>(null);
    const [userQuizDetails, setUserQuizDetails] = useState<any>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id")

    useEffect(() => {
        handleGetTopCourses();

        if (token === null) {
            setCheckBoxVisibility(false);
        } else {
            setCheckBoxVisibility(true);
        }

        window.scrollTo(0, 0);
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

    const handleGetQuizes = async (id: any) => {
        try {
            const res = await getQuiz(id);
            const activeQuizzes = res.data.filter((quiz: any) => quiz.activeStatus === 1);
            setQuizzes(activeQuizzes);
        } catch (error) {
            console.error(error);
        }
    };

    const handleGetQuizById = async (id: any) => {
        try {
            const res = await getQuizById(id);
            setQuiz(res.data);
            setModalOpen(true);
        } catch (error) {
            console.error(error);
        }
    }

    const handleGetUserQuizDetails = async (quizId: any) => {
        try {
            const res = await getUserQuizDetails(id, quizId, token);
            setUserQuizDetails(res.data);
            handleGetQuizById(quizId);
        } catch (error) {
            console.error(error);
        }
    }

    const handleGetAssignQuizes = async (courseid: any) => {
        try {
            const res = await GetAssignQuizes(id, courseid, token)
            setAssignedQuizes(res.data)
        } catch (error: any) {
            console.log(error);
        }
    }

    return (
        <div className="courses-main-outer">

            <div className="courses-header" style={{ textAlign: "center", marginBottom: "1rem" }}>
                <QuizModal open={modalOpen} onClose={() => setModalOpen(false)} quiz={quiz} buy={myQuizzesOnly} usedAttempts={userQuizDetails?.attempts} marks={userQuizDetails?.marks} userId={id} quizId={quiz?.id} />

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
                        onChange={(e: any) => {
                            handleSelectChange(e)
                            setMyQuizzesOnly(false);
                            if (e.target.value !== "default") {
                                handleGetQuizes(e.target.value);
                            } else {
                                setQuizzes([]);
                            }
                        }}
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

            {checkBoxVisibility && (
                <div className="checkbox-out" style={{ marginTop: "15px", display: "flex", justifyContent: "left", marginLeft: "40px" }}>
                    <ToggleButtonGroup
                        value={myQuizzesOnly ? "my" : "all"}
                        exclusive
                        onChange={(e, newValue) => {
                            if (newValue === null) return;
                            const isMy = newValue === "my";
                            setMyQuizzesOnly(isMy);
                            if (isMy) {
                                handleGetAssignQuizes(selectedCourse);
                            } else {
                                handleGetQuizes(selectedCourse);
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
                        <ToggleButton value="all" aria-label="all quizzes">
                            {t("quiz")}
                        </ToggleButton>
                        <ToggleButton value="my" aria-label="my quizzes">
                            {t("My Quizzes")}
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
            )}


            <div className="cmi">
                {myQuizzesOnly ? (
                    <div className="courses-main-inner">
                        {assignedQuizes.length > 0 ? assignedQuizes.map((quiz, index) => (
                                <div
                                    className="course-card"
                                    data-aos="fade-up"
                                    data-aos-delay="100"
                                    key={index}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        handleGetUserQuizDetails(quiz.quizId);
                                    }}
                                >
                                    <div className="course-thumbnail">
                                        {quiz.quizImageUrl === null || quiz.quizImageUrl === "" ? (<img src={thumb} alt="Course Thumbnail" />)
                                            : (<img src={quiz.quizImageUrl.replace("dl=0", "raw=1")} alt="Course Thumbnail" />)}
                                    </div>

                                    <div className="course-info">
                                        <h3 className="course-title">{quiz.quizName}</h3>
                                    </div>
                                </div>
                        )) : (
                            <p style={{ textAlign: "center", width: "100%" }}>No Purchased Papers found.</p>
                        )}
                    </div>
                ) : (
                    <div className="courses-main-inner">
                        {quizzes.length > 0 ? quizzes.map((quiz, index) => (
                            <div
                                className="course-card"
                                data-aos="fade-up"
                                data-aos-delay="100"
                                key={index}
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    handleGetQuizById(quiz.id);
                                    setUserQuizDetails(null);
                                }}
                            >
                                <div className="course-thumbnail">
                                    {quiz.imageUrl === null || quiz.imageUrl === "" ? (<img src={thumb} alt="Course Thumbnail" />)
                                        : (<img src={quiz.imageUrl.replace("dl=0", "raw=1")} alt="Course Thumbnail" />)}
                                    <div className="price">Rs.{(quiz.prize).toFixed(2)}</div>
                                </div>

                                <div className="course-info">
                                    <h3 className="course-title">{quiz.name}</h3>
                                </div>
                            </div>
                        )) : (
                            <p style={{ textAlign: "center", width: "100%" }}>No Papers found.</p>
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
