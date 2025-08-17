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
import { getQuestionsForUser, submitQuiz, updateAttempt } from "src/Services/quiz_api";
import "../styles/quiz.css"; // Adjust path if needed
import { useTranslation } from "react-i18next";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { ArrowForwardIos, ArrowForwardIosOutlined } from "@mui/icons-material";

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
  const { t } = useTranslation();
  const [warningVisible, setWarningVisible] = useState(true);

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
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const pad = (n: number) => (n < 10 ? "0" + n : n);

    return `${pad(h)}:${pad(m)}:${pad(s)}`;
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

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ""; // triggers browser warning
    };

    if (open) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const blockBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    blockBack(); // push initial
    window.addEventListener("popstate", blockBack);

    return () => {
      window.removeEventListener("popstate", blockBack);
    };
  }, [open]);


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
      <DialogTitle className="" sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "black", color: "white", padding: "16px 24px", flexWrap: "wrap" }}>
        <div className="submit-btn-q1">
          <Box className="quiz-timer-box" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <span style={{ fontSize: "20px", color: "#fff" }}>⏳</span>
            <Typography
              variant="h4"
              sx={{
                color: "#fff",
                fontWeight: "bold",
                fontFamily: "monospace",
                letterSpacing: "1px",
              }}
            >
              {formatTime(timeLeft)}
            </Typography>
          </Box>

        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginRight: "5px" }}>

          <Button
            variant="contained"
            color="primary"
            className="submit-btn-q"
            onClick={() => {
              handleSubmit();
              setMobileSummaryOpen(false);
            }}
          >
            Submit Quiz
          </Button>
        </div>
      </DialogTitle>

      <DialogContent sx={{ padding: "24px", overflowY: "hidden" }}>
        {loading ? (
          <Box mt={4} textAlign="center">
            <CircularProgress />
          </Box>
        ) : questions.length === 0 ? (
          <Typography>No questions available.</Typography>
        ) : (
          <Grid container spacing={1}>
            <div style={{ textAlign: "left", width: "100%", marginTop: "20px" }} className="quiz-title-outer">
              <Typography variant="h5" className="quiz-title">
                {name || "Quiz"}
              </Typography>
            </div>
            {warningVisible && (
              <div className="warning-outer">
                <div className="">
                  <p>
                    ⚠️ {t("warning")}
                  </p>
                </div>
                <IconButton
                  aria-label="close"

                  onClick={() => setWarningVisible(false)}
                  sx={{ position: "absolute", right: 0, top: 0, width: "30px", height: "30px", padding: 0 }}
                >
                  <CloseIcon />
                </IconButton>
              </div>
            )}
            <div className="summary-outer">
              <Box display="flex" flexWrap="wrap" gap={1} sx={{ overflow: "hidden" }}>
                {questions.map((q, idx) => {
                  const answered = answers[q.id] !== undefined;
                  return (
                    <Button
                      key={q.id}
                      size="small"
                      style={{ minWidth: "30px", padding: "6px 12px" }}
                      variant={idx === currentIndex ? "contained" : answered ? "contained" : "outlined"}
                      color={answered ? "success" : "primary"}
                      onClick={() => setCurrentIndex(idx)}
                    >
                      {idx + 1}
                    </Button>
                  );
                })}
              </Box>
            </div>
            {/* Main Quiz Area */}
            <Grid item xs={12} md={12} sx={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}>
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

                <Grid container mt={1} mb={1}>
                  {currentQuestion.audioUrl && (
                    <audio controls style={{ marginTop: 10 }}>
                      <source
                        src={currentQuestion.audioUrl.replace("dl=0", "raw=1")}
                        type="audio/mpeg"
                      />
                    </audio>
                  )}

                </Grid>


                {currentQuestion.imageUrl && (
                  <img
                    src={currentQuestion.imageUrl.replace("dl=0", "raw=1")}
                    alt="Question"
                    style={{ maxWidth: "70%", minWidth: "280px", borderRadius: 8, marginTop: 10 }}
                  />
                )}

                {/* MCQ Options */}
                {!isFillInTheBlank(currentQuestion) && (
                  <RadioGroup
                    name={`q-${currentQuestion.id}`}
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                    sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}
                  >
                    {[1, 2, 3, 4].map((num) => {
                      const opt = currentQuestion.answer[`answer${num}`];
                      if (!opt) return null;

                      // If answerType == 1, opt is an image URL
                      if (currentQuestion.answer.answerType === 1) {
                        return (
                          <FormControlLabel
                            key={num}
                            value={opt}
                            control={<Radio />}
                            label={
                              <img
                                src={opt.replace("dl=0", "raw=1")}
                                alt={`Option ${num}`}
                                style={{ maxWidth: 320, borderRadius: 8 }}
                              />
                            }
                            sx={{ flexDirection: "column" }}
                          />
                        );
                      }

                      // Default text option
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
                <Box mt={3} mb={50} display="flex" justifyContent="center" gap={2} flexWrap="wrap">
                  <Button
                    style={{ minWidth: "30px", fontSize: "10px" }}
                    variant="contained"
                    onClick={() => setCurrentIndex(0)}
                    disabled={currentIndex === 0}
                  >
                    First
                  </Button>
                  <Button
                    style={{ minWidth: "20px", fontSize: "10px" }}
                    variant="contained"
                    onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                    disabled={currentIndex === 0}
                  >
                    <ArrowBackIosNewIcon style={{ fontSize: "12px" }} />
                  </Button>
                  <Button
                    style={{ minWidth: "20px", fontSize: "10px" }}
                    variant="contained"
                    onClick={() =>
                      setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))
                    }
                    disabled={currentIndex === questions.length - 1}
                  >
                    <ArrowForwardIos style={{ fontSize: "12px" }} />
                  </Button>
                  <Button
                    style={{ minWidth: "30px", fontSize: "10px" }}
                    variant="contained"
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
