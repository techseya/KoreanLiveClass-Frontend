import {
    Paper, IconButton, Box, Typography, TextField,
    Grid, FormControl, InputLabel, Select, MenuItem, Button,
    Backdrop,
    CircularProgress
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useRef, useState } from "react";
import { getAllCourses } from "src/Services/course_api";
import { createQuestion, deleteQuestion, deleteQuiz, getQuestions, getQuiz, updateQuestion, updateQuiz } from "src/Services/quiz_api";
import { AddCircle, Delete } from "@mui/icons-material";
import Dialogbox from "src/Common/Components/DialogBox";
import {
    Dialog,
    AppBar,
    Toolbar,
    Slide,
    DialogContent
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";
import "../../../Common/styles/quiz.css"
import { RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { AudioRecorder } from "src/Common/Components/AudioRecorder";

function CustomNoRowsOverlay() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: 2 }}>
            <Typography variant="h6" color="text.secondary">No Quizes Found</Typography>
        </Box>
    );
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function QuizMaintenance() {
    const [visible, setVisible] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<any | null>(null);
    const [courseId, setCourseId] = useState(1);
    const [courses, setCourses] = useState<any[]>([]);
    const [rows, setRows] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [quizId, setQuizId] = useState("")
    const [quizName, setQuizName] = useState("");
    const [thumb, setThumb] = useState<File | any>(null);
    const [openFullScreenModal, setOpenFullScreenModal] = useState(false);

    const [qType, setQType] = useState(1);
    const [qTextFields, setQTextFields] = useState([{ key: "field01", value: "" }]);
    const [qTextFieldsB, setQTextFieldsB] = useState([{ key: "field01", value: "" }]);
    const [questionImage, setQuestionImage] = useState<File | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [answers, setAnswers] = useState(["", "", "", ""]);
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0); // default Answer 1 selected
    const [loading, setLoading] = useState(false);
    const [fillBlankAnswers, setFillBlankAnswers] = useState<string[]>([]);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [audioUrl, setAudioUrl] = useState("")
    const [imageUrl, setImageUrl] = useState("");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setQuestionImage(e.target.files[0]);
        }
    };

    const handleAnswerChange = (index: number, value: string) => {
        const updated = [...answers];
        updated[index] = value;
        setAnswers(updated);
    };

    const handleQTextChange = (index: number, field: string, value: string) => {
        const updatedFields = [...qTextFields];
        updatedFields[index] = { ...updatedFields[index], [field]: value };
        setQTextFields(updatedFields);
    };

    const handleAddQTextField = () => {
        const nextFieldNumber = qTextFields.length + 1;
        setQTextFields([...qTextFields, { key: `field${nextFieldNumber.toString().padStart(2, '0')}`, value: "" }]);
    };

    const handleRemoveQTextField = (index: number) => {
        const updatedFields = [...qTextFields];
        updatedFields.splice(index, 1);
        setQTextFields(updatedFields);
    };


    const handleQTextChangeB = (index: number, field: string, value: string) => {
        const updatedFields = [...qTextFieldsB];
        updatedFields[index] = { ...updatedFields[index], [field]: value };
        setQTextFieldsB(updatedFields);
    };

    const handleAddQTextFieldB = () => {
        const nextFieldNumber = qTextFieldsB.length + 1;
        setQTextFieldsB([...qTextFieldsB, { key: `field${nextFieldNumber.toString().padStart(2, '0')}`, value: "" }]);
    };

    const handleRemoveQTextFieldB = (index: number) => {
        const updatedFields = [...qTextFieldsB];
        updatedFields.splice(index, 1);
        setQTextFieldsB(updatedFields);
    };

    const handleOpenFullScreenModal = (row: any) => {
        setOpenFullScreenModal(true)
        setQuizId(row.id);
        setQuizName(row.name)
        handleGetQuestions(row.id)
    }

    useEffect(() => {
        handleGetCourses();
        handleGetQuizes(courseId);
    }, []);

    useEffect(() => {
        // Combine all question text
        const combinedText = qTextFieldsB.map(f => f.value).join(" ");
        const regex = /\[\[(\d+)\]\]/g;
        const matches: RegExpExecArray[] = [];
        let match;
        while ((match = regex.exec(combinedText)) !== null) {
            matches.push(match);
        }

        // Extract unique indexes
        const uniqueIndexes = Array.from(new Set(matches.map(m => parseInt(m[1])))).sort((a, b) => a - b);

        // Create/update answers array
        const updatedAnswers = uniqueIndexes.map((idx) => fillBlankAnswers[idx] || "");
        setFillBlankAnswers(updatedAnswers);
    }, [qTextFieldsB]);

    const handleFillBlankAnswerChange = (index: number, value: string) => {
        const updated = [...fillBlankAnswers];
        updated[index] = value;
        setFillBlankAnswers(updated);
    };

    const handleGetQuestions = async (id: any) => {
        try {
            const res = await getQuestions(id);
            setQuestions(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleGetCourses = async () => {
        try {
            const res = await getAllCourses();
            const activeCourses = res.data.filter((course: any) => course.activeStatus === 1);
            setCourses(activeCourses);
        } catch (error) {
            console.error(error);
        }
    };

    const handleGetQuizes = async (id: any) => {
        try {
            const res = await getQuiz(id);
            setRows(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditClick = (q: any) => {
        const correctAnswerIndex = Array.isArray(q.isCorrectAnswers)
            ? q.isCorrectAnswers.findIndex((val: boolean) => val === true)
            : 0;

        setEditingQuestion({
            ...q,
            correctAnswer: correctAnswerIndex >= 0 ? correctAnswerIndex : 0
        });

        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
        setEditingQuestion(null);
    };

    const handleFormChange = (field: string, value: any) => {
        setEditingQuestion((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleUpdate = async () => {
        const formData = new FormData();
        formData.append("id", editingQuestion.id);
        formData.append("courseId", editingQuestion.courseId);
        formData.append("name", editingQuestion.name);
        formData.append("prize", editingQuestion.prize);
        formData.append("attemptLimit", editingQuestion.attemptLimit);
        formData.append("description", editingQuestion.description);
        formData.append("quizDuration", editingQuestion.quizDuration);
        formData.append("image", editingQuestion.imageUrl);
        formData.append("activeStatus", editingQuestion.activeStatus);

        console.log(formData);

        try {
            const res = await updateQuiz(formData);
            alert(res.data.message);
        } catch (error: any) {
            alert(error.response?.data?.message || "An error occurred while updating the quiz.");
        }
        window.location.reload()
    };

    const handleDeleteClick = (c: any) => {
        setQuizId(c.id)
        setIsOpen(true)
    };

    const handleDelete = async () => {
        try {
            const response = await deleteQuiz(quizId)
            alert(response.data.message)
        } catch (error: any) {
            alert(error.response.message)
        }

        handleClose()
        window.location.reload()
    }

    const handleClose = () => setIsOpen(false);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', flex: 1, minWidth: 130 },
        { field: 'attemptLimit', headerName: 'Attempts for student', flex: 1, minWidth: 130 },
        { field: 'prize', headerName: 'Price', flex: 1, minWidth: 130 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton sx={{ color: 'black' }} aria-label="edit" onClick={() => handleEditClick(params.row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton sx={{ color: 'red' }} aria-label="edit" onClick={() => handleDeleteClick(params.row)}>
                        <Delete />
                    </IconButton>
                    <IconButton sx={{ color: '#1d6add' }} aria-label="edit" onClick={() => handleOpenFullScreenModal(params.row)}>
                        <AddCircle />
                    </IconButton>
                </Box>

            ),
        },
    ];

    const qTextJson = JSON.stringify(
        qTextFields.reduce((acc, curr) => {
            if (curr.key.trim()) {
                acc[curr.key] = curr.value;
            }
            return acc;
        }, {} as Record<string, string>)
    );



    const qTextJsonB = JSON.stringify(
        qTextFieldsB.reduce((acc, curr) => {
            if (curr.key.trim()) {
                acc[curr.key] = curr.value;
            }
            return acc;
        }, {} as Record<string, string>)
    );

    const handleSaveAnswers = async () => {
        setLoading(true)
        // console.log(quizId);
        // console.log(qType);
        // console.log(qTextJson);
        // console.log(questionImage);
        // console.log(audioBlob);
        // console.log(answers);
        // console.log(correctAnswerIndex + 1);
        console.log(qTextJsonB);
        console.log(JSON.stringify(fillBlankAnswers));


        const formData = new FormData();
        formData.append("quizId", quizId);
        formData.append("questionType", qType.toString());
        formData.append("questionText", qType === 1 ? `"${qTextJson}"` : `"${qTextJsonB}"`);
        formData.append("image", questionImage ? questionImage : "");
        formData.append("audio", audioBlob ? audioBlob : "");
        formData.append("answer1", qType === 1 ? answers[0] : "");
        formData.append("answer2", qType === 1 ? answers[1] : "");
        formData.append("answer3", qType === 1 ? answers[2] : "");
        formData.append("answer4", qType === 1 ? answers[3] : "");
        formData.append("correctAnswerMcq", qType === 1 ? (correctAnswerIndex + 1).toString() : "");
        formData.append("correctAnswerFillInBlanks", qType === 2 ? JSON.stringify(fillBlankAnswers) : "");

        try {
            const res = await createQuestion(formData)
            setLoading(false)
            alert(res.data.message);
            handleClearFields();
        } catch (error: any) {
            setLoading(false)
            alert(error.response.data.message)
        }
    }

    const handleClearFields = () => {
        setQTextFields([{ key: "field01", value: "" }])
        setQTextFieldsB([{ key: "field01", value: "" }])
        setQuestionImage(null)
        setAudioBlob(null)
        setAnswers(["", "", "", ""])
        setCorrectAnswerIndex(0);
        setFillBlankAnswers([]);

        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    }

    const handleInsertBlank = (index: number) => {
        const updatedFields = [...qTextFieldsB];
        const field = updatedFields[index];

        // Find max existing [[x]] index
        const existingMatches = field.value.match(/\[\[(\d+)\]\]/g);
        const nextIndex = existingMatches
            ? Math.max(...existingMatches.map(m => parseInt(m.replace(/\D/g, '')))) + 1
            : 0;

        const newText = field.value + ` [[${nextIndex}]]`;
        updatedFields[index].value = newText;
        setQTextFieldsB(updatedFields);
    };

    const handleQuestion = (question: any) => {
        console.log(question);

        const newTextFields = Object.entries(question.questionText).map(([key, value]) => ({
            key,
            value: String(value)
        }));

        setQTextFields(newTextFields);

        setQTextFieldsB(newTextFields)

        setQType(question.questionType);
        setAnswers([question.answer.answer1, question.answer.answer2, question.answer.answer3, question.answer.answer4]);
        setCorrectAnswerIndex(question.answer.correctAnswer - 1); // Adjust for 0-based index
        setAudioUrl(question.audioUrl !== null ? question.audioUrl.replace("dl=0", "raw=1") : "")
        setImageUrl(question.imageUrl !== null ? question.imageUrl.replace("dl=0", "raw=1") : "")

        const raw = question.answer.correctAnswersFillInBlanks?.[0];

        if (raw) {
            const parsedList = JSON.parse(raw); // e.g. ["Piduruthalagala", "longest", "Sri Lanka"]
            console.log(parsedList); // Log full list
            setFillBlankAnswers(parsedList); // ✅ set once
        }

    }

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 10000 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Dialogbox
                open={isOpen}
                title="Delete Confirmation"
                content="Are you sure you want to delete this question?"
                agreeButtonText="Yes, Delete"
                disagreeButtonText="No"
                onAgree={handleDelete}
                onDisagree={handleClose}
                onClose={handleClose}
            />
            <Dialog
                fullScreen
                open={openFullScreenModal}
                onClose={() => setOpenFullScreenModal(false)}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: "relative" }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setOpenFullScreenModal(false)}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Add Quiz Content
                        </Typography>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <div className="q-outer">
                        <div className="q-inner">
                            <div className="q-content-highlight-outer">
                                {questions.length > 0 ? (
                                    <Grid container spacing={2}>
                                        {questions.map((question, index) => (
                                            <Grid item xs={12} key={index}>
                                                <Paper elevation={2} sx={{ padding: 2 }} onClick={() => handleQuestion(question)}>
                                                    <Typography variant="h6">{`Question ${index + 1}: ${question.questionType === 1 ? 'MCQ' : 'Fill In The Blanks'}`}</Typography>
                                                    <Typography style={{ fontSize: "13px" }} variant="body1">{`Type: ${question.questionText.field01.length > 50 ? `${question.questionText.field01.substring(0, 50)}...` : `${question.questionText.field01}`}`}</Typography>
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : (
                                    <Typography variant="body1">No questions available</Typography>
                                )}
                            </div>
                        </div>
                        <div className="q-inner1">
                            <div className="q-content-outer">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12}>
                                        <FormControl component="fieldset">
                                            <Typography variant="subtitle1" gutterBottom>
                                                Question Type
                                            </Typography>
                                            <RadioGroup
                                                row
                                                value={qType}
                                                onChange={(e) => {
                                                    setQType(Number(e.target.value))
                                                    handleClearFields();
                                                }}
                                            >
                                                <FormControlLabel value={1} control={<Radio />} label="MCQ" />
                                                <FormControlLabel value={2} control={<Radio />} label="Fill In The Blanks" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1">Question Text Fields</Typography>
                                    </Grid>
                                    {qType === 1 && (
                                        <>
                                            {qTextFields.map((field, index) => (
                                                <Grid item xs={12} sm={12} key={index} container spacing={1} alignItems="center">
                                                    <Grid item xs={3}>
                                                        <TextField
                                                            label="Field Name"
                                                            fullWidth
                                                            size="small"
                                                            disabled
                                                            value={field.key}
                                                            onChange={(e) => handleQTextChange(index, "key", e.target.value)}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                        <TextField
                                                            label="Field Value"
                                                            fullWidth
                                                            size="small"
                                                            value={field.value}
                                                            onChange={(e) => handleQTextChange(index, "value", e.target.value)}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={1}>
                                                        <IconButton onClick={() => handleRemoveQTextField(index)}>
                                                            <Delete fontSize="small" />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            ))}

                                            <Grid item xs={12}>
                                                <Button variant="outlined" onClick={handleAddQTextField}>
                                                    + Add Text Field
                                                </Button>
                                            </Grid>

                                        </>
                                    )}

                                    {qType === 2 && (
                                        <>
                                            {qTextFieldsB.map((field, index) => (
                                                <Grid item xs={12} sm={12} key={index} container spacing={1} alignItems="center">
                                                    <Grid item xs={3}>
                                                        <TextField
                                                            label="Field Name"
                                                            fullWidth
                                                            size="small"
                                                            disabled
                                                            value={field.key}
                                                            onChange={(e) => handleQTextChangeB(index, "key", e.target.value)}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={7}>
                                                        <TextField
                                                            label="Field Value"
                                                            fullWidth
                                                            size="small"
                                                            value={field.value}
                                                            onChange={(e) => handleQTextChangeB(index, "value", e.target.value)}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={1}>
                                                        <IconButton onClick={() => handleInsertBlank(index)} title="Insert Blank">
                                                            <AddCircle />
                                                        </IconButton>
                                                    </Grid>
                                                    <Grid item xs={1}>
                                                        <IconButton onClick={() => handleRemoveQTextFieldB(index)} title="Remove">
                                                            <Delete fontSize="small" />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            ))}

                                            <Grid item xs={12}>
                                                <Button variant="outlined" onClick={handleAddQTextFieldB}>
                                                    + Add Text Field
                                                </Button>
                                            </Grid>
                                        </>
                                    )}

                                    <Grid item xs={12} sm={12}>
                                        <Typography variant="subtitle1">Upload Image</Typography>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={imageInputRef}
                                            onChange={handleImageChange}
                                            style={{ marginTop: "8px" }}
                                        />
                                    </Grid>

                                    {imageUrl !== "" && (
                                        <Grid item xs={12} sm={6}>
                                            <img
                                                src={imageUrl}
                                                alt="Preview"
                                                style={{ width: "100%", maxHeight: "200px", objectFit: "contain", marginTop: "8px", border: "1px solid #ccc", borderRadius: "6px" }}
                                            />
                                        </Grid>
                                    )}

                                    {questionImage && (
                                        <Grid item xs={12} sm={6}>
                                            <img
                                                src={URL.createObjectURL(questionImage)}
                                                alt="Preview"
                                                style={{ width: "100%", maxHeight: "200px", objectFit: "contain", marginTop: "8px", border: "1px solid #ccc", borderRadius: "6px" }}
                                            />
                                        </Grid>
                                    )}

                                    <Grid item xs={12} sm={12}>
                                        <AudioRecorder onRecordingComplete={(blob) => setAudioBlob(blob)} />
                                    </Grid>

                                    {audioUrl !== "" && (
                                        <div style={{margin: "5px 15px"}}>
                                            <audio controls src={audioUrl} />
                                        </div>                                        
                                    )}

                                    {audioBlob && (
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle1">Audio Preview</Typography>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <audio controls src={URL.createObjectURL(audioBlob)} />
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => setAudioBlob(null)}
                                                >
                                                    Delete Audio
                                                </Button>
                                            </Box>
                                        </Grid>
                                    )}

                                    {qType === 1 && (
                                        <><Grid item xs={12}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Answers
                                            </Typography>
                                        </Grid>
                                            {[0, 1, 2, 3].map((i) => (
                                                <Grid item xs={12} sm={6} key={i}>
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        label={`Answer ${i + 1}`}
                                                        value={answers[i]}
                                                        onChange={(e) => handleAnswerChange(i, e.target.value)}
                                                    />
                                                </Grid>
                                            ))}

                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth>
                                                    <InputLabel id="correct-answer-label">Correct Answer</InputLabel>
                                                    <Select
                                                        labelId="correct-answer-label"
                                                        size="small"
                                                        value={correctAnswerIndex}
                                                        label="Correct Answer"
                                                        onChange={(e) => setCorrectAnswerIndex(Number(e.target.value))}
                                                    >
                                                        {[0, 1, 2, 3].map((i) => (
                                                            <MenuItem key={i} value={i}>
                                                                Answer {i + 1}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </>
                                    )}

                                    {qType === 2 && fillBlankAnswers.length > 0 && (
                                        <>
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle1" gutterBottom>
                                                    Fill in the Blanks - Correct Answers
                                                </Typography>
                                            </Grid>
                                            {fillBlankAnswers.map((ans, index) => (
                                                <Grid item xs={12} sm={6} key={index}>
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        label={`Answer for [[${index}]]`}
                                                        value={ans}
                                                        onChange={(e) => handleFillBlankAnswerChange(index, e.target.value)}
                                                    />
                                                </Grid>
                                            ))}
                                        </>
                                    )}

                                    <Grid item xs={12} display="flex" justifyContent="flex-end" mt={2}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSaveAnswers}
                                        >
                                            Save Question
                                        </Button>
                                    </Grid>

                                </Grid>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {!visible && (
                <>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Course</InputLabel>
                            <Select
                                value={courseId}
                                label="Course"
                                onChange={(e) => {
                                    setCourseId(Number(e.target.value));
                                    handleGetQuizes(Number(e.target.value));
                                }}
                                fullWidth
                            >
                                {courses?.map((c: any, index) => (
                                    <MenuItem key={index} value={c.id}>{c.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Paper sx={{ mt: 2 }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
                            pageSizeOptions={[5]}
                            autoHeight
                            sx={{
                                border: 0,
                                minWidth: 600,
                                '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold', fontSize: '15px', fontFamily: 'Public Sans, sans-serif' },
                                '& .MuiDataGrid-cell': { fontSize: '14px', fontFamily: 'Public Sans, sans-serif' }
                            }}
                            slots={{ noRowsOverlay: CustomNoRowsOverlay }}
                        />
                    </Paper>
                </>
            )}

            {visible && editingQuestion && (
                <Grid container spacing={2} mt={1}>

                    <Grid item xs={12}>
                        <TextField
                            label="Name"
                            fullWidth
                            value={editingQuestion.name || ''}
                            onChange={(e) => handleFormChange("name", e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Price"
                            fullWidth
                            value={editingQuestion.prize || ''}
                            onChange={(e) => handleFormChange("prize", e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Attempts"
                            fullWidth
                            value={editingQuestion.attemptLimit || ''}
                            onChange={(e) => handleFormChange("attemptLimit", e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Duration (hours)"
                            fullWidth
                            value={editingQuestion.quizDuration || ''}
                            onChange={(e) => handleFormChange("quizDuration", e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={editingQuestion.activeStatus || 'Active'}
                                onChange={(e) => handleFormChange("activeStatus", e.target.value)}
                                label="Status"
                            >
                                <MenuItem value={1}>Active</MenuItem>
                                <MenuItem value={2}>Inactive</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={editingQuestion.description || ''}
                            onChange={(e) => handleFormChange("description", e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    const file = e.target.files[0];
                                    handleFormChange("imageUrl", file);
                                    setThumb(file);
                                }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <img
                            style={{ width: "80%", border: '1px solid black', borderRadius: "8px" }}
                            src={
                                typeof editingQuestion.imageUrl === "string"
                                    ? editingQuestion.imageUrl.replace("dl=0", "raw=1")
                                    : thumb
                                        ? URL.createObjectURL(thumb)
                                        : ""
                            }
                            alt="Quiz Thumbnail"
                        />
                    </Grid>

                    <Grid item xs={12} display="flex" justifyContent="flex-end">
                        <Button variant="outlined" onClick={handleCancel} sx={{ mr: 2 }}>Cancel</Button>
                        <Button variant="contained" onClick={handleUpdate}>Update</Button>
                    </Grid>
                </Grid>
            )}
        </>
    );
}
