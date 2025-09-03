import {
    Paper, IconButton, Box, Typography, TextField,
    Grid, FormControl, InputLabel, Select, MenuItem, Button,
    Backdrop,
    CircularProgress,
    StepLabel,
    Stepper,
    Step,
    DialogTitle,
    DialogContentText,
    DialogActions,
    Divider,
    Avatar,
    ToggleButtonGroup,
    ToggleButton
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { act, useEffect, useRef, useState } from "react";
import { getAllCourses } from "src/Services/course_api";
import { createQuestion, deleteQuestion, deleteQuiz, getQuestions, getQuiz, updateQuestion, updateQuiz } from "src/Services/quiz_api";
import { AddAPhoto, AddCircle, Delete, Man, Person } from "@mui/icons-material";
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
import { get, set } from "lodash";
import { t } from "i18next";
import { createLanguagePracticeQuestion, deleteLanguagePractice, deleteLanguagePracticeAudioQuestion, deleteLanguagePracticeWordQuestion, getLanguagePracticeQuestions, getLanguagePractices, updateLanguagePractice, updateLanguagePracticeAudioQuestion, updateLanguagePracticeWordQuestion } from "src/Services/lang_practice_api";
import { a, h, u } from "framer-motion/dist/types.d-B50aGbjN";
import "../../../Common/styles/lang.css"
import av1 from "../../../Assets/Images/av1.jpg";
import av2 from "../../../Assets/Images/av2.jpg";
import av3 from "../../../Assets/Images/av3.jpg";
import av4 from "../../../Assets/Images/av4.jpg";
import av5 from "../../../Assets/Images/av5.jpg";
import av6 from "../../../Assets/Images/av6.jpg";
import av7 from "../../../Assets/Images/av7.jpg";
import av8 from "../../../Assets/Images/av8.jpg";
import av9 from "../../../Assets/Images/av9.jpg";
import back1 from "../../../Assets/Images/back1.jpg";
import back2 from "../../../Assets/Images/back2.jpg";
import back3 from "../../../Assets/Images/back3.jpg";
import back4 from "../../../Assets/Images/back4.jpg";
import back5 from "../../../Assets/Images/back5.jpg";
import back6 from "../../../Assets/Images/back6.jpg";
import back7 from "../../../Assets/Images/back7.jpg";
import back8 from "../../../Assets/Images/back8.jpg";
import back9 from "../../../Assets/Images/back9.jpg";
import background from "../../../Assets/Images/background.png";
import { SketchPicker } from "react-color";

function CustomNoRowsOverlay() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: 2 }}>
            <Typography variant="h6" color="text.secondary">No Language Practices Found</Typography>
        </Box>
    );
}

const avatarOptions = [
    av1,
    av2,
    av3,
    av4,
    av5,
    av6,
    av7,
    av8,
    av9
];

const backgroundOptions = [
    back1,
    back2,
    back3,
    back4,
    back5,
    back6,
    back7,
    back8,
    back9
];

// Map avatar names to their image sources
const avatarMap: { [key: string]: string } = {
    av1: av1,
    av2: av2,
    av3: av3,
    av4: av4,
    av5: av5,
    av6: av6,
    av7: av7,
    av8: av8,
    av9: av9,
};

const backgroundMap: { [key: string]: string } = {
    back1: back1,
    back2: back2,
    back3: back3,
    back4: back4,
    back5: back5,
    back6: back6,
    back7: back7,
    back8: back8,
    back9: back9,
};

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function LanguagePracticeMaintenance() {
    const [visible, setVisible] = useState(false);
    const [editingLang, seteditingLang] = useState<any | null>(null);
    const [courseId, setCourseId] = useState(1);
    const [courses, setCourses] = useState<any[]>([]);
    const [rows, setRows] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen1, setIsOpen1] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [langId, setLangId] = useState("")
    const [quizName, setQuizName] = useState("");
    const [thumb, setThumb] = useState<File | any>(null);
    const [openFullScreenModal, setOpenFullScreenModal] = useState(false);

    const [qType, setQType] = useState(0);
    const [qTextFields, setQTextFields] = useState([{ key: "field01", value: "" }]);
    const [qTextFieldsB, setQTextFieldsB] = useState([{ key: "field01", value: "" }]);
    const [questionImage, setQuestionImage] = useState<File | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [newAudioBlob, setNewAudioBlob] = useState<Blob | null>(null);
    const [subtitle, setSubtitle] = useState("");
    const [answers, setAnswers] = useState(["", "", "", ""]);
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [fillBlankAnswers, setFillBlankAnswers] = useState<string[]>([]);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [audioUrl, setAudioUrl] = useState("")
    const [imageUrl, setImageUrl] = useState("");
    const [updateBtnVisible, setUpdateBtnVisible] = useState(false)
    const [id, setId] = useState("")
    const [stepComponent, setStepComponent] = useState<any>(1);
    const [u1, setU1] = useState("")
    const [u2, setU2] = useState("")
    const [u1Avatar, setU1Avatar] = useState("")
    const [u1AvatarName, setU1AvatarName] = useState("")
    const [u2Avatar, setU2Avatar] = useState("")
    const [u2AvatarName, setU2AvatarName] = useState("")
    const [scrambledSentence, setScrambledSentence] = useState("");
    const [correctSentence, setCorrectSentence] = useState("");
    const [langDetailsOpen, setLangDetailsOpen] = useState(false)
    const [audioUser, setAudioUser] = useState("default")
    const [selectedAudioUser, setSelectedAudioUser] = useState("default")
    const [selectedSubtitle, setSelectedSubtitle] = useState("");
    const [selectedAudioQuestionOrder, setSelectedAudioQuestionOrder] = useState<any>(null);
    const [audioUpdateVisible, setAudioUpdateVisible] = useState(false);
    const [selectedId, setSelectedId] = useState("");
    const [openPicker, setOpenPicker] = useState(false);
    const [openPickerB, setOpenPickerB] = useState(false);
    const [backgroundImage, setBackgroundImage] = useState("");
    const [b, setB] = useState("");
    const [backgroundImageName, setBackgroundImageName] = useState("");
    const [activeUser, setActiveUser] = useState<"u1" | "u2">("u1");
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const audioInputRef = useRef<HTMLInputElement | null>(null);
    const [color, setColor] = useState("");
    const [openColorPicker, setOpenColorPicker] = useState(false);
    const [mode, setMode] = useState<"color" | "image">("color");

    const token = localStorage.getItem("token") || "";

    const handleModeChange = (
        event: React.MouseEvent<HTMLElement>,
        newMode: "color" | "image" | null
    ) => {
        if (newMode !== null) setMode(newMode);
        setColor("")
        setB("")
        setBackgroundImage("")
        setBackgroundImageName("")
    };

    const handleAvatarClick = (user: "u1" | "u2") => {
        setActiveUser(user);
        setOpenPicker(true);
    };

    const handleSelectAvatar = (src: string) => {
        if (activeUser === "u1") {
            setU1Avatar(src);
            setU1AvatarName(src.split("/").pop()?.split(".")[0] || "");
        } else {
            setU2Avatar(src);
            setU2AvatarName(src.split("/").pop()?.split(".")[0] || "");
        }
        setOpenPicker(false);
    };

    const handleSelectBackground = (src: string) => {
        const name = src.split("/").pop()?.split(".")[0] || "";

        setBackgroundImage(name);
        setBackgroundImageName(name);
        setOpenPickerB(false);
    };

    const handleOpenFullScreenModal = (row: any) => {
        setOpenFullScreenModal(true)
        setLangId(row.id);
        setQuizName(row.name)
        handleGetQuestions(row.id)
    };

    useEffect(() => {
        handleGetCourses();
        handleGetLanguagePractices();
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

    const handleGetQuestions = async (id: any) => {
        try {
            const res = await getLanguagePracticeQuestions(id, token);
            setQuestions(res.data);
            if (res.data.length > 0) {
                if (res.data[0].originalSentence === "") {
                    setQType(1);
                    setLangDetailsOpen(true);
                    setB(res.data[0].audioFilePaths[0].backgroundImage);
                    setU1(res.data[0].audioFilePaths[0].audioUserName.split(",")[0]);
                    setU1AvatarName(res.data[0].audioFilePaths[0].audioAvatar.split(",")[0]);
                    setU2(res.data[0].audioFilePaths[0].audioUserName.split(",")[1]);
                    setU2AvatarName(res.data[0].audioFilePaths[0].audioAvatar.split(",")[1]);
                } else {
                    setQType(2);
                }
            } else {
                setQType(0);
            }
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

    const handleGetLanguagePractices = async () => {
        try {
            const res = await getLanguagePractices(token);
            setRows(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditClick = (q: any) => {
        const correctAnswerIndex = Array.isArray(q.isCorrectAnswers)
            ? q.isCorrectAnswers.findIndex((val: boolean) => val === true)
            : 0;

        seteditingLang({
            ...q,
            correctAnswer: correctAnswerIndex >= 0 ? correctAnswerIndex : 0
        });

        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
        seteditingLang(null);
    };

    const handleFormChange = (field: string, value: any) => {
        seteditingLang((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleUpdate = async () => {

        if (editingLang.isPaid) {
            if (!editingLang.price || isNaN(editingLang.price) || editingLang.price <= 0) {
                alert("Please enter a valid price.");
                return;
            }
        }

        const body = {
            id: editingLang.id,
            name: editingLang.name,
            description: editingLang.descriptions,
            difficultyLevel: editingLang.difficultyLevel,
            activeStatus: editingLang.activeStatus,
            isPaid: editingLang.isPaid,
            price: editingLang.isPaid ? Number(editingLang.price) : 0, // default 0 if not paid
        }

        try {
            const res = await updateLanguagePractice(body, token);
            alert(res.data.message);
        } catch (error: any) {
            alert(error.response?.data?.message || "An error occurred while updating the language practice.");
        }
        window.location.reload()
    };

    const handleDeleteClick = (c: any) => {
        setLangId(c.id)
        setIsOpen(true)
    };

    const handleDelete = async () => {
        try {
            const response = await deleteLanguagePractice(langId, token)
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
        { field: 'descriptions', headerName: 'Description', flex: 1, minWidth: 130 },
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

    const handleClearFields = () => {
        setAudioBlob(null)
        setSubtitle("");
        setScrambledSentence("");
        setCorrectSentence("");
    }

    const handleUpdateAudioQuestion = async (order: any, audioUserName: any, subtitle: any) => {
        if (audioUserName === u1) {
            audioUserName = audioUserName + `,${u2}`;
        } else if (audioUserName === u2) {
            audioUserName = audioUserName + `,${u1}`;
        }
        const formData = new FormData();
        formData.append("languagePracticeId", langId);
        formData.append("order", order);
        formData.append("audioUserName", audioUserName ? audioUserName : "");
        formData.append("subtitle", subtitle);
        formData.append("audio", newAudioBlob ? newAudioBlob : audioBlob ? audioBlob : "");

        try {
            const res = await updateLanguagePracticeAudioQuestion(formData, token);
            alert("Audio question updated successfully.");
            setAudioUpdateVisible(false);
            handleClearFields();
            handleGetQuestions(langId);
        } catch (error: any) {
            alert(error.response.data.message);
        }
    }

    const handleUpdateWordQuestion = async () => {
        const formData = new FormData();
        formData.append("id", selectedId);
        formData.append("scrambledSentence", scrambledSentence);
        formData.append("originalSentence", correctSentence);

        try {
            const res = await updateLanguagePracticeWordQuestion(formData, token);
            alert("Word question updated successfully.");
            setUpdateBtnVisible(false);
            handleClearFields();
            handleGetQuestions(langId);
        } catch (error: any) {
            alert(error.response.data.message);
        }
    }

    const handleDeleteAudioQuestion = async () => {
        try {
            const res = await deleteLanguagePracticeAudioQuestion(langId, selectedAudioQuestionOrder, token);
            alert(res.data);
            handleClearFields();
            handleGetQuestions(langId);
        } catch (error: any) {
            alert(error.response.data.message);
        }
    }

    const handleDeleteWordQuestion = async () => {
        try {
            const res = await deleteLanguagePracticeWordQuestion(langId, selectedId, token);
            alert(res.data);
            handleClearFields();
            handleGetQuestions(langId);
        } catch (error: any) {
            alert(error.response.data.message);
        }
    }

    const handleCreateQuestion = async () => {
        if (qType === 0) {
            alert("Please select a question type.");
            return;
        }
        const formdata = new FormData();
        if (qType === 1) {
            if (audioUser === u1) {
                formdata.append("audioUserName", audioUser + `,${u2}`);
                formdata.append("audioAvatar", u1AvatarName + `,${u2AvatarName}`);
            } else if (audioUser === u2) {
                formdata.append("audioUserName", audioUser + `,${u1}`);
                formdata.append("audioAvatar", u2AvatarName + `,${u1AvatarName}`);
            }

            formdata.append("backgroundImage", backgroundImageName ? backgroundImageName : "");
            formdata.append("languagePracticeId", langId);
            formdata.append("languagePracticeQuestionId", "1");
            formdata.append("languagePracticeType", qType.toString());
            formdata.append("subtitle", subtitle);
            formdata.append("audio", audioBlob ? audioBlob : "");
            formdata.append("originalSentence", "");
            formdata.append("scrambledSentence", "");
            formdata.append("order", (questions.length > 0 ? questions[0].audioFilePaths[questions[0].audioFilePaths.length - 1].order + 1 : 1).toString());
        }

        if (qType === 2) {
            formdata.append("languagePracticeId", langId);
            formdata.append("languagePracticeQuestionId", "1");
            formdata.append("languagePracticeType", qType.toString());
            formdata.append("subtitle", "");
            formdata.append("audio", "");
            formdata.append("audioUserName", "");
            formdata.append("originalSentence", correctSentence);
            formdata.append("scrambledSentence", scrambledSentence);
            formdata.append("order", "1");
        }

        try {
            const res = await createLanguagePracticeQuestion(formdata, token);
            alert(res.data.message);
            handleClearFields();
            handleGetQuestions(langId);
        } catch (error: any) {
            console.error("Error creating question:", error);
            alert(error.response?.data?.message || "An error occurred while creating the question.");
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
                open={isOpen1}
                title="Delete Confirmation"
                content="Are you sure you want to delete this audio question?"
                agreeButtonText="Yes, Delete"
                disagreeButtonText="No"
                onAgree={handleDeleteAudioQuestion}
                onDisagree={() => setIsOpen1(false)}
                onClose={() => setIsOpen1(false)}
            />
            <Dialogbox
                open={isOpen2}
                title="Delete Confirmation"
                content="Are you sure you want to delete this word scramble question?"
                agreeButtonText="Yes, Delete"
                disagreeButtonText="No"
                onAgree={handleDeleteWordQuestion}
                onDisagree={() => setIsOpen2(false)}
                onClose={() => setIsOpen2(false)}
            />
            <Dialogbox
                open={isOpen}
                title="Delete Confirmation"
                content="Are you sure you want to delete this language practice?"
                agreeButtonText="Yes, Delete"
                disagreeButtonText="No"
                onAgree={handleDelete}
                onDisagree={handleClose}
                onClose={handleClose}
            />

            <Dialog
                open={audioUpdateVisible}
                onClose={() => setAudioUpdateVisible(false)}
                fullWidth
                maxWidth="md"
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Update Audio Question</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To update the audio question, please fill in the details below.
                    </DialogContentText>
                    <Select
                        size="small"
                        value={selectedAudioUser}
                        onChange={(e) => {
                            setSelectedAudioUser(e.target.value)
                        }}
                        fullWidth
                    >
                        <MenuItem disabled value="default">Select User</MenuItem>
                        <MenuItem value={u1}>{u1}</MenuItem>
                        <MenuItem value={u2}>{u2}</MenuItem>
                    </Select>
                    <TextField
                        margin="dense"
                        label="Subtitle"
                        type="text"
                        value={selectedSubtitle}
                        onChange={(e) => setSelectedSubtitle(e.target.value)}
                        fullWidth
                        variant="outlined"
                    />

                    <Grid item xs={12} sm={12} mt={2}>
                        <Typography variant="subtitle1">Upload Audio</Typography>
                        <input
                            ref={audioInputRef}
                            type="file"
                            accept=".mp3,.ogg,audio/mpeg,audio/ogg"
                            onChange={(e) =>
                                setNewAudioBlob(
                                    e.target.files && e.target.files[0] ? e.target.files[0] : null
                                )
                            }
                            style={{ marginTop: "8px" }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12} mt={2}>
                        <AudioRecorder onRecordingComplete={(blob) => setNewAudioBlob(blob)} />
                    </Grid>

                    {newAudioBlob && (
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">Audio Preview</Typography>
                            <Box display="flex" alignItems="center" gap={2}>
                                <audio controls src={URL.createObjectURL(newAudioBlob)} />
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => {
                                        setNewAudioBlob(null)
                                        if (audioInputRef.current) {
                                            audioInputRef.current.value = ""
                                        }
                                    }}
                                >
                                    Delete Audio
                                </Button>
                            </Box>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAudioUpdateVisible(false)} color="primary">
                        Cancel
                    </Button>
                    <Button color="primary" onClick={() => {
                        handleUpdateAudioQuestion(selectedAudioQuestionOrder, selectedAudioUser, selectedSubtitle);
                    }}>
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
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
                            onClick={() => {
                                setU1("")
                                setU2("")
                                setBackgroundImage("")
                                setBackgroundImageName("")
                                setB("")
                                setQType(0)
                                setOpenFullScreenModal(false)
                            }}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Add Language Practice Content
                        </Typography>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <div className="selection-type-outer">
                        {qType === 0 && (
                            <div className="selection-type-outer">
                                <div className="selection-type-inner">
                                    <h3>Select Language Practice Type</h3>
                                    <Grid container spacing={2}>
                                        <Grid item sm={6}>
                                            <Button variant="contained" onClick={() => { setQType(1) }}>
                                                Dialogue
                                            </Button>
                                        </Grid>
                                        <Grid item sm={6}>
                                            <Button variant="contained" onClick={() => { setQType(2) }}>
                                                Scramble Text
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>)}
                        {qType === 1 && (
                            <div className="dl-outer">
                                {qType === 1 && !langDetailsOpen && (
                                    <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <Grid item sm={1} sx={{ display: "flex", justifyContent: "center" }}>
                                            <Box
                                                sx={{
                                                    position: "relative",
                                                    width: 56,
                                                    height: 56,
                                                    cursor: "pointer",
                                                    "&:hover .overlay": { opacity: 1 },
                                                }}
                                                onClick={() => handleAvatarClick("u1")}
                                            >
                                                <Avatar src={u1Avatar} alt="User1 Avatar" sx={{ width: 56, height: 56 }} />
                                                <Box
                                                    className="overlay"
                                                    sx={{
                                                        position: "absolute",
                                                        inset: 0,
                                                        bgcolor: "rgba(0,0,0,0.5)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        borderRadius: "50%",
                                                        opacity: 0,
                                                        transition: "opacity 0.3s",
                                                    }}
                                                >
                                                    <AddAPhoto sx={{ color: "white" }} />
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid item sm={11}>
                                            <TextField
                                                label="User1"
                                                fullWidth
                                                size="small"
                                                variant="outlined"
                                                value={u1}
                                                onChange={(e) => {
                                                    setU1(e.target.value);
                                                }}
                                            />
                                        </Grid>
                                        <Grid item sm={1} sx={{ display: "flex", justifyContent: "center" }}>
                                            <Box
                                                sx={{
                                                    position: "relative",
                                                    width: 56,
                                                    height: 56,
                                                    cursor: "pointer",
                                                    "&:hover .overlay": { opacity: 1 },
                                                }}
                                                onClick={() => handleAvatarClick("u2")}
                                            >
                                                <Avatar src={u2Avatar} alt="User2 Avatar" sx={{ width: 56, height: 56 }} />
                                                <Box
                                                    className="overlay"
                                                    sx={{
                                                        position: "absolute",
                                                        inset: 0,
                                                        bgcolor: "rgba(0,0,0,0.5)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        borderRadius: "50%",
                                                        opacity: 0,
                                                        transition: "opacity 0.3s",
                                                    }}
                                                >
                                                    <AddAPhoto sx={{ color: "white" }} />
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid item sm={11}>
                                            <TextField
                                                label="User2"
                                                fullWidth
                                                size="small"
                                                variant="outlined"
                                                value={u2}
                                                onChange={(e) => {
                                                    setU2(e.target.value);
                                                }}
                                            />
                                        </Grid>
                                        <Grid item sm={12} sx={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                                            <ToggleButtonGroup
                                                value={mode}
                                                exclusive
                                                size="small"
                                                onChange={handleModeChange}
                                                fullWidth
                                                sx={{ marginBottom: 2, width: "200px", marginRight: "10px" }}
                                            >
                                                <ToggleButton value="color">Color</ToggleButton>
                                                <ToggleButton value="image">Image</ToggleButton>
                                            </ToggleButtonGroup>
                                            {mode === "color" && (
                                                <>
                                                    <div style={{ marginRight: "10px", width: "40px", height: "40px", backgroundColor: color, borderRadius: "12px" }}></div>
                                                    <Button style={{ height: "40px", marginRight: "10px" }} variant="contained" onClick={() => setOpenColorPicker(!openColorPicker)}>Pick Color</Button>
                                                    <Dialog open={openColorPicker} onClose={() => setOpenColorPicker(false)}>
                                                        <DialogTitle>Select a Color</DialogTitle>
                                                        <DialogContent>
                                                            <SketchPicker
                                                                color={color}
                                                                onChange={(newColor) => setColor(newColor.hex)}
                                                            />
                                                            <div
                                                                style={{
                                                                    marginTop: "10px",
                                                                    width: "100%",
                                                                    height: "40px",
                                                                    backgroundColor: color,
                                                                    borderRadius: "5px",
                                                                    border: "1px solid #ccc",
                                                                }}
                                                            />
                                                            <span>Selected: {color}</span>
                                                        </DialogContent>
                                                        <DialogActions>
                                                            <Button onClick={() => setOpenColorPicker(false)}>Cancel</Button>
                                                            <Button onClick={() => setOpenColorPicker(false)} variant="contained">
                                                                Confirm
                                                            </Button>
                                                        </DialogActions>
                                                    </Dialog>
                                                </>
                                            )}

                                            {mode === "image" && (
                                                <>
                                                    <Avatar
                                                        src={backgroundMap[backgroundImage] || background}
                                                        alt="Background"
                                                        sx={{ width: 40, height: 40, marginRight: "10px" }}
                                                    />
                                                    <Button
                                                        style={{ marginRight: "10px", height: "40px" }}
                                                        variant="contained"
                                                        size="small"
                                                        onClick={() => {
                                                            setOpenPickerB(true);
                                                        }}
                                                    >
                                                        Background
                                                    </Button>
                                                </>
                                            )}


                                            <Button style={{height: "40px"}} disabled={!u1 || !u2 || !u1Avatar || !u2Avatar} variant="contained" onClick={() => { setLangDetailsOpen(true) }}>
                                                Confirm Users
                                            </Button>
                                        </Grid>
                                    </Grid>
                                )}

                                <Dialog open={openPicker} onClose={() => setOpenPicker(false)}>
                                    <DialogTitle>Select Avatar</DialogTitle>
                                    <DialogContent>
                                        <Grid container spacing={2} sx={{ padding: 2, display: "flex", justifyContent: "center" }}>
                                            {avatarOptions.map((src) => (
                                                <Grid item xs={4} key={src} sx={{ display: "flex", justifyContent: "center" }}>
                                                    <IconButton onClick={() => handleSelectAvatar(src)}>
                                                        <Avatar src={src} sx={{ width: 66, height: 66 }} />
                                                    </IconButton>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </DialogContent>
                                </Dialog>

                                <Dialog open={openPickerB} onClose={() => setOpenPickerB(false)}>
                                    <DialogTitle>Select Background</DialogTitle>
                                    <DialogContent>
                                        <Grid container spacing={2} sx={{ padding: 2, display: "flex", justifyContent: "center" }}>
                                            {backgroundOptions.map((src) => (
                                                <Grid item xs={4} key={src} sx={{ display: "flex", justifyContent: "center" }}>
                                                    <IconButton onClick={() => handleSelectBackground(src)}>
                                                        <Avatar src={src} sx={{ width: 66, height: 66 }} />
                                                    </IconButton>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </DialogContent>
                                </Dialog>

                                {qType === 1 && langDetailsOpen && (
                                    <div >
                                        <Grid container sm={12} spacing={2} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            <Grid item sm={4}>
                                                <Select
                                                    size="small"
                                                    value={audioUser}
                                                    onChange={(e) => {
                                                        setAudioUser(e.target.value)
                                                    }}
                                                    fullWidth
                                                >
                                                    <MenuItem disabled value="default">Select User</MenuItem>
                                                    <MenuItem value={u1}>{u1}</MenuItem>
                                                    <MenuItem value={u2}>{u2}</MenuItem>
                                                </Select>
                                            </Grid>

                                            <Grid item sm={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
                                                <Button
                                                    variant="contained"
                                                    onClick={() => {
                                                        handleCreateQuestion();
                                                    }}
                                                    disabled={!audioBlob || audioUser === "default" || !subtitle}
                                                >
                                                    Add
                                                </Button>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12} sm={12} mt={2}>
                                            <Typography variant="subtitle1">Upload Audio</Typography>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept=".mp3,.ogg,audio/mpeg,audio/ogg"
                                                onChange={(e) =>
                                                    setAudioBlob(
                                                        e.target.files && e.target.files[0] ? e.target.files[0] : null
                                                    )
                                                }
                                                style={{ marginTop: "8px" }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={12} mt={2}>
                                            <AudioRecorder onRecordingComplete={(blob) => setAudioBlob(blob)} />
                                        </Grid>

                                        {audioBlob && (
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle1">Audio Preview</Typography>
                                                <Box display="flex" alignItems="center" gap={2}>
                                                    <audio controls src={URL.createObjectURL(audioBlob)} />
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() => {
                                                            setAudioBlob(null);
                                                            if (fileInputRef.current) {
                                                                fileInputRef.current.value = "";
                                                            }
                                                        }
                                                        }
                                                    >
                                                        Delete Audio
                                                    </Button>
                                                </Box>
                                            </Grid>
                                        )}

                                        {audioUrl !== "" && (
                                            <div style={{ margin: "5px 15px" }}>
                                                <audio controls src={audioUrl} />
                                            </div>
                                        )}

                                        <Grid item xs={12} sm={12} mt={2}>
                                            <TextField
                                                label="Subtitle"
                                                fullWidth
                                                multiline
                                                rows={3}
                                                value={subtitle}
                                                onChange={(e) => setSubtitle(e.target.value)}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={12} mt={2} style={{
                                            backgroundImage: `url(${backgroundMap[b] || ""})`, // fallback to b1
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            maxHeight: "500px",
                                            overflowY: "auto",
                                            padding: "20px",
                                            borderRadius: "8px"
                                        }}>
                                            {questions.length > 0 ? (<>
                                                {questions.map((q: any, qIdx: number) =>
                                                    q.audioFilePaths?.map((question: any, index: any) => (
                                                        (question?.audioUserName?.split(",")[0] === u1) ? (
                                                            <div>
                                                                <div style={{ display: "flex", gap: "8px" }} key={`${qIdx}-${index}`}>
                                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                                                                        <Avatar
                                                                            src={avatarMap[question.audioAvatar?.split(",")[0]?.trim() || ""]}
                                                                            sx={{ width: 66, height: 66 }}
                                                                        />

                                                                    </div>
                                                                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "8px 10px", backgroundColor: "#dfe6e9", borderRadius: "8px", position: "relative" }}>
                                                                        <div style={{ position: "absolute", top: "8px", right: "8px", display: "flex", gap: "8px" }}>
                                                                            <EditIcon style={{ fontSize: "16px", cursor: "pointer" }} onClick={() => {
                                                                                setSelectedAudioUser(question.audioUserName.split(",")[0]);
                                                                                setSelectedSubtitle(question.subtitle);
                                                                                setSelectedAudioQuestionOrder(question.order);
                                                                                setAudioUpdateVisible(true);
                                                                            }} />
                                                                            <Delete style={{ fontSize: "16px", cursor: "pointer" }} onClick={() => {
                                                                                setSelectedAudioQuestionOrder(question.order);
                                                                                setIsOpen1(true)
                                                                            }} />
                                                                        </div>
                                                                        {question?.audioUserName?.split(",")[0] || "User1"}
                                                                        <audio controls src={question?.audioFilePath ? question.audioFilePath.replace("dl=0", "raw=1") : ""} />
                                                                    </div>
                                                                </div>
                                                                <div style={{
                                                                    padding: "4px 10px", borderRadius: "8px", margin: "8px", backgroundColor: "#dfe6e9", width: "250px", wordWrap: "break-word", // ✅ forces breaking long words
                                                                    whiteSpace: "normal"
                                                                }}>
                                                                    {question?.subtitle}
                                                                </div>

                                                            </div>

                                                        ) : (
                                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                                                <div style={{ display: "flex", gap: "8px" }} key={`${qIdx}-${index}`}>
                                                                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "8px 10px", backgroundColor: "#dfe6e9", borderRadius: "8px", position: "relative" }}>
                                                                        <div style={{ position: "absolute", top: "8px", right: "8px", display: "flex", gap: "8px" }}>
                                                                            <EditIcon style={{ fontSize: "16px", cursor: "pointer" }} onClick={() => {
                                                                                setSelectedAudioUser(question.audioUserName.split(",")[0]);
                                                                                setSelectedSubtitle(question.subtitle);
                                                                                setSelectedAudioQuestionOrder(question.order);
                                                                                setAudioUpdateVisible(true);
                                                                            }} />
                                                                            <Delete style={{ fontSize: "16px", cursor: "pointer" }} onClick={() => {
                                                                                setSelectedAudioQuestionOrder(question.order);
                                                                                setIsOpen1(true);
                                                                            }} />
                                                                        </div>
                                                                        {question?.audioUserName?.split(",")[0] || "User1"}
                                                                        <audio controls src={question?.audioFilePath ? question.audioFilePath.replace("dl=0", "raw=1") : ""} />
                                                                    </div>
                                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                                                                        <Avatar
                                                                            src={avatarMap[question.audioAvatar?.split(",")[0]?.trim() || ""]}
                                                                            sx={{ width: 66, height: 66 }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div style={{ padding: "4px 10px", borderRadius: "8px", margin: "8px", backgroundColor: "#dfe6e9", width: "250px", wordWrap: "break-word", whiteSpace: "normal" }}>
                                                                    {question?.subtitle}
                                                                </div>
                                                            </div>
                                                        )
                                                    ))
                                                )}
                                            </>) : (<></>)}
                                        </Grid>

                                    </div>
                                )}
                            </div>
                        )}

                        {qType === 2 && (
                            <div className="dl-outer">
                                <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <Grid item sm={12}>
                                        <TextField
                                            label="Scrambled Sentence"
                                            fullWidth
                                            size="small"
                                            multiline
                                            rows={3}
                                            variant="outlined"
                                            value={scrambledSentence}
                                            onChange={(e) => {
                                                setScrambledSentence(e.target.value);
                                            }}
                                        />
                                    </Grid>
                                    <Grid item sm={12}>
                                        <TextField
                                            label="Correct Sentence"
                                            fullWidth
                                            size="small"
                                            multiline
                                            rows={3}
                                            variant="outlined"
                                            value={correctSentence}
                                            onChange={(e) => {
                                                setCorrectSentence(e.target.value);
                                            }}
                                        />
                                    </Grid>
                                    <Grid item sm={12}>
                                        {updateBtnVisible ? (
                                            <Button variant="contained" onClick={() => handleUpdateWordQuestion()} disabled={!correctSentence || !scrambledSentence}>
                                                Update Sentence
                                            </Button>) : (
                                            <Button variant="contained" onClick={() => handleCreateQuestion()} disabled={!correctSentence || !scrambledSentence}>
                                                Add Sentence
                                            </Button>
                                        )}
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 2 }} />

                                <Grid item xs={12} sm={12} mt={2}>
                                    {questions.length > 0 ? (
                                        questions.map((q: any, qIdx: number) => (
                                            <div key={qIdx} style={{ position: "relative", padding: "8px", backgroundColor: "#f0f0f0", borderRadius: "8px", marginBottom: "8px" }} onClick={() => {
                                                setScrambledSentence(q.scrambledSentence);
                                                setCorrectSentence(q.originalSentence);
                                                setSelectedId(q.id);
                                                setUpdateBtnVisible(true);
                                            }}>
                                                <div style={{ position: "absolute", top: "8px", right: "8px", cursor: "pointer", display: "flex", gap: "8px" }}>
                                                    <Delete onClick={() => {
                                                        setSelectedId(q.id);
                                                        setIsOpen2(true);
                                                    }} />
                                                </div>
                                                <Typography variant="body1"><b>Scrambled Sentence :</b> {q.scrambledSentence}</Typography>
                                                <Typography variant="body1" sx={{ marginTop: "8px" }}><b>Correct Sentence :</b> {q.originalSentence}</Typography>
                                            </div>
                                        ))
                                    ) : (
                                        <Typography variant="body2">No sentences added yet.</Typography>
                                    )}
                                </Grid>
                            </div>
                        )}

                    </div>
                </DialogContent>
            </Dialog >

            {!visible && (
                <>
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
            )
            }

            {
                visible && editingLang && (
                    <Grid container spacing={2} mt={1}>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Name"
                                fullWidth
                                value={editingLang.name || ''}
                                onChange={(e) => handleFormChange("name", e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Difficulty Level</InputLabel>
                                <Select
                                    value={editingLang.difficultyLevel || 1}
                                    label="Difficulty Level"
                                    onChange={(e) => handleFormChange("difficultyLevel", Number(e.target.value))}
                                >
                                    <MenuItem value={1}>Easy</MenuItem>
                                    <MenuItem value={2}>Medium</MenuItem>
                                    <MenuItem value={3}>Hard</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Is Paid</InputLabel>
                                <Select
                                    value={editingLang.isPaid ? "Yes" : "No"}
                                    label="Is Paid"
                                    onChange={(e) => handleFormChange("isPaid", e.target.value === "Yes")}
                                >
                                    <MenuItem value="No">No</MenuItem>
                                    <MenuItem value="Yes">Yes</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {editingLang.isPaid && (
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Price"
                                    fullWidth
                                    type="number"
                                    value={editingLang.price || ''}
                                    onChange={(e) => handleFormChange("price", e.target.value)}
                                    inputProps={{ min: 0 }}
                                />
                            </Grid>
                        )}

                        <Grid item xs={12} sm={12}>
                            <TextField
                                label="Description"
                                fullWidth
                                multiline
                                rows={3}
                                value={editingLang.descriptions || ''}
                                onChange={(e) => handleFormChange("descriptions", e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={editingLang.activeStatus || 'Active'}
                                    onChange={(e) => handleFormChange("activeStatus", e.target.value)}
                                    label="Status"
                                >
                                    <MenuItem value={1}>Active</MenuItem>
                                    <MenuItem value={2}>Inactive</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} display="flex" justifyContent="flex-end">
                            <Button variant="outlined" onClick={handleCancel} sx={{ mr: 2 }}>Cancel</Button>
                            <Button variant="contained" onClick={handleUpdate}>Update</Button>
                        </Grid>
                    </Grid>
                )
            }
        </>
    );
}
