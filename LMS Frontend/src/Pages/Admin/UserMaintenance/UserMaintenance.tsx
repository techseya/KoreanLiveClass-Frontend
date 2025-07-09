import {
    Paper, IconButton, Box, Chip, Typography,
    TextField, Grid, FormControl, InputLabel, Select, MenuItem, Button, Modal,
    Checkbox, FormControlLabel,
    Dialog
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { Delete, FilterList, LockReset, PhonelinkErase, Send } from "@mui/icons-material";
import Dialogbox from "src/Common/Components/DialogBox";
import { assignCourse, deleteUser, getAlertUsers, getUsers, resetDevice, resetPassword, updateUser } from "src/Services/user_api";
import { getAllCourses, getSectionByCourseId, getUsersByCourseId } from "src/Services/course_api";
import { getCodeList } from "country-list";
import { getCountryCallingCode, CountryCode } from "libphonenumber-js";
import { CopyOutlined, EyeOutlined } from "@ant-design/icons";
import { log } from "util";
import React from "react";
import { getQuiz } from "src/Services/quiz_api";

type CountryOption = {
    code: string;
    name: string;
    callingCode: string;
};

const countryOptions: CountryOption[] = Object.entries(getCodeList()).map(([code, name]) => {
    try {
        const callingCode = getCountryCallingCode(code.toUpperCase() as CountryCode);
        return {
            code: code.toUpperCase(),
            name,
            callingCode: callingCode || "",
        };
    } catch (e) {
        return null;
    }
}).filter((option) => option !== null) as CountryOption[];

function CustomNoRowsOverlay() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: 2 }}>
            <Typography variant="h6" color="text.secondary">No Users Found</Typography>
        </Box>
    );
}

export default function UserMaintenance() {
    const [visible, setVisible] = useState(false);
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [courseModalOpen, setCourseModalOpen] = useState(false);
    const [courseModalOpen2, setCourseModalOpen2] = useState(false);
    const [courseModalOpen3, setCourseModalOpen3] = useState(false);
    const [sectionModalOpen, setSectionModalOpen] = useState(false);
    const [quizModalOpen, setQuizModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any | null>(null);
    const [changePwDialog, setChangePwDialog] = useState(false)
    const [changeDeviceDialog, setChangeDeviceDialog] = useState(false)
    const [deleteUserDialog, setDeleteUserDialog] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [country, setCountry] = useState<CountryOption>(countryOptions[0]);
    const [allCourses, setAllCourses] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [quizes, setQuizes] = useState<any[]>([]);
    const [location1, setLocation1] = useState("Sri Lanka");
    const [phoneNo, setPhoneNo] = useState<any>("");
    const [selectedCourseId, setSelectedCourseId] = useState<any>(null);
    const [selectedCourseName, setSelectedCourseName] = useState<any>();
    const [sectionIds, setSectionIds] = useState<any[]>([]);
    const [quizIds, setQuizIds] = useState<any[]>([])
    const [viewCourseModal, setViewCourseModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [courseId, setCourseId] = useState(0)
    const [users, setUsers] = useState<any[]>([]);
    const [alertUsers, setAlertUsers] = useState<any[]>([]);
    const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);


    const token = localStorage.getItem("token")

    const handleGetUsers = async () => {
        try {
            const response = await getUsers(token)
            setRows(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (!editingUser) return;

        const defaultCountry = countryOptions.find(c => c.name === editingUser.location) || countryOptions[0];
        setLocation1(editingUser.location);
        setCountry(defaultCountry);
        setPhoneNo(defaultCountry.callingCode);
    }, [editingUser]);


    useEffect(() => {
        handleGetUsers()
        handleGetCourses()
    }, [])

    const handleGetCourses = async () => {
        try {
            const res = await getAllCourses()
            setAllCourses(res.data)
        } catch (error) {
            console.error(error);
        }
    }

    const handleAlertUsers = async () => {
        try {
            const res = await getAlertUsers(token);
            setAlertUsers(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    const [rows, setRows] = useState<any[]>([]);

    const handleCancelChangePwDialog = () => {
        setChangePwDialog(false)
    }

    const handleCancelChangeDeviceDialog = () => {
        setChangeDeviceDialog(false)
    }

    const handleUserDeleteDialog = () => {
        setDeleteUserDialog(false)
    }

    const handleEditClick = (user: any) => {
        user.isHalfPayment = user.isHalfPayment ? "true" : "false";
        setEditingUser(user);
        setVisible(true);
    };

    const handleDeleteClick = (user: any) => {
        setEditingUser(user);
        setSelectedUserId(user.id);
        setDeleteUserDialog(true);
    };

    const handleViewClick = (user: any) => {
        setEditingUser(user)
        setViewCourseModal(true)
    }

    const handleCancel = () => {
        setVisible(false);
    };

    const handleFormChange = (field: any, value: string) => {
        setEditingUser((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleUpdate = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(editingUser?.email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (editingUser.phoneNo.length < 10 || editingUser.phoneNo.length > 15) {
            alert("Phone number must be 10 to 15 digits long (including country code).");
            return;
        }

        const selectedSectionIds = editingUser.sections ? editingUser.sections.map((s: any) => s.id) : [];

        const payload = {
            id: editingUser.id,
            userName: editingUser.userName,
            email: editingUser.email,
            location: editingUser.location,
            phoneNo: editingUser.phoneNo,
            duration: editingUser.duration || 0,
            isHalfPayment: editingUser.isHalfPayment === "true" ? true : false,
            activeStatus: editingUser.status,
            userCourses: editingUser.courses.map((c: any) => ({
                courseId: c.id,
                courseName: c.name,
                courseDuration: c.duration || 0
            })),
        };

        console.log(payload);

        try {
            const response = await updateUser(payload, token);
            alert(response.data.message);
        } catch (error: any) {
            alert(error.response.message);
        }
        setRows((prevRows) =>
            prevRows.map((row) => (row.id === editingUser.id ? editingUser : row))
        );

        setEditingUser(null);
        setVisible(false);

        window.location.reload();
    };

    const handleChangePassword = async () => {
        if (!selectedUserId) return;

        const firstName = selectedUser?.split(" ")[0] || "User";
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        const newPassword = `${firstName}${randomDigits}`;

        const body = {
            userId: selectedUserId,
            newPassword: newPassword
        };

        try {
            const res = await resetPassword(body, token);
            setGeneratedPassword(newPassword);
            setShowPasswordDialog(true);
        } catch (error: any) {
            alert(error.response?.message || "Error resetting password");
        }

        setChangePwDialog(false);
    };

    const handleResetDevice = async () => {

        if (!selectedUserId) return;

        const body = {
            userId: selectedUserId
        };

        try {
            const res = await resetDevice(body, token)
            alert(res.data.message)
        } catch (error: any) {
            alert(error.response.message)
        }

        setChangeDeviceDialog(false);
    };

    const handleDeleteUser = async () => {
        try {
            const res = await deleteUser(selectedUserId, token)
            alert(res.data.message)
        } catch (error: any) {
            alert(error.response.message)
        }

        window.location.reload();
    }

    const handleCourseChange = (course: any, checked: boolean) => {
        if (!editingUser) return;

        setEditingUser((prev: any) => {
            const updatedCourses = checked
                ? [...prev.courses, { id: course.id, name: course.name, duration: 1 }]
                : prev.courses.filter((c: any) => c.id !== course.id);

            return { ...prev, courses: updatedCourses };
        });
    };

    const handleGetSections = async (id: any) => {
        try {
            const response = await getSectionByCourseId(id)
            setSections(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    const handleGetQuizes = async (id: any) => {
        try {
            const response = await getQuiz(id)
            setQuizes(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    const handleAssignQuizes = async () => {

    }

    const handleAssignSections = async () => {
        const body = {
            courseId: selectedCourseId,
            userId: selectedUserId,
            sectionIds: sectionIds
        }

        try {
            const response = await assignCourse(body, token)
            alert(response.data.message)
        } catch (error: any) {
            alert(error.response.message)
        }

        window.location.reload()
    }

    const handleGetUsersByCourse = async (courseId: number) => {
        try {
            const res = await getUsersByCourseId(courseId);
            setUsers(res.data.userResponse);
        } catch (error) {
            console.error(error);
        }
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'userName', headerName: 'Username', flex: 1, minWidth: 130 },
        { field: 'phoneNo', headerName: 'Phone No', flex: 1, minWidth: 130 },
        { field: 'location', headerName: 'Location', flex: 1, minWidth: 130 },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            minWidth: 100,
            renderCell: (params) => {
                const value = params.value;
                let color: 'success' | 'error' | 'info' = 'info';
                if (value === 1) color = 'success';
                else if (value === 2) color = 'error';
                return <Chip label={value === 1 ? "Active" : "Inactive"} color={color} size="small" style={{ width: '70px', opacity: '0.8' }} />;
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 220,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton sx={{ color: 'black' }} aria-label="edit" onClick={() => handleViewClick(params.row)}>
                        <EyeOutlined />
                    </IconButton>
                    <IconButton sx={{ color: 'black' }} aria-label="edit" onClick={() => handleEditClick(params.row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton sx={{ color: 'red' }} aria-label="edit" onClick={() => handleDeleteClick(params.row)}>
                        <Delete />
                    </IconButton>
                    <IconButton
                        sx={{ color: 'grey' }}
                        aria-label="reset password"
                        onClick={() => {
                            setSelectedUserId(params.row.id);
                            setSelectedUser(params.row.userName)
                            setChangePwDialog(true);
                        }}
                    >
                        <LockReset />
                    </IconButton>
                    <IconButton
                        sx={{ color: 'grey' }}
                        aria-label="reset device"
                        onClick={() => {
                            setSelectedUserId(params.row.id);
                            setChangeDeviceDialog(true);
                        }}
                    >
                        <PhonelinkErase />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <>
            <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)}>
                <Box p={3}>
                    <Typography variant="h6" gutterBottom>Password Reset Successful</Typography>
                    <Typography variant="body1">New Password:</Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mt: 1,
                            mb: 2,
                            p: 1,
                            border: '1px solid #ccc',
                            borderRadius: 1,
                        }}
                    >
                        <Typography variant="body1">{generatedPassword}</Typography>
                        <CopyOutlined
                            onClick={() => {
                                navigator.clipboard.writeText(generatedPassword || "");
                                setShowPasswordDialog(false)
                            }}
                            style={{
                                cursor: "pointer",
                                color: "#555",
                                transition: "color 0.2s ease",
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.color = "#1976d2")}
                            onMouseOut={(e) => (e.currentTarget.style.color = "#555")}
                        />

                    </Box>
                </Box>
            </Dialog>

            <Dialogbox
                open={changePwDialog}
                title="Password Reset Confirmation"
                content="Are you sure? Resetting the password will require the user to set a new one, and they may temporarily lose access until it’s updated."
                agreeButtonText="Yes, Reset"
                disagreeButtonText="No"
                onAgree={handleChangePassword}
                onDisagree={handleCancelChangePwDialog}
                onClose={handleCancelChangePwDialog}
            />

            <Dialogbox
                open={changeDeviceDialog}
                title="Device Reset Confirmation"
                content="Are you sure? Resetting the device will remove its current authentication, and the user will need to re-authenticate the device before accessing their account."
                agreeButtonText="Yes, Reset"
                disagreeButtonText="No"
                onAgree={handleResetDevice}
                onDisagree={handleCancelChangeDeviceDialog}
                onClose={handleCancelChangeDeviceDialog}
            />

            <Dialogbox
                open={deleteUserDialog}
                title="Delete Confirmation"
                content="Are you sure you want to delete this user?"
                agreeButtonText="Yes, Delete"
                disagreeButtonText="No"
                onAgree={handleDeleteUser}
                onDisagree={handleUserDeleteDialog}
                onClose={handleUserDeleteDialog}
            />

            {!visible && (
                <Paper sx={{ height: 'auto', width: '100%', marginTop: 2, overflowX: 'auto' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
                        <div></div>
                        <Button
                            variant="contained"
                            startIcon={<FilterList />}
                            onClick={() => setFilterModalOpen(true)}
                        >
                            Filter
                        </Button>
                    </Box>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 50 } } }}
                        pageSizeOptions={[50]}
                        autoHeight
                        sx={{
                            border: 0,
                            minWidth: 600,
                            '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold', fontSize: '15px', fontFamily: 'Public Sans, sans-serif' },
                            '& .MuiDataGrid-cell': { fontSize: '14px', fontFamily: 'Public Sans, sans-serif' }
                        }}
                        slots={{ noRowsOverlay: CustomNoRowsOverlay }}
                    />
                </Paper>
            )}

            <Modal
                open={filterModalOpen}
                onClose={() => setFilterModalOpen(false)}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '40%',
                        maxHeight: '80vh',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        overflowY: 'auto',
                        borderRadius: '10px'
                    }}
                >
                    <Typography variant="h6" mb={2}>Filter Users By Course</Typography>
                    <Grid item xs={12} sm={12} mb={2}>
                        <FormControl fullWidth>
                            <InputLabel>Course</InputLabel>
                            <Select
                                value={courseId}
                                label="Course"
                                onChange={(e) => {
                                    setCourseId(Number(e.target.value))
                                    handleGetUsersByCourse(Number(e.target.value));
                                }}
                                fullWidth
                            >
                                <MenuItem disabled value={0}>Select a course</MenuItem>
                                {allCourses?.map((c: any, index) => (
                                    <MenuItem key={index} value={c.id}>
                                        {c.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12} mb={2}>
                        {users.length > 0 && (
                            users.map((user: any) => (
                                <Box key={user.id} display="flex" alignItems="center" justifyContent="space-between" bgcolor="#eef6ff" p="5px 10px" borderRadius="10px" mb={1}>
                                    <span>{user.name} ({user.email})</span>
                                </Box>
                            ))
                        )}
                    </Grid>

                    <Grid container spacing={1}>
                    </Grid>
                </Box>
            </Modal>

            {visible && (
                <>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Username"
                                fullWidth
                                value={editingUser?.userName || ''}
                                onChange={(e) => handleFormChange("userName", e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Email"
                                fullWidth
                                value={editingUser?.email || ''}
                                onChange={(e) => handleFormChange("email", e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Location</InputLabel>
                                <Select
                                    value={location1}
                                    onChange={(e) => {
                                        const selectedCountry = countryOptions.find(c => c.name === e.target.value);
                                        if (selectedCountry) {
                                            setLocation1(selectedCountry.name);
                                            setCountry(selectedCountry);
                                            setPhoneNo(selectedCountry.callingCode);
                                            handleFormChange("location", selectedCountry.name);
                                            handleFormChange("phoneNo", selectedCountry.callingCode);
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
                                value={editingUser?.phoneNo || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) {
                                        if (value === '' || value[0] !== '0') {
                                            handleFormChange("phoneNo", e.target.value)
                                        }
                                    }
                                }}
                                inputProps={{ inputMode: 'numeric' }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="is-paid-label">Is Paid</InputLabel>
                                <Select
                                    labelId="is-paid-label"
                                    value={editingUser?.isHalfPayment}
                                    label="Is Paid"
                                    onChange={(e) => handleFormChange("isHalfPayment", e.target.value)}
                                >
                                    <MenuItem value="false">Full Payment</MenuItem>
                                    <MenuItem value="true">Half Payment</MenuItem>
                                </Select>

                            </FormControl>
                        </Grid>

                        {editingUser?.isHalfPayment === "true" && (
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Duration (Months)"
                                    type="number"
                                    fullWidth
                                    inputProps={{ min: 0 }}
                                    value={editingUser?.duration ?? ""}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === "" || parseInt(value, 10) >= 0) {
                                            handleFormChange("duration", value);
                                        }
                                    }}
                                />
                            </Grid>
                        )}

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={editingUser?.status || ''}
                                    label="Status"
                                    onChange={(e) => handleFormChange("status", e.target.value)}
                                >
                                    <MenuItem value={1}>Active</MenuItem>
                                    <MenuItem value={2}>Inactive</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Button style={{ margin: "5px" }} variant="outlined" onClick={() => setCourseModalOpen(true)}>
                                Manage Courses
                            </Button>
                            <Button style={{ margin: "5px" }} variant="outlined" onClick={() => setCourseModalOpen2(true)}>
                                Assign Sections
                            </Button>
                            <Button style={{ margin: "5px" }} variant="outlined" onClick={() => setCourseModalOpen3(true)}>
                                Assign Quizes
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                        </Grid>

                        <Grid item xs={12} display="flex" justifyContent="flex-end">
                            <Button className="update-btn" variant="contained" onClick={handleCancel}>Cancel</Button>
                            <Button
                                disabled={!editingUser?.userName || !editingUser?.email || !editingUser?.phoneNo || !editingUser?.location || !editingUser?.status}
                                variant="contained" onClick={handleUpdate}>Update</Button>
                        </Grid>
                    </Grid>
                </>
            )}

            {/* Modal for course selection */}
            <Modal
                open={viewCourseModal}
                onClose={() => setViewCourseModal(false)}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '40%',
                        maxHeight: '80vh',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        overflowY: 'auto',
                        borderRadius: '10px'
                    }}
                >
                    <Typography variant="h6" mb={2}>Courses Purchased By {editingUser?.userName}</Typography>
                    <Grid item xs={12} sm={12} mb={2}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search course"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </Grid>

                    <Grid container spacing={1}>
                        {editingUser?.courses
                            .filter((course: any) =>
                                course.name.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((course: any) => (
                                <Grid item xs={12} sm={12} key={course.id}>
                                    <Box display="flex" alignItems="center">
                                        <span>{course.name}</span>
                                    </Box>
                                </Grid>
                            ))}
                    </Grid>
                </Box>
            </Modal>

            {/* Modal for course selection */}
            <Modal
                open={courseModalOpen}
                onClose={() => setCourseModalOpen(false)}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '40%',
                        maxHeight: '80vh',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        overflowY: 'auto',
                        borderRadius: '10px'
                    }}
                >
                    <Typography variant="h6" mb={2}>Assign Courses : {editingUser?.userName}</Typography>

                    <Grid container spacing={1}>
                        {allCourses
                            .filter(course => course.activeStatus === 1)
                            .map(course => {
                                const isChecked = editingUser?.courses?.some((c: any) => c.id === course.id) || false;

                                return (
                                    <React.Fragment key={course.id}>
                                        <Grid item xs={12} sm={9}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={isChecked}
                                                        onChange={(e) => handleCourseChange(course, e.target.checked)}
                                                    />
                                                }
                                                label={<span>{course.name}</span>}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <TextField
                                                label="Duration (months)"
                                                type="number"
                                                fullWidth
                                                size="small"
                                                disabled={!isChecked}
                                                value={
                                                    editingUser?.courses?.find((c: any) => c.id === course.id)?.duration ?? ''
                                                }
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value, 10);
                                                    if (val > 0 || e.target.value === '') {
                                                        setEditingUser((prev: any) => {
                                                            const updatedCourses = prev.courses.map((c: any) =>
                                                                c.id === course.id
                                                                    ? { ...c, duration: e.target.value === '' ? '' : val }
                                                                    : c
                                                            );
                                                            return { ...prev, courses: updatedCourses };
                                                        });
                                                    }
                                                }}
                                                inputProps={{ min: 1 }}
                                            />
                                        </Grid>
                                    </React.Fragment>
                                );
                            })}

                    </Grid>



                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button variant="contained" onClick={() => setCourseModalOpen(false)}>Done</Button>
                    </Box>
                </Box>
            </Modal>

            <Modal
                open={courseModalOpen2}
                onClose={() => setCourseModalOpen2(false)}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '50%',
                        maxHeight: '80vh',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        overflowY: 'auto',
                        borderRadius: '10px'
                    }}
                >
                    <Typography variant="h6" mb={2}>Assign Sections : {editingUser?.userName}</Typography>

                    <Grid container spacing={1}>
                        {editingUser?.courses.map((course: any) => (
                            <Grid item xs={12} key={course.id}>
                                <Box display="flex" alignItems="center" justifyContent="space-between" bgcolor="#eef6ff" p="5px 10px" borderRadius="10px">
                                    <span>{course.name}</span>
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            setSectionModalOpen(true);
                                            setSelectedCourseId(course.id);
                                            setSelectedUserId(editingUser?.id);
                                            setSelectedCourseName(course.name);
                                            handleGetSections(course.id);

                                            const matchedCourse = editingUser?.courses?.find(
                                                (c: any) => c.id === course.id
                                            );
                                            setSectionIds(matchedCourse?.sectionIds || []);
                                        }}
                                        sx={{ ml: 1 }}
                                    >
                                        <Send fontSize="small" color="primary" />
                                    </IconButton>
                                </Box>
                            </Grid>
                        ))}

                        {editingUser?.courses.length === 0 && (
                            <Grid item xs={12} sm={12}>No courses assign to this user. First you need to assign courses.</Grid>
                        )}
                    </Grid>

                </Box>
            </Modal>


            <Modal
                open={courseModalOpen3}
                onClose={() => setCourseModalOpen3(false)}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        height: '90vh',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '10px'
                    }}
                >
                    <Typography variant="h6" mb={2}>Assign Quizes : {editingUser?.userName}</Typography>

                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="course-select-label">Select Course</InputLabel>
                        <Select
                            labelId="course-select-label"
                            value={selectedCourseId || ""}
                            label="Select Course"
                            onChange={(e) => {
                                const selectedId = e.target.value;
                                const selectedCourse = allCourses.find((c: any) => c.id === selectedId);
                                if (!selectedCourse) return;

                                setSelectedCourseId(selectedId);
                                setSelectedUserId(editingUser?.id);
                                setSelectedCourseName(selectedCourse.name);
                                handleGetQuizes(selectedId);

                                const matchedCourse = editingUser?.courses?.find(
                                    (c: any) => c.id === selectedId
                                );
                                setQuizIds(matchedCourse?.quizIds || []);
                            }}
                        >
                            {allCourses?.map((course: any) => (
                                <MenuItem key={course.id} value={course.id}>
                                    {course.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box display="flex" flexWrap="wrap" gap="15px" alignItems="center" justifyContent="start" p="5px 10px" borderRadius="10px">
                        {selectedCourseId && (
                            <Grid container spacing={1} sx={{ mt: 2 }}>
                                {quizes
                                    .filter((quiz) => quiz.activeStatus === 1)
                                    .map((paper: any) => (
                                        <div key={paper.id} style={{ textAlign: "center", marginBottom: '10px', width: "250px", border: '1px solid #ccc', padding: '5px', borderRadius: '5px' }}>
                                            <img style={{width: "230px", height: "auto"}} src={paper.imageUrl.replace("dl=0", "raw=1")} alt="" />
                                            <div style={{width: "100%" ,textAlign: "center"}}>{paper.name}</div>
                                            {/* <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setQuizModalOpen(true);
                                                    setSelectedCourseId(course.id);
                                                    setSelectedUserId(editingUser?.id);
                                                    setSelectedCourseName(course.name);
                                                    handleGetQuizes(course.id);

                                                    const matchedCourse = editingUser?.courses?.find(
                                                        (c: any) => c.id === course.id
                                                    );
                                                    setQuizIds(matchedCourse?.quizIds || []);
                                                }}
                                                sx={{ ml: 1 }}
                                            >
                                                <Send fontSize="small" color="primary" />
                                            </IconButton> */}
                                        </div>
                                    ))}
                            </Grid>
                        )}
                    </Box>

                </Box>
            </Modal>

            {/* Modal for section selection */}
            <Modal
                open={quizModalOpen}
                onClose={() => setQuizModalOpen(false)}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        maxHeight: '80vh',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        overflowY: 'auto',
                        borderRadius: '10px'
                    }}
                >
                    <Typography variant="h6" mb={2}>Assign Quizes : {editingUser?.userName} | Course : {selectedCourseName}</Typography>
                    <Grid container spacing={1}>

                        <Grid container spacing={1} sx={{ mt: 2 }}>
                            {quizes.filter((c) => c.activeStatus === 1).map((quiz) => {
                                const isChecked = quizIds.includes(quiz.id);

                                return (
                                    <Grid item xs={12} sm={6} key={quiz.id}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={isChecked}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setQuizIds((prev) => [...prev, quiz.id]);
                                                        } else {
                                                            setQuizIds((prev) =>
                                                                prev.filter((id) => id !== quiz.id)
                                                            );
                                                        }
                                                    }}
                                                />
                                            }
                                            label={quiz.name}
                                        />
                                    </Grid>
                                );
                            })}

                            {quizes.length === 0 && (
                                <Grid item xs={12} sm={12}>No Sections for this course</Grid>
                            )}
                        </Grid>
                    </Grid>
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button variant="contained" disabled={quizes.length === 0} onClick={() => {
                            setQuizModalOpen(false)
                            handleAssignQuizes()
                        }}>Update</Button>
                    </Box>
                </Box>
            </Modal>

            {/* Modal for section selection */}
            <Modal
                open={sectionModalOpen}
                onClose={() => setSectionModalOpen(false)}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        maxHeight: '80vh',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        overflowY: 'auto',
                        borderRadius: '10px'
                    }}
                >
                    <Typography variant="h6" mb={2}>Assign Sections : {editingUser?.userName} | Course : {selectedCourseName}</Typography>
                    <Grid container spacing={1}>

                        <Grid container spacing={1} sx={{ mt: 2 }}>
                            {sections.filter((c) => c.activeStatus === 1).map((section) => {
                                const isChecked = sectionIds.includes(section.id);

                                return (
                                    <Grid item xs={12} sm={6} key={section.id}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={isChecked}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSectionIds((prev) => [...prev, section.id]);
                                                        } else {
                                                            setSectionIds((prev) =>
                                                                prev.filter((id) => id !== section.id)
                                                            );
                                                        }
                                                    }}
                                                />
                                            }
                                            label={section.name}
                                        />
                                    </Grid>
                                );
                            })}

                            {sections.length === 0 && (
                                <Grid item xs={12} sm={12}>No Sections for this course</Grid>
                            )}
                        </Grid>
                    </Grid>

                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button variant="contained" disabled={sections.length === 0} onClick={() => {
                            setSectionModalOpen(false)
                            handleAssignSections()
                        }}>Update</Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}
