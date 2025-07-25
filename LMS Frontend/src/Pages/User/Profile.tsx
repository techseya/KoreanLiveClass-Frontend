import "../../Common/styles/profile.css"
import userIcon from "../../Assets/Images/man.png"
import { useEffect, useState } from "react"
import { changePassword, getUser, getWallet, resetPassword } from "src/Services/user_api"
import { AccountBalanceTwoTone, AccountBalanceWalletTwoTone, Email, LocationCity, LocationOn, NotificationImportant, Phone, Wallet } from "@mui/icons-material"
import { useTranslation } from "react-i18next"
import { Box, Button, Modal, Tab, Tabs, TextField, Typography } from "@mui/material"
import React from "react"
import Footer from "src/Layout/Footer"
import { useNavigate } from "react-router-dom"
import trophy from "../../Assets/Images/trophy-p.png"
import UserChat from "./UserChat"
import { BellFilled, BellOutlined, NotificationFilled } from "@ant-design/icons"
import { getAllNotices } from "src/Services/notice_api"

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function Profile() {
    const token = localStorage.getItem("token")
    const id = localStorage.getItem("id")

    const { i18n, t } = useTranslation();
    const [user, setUser] = useState<any>()
    const [value, setValue] = React.useState(0);
    const [openModal, setOpenModal] = useState(false)
    const [email, setEmail] = useState("")
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [notice, setNotice] = useState<any[]>([])
    const [noticeModal, setNoticeModal] = useState(false)
    const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});
    const [wallet, setWallet] = useState<any>(null)

    const handleImageError = (id: string | number) => {
        setImageErrors(prev => ({ ...prev, [id]: true }));
    };


    const handleGetNotices = async () => {
        try {
            const response = await getAllNotices("")
            setNotice(response.data)
        } catch (error) {
            setNotice([])
            console.error(error);
        }
    }

    const handleGetWallet = async (email: any) => {
        try {
            const response = await getWallet(email, token)
            setWallet(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    const handleOpen = () => {
        setEmail(user?.email || "")
        setOpenModal(true)
    }
    const handleClose = () => {
        setOldPassword("")
        setNewPassword("")
        setError("")
        setOpenModal(false)
    }

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword) {
            setError("All fields are required.")
            return
        }

        const body = {
            email,
            oldPassword,
            newPassword
        }

        try {
            setLoading(true)
            const response = await changePassword(body, token)
            alert(response.data.message)
        } catch (err: any) {
            if (err.response.data.message === "Invalid credentials") {
                alert("Incorrect Password")
            }
        } finally {
            setLoading(false)
        }

        setOpenModal(false)
    }


    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const navigate = useNavigate()

    useEffect(() => {
        if (token === null) {
            navigate("/")
        }
        handleGetDetails()
        handleGetNotices()
    }, [])

    const handleGetDetails = async () => {
        try {
            const response = await getUser(id, token)
            setUser(response.data)
            handleGetWallet(response.data.email)
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="profile-outer">

            <Modal
                open={noticeModal}
                onClose={(e) => setNoticeModal(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxHeight: '75vh',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    overflowY: "auto"
                }}>
                    <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
                        Notices
                    </Typography>
                    {notice.slice(0, 5).map((item) => (
                        <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            {imageErrors[item.id] || !item.thumbnailUrl ? (
                                <NotificationFilled style={{ fontSize: 30, color: '#1976d2', marginRight: 30 }} />
                            ) : (
                                <img
                                    src={item.thumbnailUrl.replace("dl=0", "raw=1")}
                                    alt={item.title}
                                    style={{ width: 50, height: 50, objectFit: 'contain', marginRight: 10 }}
                                    onError={() => handleImageError(item.id)}
                                />
                            )}
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {item.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.notification}
                                </Typography>
                            </Box>
                        </Box>
                    ))}


                </Box>
            </Modal>

            <Modal
                open={openModal}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 350,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2
                }}>
                    <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
                        Change Password
                    </Typography>
                    <TextField
                        label="Email"
                        value={email}
                        fullWidth
                        disabled
                        margin="normal"
                    />
                    <TextField
                        label="Old Password"
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    {error && (
                        <Typography variant="body2" color="error" mt={1}>
                            {error}
                        </Typography>
                    )}
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleChangePassword}
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        {loading ? "Changing..." : "Change Password"}
                    </Button>
                </Box>
            </Modal>

            <div className="profile-inner">
                <div className="profile-container">
                    <div className="p-inner">
                        <div className="pi1">
                            <img className="userLogo" src={userIcon} alt="" />
                            <div className="username1">
                               <strong>{user?.userName}</strong>
                            </div>
                            <div style={{width: "100%" , display: "flex", justifyContent: "center", alignItems: "center"}}>
                                <div className="promo-code-label">
                                   <strong className="promo">Promo Code : {wallet?.promoCode || "N/A"}</strong>
                                </div>
                            </div>

                            <div style={{width: "100%" , display: "flex", justifyContent: "center", alignItems: "center", margin: "10px 0"}}>
                                <AccountBalanceWalletTwoTone style={{marginRight: "5px"}}/> {wallet?.points || 0} <strong style={{marginLeft: "5px"}}> Points</strong>
                            </div>

                            <div className="i-outer">
                                <Email />
                                <div className="txt0">
                                    {user?.email}
                                </div>
                            </div>
                            <div className="i-outer">
                                <Phone />
                                <div className="txt0">
                                    {user?.phoneNo}
                                </div>
                            </div>
                            <div className="i-outer">
                                <LocationOn />
                                <div className="txt0">
                                    {user?.location}
                                </div>
                            </div>
                            <br />

                            <div className="i-outer">
                                <BellFilled onClick={(e) => setNoticeModal(true)} style={{ cursor: "pointer" }} />
                                <button className="btn signup" onClick={handleOpen}>
                                    {t('changeP')}
                                </button>

                            </div>
                        </div>
                    </div>
                    <div className="line"></div>
                    <div className="p-inner1">
                        <Box sx={{ width: '95%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab label={t("myCourses")} {...a11yProps(0)} />
                                    <Tab label={t("chat")} {...a11yProps(1)} />
                                </Tabs>
                            </Box>

                            <CustomTabPanel value={value} index={0}>
                                <div className="courses-list">
                                    {user?.userCoursesList && user.userCoursesList.length > 0 ? (
                                        user.userCoursesList.map((course: any) => (
                                            <div key={course.id} className="course-item">
                                                <img className="trophy-p" src={trophy} alt="" />
                                                {course.courseName}
                                            </div>
                                        ))
                                    ) : (
                                        <div>No Courses</div>
                                    )}
                                </div>
                            </CustomTabPanel>

                            <CustomTabPanel value={value} index={1}>
                                <UserChat />
                            </CustomTabPanel>
                        </Box>
                    </div>
                </div>
            </div>

            <br /><br />
            <Footer />
        </div>
    )
}