import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    CircularProgress,
    Box,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    Button,
    Divider,
    Grid,
    useMediaQuery,
    SwipeableDrawer
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { getQuestionsForUser, submitQuiz } from "src/Services/quiz_api";
import "../styles/quiz.css"; // Adjust path if needed

interface FullScreenQuizModalProps {
    open: boolean;
    onClose: () => void;
    userId: any;
    name?: string;
    quizId: any;
    duration?: any; // hours
}

const FullScreenQuizModal: React.FC<FullScreenQuizModalProps> = ({
    open,
    onClose,
    userId,
    name,
    quizId,
    duration
}) => {
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, any>>({});
    const [timeLeft, setTimeLeft] = useState(duration * 60 * 3600);
    const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

    const isSmall = useMediaQuery("(max-width:768px)");

    useEffect(() => {
        if (open && userId && quizId) {
            fetchQuestions();
        }
    }, [open, userId, quizId]);

    useEffect(() => {
        if (!open) return;
        const timer = setInterval(() => {
            setTimeLeft((prev: any) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [open]);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const response = await getQuestionsForUser(quizId, userId);
            setQuestions(response.data || []);
            setCurrentIndex(0);
            setAnswers({});
            setTimeLeft(duration * 60 * 60);
        } catch (error) {
            console.error("Error fetching questions for user:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    const isFillInTheBlank = (q: any) => {
        const { answer1, answer2, answer3, answer4 } = q.answer;
        return !answer1 && !answer2 && !answer3 && !answer4;
    };

    const handleAnswer = (questionId: number, value: any) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const renderFIB = (field01: string, qid: number) => {
        const blanks = field01.match(/\[\[\d+\]\]/g) || [];
        const parts = field01.split(/\[\[\d+\]\]/);
        return parts.map((part, idx) => (
            <React.Fragment key={idx}>
                {part}
                {idx < blanks.length && (
                    <TextField
                        size="small"
                        sx={{ width: "150px", mx: 1 }}
                        onChange={(e) => {
                            const prev = answers[qid] || [];
                            const newAns = [...prev];
                            newAns[idx] = e.target.value;
                            handleAnswer(qid, newAns);
                        }}
                        value={(answers[qid]?.[idx] || "")}
                        placeholder={`Blank ${idx + 1}`}
                    />
                )}
            </React.Fragment>
        ));
    };

    const currentQuestion = questions[currentIndex];

    const getSelectedIndex = (q: any, selected: string) => {
        const options = [
            q.answer.answer1,
            q.answer.answer2,
            q.answer.answer3,
            q.answer.answer4
        ];
        const index = options.findIndex((opt) => opt === selected);
        return index >= 0 ? index + 1 : 0; // convert to 1-based index, or return 0 if not found
    };


    const handleSubmit = async () => {
        const formattedAnswers = questions.map((q) => {
            const isFIB = isFillInTheBlank(q);
            const selectedAnswer = answers[q.id];

            return {
                questionId: q.id,
                selectedAnswerMcq: isFIB ? 0 : getSelectedIndex(q, selectedAnswer), // for MCQ
                selectedAnswerFillInTheBlanks: isFIB ? selectedAnswer || [] : []     // for FIB
            };
        });

        const payload = {
            quizId,
            userId,
            courseId: currentQuestion.courseId || 0, // adjust if courseId is passed differently
            questions: formattedAnswers
        };

        try {
            console.log("Submitting payload:", payload); // optional debug
            await submitQuiz(payload);
            alert("Quiz submitted successfully!");
            window.location.reload(); // reload to refresh quiz state
        } catch (error) {
            console.error("Submission error:", error);
            alert("Error submitting quiz. Please try again.");
        }
    };


    return (
        <Dialog fullScreen open={open} onClose={onClose}>
            <DialogTitle sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "black", color: "white", padding: "16px 24px" }}>
                {name || "Quiz"}
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginRight: "35px" }}>
                    <Typography style={{color: "white", fontSize: "15px"}} variant="subtitle2" color="text.secondary">
                    ⏳ Time Left: {formatTime(timeLeft)}
                </Typography>
                <Button
                        variant="contained"
                        color="primary"
                        
                        onClick={() => {
                            handleSubmit();
                            setMobileSummaryOpen(false);
                        }}
                    >
                        Submit Quiz
                    </Button>
                </div>
                
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: "absolute", right: 16, top: 10 }}
                >
                    <CloseIcon sx={{ color: "white" }} />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ padding: "24px", overflowY: "hidden" }}>
                {loading ? (
                    <Box mt={4} textAlign="center">
                        <CircularProgress />
                    </Box>
                ) : questions.length === 0 ? (
                    <Typography>No questions available.</Typography>
                ) : (
                    <Grid container spacing={2}>
                        {/* Main Quiz Area */}
                        <Grid item xs={12} md={12} sx={{ overflowY: "auto", maxHeight: "calc(100vh - 100px)" }}>
                            <Box>
                                <Typography variant="h6" mt={2}>
                                    Q{currentIndex + 1}.{" "}
                                    {isFillInTheBlank(currentQuestion)
                                        ? renderFIB(currentQuestion.questionText.field01, currentQuestion.id)
                                        : currentQuestion.questionText.field01}
                                </Typography>

                                {currentQuestion.questionText?.field02 && !isFillInTheBlank(currentQuestion) && (
                                    <Typography variant="subtitle1">
                                        {currentQuestion.questionText.field02}
                                    </Typography>
                                )}

                                {currentQuestion.imageUrl && (
                                    <img
                                        src={currentQuestion.imageUrl.replace("dl=0", "raw=1")}
                                        alt="Question"
                                        style={{ maxWidth: "100%", borderRadius: 8, marginTop: 10 }}
                                    />
                                )}

                                {currentQuestion.audioUrl && (
                                    <audio controls style={{ marginTop: 10 }}>
                                        <source
                                            src={currentQuestion.audioUrl.replace("dl=0", "raw=1")}
                                            type="audio/mpeg"
                                        />
                                    </audio>
                                )}

                                {/* MCQ Options */}
                                {!isFillInTheBlank(currentQuestion) && (
                                    <RadioGroup
                                        name={`q-${currentQuestion.id}`}
                                        value={answers[currentQuestion.id] || ""}
                                        onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                                        sx={{ mt: 2 }}
                                    >
                                        {[1, 2, 3, 4].map((num) => {
                                            const opt = currentQuestion.answer[`answer${num}`];
                                            return (
                                                <FormControlLabel
                                                    key={num}
                                                    value={opt}
                                                    control={<Radio />}
                                                    label={opt}
                                                />
                                            );
                                        })}
                                    </RadioGroup>
                                )}

                                {/* Pagination Controls */}
                                <Box mt={3} display="flex" justifyContent="space-between" gap={2} flexWrap="wrap">
                                    <Button
                                        variant="outlined"
                                        onClick={() => setCurrentIndex(0)}
                                        disabled={currentIndex === 0}
                                    >
                                        First
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                                        disabled={currentIndex === 0}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() =>
                                            setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))
                                        }
                                        disabled={currentIndex === questions.length - 1}
                                    >
                                        Next
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setCurrentIndex(questions.length - 1)}
                                        disabled={currentIndex === questions.length - 1}
                                    >
                                        Last
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Right Sidebar (Desktop Only) */}
                        {/* {!isSmall && (
                            <Grid item xs={12} md={3} sx={{ backgroundColor: "#f5f5f5", padding: 2, height: "100vh", overflowY: "auto", marginTop: "16px", borderLeft: "2px solid #ddd" }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Summary
                                </Typography>
                                <Box display="flex" flexWrap="wrap" gap={1} sx={{ overflow: "hidden" }}>
                                    {questions.map((q, idx) => {
                                        const answered = answers[q.id] !== undefined;
                                        return (
                                            <Button
                                                key={q.id}
                                                size="small"
                                                variant={idx === currentIndex ? "contained" : "outlined"}
                                                color={answered ? "success" : "error"}
                                                onClick={() => setCurrentIndex(idx)}
                                            >
                                                {idx + 1}
                                            </Button>
                                        );
                                    })}
                                </Box>
                                <Divider sx={{ my: 2 }} />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleSubmit}
                                >
                                    Submit Quiz
                                </Button>
                            </Grid>
                        )} */}
                    </Grid>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default FullScreenQuizModal;
