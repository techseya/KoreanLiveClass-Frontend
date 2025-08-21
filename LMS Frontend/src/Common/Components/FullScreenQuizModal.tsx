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
  SwipeableDrawer,
  Menu,
  Icon
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { getQuestionsForUser, submitQuiz, updateAttempt } from "src/Services/quiz_api";
import "../styles/quiz.css"; // Adjust path if needed
import "../styles/main.css"
import { useTranslation } from "react-i18next";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { ArrowForwardIos, ArrowForwardIosOutlined, MenuBookOutlined } from "@mui/icons-material";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const [warningVisible, setWarningVisible] = useState(true);

  const isSmall = useMediaQuery("(max-width:768px)");

  useEffect(() => {
    if (open && userId && quizId) {
      fetchQuestions();
      // if (questions.length === 0 && open) {
      //   const dummy = Array.from({ length: 50 }, (_, i) => ({
      //     id: i + 1,
      //     questionText: {
      //       field01: `Sample Question ${i + 1}`,
      //       field02: `Extra info for Question ${i + 1}`,
      //     },
      //     answer: {
      //       answer1: "Option A",
      //       answer2: "Option B",
      //       answer3: "Option C",
      //       answer4: "Option D",
      //       answerType: 0, // 0 = text, 1 = image
      //     },
      //     imageUrl: null,
      //     audioUrl: null,
      //     courseId: 1,
      //   }));

      //   setQuestions(dummy);
      // }
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
      <DialogTitle className="" sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgb(23, 143, 199)", color: "white", padding: "16px 24px", flexWrap: "wrap" }}>
        <div className="submit-btn-q1">
          <Box className="quiz-timer-box" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h5" className="quiz-title">
              {(name && name.length > 15) ? name.slice(0, 15) + "..." : (name || "")}
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
            </div>
            {/* {warningVisible && (
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
            )} */}
            {/* <div className="summary-outer">
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
            </div> */}
            {/* Main Quiz Area */}

            {/* PC VIEW */}
            <div className="do-quiz-outer pc-view">
              <div className="do-quiz-inner">
                <Box>
                  <Typography variant="h6" mt={2}>
                    {currentIndex + 1}.{" "}
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
                      style={{ maxWidth: "40%", minWidth: "280px", borderRadius: 8, marginTop: 10 }}
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
                  <Box mt={3} mb={20} display="flex" justifyContent="center" gap={2} flexWrap="wrap">
                    <Button
                      style={{ minWidth: "20px", fontSize: "10px" }}
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
                    >Back
                    </Button>
                    <Button
                      style={{ minWidth: "20px", fontSize: "10px" }}
                      variant="contained"
                      onClick={() =>
                        setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))
                      }
                      disabled={currentIndex === questions.length - 1}
                    >Next
                    </Button>
                    <Button
                      style={{ minWidth: "20px", fontSize: "10px" }}
                      variant="contained"
                      onClick={() => setCurrentIndex(questions.length - 1)}
                      disabled={currentIndex === questions.length - 1}
                    >
                      Last
                    </Button>
                  </Box>
                </Box>
              </div>
              <div className="do-quiz-inner1">
                <Typography variant="h6">Quiz Instructions</Typography>
                <Typography variant="body2" style={{ textAlign: "center" }}>
                  Please read each question carefully and select the best answer.
                </Typography>
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
                <Box display="flex" flexWrap="wrap" gap={1} sx={{ overflowY: "auto", marginTop: "20px" }}>
                  {questions.map((q, idx) => {
                    const answered = answers[q.id] !== undefined;
                    return (
                      <Button
                        key={q.id}
                        size="small"
                        className="q-button"
                        style={{
                          minWidth: "40px",
                          padding: "6px 12px",
                          color: "white",
                          backgroundColor:
                            idx === currentIndex
                              ? "#ffa33bff" // 🔶 yellow
                              : answered
                                ? "#4caf50" // ✅ green if answered
                                : "#2298ce70", // 🔹 blue for default
                        }}
                        variant="contained"
                        onClick={() => setCurrentIndex(idx)}
                      >
                        {idx + 1}
                      </Button>

                    );
                  })}
                </Box>
              </div>
            </div>

            {/* MOBILE VIEW */}
            <div className="do-quiz-outer mobile-view">
              <div className="do-quiz-inner mobile">

                <IconButton className="mobile-menu-button" style={{ display: "flex", gap: "10px", position: "absolute", top: 10, right: 10, zIndex: 1000 }} onClick={() => setMobileMenuOpen(true)}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#000000ff",
                      fontFamily: "monospace",
                      letterSpacing: "1px",
                      textAlign: "center",
                    }}
                  >
                    {formatTime(timeLeft)}
                  </Typography>

                  <MenuBookOutlined />
                </IconButton>

                <Box sx={{ mt: 4, mb: 2 }}>
                  <Typography variant="h6" mt={2}>
                    {currentIndex + 1}.{" "}
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
                      style={{ maxWidth: "40%", minWidth: "280px", borderRadius: 8, marginTop: 10 }}
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
                  <Box mt={3} mb={20} display="flex" justifyContent="center" gap={2} flexWrap="wrap">
                    <Button
                      style={{ minWidth: "20px", fontSize: "10px" }}
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
                    >Back
                    </Button>
                    <Button
                      style={{ minWidth: "20px", fontSize: "10px" }}
                      variant="contained"
                      onClick={() =>
                        setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))
                      }
                      disabled={currentIndex === questions.length - 1}
                    >Next
                    </Button>
                    <Button
                      style={{ minWidth: "20px", fontSize: "10px" }}
                      variant="contained"
                      onClick={() => setCurrentIndex(questions.length - 1)}
                      disabled={currentIndex === questions.length - 1}
                    >
                      Last
                    </Button>
                  </Box>
                </Box>
              </div>
            </div>

            <Dialog
              open={mobileMenuOpen}
              onClose={() => setMobileMenuOpen(false)}
              fullScreen
              PaperProps={{
                sx: {
                  backgroundColor: "rgba(0, 0, 0, 0.32)", // dark overlay
                  backdropFilter: "blur(6px)", // blur effect behind modal
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                },
              }}
            >
              <Box
                className="modal-back"
                sx={{
                  width: "90%",
                  maxWidth: "400px",
                  borderRadius: 2,
                  p: 3,
                  position: "relative",
                }}
              >
                {/* Close Button */}
                <IconButton
                  onClick={() => setMobileMenuOpen(false)}
                  sx={{ position: "absolute", top: 8, right: 8, color: "white" }}
                >
                  <CloseIcon />
                </IconButton>

                {/* Title */}
                <Typography variant="h6" gutterBottom>
                  Quiz Instructions
                </Typography>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  Please read each question carefully and select the best answer.
                </Typography>

                {/* Timer */}
                <Typography
                  variant="h4"
                  sx={{
                    color: "#ffffffff",
                    fontWeight: "bold",
                    fontFamily: "monospace",
                    letterSpacing: "1px",
                    textAlign: "center",
                    mb: 2,
                  }}
                >
                  {formatTime(timeLeft)}
                </Typography>

                {/* Question Summary Buttons */}
                <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center">
                  {questions.map((q, idx) => {
                    const answered = answers[q.id] !== undefined;
                    return (
                      <Button
                        key={q.id}
                        size="small"
                        style={{
                          minWidth: "40px",
                          padding: "6px 12px",
                          color: "white",
                          backgroundColor:
                            idx === currentIndex
                              ? "#ffa33bff" // yellow
                              : answered
                                ? "#4caf50" // green
                                : "#2298ce70", // blue
                        }}
                        variant="contained"
                        onClick={() => {
                          setCurrentIndex(idx);
                          setMobileMenuOpen(false);
                        }}
                      >
                        {idx + 1}
                      </Button>
                    );
                  })}
                </Box>
              </Box>
            </Dialog>

          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenQuizModal;
