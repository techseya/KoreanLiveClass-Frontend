import { useState } from "react";
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
import { createCategory } from "src/Services/category_api";

export default function CategoryForm() {
    const navigate = useNavigate();

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [status, setStatus] = useState("Active")
    const [thumbnail, setThumbnail] = useState<File | any>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

    const handleSubmit = async () => {

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description)
        formData.append("imageUrl", thumbnail);
        formData.append("activeStatus", status === "Active" ? "1" : "2");

        try {
            const response = await createCategory(formData)
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
                            disabled={!name || !status}
                        >
                            Add Category
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}
