import { FilterList } from "@mui/icons-material";
import { Paper, Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { getAlertUsers } from "src/Services/user_api";

function CustomNoRowsOverlay() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: 2 }}>
            <Typography variant="h6" color="text.secondary">No Users Found</Typography>
        </Box>
    );
}

export default function AlertUsers() {

    const [rows, setRows] = useState<any[]>([]);

    const token = localStorage.getItem("token")

    const handleAlertUsers = async () => {
        try {
            const res = await getAlertUsers(token);
            setRows(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        handleAlertUsers();
    }, []);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'userName', headerName: 'Username', flex: 1, minWidth: 130 },
        { field: 'duration', headerName: 'Duration', flex: 1, minWidth: 130 },
        {
            field: 'expires',
            headerName: 'Expiring Date',
            flex: 1,
            minWidth: 130
        }


    ];
    return (
        <Paper sx={{ height: 'auto', width: '100%', marginTop: 2, overflowX: 'auto' }}>
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
    )
}