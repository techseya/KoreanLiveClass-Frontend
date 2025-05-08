import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
    TextField,
    Typography
  } from "@mui/material";
  import { DataGrid, GridColDef } from "@mui/x-data-grid";
  import { useEffect, useState } from "react";
  import CommanLayout from "src/Layout/CommanLayout";
  import { addWord, getAllWords } from "src/Services/word_api";
  
  function CustomNoRowsOverlay() {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", padding: 2 }}>
        <Typography variant="h6" color="text.secondary">No Words Found</Typography>
      </Box>
    );
  }
  
  export default function KoreanWordMaintenance() {
    const token = sessionStorage.getItem("token");
    const [rows, setRows] = useState<any[]>([]);
  
    // Modal state
    const [open, setOpen] = useState(false);
    const [koreanWord, setKoreanWord] = useState("");
    const [sinhalaWord, setSinhalaWord] = useState("");
  
    useEffect(() => {
      handleGetAllWords();
    }, []);
  
    const handleGetAllWords = async () => {
      try {
        const response = await getAllWords(token);
        setRows(response.data);
      } catch (error) {
        console.error(error);
      }
    };
  
    const columns: GridColDef[] = [
      { field: "id", headerName: "ID", width: 70 },
      { field: "korean", headerName: "Korean Word", flex: 1, minWidth: 130 },
      { field: "sinhala", headerName: "Sinhala Meaning", flex: 1, minWidth: 130 }
    ];
  
    const handleOpenModal = () => setOpen(true);
    const handleCloseModal = () => {
      setOpen(false);
      setKoreanWord("");
      setSinhalaWord("");
    };
  
    const handleAddWord = async () => {
        const body = {
            korean: koreanWord,
            sinhala: sinhalaWord
        }
      try {
        const response = await addWord(token, body)
        alert(response.data.message)
      } catch (error:any) {
        alert(error.response.message)
      }
      
      window.location.reload()
    };
  
    return (
      <CommanLayout name="Korean Word Maintenance" path="k-word">
        <Grid container spacing={2}>
          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleOpenModal}>
              Add Word
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
  