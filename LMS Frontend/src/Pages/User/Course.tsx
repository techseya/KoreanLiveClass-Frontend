import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import "../../Common/styles/courses.css";
import { useEffect, useState } from "react";
import { getCourseByCourseId, getRecordingsBySectionId, getSectionByCourseId } from "src/Services/course_api";
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
    const [courseData, setCourseData] = useState<any>();
    const [sections, setSections] = useState<any[]>([]);
    const [recordingsMap, setRecordingsMap] = useState<Record<string, any[]>>({});
    const [expandedSection, setExpandedSection] = useState<string | false>(false);
    const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);
    const [videoType, setVideoType] = useState<string | null>(null);
    const { t, i18n } = useTranslation();

    const token = localStorage.getItem("token")
    const [searchParams] = useSearchParams();

    const navigate = useNavigate()

    useEffect(() => {
        const pathSegments = location.pathname.split("/").filter(Boolean);
        const lastPath = pathSegments[pathSegments.length - 1];

        handleGetCourse(lastPath);
        if (lastPath) handleGetSections(lastPath);
        window.scrollTo(0, 0);
    }, []);

    // useEffect(() => {
    //     const videoUrl = searchParams.get("video");
    //     if (videoUrl) {
    //         setPlayingVideoUrl(decodeURIComponent(videoUrl));
    //         const isYouTube = videoUrl.includes("youtube") || videoUrl.includes("youtu.be");
    //         const isVimeo = videoUrl.includes("vimeo");

    //         if (isYouTube) setVideoType("YouTube");
    //         else if (isVimeo) setVideoType("Vimeo");
    //     }
    // }, [searchParams]);

    useEffect(() => {
        const videoUrl = searchParams.get("video");
        if (videoUrl) {
            const decodedUrl = decodeURIComponent(videoUrl);
            setPlayingVideoUrl(decodedUrl);
            const isYouTube = decodedUrl.includes("youtube") || decodedUrl.includes("youtu.be");
            const isVimeo = decodedUrl.includes("vimeo");

            if (isYouTube) setVideoType("YouTube");
            else if (isVimeo) setVideoType("Vimeo");

            // Try to find and expand the section
            (async () => {
                for (const section of sections) {
                    const response = await getRecordingsBySectionId(section.id);
                    const recordings = response.data || [];
                    const matching = recordings.find((rec: any) => rec.recordLink === decodedUrl);
                    if (matching) {
                        setExpandedSection(section.name);
                        handleGetRecordings(section.id); // loads if not already loaded
                        break;
                    }
                }
            })();
        }
    }, [searchParams, sections]);



    const scrollTop = () => {
        window.scrollTo(0, 0);
    }

    const handleGetSections = async (id: any) => {
        try {
            const response = await getSectionByCourseId(id);
            const filteredSections = (response.data || []).filter(
                (section: any) => section.activeStatus === 1
            );
            setSections(filteredSections);
        } catch (error) {
            console.error("Error fetching sections", error);
        }
    };

    const handleGetCourse = async (id: any) => {
        try {
            const res = await getCourseByCourseId(id, token);
            setCourseData(res.data);
        } catch (error) {
            console.error("Error fetching course", error);
        }
    }


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


    // const getVimeoEmbedUrl = (url: string) => {
    //     const videoId = url.split("/").pop();
    //     return `https://player.vimeo.com/video/${videoId}`;
    // };

    // const getYoutubeEmbedUrl = (url: string) => {
    //     const videoId = url.split("/").pop();
    //     return `https://www.youtube.com/embed/${videoId}`;
    // };

    const getVimeoEmbedUrl = (url: string) => {
    const videoId = url.split("/").pop();
    return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
};

const getYoutubeEmbedUrl = (url: string) => {
    const videoId = url.split("/").pop();
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
};

    const handleVideoSelection = (rec: any) => {
        scrollTop()
        setVideoType(rec.videoType);
        setPlayingVideoUrl(rec.recordLink);
        const videoParam = encodeURIComponent(rec.recordLink); // assuming rec.id is unique
        navigate(`${location.pathname}?video=${videoParam}`, { replace: false });
    };

    return (
        <div className="courses-main-outer">
            <div className="cc">
                <div className="c-items-outer">
                    <div className="c-title">{courseData?.name}</div>
                </div>
                <div className="c-desc">{courseData?.description}</div>
                <div className="c-items-outer">
                    <div className="c-label">{courseData?.level}</div>
                    <div className="c-section-count">Sections : {courseData?.sectionCount}</div>
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
                            <img className="c-thumb" src={courseData?.thumbnail.replace("dl=0", "raw=1")} alt="Course Thumbnail" />
                        )}
                    </div>

                    <div className="c-in1">
                        {courseData?.transactionStatus === 1 ? (
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
                        ) : (
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
                            <img className="c-thumb" src={courseData?.thumbnail.replace("dl=0", "raw=1")} alt="Course Thumbnail" />
                        )}
                    </div>
                </div>
                {courseData?.transactionStatus !== 2 && (
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
            <Footer />
        </div>
    );
}
