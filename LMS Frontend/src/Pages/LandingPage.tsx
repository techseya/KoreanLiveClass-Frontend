import React, { forwardRef, useEffect, useState } from "react";
import "../Common/styles/main.css";
import "../Common/styles/home.css";
import { useTranslation } from "react-i18next";
import k1 from "../Assets/Images/k1.jpg";
import k2 from "../Assets/Images/k2.jpg";
import k3 from "../Assets/Images/k3.jpg";
import logo from "../Assets/Images/logo.jpeg"
import { AccessTime, Adjust, CheckCircleOutline, Facebook, Instagram, Verified, X, YouTube } from "@mui/icons-material";
import AOS from 'aos';
import 'aos/dist/aos.css';
import phoneTemp from "../Assets/Images/phone-template.png"
import b1 from "../Assets/Images/b1.png"
import b2 from "../Assets/Images/b2.png"
import b3 from "../Assets/Images/b3.png"
import b4 from "../Assets/Images/b4.png"
import b5 from "../Assets/Images/b5.png"
import b6 from "../Assets/Images/b6.png"
import b7 from "../Assets/Images/b7.png"
import b8 from "../Assets/Images/b8.png"
import b9 from "../Assets/Images/b9.png"
import b10 from "../Assets/Images/b10.png"
import b11 from "../Assets/Images/b11.png"
import monkImage from "../Assets/Images/monk.png"
import s1 from "../Assets/Images/language.png"
import s2 from "../Assets/Images/guidance.png"
import s3 from "../Assets/Images/access-control.png"
import s4 from "../Assets/Images/hints.png"
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
import fb from "../Assets/Images/facebook.png"
import twitter from "../Assets/Images/twitter.png"
import linkedin from "../Assets/Images/linkedin.png"

const Transition = forwardRef(function Transition(props: any, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Landing() {
  const { t, i18n } = useTranslation();
  const [bgIndex, setBgIndex] = useState(0);

  const [fabOpen, setFabOpen] = useState(false);
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

  const toggleFab = () => setFabOpen(!fabOpen);

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


  const images = [k1, k2, k3];
  const koreanLetters = [""];

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div
      className="main-outer"
      style={{ backgroundImage: `url(${images[bgIndex]})` }}
    >
      <div className="bg-overlay"></div>

      <div className="floating-letters">
        {koreanLetters.map((letter, index) => (
          <span key={index} className={`floating-letter letter-${index}`}>
            {letter}
          </span>
        ))}
      </div>

      <div className="banner-strip">
        <span className="banner-text">
          {t("Korean Live Class Student Portal")}
        </span>
      </div>

      <div className="main-banner-strip">
        <div className="mbs">
          <div className="main-banner-desc">{t("HeroDesc")}</div>
        </div>
      </div>

      <div className="red-outer">
        <div className="red-inner">
          <div className="red-text">
            {t("red-text")}
          </div>
          <button style={{ zIndex: 10 }} className="btn signup">{t('SignUp')}</button>
        </div>
      </div>

      <div className="second-outer">
        <div className="animated-shapes">
          <span className="shape shape1"></span>
          <span className="shape shape2"></span>
          <span className="shape shape3"></span>
          <span className="shape shape4"></span>
          <span className="shape shape5"></span>
          <span className="shape shape6"></span>
        </div>
        <div className="second-inner-wrapper">
          <div className="second-inner" data-aos="fade-up">
            <div className="second-title" data-aos="fade-up" data-aos-delay="100">
              {t("who")}
            </div>
            <div className="second-desc">
              {t("who-desc")}
            </div>
            <div className="space"></div>
            <div className="space"></div>
            <div className="second-content" data-aos="fade-up" data-aos-delay="200">
              <Verified style={{ color: "#4caf50", marginRight: '10px' }} />{t("who-content1")}
            </div>
            <div className="second-content" data-aos="fade-up" data-aos-delay="200">
              <Verified style={{ color: "#4caf50", marginRight: '10px' }} />{t("who-content2")}
            </div>
            <div className="second-content" data-aos="fade-up" data-aos-delay="200">
              <Verified style={{ color: "#4caf50", marginRight: '10px' }} />{t("who-content3")}
            </div>
            <div className="second-content" data-aos="fade-up" data-aos-delay="200">
              <Verified style={{ color: "#4caf50", marginRight: '10px' }} />{t("who-content4")}
            </div>
            <div className="second-content" data-aos="fade-up" data-aos-delay="200">
              <Verified style={{ color: "#4caf50", marginRight: '10px' }} />{t("who-content5")}
            </div>
            <div className="second-content" data-aos="fade-up" data-aos-delay="200">
              <Verified style={{ color: "#4caf50", marginRight: '10px' }} />{t("who-content6")}
            </div>
          </div>
        </div>
        <div className="second-inner1">
          <div className="phone-outer">
            <img src={phoneTemp} alt="Phone" className="phone-bg" />
            <div className="phone-inner">
              <img className="phone-logo" src={logo} alt="Logo" />
              <div className="phone-title">Korean Live Class</div>
              <div className="space"></div>
              <div className="space"></div>
              <div className="space"></div>
              <div className="pcard-inner">
                <div className="pcard">
                  <Adjust className="picon" />
                  <div className="ptext">17 {t('ptext1')}</div>
                </div>
              </div>
              <div className="pcard-inner">
                <div className="pcard">
                  <CheckCircleOutline className="picon" />
                  <div className="ptext">{t('ptext2')}</div>
                </div>
              </div>
              <div className="pcard-inner">
                <div className="pcard">
                  <AccessTime className="picon" />
                  <div className="ptext">{t('ptext3')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space"></div>
      <div className="space"></div>
      <div className="space"></div>

      <div className="third-outer">
        <div className="third-inner">
          <div className="ti">
            <div className="third-inner-title">
              {t("benefits")}
            </div>
          </div>
        </div>

        <div className="space"></div>
        <div className="space"></div>
        <div className="third-inner1" data-aos="fade-up">
          <div className="ti1">
            <div className="third-inner-content" data-aos="fade-up">

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="100">
                <img className="tic-img" src={b1} alt="" />
                <div className="tic-title">{t("benefits-content1")}</div>
              </div>

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="120">
                <img className="tic-img" src={b2} alt="" />
                <div className="tic-title">{t("benefits-content1")}</div>
              </div>

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="140">
                <img className="tic-img" src={b3} alt="" />
                <div className="tic-title">{t("benefits-content1")}</div>
              </div>

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="160">
                <img className="tic-img" src={b4} alt="" />
                <div className="tic-title">{t("benefits-content1")}</div>
              </div>

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="100">
                <img className="tic-img" src={b5} alt="" />
                <div className="tic-title">{t("benefits-content1")}</div>
              </div>

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="120">
                <img className="tic-img" src={b6} alt="" />
                <div className="tic-title">{t("benefits-content1")}</div>
              </div>

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="140">
                <img className="tic-img" src={b7} alt="" />
                <div className="tic-title">{t("benefits-content1")}</div>
              </div>

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="160">
                <img className="tic-img" src={b8} alt="" />
                <div className="tic-title">{t("benefits-content1")}</div>
              </div>

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="100">
                <img className="tic-img" src={b9} alt="" />
                <div className="tic-title">{t("benefits-content1")}</div>
              </div>

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="120">
                <img className="tic-img" src={b10} alt="" />
                <div className="tic-title">{t("benefits-content1")}</div>
              </div>

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="140">
                <img className="tic-img" src={b11} alt="" />
                <div className="tic-title">{t("benefits-content1")}</div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="space"></div>
      <div className="space"></div>
      <div className="space"></div>

      <div className="third-outer">
        <div className="third-inner">
          <div className="ti">
            <div className="third-inner-title">
              {t("services")}
            </div>
          </div>
        </div>

        <div className="space"></div>
        <div className="space"></div>

        <div className="fourth-inner">
          <div className="bg-overlay1"></div>
          <div className="wave-lines-bg" />
          <div className="wave-lines-bg1" />
          <div className="fourth-inner1">
            <div className="monk-wrapper" data-aos="fade-up" data-aos-delay="100">
              <img src={monkImage} alt="Monk" className="monk-img" />
            </div>

            <div className="corner-box top-left" data-aos="fade-up-right" data-aos-delay="100">
              <div className="corner-inner">
                <img className="corner-img" src={s1} alt="" />
              </div>
              <div className="corner-inner1">
                <div className="corner-title">{t("services-title1")}</div>
                <div className="corner-desc">{t("services-content1")}</div>
              </div>
            </div>
            <div className="corner-box top-right" data-aos="fade-up-left" data-aos-delay="100">
              <div className="corner-inner">
                <img className="corner-img" src={s2} alt="" />
              </div>
              <div className="corner-inner1">
                <div className="corner-title">{t("services-title2")}</div>
                <div className="corner-desc">{t("services-content2")}</div>
              </div>
            </div>
            <div className="corner-box bottom-left" data-aos="fade-up-right" data-aos-delay="100">
              <div className="corner-inner">
                <img className="corner-img" src={s3} alt="" />
              </div>
              <div className="corner-inner1">
                <div className="corner-title">{t("services-title3")}</div>
                <div className="corner-desc">{t("services-content3")}</div>
              </div>
            </div>
            <div className="corner-box bottom-right" data-aos="fade-up-left" data-aos-delay="100">
              <div className="corner-inner">
                <img className="corner-img" src={s4} alt="" />
              </div>
              <div className="corner-inner1">
                <div className="corner-title">{t("services-title4")}</div>
                <div className="corner-desc">{t("services-content4")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space"></div>
      <div className="space"></div>

      <div className="third-outer">
        <div className="third-inner">
          <div className="ti">
            <div className="third-inner-title" data-aos="fade-up" data-aos-delay="100">
              {t("top-courses")}
            </div>
          </div>
        </div>

        <div className="space"></div>
        <div className="space"></div>
        <div className="top-courses-outer1" data-aos="fade-up" data-aos-delay="100">
          <div className="arrow-button" onClick={handlePrev} style={{ visibility: visibleStartIndex === 0 ? 'hidden' : 'visible' }}>
            <ArrowBackIosIcon />
          </div>

          {topCourses.slice(visibleStartIndex, visibleStartIndex + 4).map((course, index) => (
            <div
              className="top-course-card"
              data-aos="fade-up" data-aos-delay="100"
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
      </div>


      {/*<div className="third-outer">
        <div className="third-inner">
          <div className="ti">
            <div className="third-inner-title" data-aos="fade-up" data-aos-delay="100">
              {t("top-categories")}
            </div>
          </div>
        </div>

        <div className="space"></div>
        <div className="space"></div>

        <div className="top-courses-outer2">
          {categories.map((category, index) => (
            <div
              className="category-card"
              data-aos="fade-up" data-aos-delay="100"
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
      </div>

      <div className="third-outer">
        <div className="third-inner">
          <div className="ti">
            <div className="third-inner-title" data-aos="fade-up" data-aos-delay="100">
              {t("top-categories")}
            </div>
          </div>
        </div>
        </div>*/}

      {/*<><div className="top-courses-outer">
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
              <div className="role">{instructor.role}</div>
              <div className="skills">
                {instructor.skills.map((skill, idx) => (
                  <div className="skill" key={idx}>
                    {skill}
                  </div>
                ))}
              </div>
              <div className="instructor-desc">{instructor.about}</div>
              <div className="skills right-align">
                <div>
                  <a className="sm" href={instructor.socialMedia[0].facebook} target="_blank" rel="noopener noreferrer">
                    <img className="sm-icon" src={fb} alt="" />
                  </a>
                </div>
                <div>
                  <a className="sm" href={instructor.socialMedia[0].linkedIn} target="_blank" rel="noopener noreferrer">
                    <img className="sm-icon" src={linkedin} alt="" />
                  </a>
                </div>
                <div>
                  <a className="sm" href={instructor.socialMedia[0].twitter} target="_blank" rel="noopener noreferrer">
                    <img className="sm-icon" src={twitter} alt="" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </>*/}



      <div className="fab-container">
        <a href="https://facebook.com" target="_blank" className="fab fab-icon facebook"><Facebook /></a>
        <a href="https://twitter.com" target="_blank" className="fab fab-icon twitter"><X /></a>
        <a href="https://instagram.com" target="_blank" className="fab fab-icon instagram"><Instagram /></a>
        <a href="https://youtube.com" target="_blank" className="fab fab-icon youtube"><YouTube /></a>
      </div>
    </div>
  );
}