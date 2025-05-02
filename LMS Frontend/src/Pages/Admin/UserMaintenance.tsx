import { Paper, IconButton, Box, Chip, Typography, Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CommanLayout from "src/Layout/CommanLayout";
import "../../Common/styles/user.css"

// Custom overlay when no rows are available
function CustomNoRowsOverlay() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                padding: 2,
            }}
        >
            <Typography variant="h6" color="text.secondary">
                No Users Found
            </Typography>
        </Box>
    );
}

export default function UserMaintenance() {
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

                return <Chip label={value} color={color} size="small" style={{width: '70px', opacity: '0.8'}}/>;
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: () => (
                <Box>
                    <IconButton sx={{ color: 'grey.600' }} aria-label="view">
                        <VisibilityIcon />
                    </IconButton>
                    <IconButton sx={{ color: 'black' }} aria-label="edit">
                        <EditIcon />
                    </IconButton>
                    <IconButton sx={{ color: 'error.main' }} aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    //const rows:any[] = [];

    const rows = [
        { id: 1, userName: 'JonSnow', phoneNo: '1234567890', location: 'Sri Lanka', status: 'Active' },
        { id: 2, userName: 'AryaStark', phoneNo: '0987654321', location: 'South Korea', status: 'Inactive' },
        { id: 3, userName: 'TyrionLannister', phoneNo: '5551234567', location: 'Sri Lanka', status: 'New' },
        { id: 4, userName: 'DaenerysTargaryen', phoneNo: '4442221111', location: 'South Korea', status: 'Active' },
        { id: 5, userName: 'CerseiLannister', phoneNo: '1112223333', location: 'Sri Lanka', status: 'Inactive' },
    ];

    const paginationModel = { page: 0, pageSize: 5 };

    return (
        <CommanLayout name="User Maintenance" path="user-maintenance">
            {/* Add User Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    sx={{ textTransform: 'none' }}
                >
                    Add User
                </Button>
            </Box>

            {/* User Table */}
            <Paper sx={{ height: 'auto', width: '100%', marginTop: 2, overflowX: 'auto' }}>
                <DataGrid
                
                    rows={rows}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5]}
                    autoHeight
                    sx={{
                        border: 0,
                        minWidth: 600,
                        '& .MuiDataGrid-columnHeaderTitle': {
                          color: '#fff',
                          fontWeight: 'bold',
                        }
                      }}
                    slots={{ noRowsOverlay: CustomNoRowsOverlay }}
                />
            </Paper>
        </CommanLayout>
    );
}
