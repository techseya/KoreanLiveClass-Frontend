import { useLocation } from "react-router-dom";
import "../../Common/styles/courses.css";
import { useEffect, useState } from "react";
import { getRecordingsBySectionId, getSectionByCourseId } from "src/Services/course_api";
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { PlayCircleFilled } from "@mui/icons-material";
import Footer from "src/Layout/Footer";
import { useTranslation } from "react-i18next";

export default function Course() {
    const location = useLocation();
    const course = location.state;
    const [sections, setSections] = useState<any[]>([]);
    const [recordingsMap, setRecordingsMap] = useState<Record<string, any[]>>({});
    const [expandedSection, setExpandedSection] = useState<string | false>(false);
    const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);
    const [videoType, setVideoType] = useState<string | null>(null);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        if (course?.id) handleGetSections();
        window.scrollTo(0, 0);
    }, []);    

    const scrollTop = () => {
        window.scrollTo(0, 0);
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
        scrollTop()
        setVideoType(rec.videoType); // "Vimeo" or "YouTube"
        setPlayingVideoUrl(rec.recordLink);
    };

    if (!course) {
        return <p>Course data not found.</p>;
    }

    return (
        <div className="courses-main-outer">
            <div className="cc">
                <div className="c-items-outer">
                    <div className="c-title">{course.name}</div>
                </div>
                <div className="c-desc">{course.description}</div>
                <div className="c-items-outer">
                    <div className="c-label">{course.level}</div>
                    <div className="c-section-count">Sections : {course.sectionCount}</div>
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
                            <img className="c-thumb" src={course.thumbnail} alt="Course Thumbnail" />
                        )}
                    </div>

                    <div className="c-in1">
                        {course.transactionStatus === 1 ? (
                            <Box sx={{ p: { xs: 2, mt: 2 }, mx: "auto" }}>
                            <Typography variant="h5" sx={{ mb: 2 }}>
                                Course Content
                            </Typography>

                            {sections.length > 0 ? (
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
                                                if (expanded) {
                                                    handleGetRecordings(section.id);
                                                }
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
                                                            sx={{ mb: 1, display: 'flex', alignItems: 'center' }}
                                                        >
                                                            <PlayCircleFilled
                                                                sx={{
                                                                    color: rec.transactionStatus !== 1 ? '#0D47A1' : 'gray',
                                                                    mr: 1
                                                                }}
                                                            />
                                                            <span style={{
                                                                color: rec.transactionStatus !== 1 ? '#0D47A1' : 'gray',
                                                                fontWeight: 500
                                                            }}>
                                                                {rec.name}
                                                            </span>
                                                            {rec.transactionStatus !== 1 && (
                                                                <button
                                                                    onClick={() => handleVideoSelection(rec)}
                                                                    style={{
                                                                        marginLeft: 10,
                                                                        background: 'none',
                                                                        border: 'none',
                                                                        color: '#1976d2',
                                                                        cursor: 'pointer',
                                                                        textDecoration: 'underline'
                                                                    }}
                                                                >
                                                                    (Free)
                                                                </button>
                                                            )}
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
                                <Typography>No Content available.</Typography>
                            )}
                        </Box>
                        ) :(
                            <Box sx={{ p: { xs: 2, mt: 1 }, mx: "auto" }}>
                            <Typography variant="h5" sx={{ mb: 2 }}>
                                Course Content
                            </Typography>

                            {sections.length > 0 ? (
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
                                                if (expanded) {
                                                    handleGetRecordings(section.id);
                                                }
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
                                                            sx={{ mb: 1, display: 'flex', alignItems: 'center' }}
                                                        >
                                                            <PlayCircleFilled
                                                                sx={{
                                                                    color: '#0D47A1',
                                                                    mr: 1
                                                                }}
                                                            />
                                                            <span onClick={() => handleVideoSelection(rec)} style={{
                                                                color: '#0D47A1',
                                                                fontWeight: 500,
                                                                cursor: 'pointer'
                                                            }}>
                                                                {rec.name}
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
                                <Typography>No Content available.</Typography>
                            )}
                        </Box>
                        )}
                        
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
                            <img className="c-thumb" src={course.thumbnail} alt="Course Thumbnail" />
                        )}
                    </div>
                </div>
                {course.transactionStatus !== 2 && (
                    <button className="buy-course-button" onClick={() =>
                            window.open(
                                "https://wa.me/821090736674?text=Hello%2C%20I%20need%20to%20Buy%20a%20course",
                              "_blank"
                            )
                          }>
                    {t("buyCourse")}
                </button>
                )}               

            </div>

            <div className="space1"></div>
            <div className="space1"></div>
            <div className="space1"></div>
            <Footer/>
        </div>
    );
}
