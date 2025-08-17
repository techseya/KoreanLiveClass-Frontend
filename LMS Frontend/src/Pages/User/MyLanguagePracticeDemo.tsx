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
import { getLanguagePracticeQuestions, getLanguagePractices } from "src/Services/lang_practice_api";
import { Person } from "@mui/icons-material";

export default function MyLanguagePracticeDemo() {
    const [langs, setLangs] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [type, setType] = useState<any>(null);
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [questions, setQuestions] = useState<any[]>([]);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [correctAnswers, setCorrectAnswers] = useState<boolean[]>([]);

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

    const navigate = useNavigate();
    const token = localStorage.getItem("token") || "";

    useEffect(() => {
        if (questions.length) {
            setUserAnswers(Array(questions.length).fill(""));
        }
    }, [questions]);

    useEffect(() => {
        console.log("Location state:", location.pathname.split("/").pop());

        handleGetLangPractices(location.pathname.split("/").pop());

        AOS.init({
            duration: 1000,
            once: true
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleGetLangPractices = async (id: any) => {
        try {
            const response = await getLanguagePracticeQuestions(id, token);
            console.log("Language Practice Questions:", response.data);
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
                    {type === "1" && (
                        <div className="lang-card" data-aos="fade-up" data-aos-delay="100">
                            <Grid item xs={12} sm={12} mt={2}>
                                {questions.length > 0 ? (<>
                                    {questions.map((q: any, qIdx: number) =>
                                        q.audioFilePaths?.map((question: any, index: any) => (
                                            (index % 2 === 0) ? (
                                                <div>
                                                    <div style={{ display: "flex", gap: "8px" }} key={`${qIdx}-${index}`}>
                                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                                                            <Person sx={{ fontSize: "40px", color: "#1d6add", padding: "4px", backgroundColor: "wheat", borderRadius: "40px" }} />
                                                        </div>
                                                        <div className="audio-outer" style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "8px 10px", backgroundColor: "#dfe6e9", borderRadius: "8px", position: "relative" }}>

                                                            {question?.audioUserName?.split(",")[0] || "User1"}
                                                            <audio className="audio-player" controls src={question?.audioFilePath ? question.audioFilePath.replace("dl=0", "raw=1") : ""} />
                                                        </div>
                                                    </div>
                                                    <div style={{ padding: "4px 10px", borderRadius: "8px", margin: "8px" }}>
                                                        {question?.subtitle}
                                                    </div>

                                                </div>

                                            ) : (
                                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                                    <div style={{ display: "flex", gap: "8px" }} key={`${qIdx}-${index}`}>
                                                        <div className="audio-outer" style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "8px 10px", backgroundColor: "#dfe6e9", borderRadius: "8px", position: "relative", alignItems: "flex-end" }}>

                                                            {question?.audioUserName?.split(",")[0] || "User1"}
                                                            <audio className="audio-player" controls src={question?.audioFilePath ? question.audioFilePath.replace("dl=0", "raw=1") : ""} />
                                                        </div>
                                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                                                            <Person sx={{ fontSize: "40px", color: "#1d6add", padding: "4px", backgroundColor: "wheat", borderRadius: "40px" }} />
                                                        </div>
                                                    </div>
                                                    <div style={{ padding: "4px 10px", borderRadius: "8px", margin: "8px" }}>
                                                        {question?.subtitle}
                                                    </div>
                                                </div>
                                            )
                                        ))
                                    )}
                                </>) : (<>
                                    No questions found
                                </>)}
                            </Grid>
                        </div>
                    )}

                    {type === "2" && (
                        <div className="lang-card" data-aos="fade-up" data-aos-delay="100">
                            <Grid item xs={12} sm={12} mt={2}>
                                <h2>{t("scramble")}</h2>
                                {questions.length > 0 ? (
                                    <>
                                        {questions.map((q, idx) => (
                                            <Box key={q.id} sx={{ mb: 3 }}>
                                                <Typography variant="h6" gutterBottom>
                                                    {idx + 1} ) {q.scrambledSentence.split(" ").join(" / ")}
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
