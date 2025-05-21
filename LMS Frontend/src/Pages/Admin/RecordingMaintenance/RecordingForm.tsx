import { useEffect, useState } from "react";
import {
    Box,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Button,
    Grid,
} from "@mui/material";
import "../../../Common/styles/user.css";
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import { getAllCourses } from "src/Services/course_api";
import { createSection, getSections } from "src/Services/section_api";
import { createRecording } from "src/Services/recording_api";
import { access } from "fs";

export default function RecordingForm() {
    const navigate = useNavigate();

    const [name, setName] = useState("")
    const [recordingLink, setRecordingLink] = useState("")
    const [videoType, setVideoType] = useState("Vimeo")
    const [transactionStatus, setTransactionStatus] = useState(1)
    const [type, setType] = useState(1)
    const [thumbnail, setThumbnail] = useState("")
    const [status, setStatus] = useState("Active")
    const [categoryId, setCategoryId] = useState(1)
    const [categories, setCategories] = useState<any[]>([]);

    const [courseId, setCourseId] = useState(0)
    const [courses, setCourses] = useState<any[]>([]);
    const [sectionId, setSectionId] = useState(0)
    const [sections, setSections] = useState<any[]>([]);

    useEffect(() => {
        handleGetCourses()
        handleGetSections(sectionId)
    }, [])

    const handleGetCourses = async () => {
        try {
            const response = await getAllCourses()
            const activeCourses = response.data.filter((course: any) => course.activeStatus === 1);
            setCourses(activeCourses)
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
            } else {
                setSections(res.data)
                setSectionId(0)
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = async () => {

        const body = {
            name: name === "" ? "" : name,
            recordLink: recordingLink,
            recordDate: new Date().toISOString(),
            recordOrder: 0,
            recordLength: "",
            sectionId,
            courseStatus: 1,
            transactionStatus: transactionStatus,
            videoType: videoType,
            activeStatus: status === "Active" ? 1 : 2
        }

        try {
            const response = await createRecording(body)
            alert(response.data.message)
        } catch (error: any) {
            alert(error.response.data.message);
        }

        window.location.reload()
    };

    return (
        <div className="user-form-outer">
            <Box component="form" noValidate autoComplete="off" sx={{ p: 2, width: "100%" }}>
                <Grid container spacing={2}>
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
                                <MenuItem disabled value={0}>Select a Course</MenuItem>
                                {courses?.map((c: any, index) => (
                                    <MenuItem key={index} value={c.id}>
                                        {c.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                        <FormControl fullWidth>
                            <InputLabel>Section</InputLabel>
                            <Select
                                value={sectionId}
                                label="Section"
                                disabled={courseId === 0}
                                onChange={(e) => {
                                    setSectionId(Number(e.target.value))
                                }}
                                fullWidth
                            >
                                <MenuItem disabled value={0}>Select a Section</MenuItem>
                                {sections?.filter((course) => course.activeStatus === 1).map((c: any, index) => (
                                    <MenuItem key={index} value={c.id}>
                                        {c.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Name"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Recording Url"
                            fullWidth
                            value={recordingLink}
                            onChange={(e) => setRecordingLink(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Recording Type</InputLabel>
                            <Select
                                value={videoType}
                                onChange={(e) => setVideoType(e.target.value)}
                                label="Recording Type"
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
                                value={transactionStatus}
                                onChange={(e) => setTransactionStatus(Number(e.target.value))}
                                label="Recording Status"
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
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                label="Status"
                            >
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Inactive">Inactive</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} display="flex" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Add />}
                            sx={{ textTransform: 'none' }}
                            onClick={handleSubmit}
                            disabled={!recordingLink || !status || courseId === 0 || sectionId === 0}
                        >
                            Add Recording
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}
