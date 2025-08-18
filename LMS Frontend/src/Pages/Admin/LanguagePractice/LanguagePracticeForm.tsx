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
import { createLanguagePractice } from "src/Services/lang_practice_api";

export default function LanguagePracticeForm() {

    const [name, setName] = useState("")
    const [status, setStatus] = useState("Active")
    const [description, setDescription] = useState("")
    const [difficultyLevel, setDifficultyLevel] = useState(1); //Easy 1, Medium 2, Hard 3
    const [isPaid, setIsPaid] = useState(false);
    const [price, setPrice] = useState("");

    const token = localStorage.getItem("token") || "";

    useEffect(() => {
    }, [])

    const handleSubmit = async () => {
        const body = {
            name,
            description,
            difficultyLevel,
            activeStatus: status === "Active" ? 1 : 2,
            isPaid: isPaid,
            price: isPaid ? Number(price) : 0, // default 0 if not paid
        }

        try {
            const response = await createLanguagePractice(body, token)
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
                            <InputLabel>Difficulty Level</InputLabel>
                            <Select
                                value={difficultyLevel}
                                label="Difficulty Level"
                                onChange={(e) => setDifficultyLevel(Number(e.target.value))}
                            >
                                <MenuItem value={1}>Easy</MenuItem>
                                <MenuItem value={2}>Medium</MenuItem>
                                <MenuItem value={3}>Hard</MenuItem>
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
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Is Paid</InputLabel>
                            <Select
                                value={isPaid ? "Yes" : "No"}
                                label="Is Paid"
                                onChange={(e) => setIsPaid(e.target.value === "Yes")}
                            >
                                <MenuItem value="No">No</MenuItem>
                                <MenuItem value="Yes">Yes</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {isPaid && (
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Price"
                                fullWidth
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
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
                            disabled={!name || !description || !difficultyLevel || !status || (isPaid && !price)}
                        >
                            Add
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}
