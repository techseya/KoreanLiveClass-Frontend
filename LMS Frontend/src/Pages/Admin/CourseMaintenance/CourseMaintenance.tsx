import {
    Paper, IconButton, Box, Chip, Typography,
    TextField, Grid, FormControl, InputLabel, Select, MenuItem, Button,
    Backdrop,
    CircularProgress
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { deleteCourse, getAllCourses, updateCourse } from "src/Services/course_api";
import { getCategories } from "src/Services/category_api";
import Dialogbox from "src/Common/Components/DialogBox";
import { Delete } from "@mui/icons-material";

function CustomNoRowsOverlay() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: 2 }}>
            <Typography variant="h6" color="text.secondary">No Courses Found</Typography>
        </Box>
    );
}

export default function CourseMaintenance() {
    const [visible, setVisible] = useState(false);
    const [editingCourse, setEditingCourse] = useState<any | null>(null);
    const [rows, setRows] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [thumb, setThumb] = useState<File | any>(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [id, setId] = useState("")

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
        setLoading(true);

        const formData = new FormData();
        formData.append("id", editingCourse.id);
        formData.append("name", editingCourse.name);
        formData.append("description", editingCourse.description);
        formData.append("categoryId", editingCourse.categoryId);
        formData.append("price", editingCourse.price === "" ? "0" : editingCourse.price);
        formData.append("transactionStatus", editingCourse.transactionStatus);
        formData.append("level", editingCourse.level);
        formData.append("activeStatus", editingCourse.activeStatus);
        formData.append("thumbnail", thumb);

        try {
            const response = await updateCourse(editingCourse.id, formData)
            alert(response.data.message)
            setVisible(false);
        } catch (error: any) {
            alert(error?.response?.message || "Update failed");
        } finally {
            setLoading(false);
        }

        setRows((prevRows) =>
            prevRows.map((row) => (row.id === editingCourse.id ? editingCourse : row))
        );

        setEditingCourse(null);
        setVisible(false);
        window.location.reload()
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

                    <IconButton sx={{ color: 'red' }} aria-label="edit" onClick={() => handleDeleteClick(params.row)}>
                        <Delete />
                    </IconButton>
                </Box>
            ),
        },
    ];

    const handleDeleteClick = (c: any) => {
        setId(c.id)
        setIsOpen(true)
    };

    const handleClose = () => setIsOpen(false);

    const handleDelete = async () => {
        try {
            const response = await deleteCourse(id)
            alert(response.data.message)
        } catch (error: any) {
            alert(error.response.message)
        }

        handleClose()
        window.location.reload()
    }

    return (
        <>
            <Dialogbox
                open={isOpen}
                title="Delete Confirmation"
                content="Are you sure you want to delete this course?"
                agreeButtonText="Yes, Delete"
                disagreeButtonText="No"
                onAgree={handleDelete}
                onDisagree={handleClose}
                onClose={handleClose}
            />
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
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
                                value={editingCourse?.name || ''}
                                onChange={(e) => handleFormChange("name", e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Price"
                                fullWidth
                                value={editingCourse?.price || ''}
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
                                    value={editingCourse?.level || ''}
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
                                    value={editingCourse?.transactionStatus || ''}
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
                                    value={editingCourse?.categoryId || ''}
                                    label="Category"
                                    onChange={(e) => handleFormChange("categoryId", e.target.value)}
                                    fullWidth
                                >
                                    {categories?.filter((course) => course.activeStatus === 1).map((c: any, index) => (
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
                                    value={editingCourse?.activeStatus || ''}
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
                                value={editingCourse?.description || ''}
                                onChange={(e) => handleFormChange("description", e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const url = URL.createObjectURL(file);
                                        handleFormChange("thumbnail", url);
                                        setThumb(file)
                                    }
                                }}
                            />

                        </Grid>

                        <Grid item xs={12} sm={3}>
                            <img
                                style={{ width: "80%", border: '1px solid black', borderRadius: "8px" }}
                                src={editingCourse?.thumbnail?.replace("dl=0", "raw=1")}
                                alt="Course Thumbnail"
                            />
                        </Grid>

                        <Grid item xs={12} display="flex" justifyContent="flex-end">
                            <Button className="update-btn" variant="contained" onClick={handleCancel}>Cancel</Button>
                            <Button
                                disabled={!editingCourse?.name || !editingCourse?.activeStatus}
                                variant="contained" onClick={handleUpdate}>Update</Button>
                        </Grid>
                    </Grid>
                </>
            )}
        </>
    );
}
