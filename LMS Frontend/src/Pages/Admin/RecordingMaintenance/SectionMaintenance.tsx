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
import { getSections, updateSection } from "src/Services/section_api";

function CustomNoRowsOverlay() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: 2 }}>
            <Typography variant="h6" color="text.secondary">No Sections Found</Typography>
        </Box>
    );
}

export default function SectionMaintenance() {
    const [visible, setVisible] = useState(false);
    const [courseModalOpen, setCourseModalOpen] = useState(false);
    const [editingSection, setEditingSection] = useState<any | null>(null);
    const [changePwDialog, setChangePwDialog] = useState(false)
    const [changeDeviceDialog, setChangeDeviceDialog] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    const [categories, setCategories] = useState<any[]>([]);
    const [sections, setSections] = useState<any[]>([]);
    const [courseId, setCourseId] = useState(1)
    const [courses, setCourses] = useState<any[]>([]);

    useEffect(() => {
        handleGetCourses()
        handleGetSections(courseId)
    }, [])

    const handleGetCourses = async () => {
        try {
            const res = await getAllCourses()
            setCourses(res.data)
        } catch (error) {
            console.error(error);
        }
    }
    
    const handleGetSections = async (id:any) => {
        try {
            const res = await getSections(id)
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
        setEditingSection(c);
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const [status, setStatus] = useState(1)

    const handleFormChange = (field: string, value: string) => {
        setEditingSection((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleUpdate = async () => {

        const payload = {
            id: editingSection.id,
            name: editingSection.name,
            description: editingSection.description,
            dateTime: "",
            totalLength: "",
            courseId,
            activeStatus: editingSection.activeStatus
        };

        try {
            const response = await updateSection(editingSection.id, payload)
            alert(response.data.message)
        } catch (error: any) {
            alert(error.response.message)
        }
        setRows((prevRows) =>
            prevRows.map((row) => (row.id === editingSection.id ? editingSection : row))
        );

        setEditingSection(null);
        setVisible(false);
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', flex: 1, minWidth: 130 },
        { field: 'description', headerName: 'Description', flex: 1, minWidth: 130 },
        { field: 'recordingCount', headerName: 'Recordings', flex: 1, minWidth: 130 },
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
                <>
                <Grid item xs={12} sm={12}>
                        <FormControl fullWidth>
                            <InputLabel>Course</InputLabel>
                            <Select
                                value={courseId}
                                label="Category"
                                onChange={(e) => {
                                    setCourseId(Number(e.target.value))
                                    handleGetSections(Number(e.target.value))
                                }}
                                fullWidth
                            >
                                {courses?.map((c: any, index) => (
                                    <MenuItem key={index} value={c.id}>
                                        {c.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
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
                </>
            )}

            {visible && (
                <>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Name"
                                fullWidth
                                value={editingSection?.name || ''}
                                onChange={(e) => handleFormChange("name", e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={editingSection?.activeStatus || ''}
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
                                value={editingSection?.description || ''}
                                onChange={(e) => handleFormChange("description", e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} display="flex" justifyContent="flex-end">
                            <Button className="update-btn" variant="contained" onClick={handleCancel}>Cancel</Button>
                            <Button
                                disabled={!editingSection?.name || !editingSection?.description || !editingSection?.activeStatus}
                                variant="contained" onClick={handleUpdate}>Update</Button>
                        </Grid>
                    </Grid>
                </>
            )}
        </>
    );
}
