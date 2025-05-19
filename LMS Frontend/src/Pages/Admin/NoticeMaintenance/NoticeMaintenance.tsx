import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Dialogbox from "src/Common/Components/DialogBox";
import CommanLayout from "src/Layout/CommanLayout";
import { addNotice, deleteNotice, getAllNotices } from "src/Services/notice_api";
import { addWord, getAllWords } from "src/Services/word_api";

function CustomNoRowsOverlay() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", padding: 2 }}>
      <Typography variant="h6" color="text.secondary">No Notice Found</Typography>
    </Box>
  );
}

export default function NoticeMaintenance() {
  const token = sessionStorage.getItem("token");
  const [rows, setRows] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Modal state
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [notification, setNotification] = useState("");
  const [noticeId, setNoticeId] = useState("")

  useEffect(() => {
    handleGetAllNotices();
  }, []);

  const handleGetAllNotices = async () => {
    try {
      const response = await getAllNotices(token);
      setRows(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClick = (c: any) => {
    setNoticeId(c.id)
    setIsOpen(true)
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Notice Title", flex: 1, minWidth: 130 },
    { field: "notification", headerName: "Notice Content", flex: 1, minWidth: 130 },
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

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => {
    setOpen(false);
    setTitle("");
    setNotification("");
  };

  const handleAddWord = async () => {
    const formData = new FormData();
    formData.append("Korean", "");
    formData.append("Sinhala", "");
    formData.append("Title", title);
    formData.append("Notification", notification);
    formData.append("File", "");
    formData.append("TodayLessonNotification", "2");

    try {
      const response = await addNotice(token, formData)
      alert(response.data.message)
    } catch (error: any) {
      alert(error.response.message)
    }

    window.location.reload()
  };

  const handleDelete = async () => {
    try {
        const response = await deleteNotice(noticeId)
        alert(response.data.message)
    } catch (error:any) {
        alert(error.response.message)
    }

    handleClose()
    window.location.reload()
  }

  const handleClose = () => setIsOpen(false);

  return (
    <CommanLayout name="Notice Maintenance" path="notice">
      <Dialogbox
        open={isOpen}
        title="Delete Confirmation"
        content="Are you sure you want to delete this notice?"
        agreeButtonText="Yes, Delete"
        disagreeButtonText="No"
        onAgree={handleDelete}
        onDisagree={handleClose}
        onClose={handleClose}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={handleOpenModal}>
            Add Notice
          </Button>
        </Grid>
      </Grid>

      <Paper sx={{ height: "auto", width: "100%", marginTop: 2, overflowX: "auto" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
          pageSizeOptions={[5]}
          autoHeight
          sx={{
            border: 0,
            minWidth: 600,
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
              fontSize: "15px",
              fontFamily: "Public Sans, sans-serif"
            },
            "& .MuiDataGrid-cell": {
              fontSize: "14px",
              fontFamily: "Public Sans, sans-serif"
            }
          }}
          slots={{ noRowsOverlay: CustomNoRowsOverlay }}
        />
      </Paper>

      {/* Add Word Modal */}
      <Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Add New Notice</DialogTitle>
        <DialogContent>
          <Box mt={1} display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Notice Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />
            <TextField
              label="Notice Content"
              variant="outlined"
              multiline
              rows={3}
              value={notification}
              onChange={(e) => setNotification(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button variant="contained" onClick={handleAddWord}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </CommanLayout>
  );
}
