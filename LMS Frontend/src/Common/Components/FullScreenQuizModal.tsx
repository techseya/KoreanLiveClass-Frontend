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
import { getQuestionsForUser } from "src/Services/quiz_api";

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
  const [timeLeft, setTimeLeft] = useState(duration*60*3600);
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

  const handleSubmit = () => {
    console.log("Submitted Answers:", answers);
    alert("Quiz Submitted!");
    onClose();
  };

  const currentQuestion = questions[currentIndex];

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <DialogTitle sx={{ position: "relative" }}>
        {name || "Quiz"}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 16, top: 16 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box mt={4} textAlign="center">
            <CircularProgress />
          </Box>
        ) : questions.length === 0 ? (
          <Typography>No questions available.</Typography>
        ) : (
          <Grid container spacing={2}>
            {/* Main Quiz Area */}
            <Grid item xs={12} md={9}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  ⏳ Time Left: {formatTime(timeLeft)}
                </Typography>

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
            {!isSmall && (
              <Grid item xs={12} md={3}>
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
            )}
          </Grid>
        )}
      </DialogContent>

      {/* Floating Summary Button (Mobile Only) */}
      {isSmall && (
        <Box
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 1300
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<MenuIcon />}
            onClick={() => setMobileSummaryOpen(true)}
          >
            Summary
          </Button>
        </Box>
      )}

      {/* Swipeable Drawer for Summary (Mobile Only) */}
      <SwipeableDrawer
        anchor="bottom"
        open={mobileSummaryOpen}
        onClose={() => setMobileSummaryOpen(false)}
        onOpen={() => {}}
      >
        <Box p={2}>
          <Typography variant="h6" mb={2}>Summary</Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {questions.map((q, idx) => {
              const answered = answers[q.id] !== undefined;
              return (
                <Button
                  key={q.id}
                  size="small"
                  variant={idx === currentIndex ? "contained" : "outlined"}
                  color={answered ? "success" : "error"}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setMobileSummaryOpen(false);
                  }}
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
            onClick={() => {
              handleSubmit();
              setMobileSummaryOpen(false);
            }}
          >
            Submit Quiz
          </Button>
        </Box>
      </SwipeableDrawer>
    </Dialog>
  );
};

export default FullScreenQuizModal;
