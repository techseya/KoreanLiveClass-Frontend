import { useTranslation } from "react-i18next";
import "../../Common/styles/register.css";
import "../../Common/styles/user.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/system";
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { login } from "src/Services/auth_api";
import { register } from "src/Services/auth_api";

import { getCodeList } from "country-list";
import { getCountryCallingCode, CountryCode } from "libphonenumber-js";
import Footer from "src/Layout/Footer";
import React from "react";

type CountryOption = {
    code: string;
    name: string;
    callingCode: string;
};

// Filter countries that have a valid calling code
const countryOptions: CountryOption[] = Object.entries(getCodeList())
    .map(([code, name]) => {
        try {
            const callingCode = getCountryCallingCode(code.toUpperCase() as CountryCode);
            return { code: code.toUpperCase(), name, callingCode };
        } catch (error) {
            return null; // Exclude invalid countries like AQ
        }
    })
    .filter((country) => country !== null) as CountryOption[];


export default function Register() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const defaultCountry = countryOptions.find(c => c.name === "Sri Lanka") || countryOptions[0];
    const [country, setCountry] = useState<CountryOption>(defaultCountry);

    const [userName, setUserName] = useState("");
    const [phoneNo, setPhoneNo] = useState(country.callingCode);
    const [email, setEmail] = useState("");
    const [duration, setDuration] = useState<any>("0");
    const [status, setStatus] = useState("Active");
    const [password, setPassword] = useState("");
    const [cpassword, setCPassword] = useState("");
    const [promoCode, setPromoCode] = useState("");

    const [deviceId, setDeviceId] = React.useState("")

    const handleLogin = async () => {
        const body = {
            email,
            password,
            deviceId
        }

        try {
            const response = await login(body)
            if (response.data.token !== null) {
                localStorage.setItem("token", response.data.token)
                localStorage.setItem("id", response.data.id)
                if (response.data.type === "Admin") {
                    navigate("/dashboard")
                } else {
                    alert("Login Success")
                }

            }
        } catch (error: any) {
            if (error.response.data.message === "Login not allowed from this device.") {
                alert(error.response.data.message + " Please try again in different tab.")
            } else {
                alert(error.response.data.message)
            }
        }

        window.location.reload()
    }

    const getDeviceId = async () => {
        const fp = await FingerprintJS.load();

        let attempts = 0;
        let stableId = '';

        while (attempts < 3) {
            const result = await fp.get();
            const id = result.visitorId;

            console.log(`Attempt ${attempts + 1}: ${id}`);

            // If this is not the first attempt and ID matches previous, consider it stable
            if (stableId && id === stableId) {
                break;
            }

            stableId = id;
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 300)); // wait a bit between attempts
        }

        setDeviceId(stableId)

    };

    useEffect(() => {
        setPhoneNo(country.callingCode); // Reset phone on country change
        getDeviceId()
    }, [country]);

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

        if (password !== cpassword) {
            alert("Password and Confirm Password is mismatched.");
            return;
        }

        const body = {
            userName,
            password,
            email,
            location: country.name,
            phoneNo,
            isHalfPayment: false,
            duration: Number(duration),
            activeStatus: 1,
            promoCode
        };

        try {
            const response = await register(body);
            if (response.data.message === "Registration completed") {
                alert("Registration completed");
                handleLogin()
            }
        } catch (error: any) {
            alert(error.response?.data?.message || "Registration failed.");
        }
    };

    return (
        <div className="register-outer">
            <div className="courses-header" style={{ textAlign: "center", marginBottom: "1rem" }}>
                <div className="bg"></div>
                <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", zIndex: 10 }}>{t("SignUp")}</h1>
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
                            <TextField
                                label="Email"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
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
                            <FormControl fullWidth>
                                <InputLabel>Country</InputLabel>
                                <Select
                                    value={country.name}
                                    onChange={(e) => {
                                        const selected = countryOptions.find(c => c.name === e.target.value);
                                        if (selected) setCountry(selected);
                                    }}
                                    label="Country"
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
                                    const value = e.target.value.replace(/\D/g, '');
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
                                label="Promo Code"
                                fullWidth
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} display="flex" justifyContent="flex-end">
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ textTransform: 'none' }}
                                onClick={handleSubmit}
                                disabled={!userName || !email || !phoneNo || !country || !duration || !password || !cpassword}
                            >
                                Register
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </div>
            <Footer />
        </div>
    );
}
