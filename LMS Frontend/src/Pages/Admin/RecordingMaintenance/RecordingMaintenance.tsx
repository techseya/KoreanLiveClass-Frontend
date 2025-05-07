import {
    Paper, IconButton, Box, Chip, Typography,
    TextField, Grid, FormControl, InputLabel, Select, MenuItem, Button
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { getAllCourses } from "src/Services/course_api";
import { getSections, updateSection } from "src/Services/section_api";
import { getRecordings, updateRecording } from "src/Services/recording_api";

function CustomNoRowsOverlay() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: 2 }}>
            <Typography variant="h6" color="text.secondary">No Recordings Found</Typography>
        </Box>
    );
}

export default function RecordingMaintenance() {
    const [visible, setVisible] = useState(false);
    const [editingRecording, setEditingRecording] = useState<any | null>(null);
    const [sectionId, setSectionId] = useState(0)
    const [sections, setSections] = useState<any[]>([]);
    const [courseId, setCourseId] = useState(0)
    const [courses, setCourses] = useState<any[]>([]);
    const [rows, setRows] = useState<any[]>([]);

    useEffect(() => {
        handleGetCourses()
        handleGetSections(courseId)
        handleGetRecordings(sectionId)
    }, [])

    const handleGetCourses = async () => {
        try {
            const res = await getAllCourses()
            setCourses(res.data)
        } catch (error) {
            console.error(error);
        }
    }

    const handleGetSections = async (id: any) => {
        try {
            const res = await getSections(id)
            console.log(res.data.length);
            if (res.data.length === 0) {
                setSections([])
                setSectionId(0)
                setRows([])
            } else {
                setSections(res.data)
                setSectionId(0)
                setRows([])
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleGetRecordings = async (id: any) => {
        try {
            const res = await getRecordings(id)
            setRows(res.data)
        } catch (error) {
            console.error(error);
        }
    }

    const handleEditClick = (c: any) => {
        setEditingRecording(c);
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const [status, setStatus] = useState(1)

    const handleFormChange = (field: string, value: string) => {
        setEditingRecording((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleUpdate = async () => {

        const payload = {
            id: editingRecording.id,
            name: editingRecording.name,
            recordDate: new Date().toISOString(),
            recordLink: editingRecording.recordLink,
            recordOrder: 0,
            recordLength: "",
            sectionId,
            courseStatus: 1,
            transactionStatus: editingRecording.transactionStatus,
            videoType: editingRecording.videoType,
            activeStatus: editingRecording.activeStatus
        };

        try {
            const response = await updateRecording(editingRecording.id, payload)
            alert(response.data.message)
        } catch (error: any) {
            alert(error.response.message)
        }
        setRows((prevRows) =>
            prevRows.map((row) => (row.id === editingRecording.id ? editingRecording : row))
        );

        setEditingRecording(null);
        setVisible(false);
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', flex: 1, minWidth: 130 },
        { field: 'recordLink', headerName: 'Record Url', flex: 1, minWidth: 130 },
        { field: 'videoType', headerName: 'Type', flex: 1, minWidth: 130 },
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
                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Course</InputLabel>
                                <Select
                                    value={courseId}
                                    label="Course"
                                    onChange={(e) => {
                                        setCourseId(Number(e.target.value))
                                        handleGetSections(Number(e.target.value))
                                    }}
                                    fullWidth
                                >
                                    <MenuItem disabled value={0}>Select a Course</MenuItem>
                                    {courses?.map((c: any, index) => (
                                        <MenuItem key={index} value={c.id}>
                                            {c.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Section</InputLabel>
                                <Select
                                    value={sectionId}
                                    label="Section"
                                    disabled={courseId === 0}
                                    onChange={(e) => {
                                        setSectionId(Number(e.target.value))
                                        handleGetRecordings(Number(e.target.value))
                                    }}
                                    fullWidth
                                >
                                    <MenuItem disabled value={0}>Select a Section</MenuItem>
                                    {sections?.map((c: any, index) => (
                                        <MenuItem key={index} value={c.id}>
                                            {c.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
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
                                value={editingRecording?.name || ''}
                                onChange={(e) => handleFormChange("name", e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Recording Url"
                                fullWidth
                                value={editingRecording?.recordLink || ''}
                                onChange={(e) => handleFormChange("recordLink", e.target.value)}
                            />
                        </Grid>                        

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Recording Type</InputLabel>
                                <Select
                                    value={editingRecording?.videoType || ''}
                                    label="Recording Type"
                                    onChange={(e) => handleFormChange("videoType", e.target.value)}
                                >
                                    <MenuItem value="Vimeo">Vimeo</MenuItem>
                                    <MenuItem value="YouTube">YouTube</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Recording Status</InputLabel>
                                <Select
                                    value={editingRecording?.transactionStatus || ''}
                                    label="Recording Status"
                                    onChange={(e) => handleFormChange("transactionStatus", e.target.value)}
                                >
                                    <MenuItem value={1}>Paid</MenuItem>
                                    <MenuItem value={2}>Free</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={editingRecording?.activeStatus || ''}
                                    label="Status"
                                    onChange={(e) => handleFormChange("activeStatus", e.target.value)}
                                >
                                    <MenuItem value={1}>Active</MenuItem>
                                    <MenuItem value={2}>Inactive</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} display="flex" justifyContent="flex-end">
                            <Button className="update-btn" variant="contained" onClick={handleCancel}>Cancel</Button>
                            <Button
                                disabled={!editingRecording?.name || !editingRecording?.recordLink || !editingRecording.videoType || !editingRecording.transactionStatus || !editingRecording?.activeStatus}
                                variant="contained" onClick={handleUpdate}>Update</Button>
                        </Grid>
                    </Grid>
                </>
            )}
        </>
    );
}
