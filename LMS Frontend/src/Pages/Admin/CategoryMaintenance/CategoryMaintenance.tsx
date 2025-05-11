import {
    Paper, IconButton, Box, Chip, Typography,
    TextField, Grid, FormControl, InputLabel, Select, MenuItem, Button
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { getCategories, updateCategory } from "src/Services/category_api";

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

    const token = sessionStorage.getItem("token")


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

    const [status, setStatus] = useState(1)

    const handleFormChange = (field: string, value: string) => {
        setEditingCategory((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleUpdate = async () => {

        const payload = {
            id: editingCategory.id,
            name: editingCategory.name,
            description: editingCategory.description,
            imageUrl: editingCategory.imageUrl,
            activeStatus: editingCategory.activeStatus
        };

        try {
            const response = await updateCategory(editingCategory.id, payload)
            alert(response.data.message)
        } catch (error: any) {
            alert(error.response.message)
        }
        setRows((prevRows) =>
            prevRows.map((row) => (row.id === editingCategory.id ? editingCategory : row))
        );

        setEditingCategory(null);
        setVisible(false);
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
                            <TextField
                                label="Thumbnail"
                                fullWidth
                                value={editingCategory?.imageUrl || ''}
                                onChange={(e) => handleFormChange("thumbnail", e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={3}>
                            <img style={{ width: "80%", border: '1px solid black', borderRadius: "8px" }} src={editingCategory?.imageUrl} alt="" />
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
