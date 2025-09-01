import { useLocation, useNavigate } from "react-router-dom";
import "../../Common/styles/courses.css";
import { useEffect, useState } from "react";
import { getRecordingsBySectionId, getSectionByCourseId } from "src/Services/course_api";
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Modal,
    Button,
    Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ArrowBackIos, ArrowForwardIos, AutoStories, Description, DockOutlined, PlayCircleFilled, Quiz } from "@mui/icons-material";
import Footer from "src/Layout/Footer";
import { useTranslation } from "react-i18next";
import thumb from "../../Assets/Images/klc-thumb.png"
import { getAnswer, getQuestions, getQuiz } from "src/Services/quiz_api";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { getAssignSections } from "src/Services/user_api";

export default function MyCourse() {
    const location = useLocation();
    const course = location.state;
    const [sections, setSections] = useState<any[]>([]);
    const [recordingsMap, setRecordingsMap] = useState<Record<string, any[]>>({});
    const [expandedSection, setExpandedSection] = useState<string | false>(false);
    const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);
    const [videoType, setVideoType] = useState<string | null>(null);
    const { t, i18n } = useTranslation();
    const [quizId, setQuizId] = useState("")
    const [openQuizModal, setOpenQuizModal] = useState(false);
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [confirmedAnswers, setConfirmedAnswers] = useState<Record<number, string>>({});
    const [correctAnswersIndexMap, setCorrectAnswersIndexMap] = useState<Record<number, number>>({});
    const [sectionIds, setSectionIds] = useState<any[]>([])

    const token = localStorage.getItem("token")
    const id = localStorage.getItem("id")
    const navigate = useNavigate()

    useEffect(() => {
        if (token === null) {
            navigate("/")
        }
        if (course?.id) {
            handleGetSections();
            handleGetQuiz()
            handleGetAssignSections()
        }

        window.scrollTo(0, 0);
    }, []);

    const handleGetAssignSections = async () => {
        try {
            const response = await getAssignSections(course.id, id, token)
            setSectionIds(response.data.sectionIds)
        } catch (error) {
            console.error(error);
        }
    }

    const handleGetSections = async () => {
        try {
            const response = await getSectionByCourseId(course.id);
            const filteredSections = (response.data || []).filter(
                (section: any) => section.activeStatus === 1
            );
            setSections(filteredSections);
        } catch (error) {
            console.error("Error fetching sections", error);
        }
    };

    const handleGetQuiz = async () => {
        try {
            const response = await getQuiz(course.id)
            setQuizId(response.data[0].id)
            // handleGetQuestions(response.data[0].id)
        } catch (error) {
            console.error(error);
        }
    }

    // const handleGetQuestions = async (id: any) => {
    //     try {
    //         const response = await getQuestions(id, "user")
    //         setQuestions(response.data);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    const handleGetRecordings = async (sectionId: string) => {
        if (recordingsMap[sectionId]) return; // Avoid refetching

        try {
            const response = await getRecordingsBySectionId(sectionId);
            const filteredRecordings = (response.data || []).filter(
                (rec: any) => rec.activeStatus === 1
            );
            setRecordingsMap(prev => ({ ...prev, [sectionId]: filteredRecordings }));
        } catch (error) {
            console.error("Error fetching recordings", error);
        }
    };

    const getVimeoEmbedUrl = (url: string) => {
        const videoId = url.split("/").pop();
        return `https://player.vimeo.com/video/${videoId}`;
    };

    const getYoutubeEmbedUrl = (url: string) => {
        const videoId = url.split("/").pop();
        return `https://www.youtube.com/embed/${videoId}`;
    };

    const handleVideoSelection = (rec: any) => {
        setVideoType(rec.videoType); // "Vimeo" or "YouTube"
        setPlayingVideoUrl(rec.recordLink);
    };

    if (!course) {
        return <p>Course data not found.</p>;
    }

    const handleGetCorerctAnswer = async (questionId: any) => {
        try {
            const response = await getAnswer(questionId);
            const answerData = response.data.answer;

            const answerOptions = Object.entries(answerData)
                .filter(([key]) => key.startsWith("answer"))
                .map(([_, value]) => value);

            const correctIndex = answerData.isCorrectAnswers.findIndex((val: boolean) => val === true);
            const selectedIndex = answerOptions.findIndex(val => val === selectedAnswer);

            setConfirmedAnswers(prev => ({
                ...prev,
                [currentQuestionIndex]: selectedAnswer!
            }));

            setCorrectAnswersIndexMap(prev => ({
                ...prev,
                [currentQuestionIndex]: correctIndex
            }));
        } catch (error) {
            console.error("Error checking answer:", error);
        }
    };

    const iconAnimation = {
        animation: 'pop 0.6s ease',
        fontSize: '22px',
        verticalAlign: 'middle',
        marginRight: 1,
        '@keyframes pop': {
            '0%': {
                transform: 'scale(0.5)',
                opacity: 0,
            },
            '50%': {
                transform: 'scale(1.2)',
                opacity: 1,
            },
            '100%': {
                transform: 'scale(1)',
                opacity: 1,
            },
        },
    };


    return (
        <div className="courses-main-outer">

            <Modal open={openQuizModal} onClose={() => setOpenQuizModal(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', sm: 400 },
                        maxHeight: '90vh',
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: { xs: 2, sm: 4 },
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {questions.length > 0 ? (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Question {currentQuestionIndex + 1}
                            </Typography>
                            <Typography sx={{ mb: 2 }}>
                                {questions[currentQuestionIndex].questionText}
                            </Typography>
                            {confirmedAnswers.hasOwnProperty(currentQuestionIndex) && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: 15,
                                        right: 15,
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: 1,
                                        fontWeight: "bold",
                                        fontSize: "16px",
                                        color:
                                            confirmedAnswers[currentQuestionIndex] ===
                                                questions[currentQuestionIndex].answer[
                                                Object.keys(questions[currentQuestionIndex].answer).filter(key =>
                                                    key.startsWith("answer")
                                                )[correctAnswersIndexMap[currentQuestionIndex]]
                                                ]
                                                ? "green"
                                                : "red",
                                        userSelect: "none",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    {confirmedAnswers[currentQuestionIndex] ===
                                        questions[currentQuestionIndex].answer[
                                        Object.keys(questions[currentQuestionIndex].answer).filter(key =>
                                            key.startsWith("answer")
                                        )[correctAnswersIndexMap[currentQuestionIndex]]
                                        ] ? (
                                        <>
                                            <CheckCircleIcon sx={iconAnimation} />
                                            Correct
                                        </>
                                    ) : (
                                        <>
                                            <CancelIcon sx={iconAnimation} />
                                            Wrong
                                        </>
                                    )}
                                </Box>

                            )}

                            {Object.entries(questions[currentQuestionIndex].answer)
                                .filter(([key]) => key.startsWith("answer"))
                                .map(([key, val], index) => {
                                    const valStr = val as string;
                                    const isConfirmed = confirmedAnswers.hasOwnProperty(currentQuestionIndex);
                                    const correctIndex = correctAnswersIndexMap[currentQuestionIndex];
                                    const confirmedAnswer = confirmedAnswers[currentQuestionIndex];

                                    let buttonColor: "primary" | "success" | "error" = "primary";
                                    let buttonVariant: "contained" | "outlined" = "outlined";

                                    if (isConfirmed) {
                                        if (index === correctIndex) {
                                            // Correct answer: green contained
                                            buttonColor = "success";
                                            buttonVariant = "contained";
                                        } else if (valStr === confirmedAnswer && index !== correctIndex) {
                                            // User selected wrong answer: red contained
                                            buttonColor = "error";
                                            buttonVariant = "contained";
                                        } else {
                                            // Other answers after confirmation: outlined and disabled (gray)
                                            buttonColor = "primary";
                                            buttonVariant = "outlined";
                                        }
                                    } else {
                                        // Before confirmation, highlight selected answer
                                        if (selectedAnswer === valStr) {
                                            buttonVariant = "contained";
                                            buttonColor = "primary";
                                        }
                                    }

                                    return (
                                        <Button
                                            key={key}
                                            variant={buttonVariant}
                                            color={buttonColor}
                                            fullWidth
                                            sx={{ mb: 1, textTransform: "none" }}
                                            onClick={() => {
                                                if (!isConfirmed) {
                                                    setSelectedAnswer(valStr);
                                                }
                                            }}
                                        >
                                            {valStr}
                                        </Button>
                                    );
                                })}


                            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                                <Button
                                    disabled={currentQuestionIndex === 0}
                                    onClick={() => {
                                        setCurrentQuestionIndex((prev) => prev - 1);
                                    }}
                                >
                                    <ArrowBackIos />
                                </Button>

                                <Button
                                    disabled={
                                        selectedAnswer === null ||
                                        Boolean(confirmedAnswers[currentQuestionIndex])
                                    }

                                    onClick={() =>
                                        handleGetCorerctAnswer(questions[currentQuestionIndex].id)
                                    }
                                >
                                    Confirm
                                </Button>

                                <Button
                                    disabled={currentQuestionIndex === questions.length - 1}
                                    onClick={() => {
                                        setCurrentQuestionIndex((prev) => prev + 1);
                                    }}
                                >
                                    <ArrowForwardIos />
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <Typography>No questions available.</Typography>
                    )}
                </Box>
            </Modal>


            <div className="cc">
                <div className="c-items-outer">
                    <div className="c-title">{course.name}</div>
                </div>
                <div className="c-desc">{course.description}</div>
                <div className="c-items-outer">
                    <div style={{ display: "flex", gap: "10px" }}>
                        <div className="c-label">{course.level}</div>
                        {questions.length > 0 && (
                            <div className="c-label1" onClick={() => setOpenQuizModal(true)}>
                                <Description />
                                {t("quiz")}
                            </div>
                        )}
                    </div>

                    <div className="c-section-count">Sections : {sectionIds.length === 0 ? sections.length : sectionIds.length}</div>
                </div>
            </div>
            <div className="c-inner">
                <div className="c-inner1">

                    <div className="c-in visible">
                        {playingVideoUrl ? (
                            <div className="c-thumb-wrapper">
                                {videoType === "Vimeo" ? (
                                    <iframe
                                        src={getVimeoEmbedUrl(playingVideoUrl)}
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        allow="autoplay; fullscreen"
                                        allowFullScreen
                                        title="Vimeo Video"
                                    ></iframe>
                                ) : videoType === "YouTube" ? (
                                    <iframe
                                        src={getYoutubeEmbedUrl(playingVideoUrl)}
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        allow="autoplay; fullscreen"
                                        allowFullScreen
                                        title="YouTube Video"
                                    ></iframe>
                                ) : null}

                            </div>
                        ) : (
                            <img className="c-thumb" src={course.thumbnail.replace("dl=0", "raw=1")} alt="Course Thumbnail" />
                        )}
                    </div>
                    <div className="c-in1">

                        <Box sx={{ p: { xs: 2, mt: 1 }, mx: "auto" }}>
                            <Typography variant="h5" sx={{ mb: 2 }}>
                                Course Content
                            </Typography>

                            {sections.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">
                                    No Content.
                                </Typography>
                            ) : (sectionIds?.length ?? 0) > 0 ? (
                                sections
                                    .filter((s) => sectionIds.includes(s.id))
                                    .map((section, index) => {
                                        const isExpanded = expandedSection === section.name;
                                        const recordings = recordingsMap[section.id] || [];

                                        return (
                                            <Accordion
                                                key={index}
                                                expanded={isExpanded}
                                                onChange={(event, expanded) => {
                                                    const newExpanded = expanded ? section.name : false;
                                                    setExpandedSection(newExpanded);
                                                    if (expanded) handleGetRecordings(section.id);
                                                }}
                                            >
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                    <Typography sx={{ flexGrow: 1 }}>{section.name}</Typography>
                                                    <Typography color="text.secondary">{section.totalLength}</Typography>
                                                </AccordionSummary>

                                                <AccordionDetails>
                                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                                        {section.description}
                                                    </Typography>

                                                    {recordings.length > 0 ? (
                                                        recordings.map((rec, i) => (
                                                            <Typography
                                                                key={i}
                                                                sx={{ mb: 1, display: "flex", alignItems: "center" }}
                                                            >
                                                                <PlayCircleFilled onClick={() => handleVideoSelection(rec)} sx={{ color: "#0D47A1", mr: 1, cursor: "pointer" }} />
                                                                <span
                                                                    style={{
                                                                        color: "#0D47A1",
                                                                        fontWeight: 500
                                                                    }}
                                                                >
                                                                    {rec.name === "" ? "View Lesson" : rec.name}
                                                                </span>
                                                            </Typography>
                                                        ))
                                                    ) : (
                                                        <Typography variant="body2" color="text.secondary">
                                                            No recordings.
                                                        </Typography>
                                                    )}
                                                </AccordionDetails>
                                            </Accordion>
                                        );
                                    })
                            ) : (
                                sections.map((section, index) => {
                                    const isExpanded = expandedSection === section.name;
                                    const recordings = recordingsMap[section.id] || [];

                                    return (
                                        <Accordion
                                            key={index}
                                            expanded={isExpanded}
                                            onChange={(event, expanded) => {
                                                const newExpanded = expanded ? section.name : false;
                                                setExpandedSection(newExpanded);
                                                if (expanded) handleGetRecordings(section.id);
                                            }}
                                        >
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography sx={{ flexGrow: 1 }}>{section.name}</Typography>
                                                <Typography color="text.secondary">{section.totalLength}</Typography>
                                            </AccordionSummary>

                                            <AccordionDetails>
                                                <Typography variant="body2" sx={{ mb: 1 }}>
                                                    {section.description}
                                                </Typography>

                                                {recordings.length > 0 ? (
                                                    recordings.map((rec, i) => (
                                                        <Typography
                                                            key={i}
                                                            sx={{ mb: 1, display: "flex", alignItems: "center" }}
                                                        >
                                                            <PlayCircleFilled onClick={() => handleVideoSelection(rec)} sx={{ color: "#0D47A1", mr: 1, cursor: "pointer" }} />
                                                            <span
                                                                style={{
                                                                    color: "#0D47A1",
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                {rec.name === "" ? "View Lesson" : rec.name}
                                                            </span>
                                                        </Typography>
                                                    ))
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">
                                                        No recordings.
                                                    </Typography>
                                                )}
                                            </AccordionDetails>
                                        </Accordion>
                                    );
                                })
                            )}
                        </Box>
                    </div>

                    <div className="c-in">
                        {playingVideoUrl ? (
                            <div className="c-thumb-wrapper">
                                {videoType === "Vimeo" ? (
                                    <iframe
                                        src={getVimeoEmbedUrl(playingVideoUrl)}
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        allow="autoplay; fullscreen"
                                        allowFullScreen
                                        title="Vimeo Video"
                                    ></iframe>
                                ) : videoType === "YouTube" ? (
                                    <iframe
                                        src={getYoutubeEmbedUrl(playingVideoUrl)}
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        allow="autoplay; fullscreen"
                                        allowFullScreen
                                        title="YouTube Video"
                                    ></iframe>
                                ) : null}

                            </div>
                        ) : (
                            <img className="c-thumb" src={course.thumbnail.replace("dl=0", "raw=1")} alt="Course Thumbnail" />
                        )}
                    </div>
                </div>
            </div>

            <div className="space1"></div>
            <div className="space1"></div>
            <div className="space1"></div>
            <Footer />
        </div>
    );
}
