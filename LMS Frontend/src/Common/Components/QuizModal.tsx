import React from "react";
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

interface QuizModalProps {
  open: boolean;
  onClose: () => void;
  quiz: any;
  buy: boolean;
}

const QuizModal: React.FC<QuizModalProps> = ({ open, onClose, quiz, buy }) => {
  if (!quiz) return null;

  return (
    <Dialog sx={{maxHeight: "95vh", overflowY: "auto"}} open={open} onClose={onClose} maxWidth="sm" fullWidth>
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

      <DialogContent dividers>
        <Box mb={2}>
          <img
            src={quiz.imageUrl.replace("dl=0", "raw=1")}
            alt="Quiz Thumbnail"
            style={{ width: "100%", borderRadius: "10px" }}
          />
        </Box>
        <Typography variant="body1" gutterBottom>
          {quiz.description}
        </Typography>

        <Typography variant="subtitle2">
          🎯 Attempt Limit: {quiz.attemptLimit}
        </Typography>
        <Typography variant="subtitle2">
          🕒 Duration: {quiz.quizDuration} hour(s)
        </Typography>
        {!buy ? (
            <Typography variant="subtitle2">
          💰 Price: Rs. {quiz.prize.toFixed(2)}
        </Typography>
        ) : (
            <Button
              variant="contained"
              color="primary"
            //   onClick={() => window.open(quiz.quizUrl, "_blank")}
              style={{ marginTop: "1rem" }}
            >
              Start Quiz
            </Button>
        )}
        
      </DialogContent>
    </Dialog>
  );
};

export default QuizModal;
