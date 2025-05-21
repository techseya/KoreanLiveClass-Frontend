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
import { register } from "src/Services/auth_api";
import { createCategory, getCategories } from "src/Services/category_api";
import { createCourse, getAllCourses } from "src/Services/course_api";
import { createSection } from "src/Services/section_api";

export default function SectionForm() {
    const navigate = useNavigate();

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [level, setLevel] = useState("Beginner")
    const [type, setType] = useState(1)
    const [thumbnail, setThumbnail] = useState("")
    const [status, setStatus] = useState("Active")
    const [categoryId, setCategoryId] = useState(1)
    const [categories, setCategories] = useState<any[]>([]);

    const [courseId, setCourseId] = useState(1)
    const [courses, setCourses] = useState<any[]>([]);

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

        const body = {
            name: name,
            description: description,
            dateTime: "",
            totalLength: "",
            courseId,
            activeStatus: status === "Active" ? 1 : 2
        }

        try {
            const response = await createSection(body)
            alert(response.data.message)
        } catch (error: any) {
            alert(error.response.data.message);
        }

        window.location.reload()
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
                                label="Category"
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
                            label="Name"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                    </Grid>

                    <Grid item xs={12} display="flex" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Add />}
                            sx={{ textTransform: 'none' }}
                            onClick={handleSubmit}
                            disabled={!name || !status}
                        >
                            Add Section
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}
