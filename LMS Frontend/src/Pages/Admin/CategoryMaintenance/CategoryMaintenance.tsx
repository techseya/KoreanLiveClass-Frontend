import {
    Paper, IconButton, Box, Chip, Typography,
    TextField, Grid, FormControl, InputLabel, Select, MenuItem, Button,
    Backdrop,
    CircularProgress
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { deleteCategory, getCategories, updateCategory } from "src/Services/category_api";
import { Delete } from "@mui/icons-material";
import Dialogbox from "src/Common/Components/DialogBox";

function CustomNoRowsOverlay() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: 2 }}>
            <Typography variant="h6" color="text.secondary">No Categories Found</Typography>
        </Box>
    );
}

export default function CategoryMaintenance() {
    const [visible, setVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any | null>(null);
    const [rows, setRows] = useState<any[]>([]);
    const [thumb, setThumb] = useState<File | any>(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [id, setId] = useState("")

    const token = localStorage.getItem("token")


    const handleGetCategories = async () => {
        try {
            const response = await getCategories()
            setRows(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        handleGetCategories()
    }, [])

    const handleEditClick = (c: any) => {
        setEditingCategory(c);
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleFormChange = (field: string, value: string) => {
        setEditingCategory((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleUpdate = async () => {
        setLoading(true);

        const formData = new FormData();
        formData.append("id", editingCategory.id);
        formData.append("name", editingCategory.name);
        formData.append("description", editingCategory.description);
        formData.append("imageUrl", thumb)
        formData.append("activeStatus", editingCategory.activeStatus);

        try {
            const response = await updateCategory(editingCategory.id, formData)
            alert(response.data.message)
            setLoading(false);
        } catch (error: any) {
            alert(error.response.message)
        } finally {
            setLoading(false);
        }
        setRows((prevRows) =>
            prevRows.map((row) => (row.id === editingCategory.id ? editingCategory : row))
        );

        setEditingCategory(null);
        setVisible(false);
        window.location.reload()
    };

    const handleDeleteClick = (c: any) => {
        setId(c.id)
        setIsOpen(true)
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', flex: 1, minWidth: 130 },
        { field: 'description', headerName: 'Description', flex: 1, minWidth: 130 },
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

    const handleClose = () => setIsOpen(false);

    const handleDelete = async () =>{
        try {
                const response = await deleteCategory(id)
                alert(response.data.message)
            } catch (error:any) {
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
                content="Are you sure you want to delete this category?"
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
                                value={editingCategory?.name || ''}
                                onChange={(e) => handleFormChange("name", e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={editingCategory?.activeStatus || ''}
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
                                value={editingCategory?.description || ''}
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
                                        handleFormChange("imageUrl", url);
                                        setThumb(file)
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={3}>
                            <img
                                style={{ width: "80%", border: '1px solid black', borderRadius: "8px" }}
                                src={editingCategory?.imageUrl?.replace("dl=0", "raw=1")}
                                alt="Course Thumbnail"
                            />
                        </Grid>

                        <Grid item xs={12} display="flex" justifyContent="flex-end">
                            <Button className="update-btn" variant="contained" onClick={handleCancel}>Cancel</Button>
                            <Button
                                disabled={!editingCategory?.name || !editingCategory?.activeStatus}
                                variant="contained" onClick={handleUpdate}>Update</Button>
                        </Grid>
                    </Grid>
                </>
            )}
        </>
    );
}
