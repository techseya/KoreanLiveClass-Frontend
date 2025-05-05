import { useTranslation } from "react-i18next";
import "../../Common/styles/register.css"
import "../../Common/styles/user.css"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/system";
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import { register } from "src/Services/auth_api";

export default function Register() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const [userName, setUserName] = useState("")
    const [location, setLocation] = useState("Sri Lanka")
    const [phoneNo, setPhoneNo] = useState<any>("")
    const [email, setEmail] = useState("")
    const [duration, setDuration] = useState<any>("0")
    const [status, setStatus] = useState("Active")
    const [password, setPassword] = useState("")
    const [cpassword, setCPassword] = useState("")

    const handleSubmit = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (phoneNo.length !== 11 && phoneNo.length !== 12) {
            alert("Phone number must be 11 or 12 digits long.");
            return;
        }

        if (password !== cpassword){
            alert("Password and Confirm Password is Mismatched")
            return
        }

        const body = {
            userName: userName,
            password: password,
            email: email,
            location: location,
            phoneNo: phoneNo,
            duration: Number(duration),
            activeStatus: status === "Active" ? 1 : 2
        }

        try {
            const response = await register(body)
            if(response.data.message === "Registration completed"){
                alert("Registration completed")
            }      
        } catch (error:any) {
            alert(error.response.data.message);            
        }

        window.location.reload()
    };

    return (
        <div className="register-outer">
            <div className="courses-header" style={{ textAlign: "center", marginBottom: "1rem" }}>
            <div className="bg"></div>
                <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{t("SignUp")}</h1>
            </div>
            <div className="user-form-outer1">
                <Box component="form" noValidate autoComplete="off" sx={{ p: 2, width: "95%" }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Full Name"
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
                                label="Password"
                                fullWidth
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Confirm Password"
                                fullWidth
                                type="password"
                                value={cpassword}
                                onChange={(e) => setCPassword(e.target.value)}
                            />
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
                                disabled={!userName || !email || !status || !phoneNo || !location || !duration || !password || !cpassword}
                            >
                                Add User
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        </div>
    )
}