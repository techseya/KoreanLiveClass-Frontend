import { useState, useEffect } from "react";
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

import { getCodeList } from "country-list";
import { getCountryCallingCode, CountryCode } from "libphonenumber-js";

type CountryOption = {
    code: string;
    name: string;
    callingCode: string;
};

const countryOptions: CountryOption[] = Object.entries(getCodeList()).map(([code, name]) => {
    try {
        const callingCode = getCountryCallingCode(code.toUpperCase() as CountryCode);
        return {
            code: code.toUpperCase(), // Ensure ISO code is uppercase
            name,
            callingCode: callingCode || "", // Fallback for unknown country codes
        };
    } catch (e) {
        // Catch errors for unsupported countries like "AQ" and skip them
        return null;
    }
}).filter((option) => option !== null) as CountryOption[];

export default function UserForm() {
    const navigate = useNavigate();

    const [userName, setUserName] = useState("");
    const [location, setLocation] = useState("Sri Lanka");
    const [phoneNo, setPhoneNo] = useState<any>("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState<any>("");
    const [status, setStatus] = useState("Active");
    const [country, setCountry] = useState<CountryOption>(countryOptions[0]);

    useEffect(() => {
        const defaultCountry = countryOptions.find(c => c.name === "Sri Lanka") || countryOptions[0];
        setLocation(defaultCountry.name);
        setCountry(defaultCountry);
        setPhoneNo(defaultCountry.callingCode);
    }, []);

    const handleSubmit = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (phoneNo.length < 10 || phoneNo.length > 15) {
            alert("Phone number must be 10 to 15 digits long (including country code).");
            return;
        }

        const body = {
            userName: userName,
            password: password,
            email: email,
            location: location,
            phoneNo: phoneNo,
            isHalfPayment: false,
            duration: 0,
            activeStatus: status === "Active" ? 1 : 2
        }

        try {
            const response = await register(body)
            if (response.data.message === "Registration completed") {
                alert("Registration completed");
            }
        } catch (error: any) {
            alert(error.response?.data?.message || "Registration failed.");
        }

        window.location.reload();
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
                        <TextField
                            label="Email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Location</InputLabel>
                            <Select
                                value={location}
                                onChange={(e) => {
                                    const selectedCountry = countryOptions.find(c => c.name === e.target.value);
                                    if (selectedCountry) {
                                        setLocation(selectedCountry.name);
                                        setCountry(selectedCountry);
                                        setPhoneNo(selectedCountry.callingCode);
                                    }
                                }}
                                label="Location"
                            >
                                {countryOptions.map((c) => (
                                    <MenuItem key={c.code} value={c.name}>
                                        {c.name} (+{c.callingCode})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Phone No"
                            fullWidth
                            value={phoneNo}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                                if (!value.startsWith(country.callingCode)) {
                                    setPhoneNo(country.callingCode + value.slice(country.callingCode.length));
                                } else {
                                    setPhoneNo(value);
                                }
                            }}
                            inputProps={{ inputMode: 'numeric' }}
                            placeholder={`+${country.callingCode} XXXXXXXX`}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Password"
                            fullWidth
                            type="text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            disabled={!userName || !email || !status || !phoneNo || !location || !password}
                        >
                            Add User
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}
