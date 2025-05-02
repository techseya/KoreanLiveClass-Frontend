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

export default function UserForm() {
    const navigate = useNavigate();

    const [userName, setUserName] = useState("")
    const [location, setLocation] = useState("Sri Lanka")
    const [phoneNo, setPhoneNo] = useState<any>("")
    const [email, setEmail] = useState("")
    const [duration, setDuration] = useState<any>("")
    const [status, setStatus] = useState("Active")

    const handleSubmit = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (phoneNo.length !== 11 && phoneNo.length !== 12) {
            alert("Phone number must be 11 or 12 digits long.");
            return;
        }
    };

    return (
        <div className="user-form-outer">
            <Box component="form" noValidate autoComplete="off" sx={{ p: 2, width: "100%" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Username"
                            fullWidth
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Location</InputLabel>
                            <Select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                label="Location"
                            >
                                <MenuItem value="Sri Lanka">Sri Lanka</MenuItem>
                                <MenuItem value="South Korea">South Korea</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Phone No"
                            fullWidth
                            value={phoneNo}
                            placeholder="947X XXX XXXX"
                            onChange={(e) => {
                                const value = e.target.value;
                                // Allow only digits and disallow leading zero
                                if (/^\d*$/.test(value)) {
                                    if (value === '' || value[0] !== '0') {
                                        setPhoneNo(value);
                                    }
                                }
                            }}
                            inputProps={{ inputMode: 'numeric' }}
                        />


                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Duration (Hours)"
                            fullWidth
                            value={duration}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    if (value === '' || value[0] !== '0') {
                                        setDuration(value);
                                    }
                                }
                            }}
                            inputProps={{ inputMode: 'numeric' }}
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

                    <Grid item xs={12} display="flex" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Add />}
                            sx={{ textTransform: 'none' }}
                            onClick={handleSubmit}
                            disabled={!userName || !email || !status || !phoneNo || !location || !duration}
                        >
                            Add User
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}
