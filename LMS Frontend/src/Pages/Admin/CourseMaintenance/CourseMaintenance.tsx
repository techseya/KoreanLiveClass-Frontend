import {
    Paper, IconButton, Box, Chip, Typography,
    TextField, Grid, FormControl, InputLabel, Select, MenuItem, Button, Modal,
    Checkbox, FormControlLabel
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { LockReset, PhonelinkErase } from "@mui/icons-material";
import Dialogbox from "src/Common/Components/DialogBox";
import { getUsers, resetDevice, resetPassword, updateUser } from "src/Services/user_api";
import { getAllCourses, updateCourse } from "src/Services/course_api";
import { getCategories, updateCategory } from "src/Services/category_api";

function CustomNoRowsOverlay() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: 2 }}>
            <Typography variant="h6" color="text.secondary">No Courses Found</Typography>
        </Box>
    );
}

export default function CourseMaintenance() {
    const [visible, setVisible] = useState(false);
    const [courseModalOpen, setCourseModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<any | null>(null);
    const [changePwDialog, setChangePwDialog] = useState(false)
    const [changeDeviceDialog, setChangeDeviceDialog] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        handleGetCourses()
        handleGetCategories()
    }, [])

    const handleGetCategories = async () => {
        try {
            const response = await getCategories()
            setCategories(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    const handleGetCourses = async () => {
        try {
            const res = await getAllCourses()
            setRows(res.data)
        } catch (error) {
            console.error(error);
        }
    }

    const [rows, setRows] = useState<any[]>([]);

    const handleCancelChangePwDialog = () => {
        setChangePwDialog(false)
    }

    const handleChangePwDialog = () => {
        setChangePwDialog(true)
    }


    const handleCancelChangeDeviceDialog = () => {
        setChangeDeviceDialog(false)
    }

    const handleChangeDeviceDialog = () => {
        setChangeDeviceDialog(true)
    }


    const handleEditClick = (c: any) => {
        setEditingCourse(c);
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const [status, setStatus] = useState(1)

    const handleFormChange = (field: string, value: string) => {
        setEditingCourse((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleUpdate = async () => {

        const payload = {
            id:  editingCourse.id,
            name:  editingCourse.name,
            description: editingCourse.description,
            categoryId:  editingCourse.categoryId,
            price: editingCourse.price,
            thumbnail:  editingCourse.thumbnail,
            transactionStatus:  editingCourse.transactionStatus,
            level:  editingCourse.level,
            activeStatus:  editingCourse.activeStatus
        };

        try {
            const response = await updateCourse( editingCourse.id, payload)
            alert(response.data.message)
        } catch (error: any) {
            alert(error.response.message)
        }
        setRows((prevRows) =>
            prevRows.map((row) => (row.id ===  editingCourse.id ?  editingCourse : row))
        );

        setEditingCourse(null);
        setVisible(false);
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', flex: 1, minWidth: 130 },
        { field: 'description', headerName: 'Description', flex: 1, minWidth: 130 },
        { field: 'price', headerName: 'Price', flex: 1, minWidth: 130 },
        {
            field: 'activeStatus',
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
                                label="Name"
                                fullWidth
                                value={ editingCourse?.name || ''}
                                onChange={(e) => handleFormChange("name", e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Price"
                                fullWidth
                                value={ editingCourse?.price || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Allow only digits and disallow leading zero
                                    if (/^\d*$/.test(value)) {
                                        if (value === '' || value[0] !== '0') {
                                            handleFormChange("price", e.target.value)
                                        }
                                    }
                                }}
                                inputProps={{ inputMode: 'numeric' }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Level</InputLabel>
                                <Select
                                    value={ editingCourse?.level || ''}
                                    label="Level"
                                    onChange={(e) => handleFormChange("level", e.target.value)}
                                >
                                    <MenuItem value="Beginner">Beginner</MenuItem>
                                    <MenuItem value="Advanced">Advanced</MenuItem>
                                    <MenuItem value="Intermediate">Intermediate</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Type</InputLabel>
                                <Select
                                    value={ editingCourse?.transactionStatus || ''}
                                    label="Type"
                                    onChange={(e) => handleFormChange("transactionStatus", e.target.value)}
                                >
                                    <MenuItem value={1}>Paid</MenuItem>
                                    <MenuItem value={2}>Free</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={ editingCourse?.categoryId || ''}
                                    label="Category"
                                    onChange={(e) => handleFormChange("categoryId", e.target.value)}
                                    fullWidth
                                >
                                    {categories?.map((c: any, index) => (
                                        <MenuItem key={index} value={c.id}>
                                            {c.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={ editingCourse?.activeStatus || ''}
                                    label="Status"
                                    onChange={(e) => handleFormChange("activeStatus", e.target.value)}
                                >
                                    <MenuItem value={1}>Active</MenuItem>
                                    <MenuItem value={2}>Inactive</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <TextField
                                label="Description"
                                fullWidth
                                multiline
                                rows={3}
                                value={ editingCourse?.description || ''}
                                onChange={(e) => handleFormChange("description", e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <TextField
                                label="Thumbnail"
                                fullWidth
                                value={ editingCourse?.thumbnail || ''}
                                onChange={(e) => handleFormChange("thumbnail", e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={3}>
                            <img style={{width: "80%", border: '1px solid black', borderRadius: "8px"}} src={ editingCourse?.thumbnail} alt="" />
                        </Grid>

                        <Grid item xs={12} display="flex" justifyContent="flex-end">
                            <Button className="update-btn" variant="contained" onClick={handleCancel}>Cancel</Button>
                            <Button
                                disabled={! editingCourse?.name || ! editingCourse?.description || ! editingCourse?.activeStatus}
                                variant="contained" onClick={handleUpdate}>Update</Button>
                        </Grid>
                    </Grid>
                </>
            )}
        </>
    );
}
