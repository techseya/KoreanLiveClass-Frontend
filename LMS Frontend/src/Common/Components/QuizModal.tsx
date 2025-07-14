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
import { AccessAlarm } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import "../styles/quiz.css"

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

const QuizModal: React.FC<QuizModalProps> = ({ open, onClose, quiz, buy, usedAttempts, marks,userId,quizId }) => {
    const { t } = useTranslation();
    if (!quiz) return null;

    return (
        <Dialog sx={{ maxHeight: "95vh", overflowY: "auto" }} open={open} onClose={onClose} maxWidth="sm" fullWidth>
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

            <DialogContent sx={{ position: 'relative' }} dividers>
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

                <Typography variant="subtitle2" style={{ position: 'absolute', top: 20, right: 25, backgroundColor: '#E0F3F9', padding: '5px 10px', borderRadius: '5px', border: '1px solid #ccc', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <AccessAlarm /> Duration: {quiz.quizDuration} hour(s)
                </Typography>

                <div className="quiz-info-outer" style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between", margin: '1rem 0', flex: "wrap" }}>
                    {usedAttempts === undefined && (
                        <Typography className="q-info" variant="subtitle2">
                            🎯 Attempt Limit: {quiz.attemptLimit}
                        </Typography>
                    )}
                    {usedAttempts !== undefined && (
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
                                alert(userId && quizId ? `Starting quiz for User ID: ${userId} and Quiz ID: ${quizId}` : "Starting quiz");
                            }}
                        >
                            {t("start")}
                        </Button>
                    )}
                </div>

            </DialogContent>
        </Dialog>
    );
};

export default QuizModal;
