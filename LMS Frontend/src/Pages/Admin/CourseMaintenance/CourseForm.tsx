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
import { createCourse } from "src/Services/course_api";

export default function CourseForm() {
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

    useEffect(() => {
        handleGetCategories()
    }, [])

    const handleGetCategories = async () => {
        try {
            const response = await getCategories()
            setCategories(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = async () => {

        const body = {
            name: name,
            description: description,
            price: price === "" ? 0 : price,
            transactionStatus: type,
            categoryId: categoryId,
            level: level,
            thumbnail: thumbnail,
            activeStatus: status === "Active" ? 1 : 2
        }

        try {
            const response = await createCourse(body)
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
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Name"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Price"
                            fullWidth
                            value={price}
                            onChange={(e) => {
                                const value = e.target.value;
                                // Allow only digits and disallow leading zero
                                if (/^\d*$/.test(value)) {
                                    if (value === '' || value[0] !== '0') {
                                        setPrice(value)
                                    }
                                }
                            }}
                            inputProps={{ inputMode: 'numeric' }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Level</InputLabel>
                            <Select
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                                label="Status"
                            >
                                <MenuItem value="Beginner">Beginner</MenuItem>
                                <MenuItem value="Advanced">Advanced</MenuItem>
                                <MenuItem value="Intermediate">Intermediate</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={type}
                                onChange={(e) => setType(Number(e.target.value))}
                                label="Status"
                            >
                                <MenuItem value={1}>Paid</MenuItem>
                                <MenuItem value={2}>Free</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={categoryId}
                                label="Category"
                                onChange={(e) => setCategoryId(Number(e.target.value))}
                                fullWidth
                            >
                                {categories?.map((c: any, index) => (
                                    <MenuItem key={index} value={c.id}>
                                        {c.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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

                    <Grid item xs={12} sm={12}>
                        <TextField
                            label="Thumbnail"
                            fullWidth
                            value={thumbnail}
                            onChange={(e) => setThumbnail(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <img style={{ width: "80%", border: '1px solid black', borderRadius: "8px" }} src={thumbnail} alt="" />
                    </Grid>

                    <Grid item xs={12} display="flex" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Add />}
                            sx={{ textTransform: 'none' }}
                            onClick={handleSubmit}
                            disabled={!name || !status || !type || !thumbnail}
                        >
                            Add Course
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}
