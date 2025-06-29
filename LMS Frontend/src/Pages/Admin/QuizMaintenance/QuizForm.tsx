import { useEffect, useState } from "react";
import {
    Box,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Button,
    Grid,
} from "@mui/material";
import "../../../Common/styles/user.css";
import { Add } from "@mui/icons-material";
import { getAllCourses } from "src/Services/course_api";
import { createQuiz } from "src/Services/quiz_api";

export default function QuizForm() {

    const [quizName, setQuizName] = useState("")
    const [status, setStatus] = useState("Active")
    const [description, setDescription] = useState("")
    const [attempts, setAttempts] = useState("")
    const [price, setPrice] = useState("")
    const [thumbnail, setThumbnail] = useState<File | any>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [courseId, setCourseId] = useState(1)
    const [courses, setCourses] = useState<any[]>([]);
    const [duration, setDuration] = useState("");

    useEffect(() => {
        handleGetCourses()
    }, [])

    const handleGetCourses = async () => {
        try {
            const response = await getAllCourses()
            const activeCourses = response.data.filter((course: any) => course.activeStatus === 1);
            setCourses(activeCourses)
        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("courseId", courseId.toString());
        formData.append("name", quizName);
        formData.append("prize", price);
        formData.append("attemptLimit", attempts);
        formData.append("description", description)
        formData.append("quizDuration", duration === "" ? "0" : duration);
        formData.append("image", thumbnail);
        formData.append("activeStatus", status === "Active" ? "1" : "2");

        try {
            const response = await createQuiz(formData)
            alert(response.data.message)
        } catch (error: any) {
            alert(error.response?.data?.message || "An error occurred while creating the quiz.");
        }

        window.location.reload();
    };

    return (
        <div className="user-form-outer">
            <Box component="form" noValidate autoComplete="off" sx={{ p: 2, width: "100%" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        <FormControl fullWidth>
                            <InputLabel>Course</InputLabel>
                            <Select
                                value={courseId}
                                label="Course"
                                onChange={(e) => {
                                    setCourseId(Number(e.target.value))
                                }}
                                fullWidth
                            >
                                {courses?.map((c: any, index) => (
                                    <MenuItem key={index} value={c.id}>
                                        {c.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Quiz Name"
                            fullWidth
                            value={quizName}
                            onChange={(e) => setQuizName(e.target.value)}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Price"
                            fullWidth
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Attempts"
                            fullWidth
                            value={attempts}
                            onChange={(e) => setAttempts(e.target.value)}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Duration (hours)"
                            fullWidth
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                label="Status"
                            >
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Inactive">Inactive</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Grid><Grid item xs={12} sm={12}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    const file = e.target.files[0];
                                    setThumbnail(file);
                                    setThumbnailPreview(URL.createObjectURL(file));
                                }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                    {thumbnailPreview && (
                            <div>
                                <p>Image Preview:</p>
                                <img
                                    src={thumbnailPreview}
                                    alt="Thumbnail Preview"
                                    style={{ width: "200px", height: "auto", marginTop: "10px" }}
                                />
                            </div>
                        )}
                    </Grid>

                    <Grid item xs={12} display="flex" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Add />}
                            sx={{ textTransform: 'none' }}
                            onClick={handleSubmit}
                            disabled={!quizName || !courseId || !description || !attempts || !price }
                        >
                            Add Quiz
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}
