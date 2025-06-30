import {
    Paper, IconButton, Box, Typography, TextField,
    Grid, FormControl, InputLabel, Select, MenuItem, Button
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { getAllCourses } from "src/Services/course_api";
import { deleteQuestion, getQuestions, getQuiz, updateQuestion, updateQuiz } from "src/Services/quiz_api";
import { Delete } from "@mui/icons-material";
import Dialogbox from "src/Common/Components/DialogBox";

function CustomNoRowsOverlay() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: 2 }}>
            <Typography variant="h6" color="text.secondary">No Quizes Found</Typography>
        </Box>
    );
}

export default function QuizMaintenance() {
    const [visible, setVisible] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<any | null>(null);
    const [courseId, setCourseId] = useState(1);
    const [courses, setCourses] = useState<any[]>([]);
    const [rows, setRows] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [quizId, setQuizId] = useState("")
    const [thumb, setThumb] = useState<File | any>(null);

    useEffect(() => {
        handleGetCourses();
        handleGetQuizes(courseId);
    }, []);

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
            const response = await deleteQuestion(quizId)
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
            width: 100,
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
                </Box>

            ),
        },
    ];

    return (
        <>
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
