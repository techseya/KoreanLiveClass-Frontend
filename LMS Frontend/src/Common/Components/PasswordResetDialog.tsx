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

interface LoginDialogboxProps {
    open: boolean;
    onAgree: () => void;
    onClose: () => void;
}

export default function PwDialogbox({ open, onAgree, onClose }: LoginDialogboxProps) {
    const { t, i18n } = useTranslation();
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
                        {t("reset")}
                    </Typography>

                    {/* Input Fields */}
                    <TextField
                        margin="normal"
                        fullWidth
                        placeholder={t("username")}
                        variant="outlined"
                        type="text"
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        placeholder={t("newPw")}
                        variant="outlined"
                        type="password"
                    />
                    
                    <TextField
                        margin="normal"
                        fullWidth
                        placeholder={t("confirmPw")}
                        variant="outlined"
                        type="password"
                    />

                    {/* Login Button */}
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={onAgree}
                    >
                        {t("resetBtn")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
