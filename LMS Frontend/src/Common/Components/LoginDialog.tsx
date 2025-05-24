import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "../styles/dialogbox.css";
import logo from "../../Assets/Images/logo-light.png"
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { login } from "src/Services/auth_api";
import { initChat } from "src/Services/SignalR/chat_api";

interface LoginDialogboxProps {
    open: boolean;
    onAgree: () => void;
    onClose: () => void;
}

export default function LoginDialogbox({ open, onAgree, onClose }: LoginDialogboxProps) {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate()

    React.useEffect(() => {
        getDeviceId()
    }, [])

    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [deviceId, setDeviceId] = React.useState("")

    const id = sessionStorage.getItem("id")

    const handleLogin = async () => {
        const body = {
            email,
            password,
            deviceId
        }

        try {
            const response = await login(body)
            if (response.data.token !== null) {
                sessionStorage.setItem("token", response.data.token)
                sessionStorage.setItem("id", response.data.id)
                if (response.data.type === "Admin") {
                    navigate("/dashboard")
                } else {
                    sessionStorage.setItem("deviceId", deviceId)
                    // handleInitChat()
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

    const handleInitChat = async () => {
        const body = {
            threadId: "00000000-0000-0000-0000-000000000000",
            userId: id,
            instructorId: 1,
            senderRole: 1,
            messageText: "init"
        };

        try {
            const res = await initChat(body);
            const actualThreadId = res.data?.data?.threadId;
            sessionStorage.setItem("threadId", actualThreadId);
        } catch (err) {
            console.error("Failed to initialize chat", err);
        }
    };

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

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <div className="login-dialog-header">
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: "#aaa",
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </div>

            <DialogContent>
                <div className="login-dialog-content">
                    {/* Logo */}
                    <img
                        src={logo} // Replace with your actual logo path
                        alt="Logo"
                        className="login-dialog-logo"
                    />

                    {/* Title */}
                    <Typography variant="h5" align="center" gutterBottom>
                        {t("login")}
                    </Typography>

                    {/* Input Fields */}
                    <TextField
                        margin="normal"
                        fullWidth
                        placeholder="Email"
                        variant="outlined"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        placeholder="Password"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {/* Login Button */}
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={handleLogin}
                    >
                        {t("SignIn")}
                    </Button>

                    {/* Signup Button */}
                    <Button
                        variant="text"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => {
                            onClose(); // close dialog
                            navigate("/register"); // then navigate
                        }}
                    >
                        {t("register")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
