import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AccessAlarm } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import FullScreenQuizModal from "./FullScreenQuizModal"; // Adjust path if needed
import "../styles/quiz.css";
import { updateAttempt } from "src/Services/quiz_api";

interface QuizModalProps {
  open: boolean;
  onClose: () => void;
  quiz: any;
  buy: boolean;
  usedAttempts?: number;
  marks?: number;
  userId?: any;
  quizId?: any;
}

const QuizModal: React.FC<QuizModalProps> = ({
  open,
  onClose,
  quiz,
  buy,
  usedAttempts,
  marks,
  userId,
  quizId
}) => {
  const { t } = useTranslation();
  const [startModalOpen, setStartModalOpen] = useState(false);

  const handleUpdateAttempt = async () => {
    const payload = {
      quizId,
      userId,
    }

    try {
      const res = await updateAttempt(payload);
    } catch (error) {
      console.error("Error updating attempt:", error);
      alert("Error updating attempt. Please try again.");

    }
  }

  if (!quiz) return null;

  return (
    <>
      <Dialog
        sx={{ maxHeight: "95vh", overflowY: "auto" }}
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {quiz.name}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ position: "relative" }} dividers>
          <Box mb={2}>
            <img
              src={quiz.imageUrl?.replace("dl=0", "raw=1")}
              alt="Quiz Thumbnail"
              style={{ width: "100%", borderRadius: "10px" }}
            />
          </Box>

          <Typography variant="body1" gutterBottom>
            {quiz.description}
          </Typography>

          <Typography
            variant="subtitle2"
            style={{
              position: "absolute",
              top: 20,
              right: 25,
              backgroundColor: "#E0F3F9",
              padding: "5px 10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              display: "flex",
              alignItems: "center",
              gap: "5px"
            }}
          >
            <AccessAlarm /> Duration: {quiz.quizDuration} hour(s)
          </Typography>

          <div
            className="quiz-info-outer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "1rem 0",
              flexWrap: "wrap",
              gap: "1rem"
            }}
          >
            {usedAttempts === undefined ? (
              <Typography className="q-info" variant="subtitle2">
                🎯 Attempt Limit: {quiz.attemptLimit}
              </Typography>
            ) : (
              <Typography className="q-info" variant="subtitle2">
                📊 Used Attempts: {usedAttempts} / {quiz.attemptLimit}
              </Typography>
            )}

            {marks !== undefined && (
              <Typography className="q-info" variant="subtitle2">
                🏆 Marks: {marks}%
              </Typography>
            )}

            {!buy ? (
              <Typography className="q-info" variant="subtitle2">
                💰 Price: Rs. {quiz.prize.toFixed(2)}
              </Typography>
            ) : (
              <Button
                variant="contained"
                className="q-info"
                color="primary"
                disabled={(usedAttempts ?? 0) >= quiz.attemptLimit}
                onClick={() => {
                  setStartModalOpen(true);
                  handleUpdateAttempt();
                }}
              >
                {t("start")}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Fullscreen Quiz Modal */}
      <FullScreenQuizModal
        open={startModalOpen}
        onClose={() => setStartModalOpen(false)}
        userId={userId}
        name={quiz.name}
        quizId={quizId}
        duration={quiz.quizDuration}
      />
    </>
  );
};

export default QuizModal;
