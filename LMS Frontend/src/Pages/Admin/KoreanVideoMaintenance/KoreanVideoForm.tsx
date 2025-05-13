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
import { createVideo } from "src/Services/videos_api";

export default function KoreanVideoForm() {
    const navigate = useNavigate();

    const [link, setLink] = useState("")
    const [type, setType] = useState("YouTube")
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
            link: link,
            type: type
        }

        try {
            const response = await createVideo(body)
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
                            label="Video Url"
                            fullWidth
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                label="Status"
                            >
                                <MenuItem value="YouTube">YouTube</MenuItem>
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
                            disabled={!link || !type}
                        >
                            Add Video
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}
