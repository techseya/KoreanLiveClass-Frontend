import "../Common/styles/home.css";
import { useEffect, useState, forwardRef } from "react";
import img1 from "../Assets/Images/curriculum.png";
import img2 from "../Assets/Images/teacher.png";
import img3 from "../Assets/Images/clock.png";
import { useNavigate } from "react-router-dom";
import thumb1 from "../Assets/Images/thumb1.jpg";
import thumb2 from "../Assets/Images/thumb2.jpg";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import insImg from "../Assets/Images/ins.jpg";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Tooltip, Dialog, AppBar, Toolbar, IconButton, Typography, Slide } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import chess from "../Assets/Images/chess.png";
import chess2 from "../Assets/Images/chess(blue).png";


// Modal transition animation
const Transition = forwardRef(function Transition(props: any, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function HomePage() {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [animate, setAnimate] = useState(true);
    const [typedText, setTypedText] = useState("");
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [visibleStartIndex, setVisibleStartIndex] = useState(0);

    const handleNext = () => {
        if (visibleStartIndex + 4 < topCourses.length) {
            setVisibleStartIndex(visibleStartIndex + 4);
        }
    };

    const handlePrev = () => {
        if (visibleStartIndex - 4 >= 0) {
            setVisibleStartIndex(visibleStartIndex - 4);
        }
    };

    const navigate = useNavigate();

    const sentences = ["17 Online courses", "Expert instruction", "Access anytime"];
    const images = [img1, img2, img3];
    const fullTitle = "Korean live class";

    const topCourses = [
        {
            title: "TOPIK 1-2 제 93회 අප්‍රේල් විභාගය",
            description: "වීසා මාරු කර ගැනීම සහා ශිෂ්‍ය වීසා සදහා අයදුම්කරුවන් සමත්විය යුතු විභාගය...",
            price: 1990.00,
            duration: "06:04:45 Hours",
            ratings: 5,
            label: "Beginner",
            lectureCount: 24,
            image: "https://source.unsplash.com/featured/?korean,language",
            instructor: "Ven. Kalyanapura Mangala"
        },
        {
            title: "Conversational Korean",
            description: "Master daily conversations and practical expressions in Korean.",
            price: 24990,
            duration: "4 weeks",
            ratings: 4,
            label: "Beginner",
            lectureCount: 18,
            image: "https://source.unsplash.com/featured/?conversation,korean",
            instructor: "Ven. Kalyanapura Mangala"
        },
        {
            title: "Korean Culture and Language",
            description: "Explore Korean traditions while improving your language skills.",
            price: 2199,
            duration: "5 weeks",
            ratings: 2,
            label: "Intermediate",
            lectureCount: 22,
            image: "https://source.unsplash.com/featured/?culture,korea",
            instructor: "Ven. Kalyanapura Mangala"
        },
        {
            title: "K-Drama Korean Language",
            description: "Learn Korean through popular K-Dramas and everyday dialogues.",
            price: 1799,
            duration: "3 weeks",
            ratings: 4,
            label: "Beginner",
            lectureCount: 15,
            image: "https://source.unsplash.com/featured/?kdrama,korean",
            instructor: "Ven. Kalyanapura Mangala"
        },
        {
            title: "Korean Culture and Language",
            description: "Explore Korean traditions while improving your language skills.",
            price: 2199,
            duration: "5 weeks",
            ratings: 2,
            label: "Intermediate",
            lectureCount: 22,
            image: "https://source.unsplash.com/featured/?culture,korea",
            instructor: "Ven. Kalyanapura Mangala"
        },
        {
            title: "K-Drama Korean Language",
            description: "Learn Korean through popular K-Dramas and everyday dialogues.",
            price: 1799,
            duration: "3 weeks",
            ratings: 4,
            label: "Beginner",
            lectureCount: 15,
            image: "https://source.unsplash.com/featured/?kdrama,korean",
            instructor: "Ven. Kalyanapura Mangala"
        },
        {
            title: "K-Drama Korean Language",
            description: "Learn Korean through popular K-Dramas and everyday dialogues.",
            price: 1799,
            duration: "3 weeks",
            ratings: 4,
            label: "Beginner",
            lectureCount: 15,
            image: "https://source.unsplash.com/featured/?kdrama,korean",
            instructor: "Ven. Kalyanapura Mangala"
        },
        {
            title: "Korean Culture and Language",
            description: "Explore Korean traditions while improving your language skills.",
            price: 2199,
            duration: "5 weeks",
            ratings: 2,
            label: "Intermediate",
            lectureCount: 22,
            image: "https://source.unsplash.com/featured/?culture,korea",
            instructor: "Ven. Kalyanapura Mangala"
        },
        {
            title: "K-Drama Korean Language",
            description: "Learn Korean through popular K-Dramas and everyday dialogues.",
            price: 1799,
            duration: "3 weeks",
            ratings: 4,
            label: "Beginner",
            lectureCount: 15,
            image: "https://source.unsplash.com/featured/?kdrama,korean",
            instructor: "Ven. Kalyanapura Mangala"
        }
    ];

    const categories = [
        {
            title: "TOPIK 1-2 제 93회 අප්‍රේල් විභාගය",
            count: 2,
        },
        {
            title: "Conversational Korean Basics",
            count: 5,
        },
        {
            title: "Korean Grammar and Writing",
            count: 3,
        },
        {
            title: "Korean Vocabulary Builder",
            count: 4,
        },
        {
            title: "K-Drama & K-Pop Language",
            count: 6,
        },
        {
            title: "Korean Culture and Society",
            count: 2,
        },
    ];

    const instructors = [
        {
            name: 'Ven. Kalyanapura Mangala',
            role: 'Korean Language Trainer at Korean Live Class',
            about: 'Ven.Kalyanapura Managala holds a Masters Degree from the Uiduk University South Korea , having qualified in Korean Language Training and Korean Lanaguage Ability Test conducted by the National Institute for International Education in South Korea. He holds a Bachelor of Arts Degree from the Department Of Buddhist Cultural Studies. (B/A) (Uiduk University South Korea), Bachelor Of Arts Degree (B/A) (Kelaniya University Sri Lanka), Korean Language Training And Korean Culture Program (Uiduk University South Korea), Korean Language Ability Test (National Institute for international Education South Korea), Korean Language Training And Culture Experience (Koica Sri Lanka), Spoken English Course (Royal Institute International School Of Higher Education Colombo Sri Lanka) and a Certificate in Microsoft Office Course. (JGO SOCIAL TRAINING CENTRE Sri Lanka)',
            image: '',
            skills: ['Korean Language', 'Training', 'Korean Culture'],
            socialMedia: [
                {
                    facebook: 'https://www.facebook.com/KoreanLiveClass/'
                },
                {
                    twitter: 'https://x.com/KoreanLiveClass'
                },
                {
                    linkedIn: 'https://www.linkedin.com/company/koreanlc'
                }
            ]
        }
    ]


    // Typing animation for title
    useEffect(() => {
        let index = 0;
        const typingInterval = setInterval(() => {
            setTypedText(fullTitle.slice(0, index + 1));
            index++;
            if (index === fullTitle.length) {
                clearInterval(typingInterval);
            }
        }, 300);
        return () => clearInterval(typingInterval);
    }, []);

    // Looping animated icon + sentence
    useEffect(() => {
        const interval = setInterval(() => {
            setAnimate(false);
            setTimeout(() => {
                setCurrentTextIndex((prev) => (prev + 1) % sentences.length);
                setAnimate(true);
            }, 100);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="homepage">
            <main className="main-content">
                <div className="main-inner main-img"></div>
                <div className="main-inner main-img2">
                    <div className="bg-overlay"></div>
                    <div className="main-sub-inner">
                        <div className="main-content-title typing">
                            {typedText}<span className="cursor">|</span>
                        </div>
                        <div className="main-content-desc">
                            Study korean language anytime, anywhere!
                        </div>
                        <div className={`slide-text ${animate ? "animate" : ""}`}>
                            <div className="anime-outer">
                                <div className="anime-inner">
                                    <img className="anime-logo" src={images[currentTextIndex]} alt="" />
                                    {sentences[currentTextIndex]}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <div className="top-courses-outer">
                <span className="top-courses-title">TOP COURSES</span>
            </div>

            <div className="top-courses-outer1">
                <div className="arrow-button" onClick={handlePrev} style={{ visibility: visibleStartIndex === 0 ? 'hidden' : 'visible' }}>
                    <ArrowBackIosIcon />
                </div>

                {topCourses.slice(visibleStartIndex, visibleStartIndex + 4).map((course, index) => (
                    <div
                        className="top-course-card"
                        key={index}
                        onClick={() => {
                            setSelectedCourse(course);
                            setIsModalOpen(true);
                        }}
                        style={{ cursor: "pointer" }}
                    >
                        {/* your card code here */}
                        <div className="course-thumbnail">
                            <img src={thumb1} alt="Course Thumbnail" />
                            <div className="price">Rs.{(course.price).toFixed(2)}</div>
                        </div>

                        <div className="course-info">
                            <span className="course-level">{course.label}</span>
                            <h3 className="course-title">{course.title}</h3>
                            <div className="course-rating">
                                {Array.from({ length: 5 }).map((_, i) =>
                                    i < course.ratings ? (
                                        <StarIcon key={i} sx={{ color: "#ffc107", fontSize: 20 }} />
                                    ) : (
                                        <StarBorderIcon key={i} sx={{ color: "#d1d5db", fontSize: 20 }} />
                                    )
                                )}
                            </div>
                        </div>

                        <div className="course-info2">
                            <Tooltip title={course.instructor} arrow placement="top">
                                <img className="ins-img" src={insImg} alt="Instructor" style={{ cursor: "pointer" }} />
                            </Tooltip>
                            <div className="course-duration">
                                <ClockCircleOutlined className="clock-icon" />
                                {course.duration}
                            </div>
                        </div>
                    </div>
                ))}

                <div className="arrow-button" onClick={handleNext} style={{ visibility: visibleStartIndex + 4 >= topCourses.length ? 'hidden' : 'visible' }}>
                    <ArrowForwardIosIcon />
                </div>
            </div>


            {/* Fullscreen Dialog Modal */}
            <Dialog
                fullScreen
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative', backgroundColor: '#3b82f6' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setIsModalOpen(false)}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Course Overview
                        </Typography>
                    </Toolbar>
                </AppBar>

                <div className="modal-content">
                    <img
                        src={thumb2}
                        alt="Course"
                        style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
                    />
                    <div style={{ padding: "20px" }}>
                        <Typography variant="h4" gutterBottom>
                            {selectedCourse?.title}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {selectedCourse?.description}
                        </Typography>
                        <Typography variant="h6">
                            Price: Rs.{(selectedCourse?.price)}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ mt: 1 }}>
                            Duration: {selectedCourse?.duration}
                        </Typography>
                        <div style={{ marginTop: "20px" }}>
                            <button className="enroll-btn">Enroll Now</button>
                        </div>
                    </div>
                </div>
            </Dialog>

            <div className="space"></div>
            <div className="space"></div>

            <div className="top-courses-outer">
                <span className="top-courses-title">CATEGORIES</span>
            </div>
            <div className="top-courses-outer2">
                {categories.map((category, index) => (
                    <div
                        className="category-card"
                        key={index}
                        onClick={() => {
                            console.log(`Clicked on category: ${category.title}`);
                        }}
                        style={{ cursor: "pointer" }}
                    >
                        <div className="course-info1">
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "10px", borderRadius: "50%", backgroundColor: "#3b82f6", width: "35px", height: "35px" }}>
                                <img className="chess" src={chess} alt="" />
                            </div>
                        </div>
                        <div className="course-info1">
                            <h3 className="course-title">{category.title}</h3>
                        </div>
                        <div className="course-info1">
                            <span className="course-description">{category.count} Courses</span>
                        </div>
                    </div>
                ))}
            </div>


            <div className="space"></div>
            <div className="space"></div>

            <div className="top-courses-outer">
                <span className="top-courses-title">INSTRUCTOR</span>
            </div>
            <div className="top-courses-outer2">
                {instructors.map((instructor, index) => (
                    <div className="instructor-card">
                        <div className="instructor-card-inner">
                            <img className="instructor-card-image" src={insImg} alt="" />
                        </div>
                        <div className="instructor-card-inner1">
                            <div className="instructor-name">{instructor.name}</div>
                            <div className="instructor-desc">{instructor.about}</div>
                            <div className="skills">
                                {instructor.skills.map((skill, idx) => (
                                    <div className="skill" key={idx}>
                                        {skill}
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
