import {
    Paper, IconButton, Box, Typography, TextField,
    Grid, FormControl, InputLabel, Select, MenuItem, Button
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { getAllCourses } from "src/Services/course_api";
import { getQuestions, updateQuestion } from "src/Services/quiz_api";

function CustomNoRowsOverlay() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: 2 }}>
            <Typography variant="h6" color="text.secondary">No Questions Found</Typography>
        </Box>
    );
}

export default function QuizMaintenance() {
    const [visible, setVisible] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<any | null>(null);
    const [courseId, setCourseId] = useState(1);
    const [courses, setCourses] = useState<any[]>([]);
    const [rows, setRows] = useState<any[]>([]);

    useEffect(() => {
        handleGetCourses();
        handleGetQuestions(courseId);
    }, []);

    const handleGetCourses = async () => {
        try {
            const res = await getAllCourses();
            setCourses(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleGetQuestions = async (id: any) => {
        try {
            const res = await getQuestions(id,"admin");
            const transformed = res.data.map((q: any) => ({
                ...q,
                answer1: q.answer.answer1,
                answer2: q.answer.answer2,
                answer3: q.answer.answer3,
                answer4: q.answer.answer4,
                isCorrectAnswers: q.answer.isCorrectAnswers
            }));
            setRows(transformed);
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
        const newCorrectAnswers = [0, 1, 2, 3].map(i => i === editingQuestion.correctAnswer);

        const updatedQuestion = {
            ...editingQuestion,
            isCorrectAnswers: newCorrectAnswers
        };

        try {
            const response = await updateQuestion(updatedQuestion)            
            alert(response.data.message)
        } catch (error:any) {
            alert(error.response.message)
        }

        setEditingQuestion(null);
        setVisible(false);
        window.location.reload()
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'questionText', headerName: 'Question', flex: 1, minWidth: 130 },
        { field: 'answer1', headerName: 'Answer 1', flex: 1, minWidth: 130 },
        { field: 'answer2', headerName: 'Answer 2', flex: 1, minWidth: 130 },
        { field: 'answer3', headerName: 'Answer 3', flex: 1, minWidth: 130 },
        { field: 'answer4', headerName: 'Answer 4', flex: 1, minWidth: 130 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <IconButton sx={{ color: 'black' }} aria-label="edit" onClick={() => handleEditClick(params.row)}>
                    <EditIcon />
                </IconButton>
            ),
        },
    ];

    return (
        <>
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
                                    handleGetQuestions(Number(e.target.value));
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
                <Grid container spacing={2} mt={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Question"
                            fullWidth
                            value={editingQuestion.questionText || ''}
                            onChange={(e) => handleFormChange("questionText", e.target.value)}
                        />
                    </Grid>

                    {["answer1", "answer2", "answer3", "answer4"].map((field, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <TextField
                                label={`Answer ${index + 1}`}
                                fullWidth
                                value={editingQuestion[field] || ''}
                                onChange={(e) => handleFormChange(field, e.target.value)}
                            />
                        </Grid>
                    ))}

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Correct Answer</InputLabel>
                            <Select
                                value={editingQuestion.correctAnswer}
                                label="Correct Answer"
                                onChange={(e) => handleFormChange("correctAnswer", Number(e.target.value))}
                            >
                                <MenuItem value={0}>Answer 1</MenuItem>
                                <MenuItem value={1}>Answer 2</MenuItem>
                                <MenuItem value={2}>Answer 3</MenuItem>
                                <MenuItem value={3}>Answer 4</MenuItem>
                            </Select>
                        </FormControl>
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
