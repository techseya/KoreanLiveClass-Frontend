import {
    Paper, IconButton, Box, Typography} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { deleteVideo, getVideos } from "src/Services/videos_api";
import { Delete } from "@mui/icons-material";
import Dialogbox from "src/Common/Components/DialogBox";

function CustomNoRowsOverlay() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: 2 }}>
            <Typography variant="h6" color="text.secondary">No Videos Found</Typography>
        </Box>
    );
}

export default function KoreanVideoMaintenance() {
    const [visible, setVisible] = useState(false);
    const [editingVideo, setEditingVideo] = useState<any | null>(null);
    const [rows, setRows] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        handleGetVideos()
    }, [])

    const handleGetVideos = async () => {
        try {
            const res = await getVideos()
            setRows(res.data)
        } catch (error) {
            console.error(error);
        }
    }

    const handleDeleteVideo = async () => {
        try {
            const response = await deleteVideo(editingVideo.id)
            alert(response.data.message)
        } catch (error:any) {
            alert(error.response.message)
        }

        handleClose()
        window.location.reload()
    }

    const handleClose = () => setIsOpen(false);

    const handleDeleteClick = (c: any) => {
        setEditingVideo(c);
        setIsOpen(true)
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'link', headerName: 'Video Url', flex: 1, minWidth: 130 },
        { field: 'type', headerName: 'Video Type', flex: 1, minWidth: 130 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 220,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton sx={{ color: 'red' }} aria-label="edit" onClick={() => handleDeleteClick(params.row)}>
                        <Delete />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <>
            <Dialogbox
                open={isOpen}
                title="Delete Confirmation"
                content="Are you sure you want to delete this video?"
                agreeButtonText="Yes, Delete"
                disagreeButtonText="No"
                onAgree={handleDeleteVideo}
                onDisagree={handleClose}
                onClose={handleClose}
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
        </>
    );
}
