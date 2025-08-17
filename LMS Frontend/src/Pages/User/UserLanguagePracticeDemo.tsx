import { useEffect, useState } from "react";
import "../../Common/styles/courses.css";
import "../../Common/styles/home.css";
import { getAllCourses } from "src/Services/course_api";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Tooltip, TextField, Grid, Button, Typography, Divider, Box } from "@mui/material";
import insImg from "../../Assets/Images/ins.jpg";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "src/Layout/Footer";
import thumb from "../../Assets/Images/klc-thumb.png"
import { getLanguagePracticeQuestions } from "src/Services/lang_practice_api";
import av1 from "../../Assets/Images/av1.jpg";
import av2 from "../../Assets/Images/av2.jpg";
import av3 from "../../Assets/Images/av3.jpg";
import av4 from "../../Assets/Images/av4.jpg";
import av5 from "../../Assets/Images/av5.jpg";
import av6 from "../../Assets/Images/av6.jpg";
import av7 from "../../Assets/Images/av7.jpg";
import av8 from "../../Assets/Images/av8.jpg";
import av9 from "../../Assets/Images/av9.jpg";
import back1 from "../../Assets/Images/back1.jpg";
import back2 from "../../Assets/Images/back2.jpg";
import back3 from "../../Assets/Images/back3.jpg";
import back4 from "../../Assets/Images/back4.jpg";
import back5 from "../../Assets/Images/back5.jpg";
import back6 from "../../Assets/Images/back6.jpg";
import back7 from "../../Assets/Images/back7.jpg";
import back8 from "../../Assets/Images/back8.jpg";
import back9 from "../../Assets/Images/back9.jpg";

const avatarMap: { [key: string]: string } = {
    av1, av2, av3, av4, av5, av6, av7, av8, av9
};

const backgroundMap: { [key: string]: string } = {
    back1, back2, back3, back4, back5, back6, back7, back8, back9
};

export default function UserLanguagePracticeDemo() {
    const [langs, setLangs] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [type, setType] = useState<any>(null);
    const { t } = useTranslation();
    const location = useLocation();
    const [questions, setQuestions] = useState<any[]>([]);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [correctAnswers, setCorrectAnswers] = useState<boolean[]>([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token") || "";

    useEffect(() => {
        setUserAnswers(Array(questions.length).fill(""));
        setCorrectAnswers(Array(questions.length).fill(false));
    }, [questions]);

    const handleInputChange = (index: number, value: string) => {
        const updatedAnswers = [...userAnswers];
        updatedAnswers[index] = value;
        setUserAnswers(updatedAnswers);
    };

    const handleCheckAnswer = (index: number) => {
        const userAnswer = userAnswers[index].trim().toLowerCase();
        const correctAnswer = questions[index].originalSentence.trim().toLowerCase();
        const updatedCorrect = [...correctAnswers];
        updatedCorrect[index] = userAnswer === correctAnswer;
        setCorrectAnswers(updatedCorrect);
    };

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
        handleGetLangPractices(location.pathname.split("/").pop());
        AOS.init({ duration: 1000, once: true });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleGetLangPractices = async (id: any) => {
        try {
            const response = await getLanguagePracticeQuestions(id, token);
            if (response.data[0].originalSentence === "") {
                setType("1");
            } else {
                setType("2");
            }
            setQuestions(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="courses-main-outer">
            <div className="courses-header" style={{ textAlign: "center", marginBottom: "1rem" }}>
                <div className="bg"></div>
                <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", zIndex: 10 }}>{t("lang")}</h1>
            </div>

            <div className="cmi">
                <div className="courses-main-inner">

                    {/* Type 1 - Audio Practice */}
                    {type === "1" && questions.length > 0 && (
                        <>
                            {questions.map((q: any, qIdx: number) => {
                                // Common background for all audios in this card
                                const bgImage = q.audioFilePaths?.[0]?.backgroundImage
                                    ? backgroundMap[q.audioFilePaths[0].backgroundImage.trim()]
                                    : null;

                                return (
                                    <div
                                        key={qIdx}
                                        className="lang-card"
                                        data-aos="fade-up"
                                        data-aos-delay="100"
                                        style={{
                                            backgroundImage: bgImage ? `url(${bgImage})` : "none",
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            borderRadius: "12px",
                                            padding: "16px",
                                            marginBottom: "20px"
                                        }}
                                    >
                                        <Grid item xs={12} sm={12} mt={2}>
                                            {q.audioFilePaths?.map((question: any, index: number) => {
                                                const avatars = question?.audioAvatar
                                                    ? question.audioAvatar.split(",").map((av: string) => avatarMap[av.trim()])
                                                    : [];
                                                const isLeft = index % 2 === 0;

                                                return (
                                                    <div
                                                        key={`${qIdx}-${index}`}
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            alignItems: isLeft ? "flex-start" : "flex-end",
                                                            marginBottom: "16px"
                                                        }}
                                                    >
                                                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                                            {isLeft && avatars[0] && (
                                                                <img src={avatars[0]} alt="avatar"
                                                                    style={{
                                                                        width: 40, height: 40,
                                                                        borderRadius: "50%", objectFit: "cover"
                                                                    }} />
                                                            )}

                                                            <div
                                                                className="audio-outer"
                                                                style={{
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    gap: "8px",
                                                                    padding: "8px 10px",
                                                                    backgroundColor: "#dfe6e9cc",
                                                                    borderRadius: "8px",
                                                                    position: "relative"
                                                                }}
                                                            >
                                                                {question?.audioUserName?.split(",")[0] || "User"}
                                                                <audio
                                                                    className="audio-player"
                                                                    controls
                                                                    src={question?.audioFilePath ? question.audioFilePath.replace("dl=0", "raw=1") : ""}
                                                                />
                                                            </div>

                                                            {!isLeft && avatars[1] && (
                                                                <img src={avatars[1]} alt="avatar"
                                                                    style={{
                                                                        width: 40, height: 40,
                                                                        borderRadius: "50%", objectFit: "cover"
                                                                    }} />
                                                            )}
                                                        </div>

                                                        <div style={{ padding: "4px 10px", borderRadius: "8px", marginTop: "8px" }}>
                                                            {question?.subtitle}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </Grid>
                                    </div>
                                );
                            })}
                        </>
                    )}

                    {/* Type 2 - Sentence Scramble */}
                    {type === "2" && (
                        <div className="lang-card" data-aos="fade-up" data-aos-delay="100">
                            <Grid item xs={12} sm={12} mt={2}>
                                <h2>{t("scramble")}</h2>
                                {questions.length > 0 ? (
                                    <>
                                        {questions.map((q, idx) => (
                                            <Box key={q.id} sx={{ mb: 3 }}>
                                                <Typography variant="h6" gutterBottom>
                                                    {idx + 1}) {q.scrambledSentence.split(" ").join(" / ")}
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    placeholder="Enter the correct sentence"
                                                    value={userAnswers[idx]}
                                                    onChange={(e) => handleInputChange(idx, e.target.value)}
                                                    size="small"
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            "& fieldset": {
                                                                borderColor: correctAnswers[idx] ? "green" : "rgba(0, 0, 0, 0.23)",
                                                            },
                                                            "&:hover fieldset": {
                                                                borderColor: correctAnswers[idx] ? "green" : "#000",
                                                            },
                                                            "&.Mui-focused fieldset": {
                                                                borderColor: correctAnswers[idx] ? "green" : "#1976d2",
                                                            },
                                                        },
                                                    }}
                                                />
                                                <Box sx={{ mt: 1 }}>
                                                    <Button variant="outlined" onClick={() => handleCheckAnswer(idx)}>
                                                        Check
                                                    </Button>
                                                </Box>
                                                {correctAnswers[idx] && (
                                                    <Typography sx={{ mt: 1, color: "green" }}>
                                                        ✅ Correct!
                                                    </Typography>
                                                )}
                                                {!correctAnswers[idx] && userAnswers[idx] && (
                                                    <Typography sx={{ mt: 1, color: "red" }}>
                                                        ❌ Incorrect.
                                                    </Typography>
                                                )}
                                                <Divider sx={{ mt: 2 }} />
                                            </Box>
                                        ))}
                                    </>
                                ) : (
                                    <>No questions found</>
                                )}
                            </Grid>
                        </div>
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
