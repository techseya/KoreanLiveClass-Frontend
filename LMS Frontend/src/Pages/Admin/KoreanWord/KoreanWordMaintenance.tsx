import { Edit } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
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
import CommanLayout from "src/Layout/CommanLayout";
import { deleteNotice } from "src/Services/notice_api";
import { addWord, getAllWords } from "src/Services/word_api";

function CustomNoRowsOverlay() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", padding: 2 }}>
      <Typography variant="h6" color="text.secondary">No Lessons Found</Typography>
    </Box>
  );
}

export default function KoreanWordMaintenance() {
  const token = sessionStorage.getItem("token");
  const [rows, setRows] = useState<any[]>([]);

  // Modal state
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [koreanWord, setKoreanWord] = useState("");
  const [sinhalaWord, setSinhalaWord] = useState("");
  const [thumbnail, setThumbnail] = useState<File | any>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [id, setId] = useState("")
  const [baseD, setBaseD] = useState("")
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleGetAllWords();
  }, []);

  const handleGetAllWords = async () => {
    try {
      const response = await getAllWords(token);
      const allWords = response.data;

      if (allWords.length === 0) {
        setRows([]);
        return;
      }

      // Get base date from the first record
      const baseDate = new Date(allWords[0].createdAt).toISOString().split("T")[0];
      setBaseD(baseDate);

      // Add 'active' flag to each word
      const updatedWords = allWords.map((word: any) => {
        const wordDate = new Date(word.createdAt).toISOString().split("T")[0];
        return {
          ...word,
          active: wordDate === baseDate ? "Yes" : "No"
        };
      });

      setRows(updatedWords);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (c: any) => {
    setEditing(c);
    setId(c.id)
    setVisible(true);
  };

  const handleDelete = async () => {
    try {
      const response = await deleteNotice(id)
      alert(response.data.message)
    } catch (error: any) {
      alert(error.response.message)
    }

    window.location.reload()
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "korean", headerName: "Korean Word", flex: 1, minWidth: 130 },
    { field: "sinhala", headerName: "Sinhala Meaning", flex: 1, minWidth: 130 },
    {
      field: "active",
      headerName: "Active",
      width: 100,
    }
    ,
    {
      field: 'actions',
      headerName: 'Actions',
      width: 220,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <IconButton sx={{ color: 'black' }} aria-label="edit" onClick={() => handleEditClick(params.row)}>
            <Edit />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => {
    setOpen(false);
    setKoreanWord("");
    setSinhalaWord("");
  };

  const handleAddWord = async () => {
    setOpen(false)
    setLoading(true);
    const formData = new FormData();
    formData.append("Korean", koreanWord);
    formData.append("Sinhala", sinhalaWord);
    formData.append("Title", "");
    formData.append("Notification", "");
    formData.append("File", thumbnail);
    formData.append("TodayLessonNotification", "1");

    try {
      const response = await addWord(token, formData)
      alert(response.data.message)
      setLoading(false);
    } catch (error: any) {
      alert(error.response.message)
    } finally {
      setLoading(false);
    }

    window.location.reload()
  };

  const handleFormChange = (field: string, value: string) => {
    setEditing((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <CommanLayout name="Korean Lesson Maintenance" path="k-lesson">
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {!visible && (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} display="flex" justifyContent="flex-end">
              <Button variant="contained" onClick={handleOpenModal}>
                Add Lesson
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
              getRowClassName={(params) =>
                params.row.active === "Yes" ? "active-row" : ""
              }
              sx={{
                border: 0,
                minWidth: 600,
                "& .active-row": {
                  backgroundColor: "#0b8df721",
                },
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
        </>
      )}

      {visible && (
        <>
          <DialogContent>
            <Box mt={1} display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Korean Word"
                variant="outlined"
                value={editing?.korean || ''}
                disabled
                onChange={(e) => handleFormChange("korean", e.target.value)}
                fullWidth
              />
              <TextField
                label="Sinhala Meaning"
                variant="outlined"
                value={editing?.sinhala || ''}
                disabled
                onChange={(e) => handleFormChange("sinhala", e.target.value)}
                fullWidth
              />

              <Grid item xs={12} sm={3}>
                {editing?.imageUrl && (
                  <img
                    style={{ width: "15%", border: '1px solid black', borderRadius: "8px" }}
                    src={editing?.imageUrl?.replace("dl=0", "raw=1")}
                    alt="Course Thumbnail"
                  />
                )}
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button style={{ color: "red" }} onClick={(e) => setVisible(false)}>Cancel</Button>
            <Button variant="contained" style={{ backgroundColor: 'red' }} onClick={handleDelete}>
              Delete
            </Button>
          </DialogActions>
        </>
      )}

      {/* Add Word Modal */}
      <Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Add New Word</DialogTitle>
        <DialogContent>
          <Box mt={1} display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Korean Word"
              variant="outlined"
              value={koreanWord}
              onChange={(e) => setKoreanWord(e.target.value)}
              fullWidth
            />
            <TextField
              label="Sinhala Meaning"
              variant="outlined"
              value={sinhalaWord}
              onChange={(e) => setSinhalaWord(e.target.value)}
              fullWidth
            />
            <Grid item xs={12} sm={12}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    setThumbnail(file);
                    setThumbnailPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              {thumbnailPreview && (
                <div>
                  <p>Image Preview:</p>
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    style={{ width: "200px", height: "auto", marginTop: "10px" }}
                  />
                </div>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button disabled={!koreanWord || !sinhalaWord} variant="contained" onClick={handleAddWord}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </CommanLayout>
  );
}
