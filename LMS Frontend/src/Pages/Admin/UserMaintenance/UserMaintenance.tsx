import {
    Paper, IconButton, Box, Chip, Typography,
    TextField, Grid, FormControl, InputLabel, Select, MenuItem, Button, Modal,
    Checkbox, FormControlLabel
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { LockReset, PhonelinkErase } from "@mui/icons-material";
import Dialogbox from "src/Common/Components/DialogBox";
import { getUsers, resetDevice, resetPassword, updateUser } from "src/Services/user_api";
import { getAllCourses } from "src/Services/course_api";
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
    const [courseModalOpen, setCourseModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any | null>(null);
    const [changePwDialog, setChangePwDialog] = useState(false)
    const [changeDeviceDialog, setChangeDeviceDialog] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [country, setCountry] = useState<CountryOption>(countryOptions[0]);
    const [allCourses, setAllCourses] = useState<any[]>([]);
    const [location1, setLocation1] = useState("Sri Lanka");
    const [phoneNo, setPhoneNo] = useState<any>("");

    const token = sessionStorage.getItem("token")

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

    const [rows, setRows] = useState<any[]>([]);

    const handleCancelChangePwDialog = () => {
        setChangePwDialog(false)
    }

    const handleCancelChangeDeviceDialog = () => {
        setChangeDeviceDialog(false)
    }

    const handleEditClick = (user: any) => {
        setEditingUser(user);
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleFormChange = (field: string, value: string) => {
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

        const payload = {
            id: editingUser.id,
            userName: editingUser.userName,
            email: editingUser.email,
            location: editingUser.location,
            phoneNo: editingUser.phoneNo,
            duration: editingUser.duration || 0,
            activeStatus: editingUser.status,
            userCourses: editingUser.courses.map((c: any) => ({
                courseId: c.id,
                courseName: c.name
            }))
        };        

        try {
            const response = await updateUser(payload, token)
            alert(response.data.message)
        } catch (error: any) {
            alert(error.response.message)
        }
        setRows((prevRows) =>
            prevRows.map((row) => (row.id === editingUser.id ? editingUser : row))
        );

        setEditingUser(null);
        setVisible(false);
    };

    const handleChangePassword = async () => {

        if (!selectedUserId) return;

        const body = {
            userId: selectedUserId,
            newPassword: "abcd"
        };

        try {
            const res = await resetPassword(body, token)
            alert(res.data.message + ". New password is 'abcd'")
        } catch (error: any) {
            alert(error.response.message)
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

    const handleCourseChange = (course: any, checked: boolean) => {
        if (!editingUser) return;
        setEditingUser((prev: any) => {
            const updatedCourses = checked
                ? [...prev.courses, { id: course.id, name: course.name }]
                : prev.courses.filter((c: any) => c.id !== course.id);
            return { ...prev, courses: updatedCourses };
        });
    };

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
                    <IconButton sx={{ color: 'black' }} aria-label="edit" onClick={() => handleEditClick(params.row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        sx={{ color: 'grey' }}
                        aria-label="reset password"
                        onClick={() => {
                            setSelectedUserId(params.row.id);
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
            {!visible && (
                <Paper sx={{ height: 'auto', width: '100%', marginTop: 2, overflowX: 'auto' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
                        pageSizeOptions={[5]}
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
                            <Button variant="outlined" onClick={() => setCourseModalOpen(true)}>
                                Manage Courses
                            </Button>
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
                open={courseModalOpen}
                onClose={() => setCourseModalOpen(false)}
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
                    <Typography variant="h6" mb={2}>Assign Courses : {editingUser?.userName}</Typography>
                    <Grid container spacing={1}>
                        {allCourses.map((course) => (
                            <Grid item xs={12} sm={4} key={course.id}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={editingUser?.courses?.some((c: any) => c.id === course.id) || false}
                                            onChange={(e) => handleCourseChange(course, e.target.checked)}
                                        />
                                    }
                                    label={course.name}
                                />
                            </Grid>
                        ))}
                    </Grid>

                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button variant="contained" onClick={() => setCourseModalOpen(false)}>Done</Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}
