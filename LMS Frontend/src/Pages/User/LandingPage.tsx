import React, { forwardRef, useEffect, useState } from "react";
import "../../Common/styles/main.css";
import "../../Common/styles/home.css";
import { useTranslation } from "react-i18next";
import k1 from "../../Assets/Images/k1.jpg";
import k2 from "../../Assets/Images/k2.jpg";
import k3 from "../../Assets/Images/k3.jpg";
import logo from "../../Assets/Images/logo.jpeg"
import { AccessTime, Adjust, CheckCircleOutline, Facebook, Instagram, Verified, WhatsApp, X, YouTube } from "@mui/icons-material";
import AOS from 'aos';
import 'aos/dist/aos.css';
import phoneTemp from "../../Assets/Images/phone-template.png"
import b1 from "../../Assets/Images/b1.png"
import b2 from "../../Assets/Images/b2.png"
import b3 from "../../Assets/Images/b3.png"
import b4 from "../../Assets/Images/b4.png"
import b5 from "../../Assets/Images/b5.png"
import b6 from "../../Assets/Images/b6.png"
import b7 from "../../Assets/Images/b7.png"
import b8 from "../../Assets/Images/b8.png"
import b9 from "../../Assets/Images/b9.png"
import b10 from "../../Assets/Images/b10.png"
import b11 from "../../Assets/Images/b11.png"
import monkImage from "../../Assets/Images/play-button.png"
import s1 from "../../Assets/Images/language.png"
import s2 from "../../Assets/Images/guidance.png"
import s3 from "../../Assets/Images/access-control.png"
import s4 from "../../Assets/Images/hints.png"
import thumb1 from "../../Assets/Images/thumb1.jpg";
import thumb2 from "../../Assets/Images/thumb2.jpg";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import insImg from "../../Assets/Images/ins.jpg";
import { ClockCircleOutlined, TikTokFilled } from "@ant-design/icons";
import { Tooltip, Dialog, AppBar, Toolbar, IconButton, Typography, Slide } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import chess from "../../Assets/Images/chess.png";
import insMain from "../../Assets/Images/ins1.jpg";
import Footer from "../../Layout/Footer";
import LoginDialogbox from "src/Common/Components/LoginDialog";
import { useNavigate } from "react-router-dom";
import { getCategories } from "src/Services/category_api";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { getTopCourses } from "src/Services/course_api";

const Transition = forwardRef(function Transition(props: any, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Landing() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation();
  const [bgIndex, setBgIndex] = useState(0);

  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const [categories, setCategories] = useState<any[]>([])
  const [topCourses, setTopCourses] = useState<any[]>([])
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isModalOpen1, setIsModalOpen1] = useState(false);

  const handleBookClick = (book: any) => {
    setSelectedBook(book);
    setIsModalOpen1(true);
  };

  const closeModal = () => {
    setIsModalOpen1(false);
    setSelectedBook(null);
  };

  const handleLogin = () => {
    navigate("/dashboard")
    setLoginOpen(false);
  };

  const handleLoginOpen = () => {
    getDeviceId();
    setLoginOpen(true);
  };

  const handleRegister = () => {
    navigate("/register")
  }

  const handleClose = () => {
    setLoginOpen(false);
  };

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

  const handleNext1 = () => {
    if (visibleIndex + 4 < url.length) {
      setVisibleIndex(visibleIndex + 4);
    }
  };

  const handlePrev1 = () => {
    if (visibleIndex - 4 >= 0) {
      setVisibleIndex(visibleIndex - 4);
    }
  };

  const handleCourseClick = (course: any) => {

    navigate(`/course`, {
      state: {
        id: course.id,
        name: course.name,
        description: course.description,
        thumbnail: course.thumbnail,
        level: course.level,
        totalDuration: course.totalDuration,
        price: course.price,
        sectionCount: course.sectionCount,
      }
    });
  };

  const images = [k1, k2, k3];
  const koreanLetters = [""];

  useEffect(() => {
    const hasRefreshed = sessionStorage.getItem("hasRefreshed");

    if (!hasRefreshed) {
      sessionStorage.setItem("hasRefreshed", "true");
      window.location.reload(); // Only once per session
      return;
    }

    handleGetCategories();
    handleGetTopCourses()

    AOS.init({
      duration: 1000,
      once: true
    });

    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const getDeviceId = async () => {
    const fp = await FingerprintJS.load();

    let attempts = 0;
    let stableId = '';

    while (attempts < 3) {
      const result = await fp.get();
      const id = result.visitorId;

      console.log(`Attempt ${attempts + 1}: ${id}`);

      // If this is not the first attempt and ID matches previous, consider it stable
      if (stableId && id === stableId) {
        break;
      }

      stableId = id;
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 300)); // wait a bit between attempts
    }

    alert(stableId);

  };

  const handleGetTopCourses = async () => {
    try {
      const response = await getTopCourses()
      const activeCourses = response.data.filter((course: any) => course.activeStatus === 1);
      setTopCourses(activeCourses)
    } catch (error) {
      console.error(error);
    }
  }

  const handleGetCategories = async () => {
    try {
      const response = await getCategories();
      const activeCategories = response.data.filter((category: any) => category.activeStatus === 1);
      setCategories(activeCategories);
    } catch (error) {
      console.error(error);
    }
  };

  const url = [
    { url: "https://www.youtube.com/embed/fth6vweRyFA?&modestbranding=1&rel=0&playsinline=1" },
    { url: "https://www.youtube.com/embed/fth6vweRyFA?&modestbranding=1&rel=0&playsinline=1" },
    { url: "https://www.youtube.com/embed/fth6vweRyFA?&modestbranding=1&rel=0&playsinline=1" },
    { url: "https://www.youtube.com/embed/fth6vweRyFA?&modestbranding=1&rel=0&playsinline=1" },
    { url: "https://www.youtube.com/embed/fth6vweRyFA?&modestbranding=1&rel=0&playsinline=1" }
  ];

  const books = [
    {
      name: "EPS TOPIK BOOK – 1",
      description: "කොරියානු රැකියාවක් සදහා කොරියානු රජයේ අනුමත පාඩම් හැටකින් යුක්ත විෂය නිර්දේශයේ පළමු පාඩම් 30 මෙහි අන්තර්ගත වේ. මෙම ග්‍රන්ථයේ කොරියන් අක්ෂර ලියන ආකාරයේ සිට මූලික ව්‍යාකරණ එසේම වචන පිලිබදවත් පැහැදිලි කරනු ලබයි. මෙහි කෙටි වාක්‍ය සහ ජේද භාවිතා කරමින් අනුමාන ප්‍රශ්ණ පත්‍රයන්ද මෙහිදී ඔබට අධ්‍යනය කිරීමට හැකියාව ලැබේ. මෙහි සියලු පාඩම් ඔබට Korean Live Class Mobile App එක හරහා ඉගෙනීමටත් හැකියාවක් ඇත.",
      price: 0,
      tag: true,
      image: "https://www.koreanliveclass.com/wp-content/uploads/2020/09/TOPIK-1.jpg"
    },
    {
      name: "EPS TOPIK BOOK – 2",
      description: "කොරියානු රජයේ අනුමත පාඩම් හැටකින් යුක්ත විෂය නිර්දේශයේ දෙවන පාඩම් 30 මෙහි අන්තර්ගත වේ. මෙම කොටසේදී වැඩබිමෙහි දැනගෙන සිටිය යුතු සංස්කෘතීන් / නීති රෙගුලාසි ආදී කරුණුත් එසේම පළමු පොතට වඩා ගැඹුරු ව්‍යාකරණ සහ වචන ඉගෙනීමටත් හැකියාව ලැබේ. එසේම දීර්ඝ ජේද සහ වාක්‍යයන් භාවිතා කරමින් අනුමාන ප්‍රශ්ණ පත්‍රයන්ට මුහුණ දීමටත් ඒවාට උත්තර සපයන ආකාරයත් මෙම ග්‍රන්ථ භාවිතා කිරීමෙන් ඔබට ඉගෙනීමට හැක. මෙහි සියලු පාඩම් ඔබට Korean Live Class Mobile App එක හරහා ඉගෙනීමටත් හැකියාවක් ඇත.",
      price: 0,
      tag: true,
      image: "https://www.koreanliveclass.com/wp-content/uploads/2020/09/2.jpg"
    },
    {
      name: "VERBS CLASSIFICATION",
      description: "ක්‍රියාපද වර්ගීකරණය වන මෙම ග්‍රන්ථය මගින් ඔබගේ කොරියන් භාෂා දැනුම ඉතා කෙටි කාලයකින් දියුණු කර ගැනීමට හැකියාව ඇත. මෙහිදී ක්‍රියාපද 125 ක් ව්‍යාකරණ ක්‍රම 45 ක් සමග වර නගා ඇත. කථා බහේදී නිතර භාවිතා වන ව්‍යාකරණ මෙම ග්‍රන්ථයේදී වරනගා තිබේ.",
      price: 1200.00,
      tag: true,
      image: "https://www.koreanliveclass.com/wp-content/uploads/2020/09/1-1-677x927.jpg"
    },
    {
      name: "KOREAN LANGUAGE NOUNS & VERBS",
      description: "කොරියන් භාෂාවේ එදිනෙදා නිතර භාවිත වන නාම පද හා ක්‍රියාපද එකතුකර නිර්මාණය කරන ලද ග්‍රන්ථයකි. මෙහි කොරියන් වචන උච්චාරණය කොරියන් ජාතික නිවේදිකාවක් විසින් සිදුකරන අතර එහි සිංහල අර්ථයද එකතු කර තිබේ. මෙහි හඩ පටයත් ඔබට ලබා ගත හැක.",
      price: 1000.00,
      tag: true,
      image: "https://www.koreanliveclass.com/wp-content/uploads/2020/09/1-1-scaled-677x936.jpeg"
    },
    {
      name: "Korean Language Grammer – Part 1",
      description: "මෙම ග්‍රන්ථය කොරියන් භාෂාවේ ව්‍යාකරණ පිලිබදව සිදුකල ග්‍රන්ථයකි. මෙය 2016 වර්ෂයේ සිට 2017වර්ෂය දක්වා YouTube හරහා සිදුකල පාඩම් මාලාවේ අත් පොතයි. මෙහි සියලු ව්‍යාකරණ සහ උදාහරණ වාක්‍ය සියල්ල කොරියන් භාෂාවෙන් පමණක් සිදු කිරීමට හේතුව වන්නේ අදාල පාඩම් හි Videos බලා ලිවීමට හුරුකරවීමට ඇති අවශ්‍යතාවයයි.",
      price: 1100.00,
      tag: true,
      image: "https://www.koreanliveclass.com/wp-content/uploads/2020/09/1-2-scaled-677x936.jpeg"
    },
    {
      name: "KOREAN SINHALA DICTIONARY",
      description: "කොරියන් සිංහල ශබ්දකෝෂය කොරියන් විභාගයන්ට අනිවාර්යෙන්ම දැනගෙන සිටියයුතු වචන එකතුකර කරන ලද ග්‍රන්ථයකි. එසේම කොරියාවේ උසස් අධ්‍යාපනය ලබන්නට බලාපොරොත්තු වන්නේ නම් මෙම ග්‍රන්ථය ඔබට මහත් උපකාරයක් වනු ඇත.",
      price: 0,
      tag: false,
      image: "https://www.koreanliveclass.com/wp-content/uploads/2020/09/1-3-scaled-677x974.jpeg"
    },
    {
      name: "TOPIK 1 ~ 2",
      description: "මෙම ග්‍රන්ථය ටොපික් පළමු සහ දෙවන පන්ති විභාගය ඉලක්ක කර නිර්මාණය කරන ලද ප්‍රශ්ණපත්‍ර පොතකි. මෙහි Listening සහ Reading ආදී වශයෙන් වන අතර ප්‍රශ්ණපත්‍ර තුන බැගින් සාකච්ජ්චා කර ඇත. මෙම විභාගය කොරියාවේ පමණක් නොව ශ්‍රී ලංකාවේදී ද මුහුණ දීමට හැකියාව ඇත. මෙයට අදාල සියලු පාඩම් YouTube හරහා නැරබීමටත් හැක. මෙමෙ විභාගයට මුහුණ දීම තුලින් ඔබට වීසා මරු කිරීමෙදී විශාල උදව්වක් වනු ඇත.",
      price: 0,
      tag: false,
      image: "https://www.koreanliveclass.com/wp-content/uploads/2020/09/1-677x902.jpg"
    },
    {
      name: "TOPIK 3 ~ 6",
      description: "මෙම ප්‍රශ්ණපත්‍ර පොත ටොපික් තුන්වන සහ හයවන පන්ති විභාගය ඉලක්ක කර නිර්මාණය කරන ලද ග්‍රන්ථයකි. මෙහිදී ප්‍රශ්ණපත්‍ර එක බැගින් සාකච්ජ්චා වන අතර එය Listening / Reading / Writing වශයෙන් කොටස් තුනකින් යුක්තය. මෙම විභාගයත් ශ්‍රී ලංකාවේ සිට මහුණ දීමට හැකි අතර ඔබ කොරියාවට පැමිණි පසු වෙනත් වීසා වලට මාරු වීමේදී ප්‍රයෝජනවත්ය. මෙයට අදාල සියලු පාඩම් YouTube හරහා නැරබීමටත් හැක.",
      price: 0,
      tag: false,
      image: "https://www.koreanliveclass.com/wp-content/uploads/2020/09/1-scaled-677x948.jpeg"
    }
  ]

  return (
    <div
      className="main-outer"
      style={{ backgroundImage: `url(${images[bgIndex]})` }}
    >
      <LoginDialogbox
        open={loginOpen}
        onAgree={handleLogin}
        onClose={handleClose}
      />
      <div className="bg-overlay0"></div>

      <div className="floating-letters">
        {koreanLetters.map((letter, index) => (
          <span key={index} className={`floating-letter letter-${index}`}>
            {letter}
          </span>
        ))}
      </div>

      <div className="whatsapp-outer" onClick={() =>
        window.open(
          "https://wa.me/821090736674?text=Hello",
          "_blank"
        )
      }>
        <WhatsApp />
        <div className="whatsapp-text">WhatsApp</div>
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

      {/* {<div className="red-outer">
        <div className="red-inner">
          <div className="red-text">
            {t("red-text")}
          </div>
          <button onClick={handleRegister} style={{ zIndex: 10 }} className="btn signup">{t('SignUp')}</button>
        </div>
      </div>} */}

      <div className="second-outer">
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
        {/* {<div className="second-inner1">
          <div className="phone-outer">
            <img src={phoneTemp} alt="Phone" className="phone-bg" />
            <div className="phone-inner">
              <img className="phone-logo" src={logo} alt="Logo" />
              <div className="phone-title">{t("phoneT")}</div>
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
        </div>} */}
        <div className="second-inner1">
          <div className="phone-outer">
            <img src={phoneTemp} alt="Phone" className="phone-bg" />
            <div className="phone-inner">
              <img className="phone-logo" src={logo} alt="Logo" />
              <div className="phone-title">{t("phoneT")}</div>
              <div className="space"></div>
              <div className="pcard-inner">
                <div className="pcard1">
                  <div className="pc hover-hide-controls">
                    <iframe
                      className="video-embed"
                      src="https://www.youtube.com/embed/Dj5VolioQSk?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0"
                      title="YouTube video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
              <div className="pcard-inner">
                <div className="pcard1">
                  <div className="pc hover-hide-controls">
                    <iframe
                      className="video-embed"
                      src="https://www.youtube.com/embed/UTkjEDygbb0?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&playsinline=1"
                      title="YouTube video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
              <div className="pcard-inner">
                <div className="pcard1">
                  <div className="pc hover-hide-controls">
                    <iframe
                      className="video-embed"
                      src="https://www.youtube.com/embed/PwZk7_QRpQ4?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&playsinline=1"
                      title="YouTube video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay"
                      allowFullScreen
                    ></iframe>
                  </div>
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
            <div className="third-inner-title" data-aos="fade-up" data-aos-delay="100">
              {t("top-courses")}
            </div>
          </div>
        </div>

        <div className="space"></div>
        <div className="space"></div>
        <div className="top-courses-outer1" data-aos="fade-up" data-aos-delay="100">
          {Array.isArray(topCourses) && topCourses.slice(visibleStartIndex, visibleStartIndex + 4).map((course, index) => (
            <div
              className="top-course-card"
              data-aos="fade-up" data-aos-delay="100"
              key={index}
              onClick={() => handleCourseClick(course)}
              style={{ cursor: "pointer" }}
            >
              {/* your card code here */}
              <div className="course-thumbnail">
                <img src={course.thumbnail} alt="Course Thumbnail" />
                <div className="price">Rs.{(course.price).toFixed(2)}</div>
              </div>

              <div className="course-info">
                {<span className="course-level">{course.level}</span>}
                <h3 className="course-title">{course.name}</h3>
                {/*<div className="course-rating">
                  {Array.from({ length: 5 }).map((_, i) =>
                    i < course.ratings ? (
                      <StarIcon key={i} sx={{ color: "#ffc107", fontSize: 20 }} />
                    ) : (
                      <StarBorderIcon key={i} sx={{ color: "#d1d5db", fontSize: 20 }} />
                    )
                  )}
                </div>*/}
              </div>

              <div className="course-info2">
                <Tooltip title="Ven. Kalyanapura Mangala" arrow placement="top">
                  <img className="ins-img" src={insImg} alt="Instructor" style={{ cursor: "pointer" }} />
                </Tooltip>
                <div className="course-duration">
                  <ClockCircleOutlined className="clock-icon" />
                  {course.totalDuration} Hours
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Arrow Button Row */}
        <div className="arrow-buttons-row">
          <div
            className="arrow-button"
            onClick={handlePrev}
            style={{ visibility: visibleStartIndex === 0 ? "hidden" : "visible" }}
          >
            <ArrowBackIosIcon />
          </div>

          <div
            className="arrow-button"
            onClick={handleNext}
            style={{
              visibility: visibleStartIndex + 4 >= topCourses.length ? "hidden" : "visible",
            }}
          >
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
        <div className="space"></div>
      </div>

      <div className="third-outer">
        <div className="third-inner">
          <div className="ti">
            <div className="third-inner-title" data-aos="fade-up" data-aos-delay="100">
              {t("aboutKorea")}
            </div>
          </div>
        </div>
        <div className="space"></div>
        <div className="space"></div>
        <div className="top-courses-outer3" data-aos="fade-up" data-aos-delay="100">
          {url.slice(visibleIndex, visibleIndex + 4).map((u, index) => (
            <div className="i1">
              <iframe
                className="video-embed1"
                src={u.url}
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                data-aos="fade-up"
                data-aos-delay="500"
              ></iframe>
            </div>
          ))}
        </div>
        <div className="arrow-buttons-row">
          <div
            className="arrow-button"
            onClick={handlePrev1}
            style={{ visibility: visibleIndex === 0 ? "hidden" : "visible" }}
          >
            <ArrowBackIosIcon />
          </div>

          <div
            className="arrow-button"
            onClick={handleNext1}
            style={{
              visibility: visibleIndex + 4 >= url.length ? "hidden" : "visible",
            }}
          >
            <ArrowForwardIosIcon />
          </div>
        </div>

        <div className="space"></div>
        <div className="space"></div>
        <div className="space"></div>
      </div>

      <div className="space"></div>
      <div className="space"></div>

      <div className="third-outer">
        <div className="third-inner">
          <div className="ti">
            <div className="third-inner-title" data-aos="fade-up" data-aos-delay="100">
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
                <div className="tic-title">{t("benefits-content2")}</div>
              </div>

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="140">
                <img className="tic-img" src={b3} alt="" />
                <div className="tic-title">{t("benefits-content3")}</div>
              </div>

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="160">
                <img className="tic-img" src={b4} alt="" />
                <div className="tic-title">{t("benefits-content4")}</div>
              </div>

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="100">
                <img className="tic-img" src={b5} alt="" />
                <div className="tic-title">{t("benefits-content5")}</div>
              </div>

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="120">
                <img className="tic-img" src={b6} alt="" />
                <div className="tic-title">{t("benefits-content6")}</div>
              </div>

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="140">
                <img className="tic-img" src={b7} alt="" />
                <div className="tic-title">{t("benefits-content7")}</div>
              </div>

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="160">
                <img className="tic-img" src={b8} alt="" />
                <div className="tic-title">{t("benefits-content8")}</div>
              </div>

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="100">
                <img className="tic-img" src={b9} alt="" />
                <div className="tic-title">{t("benefits-content9")}</div>
              </div>

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="120">
                <img className="tic-img" src={b10} alt="" />
                <div className="tic-title">{t("benefits-content10")}</div>
              </div>

              <div className="third-inner-card" data-aos="fade-up" data-aos-delay="140">
                <img className="tic-img" src={b11} alt="" />
                <div className="tic-title">{t("benefits-content11")}</div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div id="korean-books" className="space"></div>
      <div className="space"></div>
      <div className="space"></div>
      <div className="space"></div>

      <div className="third-outer">
        <div className="third-inner">
          <div className="ti">
            <div className="third-inner-title" data-aos="fade-up" data-aos-delay="100">
              {t("kbooks")}
            </div>
          </div>
        </div>
        <div className="space"></div>
        <div className="space"></div>
        <div className="top-courses-outer4" data-aos="fade-up" data-aos-delay="100">
          {books.slice(visibleIndex, visibleIndex + 4).map((b, index) => (
            <div
              className="book-card"
              data-aos="fade-up" data-aos-delay="100"
              key={index}
              onClick={() => handleBookClick(b)}
              style={{ cursor: "pointer" }}
            >
              {/* your card code here */}
              <div className="book-thumbnail">
                <img className="book" src={b.image} alt="Course Thumbnail" />
              </div>

              <div className="course-info">
                <h3 className="course-title">{b.name}</h3>
              </div>
            </div>
          ))}
        </div>
        {isModalOpen1 && selectedBook && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={closeModal}>×</button>

              <img className="modal-image" src={selectedBook.image} alt={selectedBook.name} />

              <div className="modal-details">
                <h2>{selectedBook.name}</h2>
                <p className="modal-desc">{selectedBook.description}</p>

                <button onClick={() =>
                            window.open(
                                "https://wa.me/821090736674",
                              "_blank"
                            )
                          } className="purchase-btn">Purchase</button>
              </div>
            </div>
          </div>
        )}

        <div className="arrow-buttons-row">
          <div
            className="arrow-button"
            onClick={handlePrev1}
            style={{ visibility: visibleIndex === 0 ? "hidden" : "visible" }}
          >
            <ArrowBackIosIcon />
          </div>

          <div
            className="arrow-button"
            onClick={handleNext1}
            style={{
              visibility: visibleIndex + 4 >= url.length ? "hidden" : "visible",
            }}
          >
            <ArrowForwardIosIcon />
          </div>
        </div>
      </div>

        <div className="space"></div>
        <div className="space"></div>
        <div className="space"></div>
        <div className="space"></div>

      <div className="ins-outer">
        <div className="ins-inner">
          <div className="ins-inner1">
            <div className="ins-in">
              <div className="img1">
                <iframe
                  className="video-embed"
                  src="https://www.youtube.com/embed/fAjqo3VbHSc"
                  title="YouTube video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  data-aos="fade-up"
                  data-aos-delay="500"
                ></iframe>
              </div>

              <div className="img2">
                <div className="ins-info">
                  <img className="img22" src={insImg} alt="" data-aos="fade-left" data-aos-delay="700" />
                  <div className="ins">
                    <div className="int-name">{t("ins")}</div>
                    <div className="ins-items">
                      <div className="l">Korean Language</div>
                      <div className="l">Trainer</div>
                      <div className="l">Korean Culture</div>
                    </div>
                    <div className="ins-items small-t">
                      B/A Kelaniya University, BA/MA (Uiduk University South Korea), Legal Interpreter, KiiP 6,
                      Topik 6, Sri lanka international Affairs Committee
                    </div>
                  </div>
                </div>
                {/* {<div className="ins-text-title" data-aos="fade-down" data-aos-delay="900">
                  B/A Kelaniya University, BA/MA (Uiduk University South Korea), Legal Interpreter, KiiP 6,
                  Topik 6, Sri lanka international Affairs Committee
                </div>} */}
              </div>
            </div>
            <div className="ins-in">
              <div className="ins-main-title" data-aos="fade-up" data-aos-delay="100">
                {t("our-monk")}
              </div>
              <div className="ins-main-desc" data-aos="fade-up" data-aos-delay="200">
                {t("our-monk-desc")}
              </div>
              <div className="ins-main-desc" data-aos="fade-up" data-aos-delay="300">
                {t("our-monk-desc2")}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="third-outer p-zero">
        <div className="third-inner">
          <div className="ti">
            <div className="third-inner-title">
              {t("services")}
            </div>
          </div>
        </div>

        <div className="space"></div>
        <div className="space"></div>

        {showModal && (
          <div className="video-modal" onClick={() => setShowModal(false)}>
            <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
              <iframe
                src="https://www.youtube.com/embed/fAjqo3VbHSc?autoplay=1&rel=0"
                title="YouTube Video"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
          </div>
        )}

        <div className="fourth-inner">
          <div className="bg-overlay1"></div>
          <div className="wave-lines-bg" />
          <div className="wave-lines-bg1" />
          <div className="fourth-inner1">
            <div className="monk-wrapper" data-aos="fade-up" data-aos-delay="100">
              <img src={monkImage} alt="Monk" className="monk-img" onClick={() => setShowModal(true)} />
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

      {/* {<div className="third-outer">
        <div className="ul-outer">
          <div className="ul-inner">
            <div className="ul-title">{t("ul")}</div>
          </div>
        </div>
        <div className="space"></div>
        <div className="space"></div>
        <div className="ul-outer">
          <div className="ul-inner1">
            <a style={{ textDecoration: "none" }} href="https://www.slbfe.lk/" target="_blank" rel="noopener noreferrer" className="ul">
              Sri Lanka Bureau of Foreign Employment
            </a>
            <a style={{ textDecoration: "none" }} href="http://www.slembassykorea.com/eng/" target="_blank" rel="noopener noreferrer" className="ul">
              Sri Lankan Embassy in South Korea
            </a>
            <a style={{ textDecoration: "none" }} href="https://overseas.mofa.go.kr/lk-ko/index.do" target="_blank" rel="noopener noreferrer" className="ul">
              Korean Embassy in Sri Lanka
            </a>
            <a style={{ textDecoration: "none" }} href="https://www.topik.go.kr/usr/cmm/subLocation.do?menuSeq=2110601" target="_blank" rel="noopener noreferrer" className="ul">
              Topic Exam Korea
            </a>
          </div>
        </div>
        <div className="space"></div>
        <div className="space"></div>
      </div>} */}

      <Footer />

      <div className="fab-container">
        <a href="https://facebook.com" target="_blank" className="fab fab-icon facebook"><Facebook /></a>
        <a href="https://twitter.com" target="_blank" className="fab fab-icon tiktok"><TikTokFilled /></a>
        <a href="https://instagram.com" target="_blank" className="fab fab-icon instagram"><Instagram /></a>
        <a href="https://youtube.com" target="_blank" className="fab fab-icon youtube"><YouTube /></a>
      </div>
    </div>
  );
}