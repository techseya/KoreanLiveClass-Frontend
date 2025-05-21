import "../../Common/styles/profile.css"
import userIcon from "../../Assets/Images/man.png"
import { useEffect, useState } from "react"
import { getUser } from "src/Services/user_api"
import { Email, LocationCity, LocationOn, Phone } from "@mui/icons-material"
import { useTranslation } from "react-i18next"
import { Box, Tab, Tabs } from "@mui/material"
import React from "react"
import Footer from "src/Layout/Footer"

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
    const token = sessionStorage.getItem("token")
    const id = sessionStorage.getItem("id")

    const { i18n, t } = useTranslation();
    const [user, setUser] = useState<any>()
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        handleGetDetails()
    }, [])

    const handleGetDetails = async () => {
        try {
            const response = await getUser(id, token)
            setUser(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="profile-outer">
            <div className="profile-inner">
                <div className="profile-container">
                    <div className="p-inner">
                        <div className="pi1">
                            <img className="userLogo" src={userIcon} alt="" />
                            <div className="username">
                                {user?.userName}
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
                                <button className="btn signup">{t('changeP')}</button>
                            </div>
                        </div>
                    </div>
                    <div className="p-inner1">
                        <Box sx={{ width: '95%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab label="My Courses List" {...a11yProps(0)} />
                                    <Tab label="Instructor Chat" {...a11yProps(1)} />
                                </Tabs>
                            </Box>
                            <CustomTabPanel value={value} index={0}>
                                <div className="courses-list">
                                    {user?.userCoursesList && user.userCoursesList.length > 0 ? (
                                        user.userCoursesList.map((course: any) => (
                                            <div key={course.id} className="course-item">
                                                {course.courseName}
                                            </div>
                                        ))
                                    ) : (
                                        <div>No Courses</div>
                                    )}
                                </div>
                            </CustomTabPanel>

                            <CustomTabPanel value={value} index={1}>

                            </CustomTabPanel>
                        </Box>
                    </div>
                </div>
            </div>

<br /><br />
            <Footer/>
        </div>
    )
}