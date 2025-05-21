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
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import { getAllCourses } from "src/Services/course_api";
import { createSection } from "src/Services/section_api";
import { createQuestion, createQuiz, getQuiz } from "src/Services/quiz_api";

export default function QuizForm() {
    const navigate = useNavigate();

    const [question, setQuestion] = useState("")
    const [a1, setA1] = useState("")
    const [a2, setA2] = useState("")
    const [a3, setA3] = useState("")
    const [a4, setA4] = useState("")
    const [price, setPrice] = useState("")
    const [level, setLevel] = useState("Beginner")
    const [type, setType] = useState(1)
    const [thumbnail, setThumbnail] = useState<File | any>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [correctAnswer, setCorrectAnswer] = useState(0)
    const [categoryId, setCategoryId] = useState(1)
    const [categories, setCategories] = useState<any[]>([]);

    const [courseId, setCourseId] = useState(1)
    const [courses, setCourses] = useState<any[]>([]);
    const [quizId, setQuizId] = useState("")

    useEffect(() => {
        handleGetCourses()
        handleCheckQuiz(courseId)
    }, [])

    const handleGetCourses = async () => {
        try {
            const response = await getAllCourses()
            setCourses(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = async () => {
        const isCorrectAnswers = [0, 1, 2, 3].map(index => index === correctAnswer);
    
        const body = {
            quizId: quizId,
            questionText: question,
            hint: "",
            imageUrl: "",
            answer1: a1,
            answer2: a2,
            answer3: a3,
            answer4: a4,
            isCorrectAnswers: isCorrectAnswers
        };        
    
        try {
            const response = await createQuestion(body);
            alert(response.data.message);
        } catch (error: any) {
            alert(error.response.data.message);
        }
    
        window.location.reload();
    };
    

    const handleAddQuiz = async (id: any) => {

        const body = {
            courseId: id,
            name: "Quiz",
            activeStatus: 1,
            description: ""
        }

        try {
            const response = await createQuiz(body)
            handleCheckQuiz(id)
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    }

    const handleCheckQuiz = async (id: any) => {
        try {
            const response = await getQuiz(id)
            if (response.data.length === 0) {
                handleAddQuiz(id)
            } else {
                setQuizId(response.data[0].id)
            }
        } catch (error) {
            console.error(error);
        }
    }

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
                                    handleCheckQuiz(Number(e.target.value))
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
                    <Grid item xs={12} sm={12}>
                        <TextField
                            label="Question"
                            fullWidth
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Answer 1"
                            fullWidth
                            value={a1}
                            onChange={(e) => setA1(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Answer 2"
                            fullWidth
                            value={a2}
                            onChange={(e) => setA2(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Answer 3"
                            fullWidth
                            value={a3}
                            onChange={(e) => setA3(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Answer 4"
                            fullWidth
                            value={a4}
                            onChange={(e) => setA4(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Correct Answer</InputLabel>
                            <Select
                                value={correctAnswer}
                                onChange={(e) => setCorrectAnswer(Number(e.target.value))}
                                label="Correct Answer"
                            >
                                <MenuItem value={0}>Answer 1</MenuItem>
                                <MenuItem value={1}>Answer 2</MenuItem>
                                <MenuItem value={2}>Answer 3</MenuItem>
                                <MenuItem value={3}>Answer 4</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} display="flex" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Add />}
                            sx={{ textTransform: 'none' }}
                            onClick={handleSubmit}
                            disabled={!question || !a1 || !a2 || !a3 || !a4}
                        >
                            Add Question
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}
