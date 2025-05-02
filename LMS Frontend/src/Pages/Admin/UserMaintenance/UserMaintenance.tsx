import {
    Paper, IconButton, Box, Chip, Typography,
    TextField, Grid, FormControl, InputLabel, Select, MenuItem, Button, Modal,
    Checkbox, FormControlLabel
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

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

    const [userName, setUserName] = useState("")
    const [location, setLocation] = useState("Sri Lanka")
    const [phoneNo, setPhoneNo] = useState<any>("")
    const [email, setEmail] = useState("")
    const [duration, setDuration] = useState<any>("")
    const [status, setStatus] = useState("Active")

    const [rows, setRows] = useState([
        {
            id: 1,
            userName: 'JonSnow',
            phoneNo: '94345678901',
            location: 'Sri Lanka',
            status: 'Active',
            email: 'abcd@gmail.com',
            duration: '10',
            courses: [
                { name: 'abcd' },
                { name: 'abcd1' },
                { name: 'abcd2' }
            ]
        },
        {
            id: 2,
            userName: 'AryaStark',
            phoneNo: '987654321125',
            location: 'South Korea',
            status: 'Inactive',
            email: 'arya@gmail.com',
            duration: '8',
            courses: []
        }
    ]);

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

    const handleUpdate = () => {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(editingUser?.email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (editingUser?.phoneNo?.length !== 11 && editingUser?.phoneNo?.length !== 12) {
            alert("Phone number must be 11 or 12 digits long.");
            return;
        }

        setRows((prevRows) =>
            prevRows.map((row) => (row.id === editingUser.id ? editingUser : row))
        );
        setEditingUser(null);
        setVisible(false)
    };

    const handleCourseChange = (course: string, checked: boolean) => {
        if (!editingUser) return; // Add null check here
        setEditingUser((prev: any) => {
            const updatedCourses = checked
                ? [...prev.courses, { name: course }]
                : prev.courses.filter((c: any) => c.name !== course);
            return { ...prev, courses: updatedCourses };
        });
    };

    const allCourses = [
        'abcd', 'abcd1', 'abcd2', 'abcd3', 'abcd4', 'abcd5',
        'abcd6', 'abcd7', 'abcd8', 'abcd9', 'abcd10', 'abcd11', 'abcd12',
        'abcd13', 'abcd14', 'abcd15', 'abcd16'
    ];

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
                if (value === 'Active') color = 'success';
                else if (value === 'Inactive') color = 'error';
                return <Chip label={value} color={color} size="small" style={{ width: '70px', opacity: '0.8' }} />;
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton sx={{ color: 'black' }} aria-label="edit" onClick={() => handleEditClick(params.row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton sx={{ color: 'error.main' }} aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <>
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
                            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#000' },
                            '& .MuiDataGrid-columnHeaderTitle': { color: '#fff', fontWeight: 'bold', fontSize: '15px', fontFamily: 'Public Sans, sans-serif' },
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
                            <FormControl fullWidth>
                                <InputLabel>Location</InputLabel>
                                <Select
                                    value={editingUser?.location || ''}
                                    label="Location"
                                    onChange={(e) => handleFormChange("location", e.target.value)}
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
                                value={editingUser?.email || ''}
                                onChange={(e) => handleFormChange("email", e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Phone No"
                                fullWidth
                                value={editingUser?.phoneNo || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Allow only digits and disallow leading zero
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
                            <TextField
                                label="Duration"
                                fullWidth
                                value={editingUser?.duration || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Allow only digits and disallow leading zero
                                    if (/^\d*$/.test(value)) {
                                        if (value === '' || value[0] !== '0') {
                                            handleFormChange("duration", e.target.value)
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
                                    <MenuItem value="Active">Active</MenuItem>
                                    <MenuItem value="Inactive">Inactive</MenuItem>
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
                                disabled={!editingUser?.userName || !editingUser?.email || !editingUser?.phoneNo || !editingUser?.duration || !editingUser?.location || !editingUser?.status}
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
                            <Grid item xs={12} sm={4} key={course}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={editingUser?.courses?.some((c: any) => c.name === course) || false}
                                            onChange={(e) => handleCourseChange(course, e.target.checked)}
                                        />
                                    }
                                    label={course}
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
