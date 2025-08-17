import { useEffect, useState } from "react";
import "../../Common/styles/courses.css";
import "../../Common/styles/home.css";
import { getLanguagePracticeQuestions } from "src/Services/lang_practice_api";
import { TextField, Grid, Button, Typography, Divider, Box } from "@mui/material";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "src/Layout/Footer";
import thumb from "../../Assets/Images/klc-thumb.png";
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

export default function MyLanguagePracticeDemo() {
    const [type, setType] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [correctAnswers, setCorrectAnswers] = useState<boolean[]>([]);
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem("token") || "";

    useEffect(() => {

        if (!token) {
            navigate("/")
        }

        handleGetLangPractices(location.pathname.split("/").pop());
        AOS.init({ duration: 1000, once: true });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

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

    const handleGetLangPractices = async (id: any) => {
        try {
            const response = await getLanguagePracticeQuestions(id, token);
            if (response.data[0].originalSentence === "") setType("1");
            else setType("2");
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
                    {type === "1" && questions.length > 0 && questions.map((q: any, qIdx: number) => {
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
                                        const avatarKey = question.audioAvatar?.split(",")[0].trim();
                                        const userName = question.audioUserName?.split(",")[0].trim();
                                        const speakerAvatar = avatarMap[avatarKey] || null;
                                        const isLeft = index % 2 === 0;

                                        return (
                                            <div
                                                key={index}
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    marginBottom: "16px",
                                                    alignItems: isLeft ? "flex-start" : "flex-end",
                                                    width: "100%"
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: isLeft ? "row" : "row-reverse",
                                                        alignItems: "flex-start",
                                                        gap: "8px",
                                                        flexWrap: "wrap" // allow wrap on small screens
                                                    }}
                                                >
                                                    {speakerAvatar && (
                                                        <img
                                                            src={speakerAvatar}
                                                            alt={userName}
                                                            style={{
                                                                width: 40,
                                                                height: 40,
                                                                borderRadius: "50%",
                                                                objectFit: "cover",
                                                                flexShrink: 0
                                                            }}
                                                        />
                                                    )}

                                                    <div
                                                        className="audio-outer"
                                                        style={{
                                                            backgroundColor: "#dfe6e9cc",
                                                            padding: "8px 10px",
                                                            borderRadius: "8px",
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            minWidth: "200px",
                                                            maxWidth: "calc(100% - 48px)" // keep some spacing from avatar
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                textAlign: isLeft ? "left" : "right",
                                                                fontWeight: 600,
                                                                marginBottom: "4px",
                                                                wordBreak: "break-word"
                                                            }}
                                                        >
                                                            {userName}
                                                        </div>

                                                        <audio
                                                            controls
                                                            src={question.audioFilePath?.replace("dl=0", "raw=1") || ""}
                                                            style={{ width: "100%", marginBottom: "4px" }}
                                                        />
                                                        <div style={{ wordBreak: "break-word" }}>{question.subtitle}</div>
                                                    </div>
                                                </div>
                                            </div>

                                        );
                                    })}


                                </Grid>
                            </div>
                        );
                    })}

                    {/* Type 2 - Sentence Scramble */}
                    {type === "2" && (
                        <div className="lang-card" data-aos="fade-up" data-aos-delay="100">
                            <Grid item xs={12} sm={12} mt={2}>
                                <h2>{t("scramble")}</h2>
                                {questions.length > 0 ? questions.map((q, idx) => (
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
                                                    "& fieldset": { borderColor: correctAnswers[idx] ? "green" : "rgba(0,0,0,0.23)" },
                                                    "&:hover fieldset": { borderColor: correctAnswers[idx] ? "green" : "#000" },
                                                    "&.Mui-focused fieldset": { borderColor: correctAnswers[idx] ? "green" : "#1976d2" }
                                                }
                                            }}
                                        />
                                        <Box sx={{ mt: 1 }}>
                                            <Button variant="outlined" onClick={() => handleCheckAnswer(idx)}>Check</Button>
                                        </Box>
                                        {correctAnswers[idx] && <Typography sx={{ mt: 1, color: "green" }}>✅ Correct!</Typography>}
                                        {!correctAnswers[idx] && userAnswers[idx] && <Typography sx={{ mt: 1, color: "red" }}>❌ Incorrect.</Typography>}
                                        <Divider sx={{ mt: 2 }} />
                                    </Box>
                                )) : <>No questions found</>}
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
