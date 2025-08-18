import React, { forwardRef, useEffect, useState } from "react";
import "../../Common/styles/main.css";
import "../../Common/styles/home.css";
import { useTranslation } from "react-i18next";
import k1 from "../../Assets/Images/k1.jpg";
import k2 from "../../Assets/Images/k2.jpg";
import k3 from "../../Assets/Images/k3.jpeg";
import logo from "../../Assets/Images/logo.jpeg"
import { AutoStories, Close, Facebook, Forward, Instagram, Verified, WhatsApp, YouTube } from "@mui/icons-material";
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
import insImg from "../../Assets/Images/ins.jpg";
import { TikTokFilled } from "@ant-design/icons";
import { IconButton, Modal, Slide } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Footer from "../../Layout/Footer";
import LoginDialogbox from "src/Common/Components/LoginDialog";
import { useNavigate } from "react-router-dom";
import { getCategories } from "src/Services/category_api";
import { getTopCourses } from "src/Services/course_api";
import { getWord, getWordByDate } from "src/Services/word_api";
import trophy from "../../Assets/Images/trophy.png"
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import thumb from "../../Assets/Images/klc-thumb.png"
import { getVideos } from "src/Services/videos_api";
import book1 from "../../Assets/Images/b1.jpeg"
import book2 from "../../Assets/Images/b2.jpeg"
import book3 from "../../Assets/Images/b3.jpeg"
import book4 from "../../Assets/Images/b4.jpeg"
import book5 from "../../Assets/Images/b5.jpeg"
import book6 from "../../Assets/Images/b6.jpeg"
import book7 from "../../Assets/Images/b7.jpeg"
import book8 from "../../Assets/Images/b8.jpeg"
import notificationIcon from "../../Assets/Images/notification.png"
import { getAllNotices } from "src/Services/notice_api";
import CustomModal from "src/Common/Components/CustomModal";
import "../../Common/styles/courses.css";
import quizImg from "../../Assets/Images/quiz-hero.png"
import langImg from "../../Assets/Images/lang-hero.png"
import lang1 from "../../Assets/Images/counseling.png"
import lang2 from "../../Assets/Images/hard-work.png"
import lang3 from "../../Assets/Images/listen.png"
import lang4 from "../../Assets/Images/practice.png"

const Transition = forwardRef(function Transition(props: any, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface CountCardProps {
  count: number;
  suffix?: string;
  label: string;
  positionClass: string;
}

export default function Landing() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation();
  const [bgIndex, setBgIndex] = useState(0);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [visibleIndex1, setVisibleIndex1] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([])
  const [topCourses, setTopCourses] = useState<any[]>([])
  const [videos, setvideos] = useState<any[]>([])
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [korean, setKorean] = useState("")
  const [sinhala, setSinhala] = useState("")
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen1, setModalOpen1] = useState(false);
  const [ref1, inView1] = useInView({ triggerOnce: true });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [notice, setNotice] = useState<any[]>([])
  const [showModal1, setShowModal1] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const handleOpenModal1 = () => {
    if (rows.length > 0) {
      setModalOpen1(true);
    }
  };

  const handleCloseModal1 = () => {
    setModalOpen1(false);
  };

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const noticeToken = localStorage.getItem("noticeToken")

  const handleClose1 = () => {
    setShowModal1(false);
  };

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
    if (visibleIndex + 4 < videos.length) {
      setVisibleIndex(visibleIndex + 4);
    }
  };

  const handlePrev1 = () => {
    if (visibleIndex - 4 >= 0) {
      setVisibleIndex(visibleIndex - 4);
    }
  };

  const handleNext2 = () => {
    if (visibleIndex1 + 4 < books.length) {
      setVisibleIndex1(visibleIndex1 + 4);
    }
  };

  const handlePrev2 = () => {
    if (visibleIndex1 - 4 >= 0) {
      setVisibleIndex1(visibleIndex1 - 4);
    }
  };

  const handleCourseClick = (course: any) => {

    navigate(`/category-courses`, {
      state: {
        id: course.id,
        name: course.name,
      }
    });
  };

  const images = [k1, k2, k3];
  const koreanLetters = [""];

  const cards = [
    { count: 10, suffix: "+", label: t("experience") },
    { count: 1500, suffix: "+", label: t("students") },
    { count: 35000, suffix: "+", label: t("words") },
    { count: 400, suffix: "+", label: t("methods") },
    { count: 30, suffix: "+", label: t("kc") },
  ];



  const handleGetLessons = async () => {
    const baseDate = new Date().toISOString().split("T")[0];
    try {
      const response = await getWordByDate(baseDate);
      const allWords = response.data;
      setRows(allWords);
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    const hasRefreshed = localStorage.getItem("hasRefreshed");

    if (!noticeToken) {
      setShowModal1(true)
    }

    if (!hasRefreshed) {
      localStorage.setItem("hasRefreshed", "true");
      window.location.reload(); // Only once per session
      return;
    }
    handleGetLessons()
    handleGetCategories();
    handleGetTopCourses();
    handleGetWord();
    handleGetVideos()
    handleGetNotices()

    AOS.init({
      duration: 1000,
      once: true
    });

    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % images.length);
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const getCardPosition = (index: number) => {
    const total = cards.length;
    const prev = (currentIndex + total - 1) % total;
    const next = (currentIndex + 1) % total;

    if (index === prev) return "left";
    if (index === currentIndex) return "center";
    if (index === next) return "right";
    return "hidden";
  };

  const handleGetWord = async () => {
    try {
      const response = await getWord()
      setKorean(response.data.korean)
      setSinhala(response.data.sinhala)
    } catch (error) {
      console.error(error);
    }
  }

  const handleGetNotices = async () => {
    try {
      const response = await getAllNotices("")
      setNotice(response.data)
    } catch (error) {
      setNotice([])
      console.error(error);
    }
  }

  const handleGetVideos = async () => {
    try {
      const res = await getVideos()
      setvideos(res.data)
    } catch (error) {
      console.error(error);
    }
  }

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

  const convertToEmbedUrl = (url: string) => {
    let videoId = "";

    if (url.includes("youtu.be")) {
      // Handle short youtu.be format
      videoId = url.split("youtu.be/")[1].split(/[?&]/)[0];
    } else if (url.includes("youtube.com/watch")) {
      // Handle full watch?v= format
      const params = new URLSearchParams(url.split("?")[1]);
      videoId = params.get("v") || "";
    }

    return `https://www.youtube.com/embed/${videoId}`;
  };

  const books = [
    {
      name: "EPS TOPIK BOOK – 1",
      description: "කොරියානු රැකියාවක් සදහා කොරියානු රජයේ අනුමත පාඩම් හැටකින් යුක්ත විෂය නිර්දේශයේ පළමු පාඩම් 30 මෙහි අන්තර්ගත වේ. මෙම ග්‍රන්ථයේ කොරියන් අක්ෂර ලියන ආකාරයේ සිට මූලික ව්‍යාකරණ එසේම වචන පිලිබදවත් පැහැදිලි කරනු ලබයි. මෙහි කෙටි වාක්‍ය සහ ජේද භාවිතා කරමින් අනුමාන ප්‍රශ්ණ පත්‍රයන්ද මෙහිදී ඔබට අධ්‍යනය කිරීමට හැකියාව ලැබේ. මෙහි සියලු පාඩම් ඔබට Korean Live Class Mobile App එක හරහා ඉගෙනීමටත් හැකියාවක් ඇත.",
      price: 0,
      tag: true,
      image: book8
    },
    {
      name: "EPS TOPIK BOOK – 2",
      description: "කොරියානු රජයේ අනුමත පාඩම් හැටකින් යුක්ත විෂය නිර්දේශයේ දෙවන පාඩම් 30 මෙහි අන්තර්ගත වේ. මෙම කොටසේදී වැඩබිමෙහි දැනගෙන සිටිය යුතු සංස්කෘතීන් / නීති රෙගුලාසි ආදී කරුණුත් එසේම පළමු පොතට වඩා ගැඹුරු ව්‍යාකරණ සහ වචන ඉගෙනීමටත් හැකියාව ලැබේ. එසේම දීර්ඝ ජේද සහ වාක්‍යයන් භාවිතා කරමින් අනුමාන ප්‍රශ්ණ පත්‍රයන්ට මුහුණ දීමටත් ඒවාට උත්තර සපයන ආකාරයත් මෙම ග්‍රන්ථ භාවිතා කිරීමෙන් ඔබට ඉගෙනීමට හැක. මෙහි සියලු පාඩම් ඔබට Korean Live Class Mobile App එක හරහා ඉගෙනීමටත් හැකියාවක් ඇත.",
      price: 0,
      tag: true,
      image: book7
    },
    {
      name: "VERBS CLASSIFICATION",
      description: "ක්‍රියාපද වර්ගීකරණය වන මෙම ග්‍රන්ථය මගින් ඔබගේ කොරියන් භාෂා දැනුම ඉතා කෙටි කාලයකින් දියුණු කර ගැනීමට හැකියාව ඇත. මෙහිදී ක්‍රියාපද 125 ක් ව්‍යාකරණ ක්‍රම 45 ක් සමග වර නගා ඇත. කථා බහේදී නිතර භාවිතා වන ව්‍යාකරණ මෙම ග්‍රන්ථයේදී වරනගා තිබේ.",
      price: 1200.00,
      tag: true,
      image: book4
    },
    {
      name: "KOREAN LANGUAGE NOUNS & VERBS",
      description: "කොරියන් භාෂාවේ එදිනෙදා නිතර භාවිත වන නාම පද හා ක්‍රියාපද එකතුකර නිර්මාණය කරන ලද ග්‍රන්ථයකි. මෙහි කොරියන් වචන උච්චාරණය කොරියන් ජාතික නිවේදිකාවක් විසින් සිදුකරන අතර එහි සිංහල අර්ථයද එකතු කර තිබේ. මෙහි හඩ පටයත් ඔබට ලබා ගත හැක.",
      price: 1000.00,
      tag: true,
      image: book1
    },
    {
      name: "Korean Language Grammer – Part 1",
      description: "මෙම ග්‍රන්ථය කොරියන් භාෂාවේ ව්‍යාකරණ පිලිබදව සිදුකල ග්‍රන්ථයකි. මෙය 2016 වර්ෂයේ සිට 2017වර්ෂය දක්වා YouTube හරහා සිදුකල පාඩම් මාලාවේ අත් පොතයි. මෙහි සියලු ව්‍යාකරණ සහ උදාහරණ වාක්‍ය සියල්ල කොරියන් භාෂාවෙන් පමණක් සිදු කිරීමට හේතුව වන්නේ අදාල පාඩම් හි Videos බලා ලිවීමට හුරුකරවීමට ඇති අවශ්‍යතාවයයි.",
      price: 1100.00,
      tag: true,
      image: book3
    },
    {
      name: "KOREAN SINHALA DICTIONARY",
      description: "කොරියන් සිංහල ශබ්දකෝෂය කොරියන් විභාගයන්ට අනිවාර්යෙන්ම දැනගෙන සිටියයුතු වචන එකතුකර කරන ලද ග්‍රන්ථයකි. එසේම කොරියාවේ උසස් අධ්‍යාපනය ලබන්නට බලාපොරොත්තු වන්නේ නම් මෙම ග්‍රන්ථය ඔබට මහත් උපකාරයක් වනු ඇත.",
      price: 0,
      tag: false,
      image: book2
    },
    {
      name: "TOPIK 1 ~ 2",
      description: "මෙම ග්‍රන්ථය ටොපික් පළමු සහ දෙවන පන්ති විභාගය ඉලක්ක කර නිර්මාණය කරන ලද ප්‍රශ්ණපත්‍ර පොතකි. මෙහි Listening සහ Reading ආදී වශයෙන් වන අතර ප්‍රශ්ණපත්‍ර තුන බැගින් සාකච්ජ්චා කර ඇත. මෙම විභාගය කොරියාවේ පමණක් නොව ශ්‍රී ලංකාවේදී ද මුහුණ දීමට හැකියාව ඇත. මෙයට අදාල සියලු පාඩම් YouTube හරහා නැරබීමටත් හැක. මෙමෙ විභාගයට මුහුණ දීම තුලින් ඔබට වීසා මරු කිරීමෙදී විශාල උදව්වක් වනු ඇත.",
      price: 0,
      tag: false,
      image: book6
    },
    {
      name: "TOPIK 3 ~ 6",
      description: "මෙම ප්‍රශ්ණපත්‍ර පොත ටොපික් තුන්වන සහ හයවන පන්ති විභාගය ඉලක්ක කර නිර්මාණය කරන ලද ග්‍රන්ථයකි. මෙහිදී ප්‍රශ්ණපත්‍ර එක බැගින් සාකච්ජ්චා වන අතර එය Listening / Reading / Writing වශයෙන් කොටස් තුනකින් යුක්තය. මෙම විභාගයත් ශ්‍රී ලංකාවේ සිට මහුණ දීමට හැකි අතර ඔබ කොරියාවට පැමිණි පසු වෙනත් වීසා වලට මාරු වීමේදී ප්‍රයෝජනවත්ය. මෙයට අදාල සියලු පාඩම් YouTube හරහා නැරබීමටත් හැක.",
      price: 0,
      tag: false,
      image: book5
    }
  ]

  return (
    <div
      className="main-outer"
      style={{ backgroundImage: `url(${images[bgIndex]})` }}
    >
      {showModal1 && notice.length !== 0 && (
        <CustomModal
          title={notice[0]?.title}
          imageSrc={notice[0]?.thumbnailUrl}
          description={notice[0]?.notification}
          onClose={handleClose1}
        />
      )}

      <LoginDialogbox
        open={loginOpen}
        onAgree={handleLogin}
        onClose={handleClose}
      />
      {/* <div className="word-outer" onClick={() => setModalOpen(true)}>
        {t("word")}
      </div> */}

      {modalOpen && (
        <div className="modal-overlay7" onClick={() => setModalOpen(false)}>
          <div className="modal-box7" onClick={(e) => e.stopPropagation()}>
            <h2>{t("learnK")}</h2>
            <div className="modal-content7">
              <div className="modal-field7">
                <label>Korean Word:</label>
                <input type="text" value={korean} readOnly />
              </div>
              <div className="modal-field7">
                <label>Sinhala Meaning:</label>
                <input type="text" value={sinhala} readOnly />
              </div>
            </div>
            <button className="close-btn7" onClick={() => setModalOpen(false)}>
              ×
            </button>
          </div>
        </div>
      )}

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

      <div className="second-outer">
        <div className="second-i">
          <div className="center">
            <img className="trophy" src={trophy} alt="" data-aos="fade-up" data-aos-delay="100" />
          </div>
          <div className="second-inner-wrapper" data-aos="fade-up" data-aos-delay="100" ref={ref1}>
            {cards.map((card, index) => {
              return (
                <div
                  key={index}
                  ref={ref}
                  className={`s-in carousel-card ${getCardPosition(index)}`}
                >
                  <div className="s-in-no">
                    {inView && (
                      <CountUp start={0} end={card.count} duration={2} suffix={card.suffix} />
                    )}
                  </div>
                  <div className="s-in1">
                    <div className="s-in2">{card.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

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

      <div className="third-outer bg-layer">
        <div className="third-inner">
          <div className="ti">
            <div className="third-inner-title" data-aos="fade-up" data-aos-delay="100">
              {t("top-categories")}
            </div>
          </div>
        </div>

        <div className="space"></div>
        <div className="space"></div>
        <div className="top-courses-outer1" data-aos="fade-up" data-aos-delay="100">
          {Array.isArray(categories) && categories.map((course, index) => (
            <div
              className="top-course-card"
              data-aos="fade-up" data-aos-delay="100"
              key={index}
              onClick={() => handleCourseClick(course)}
              style={{ cursor: "pointer" }}
            >
              {/* your card code here */}
              <div className="course-thumbnail">
                {course.imageUrl === null ? (<img src={thumb} alt="Course Thumbnail" />) : (<img src={course.imageUrl.replace("dl=0", "raw=1")} alt="Course Thumbnail" />)}

              </div>

              <div className="course-info">
                <h3 className="course-title">{course.name}</h3>
                {<span className="course-level">Courses : {course.courseCount}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="space"></div>
        <div className="space"></div>
        <div className="space"></div>
      </div>

      <div className="content-main-out">
        {/* <div className="floating-balls">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div> */}
        <div className="content-in cin">
          <div className="content-highlights" data-aos="fade-up" data-aos-delay="100">
            🟢 Learn Korean the fun way!
          </div>
          <div className="content-highlights" data-aos="fade-up" data-aos-delay="120">
            🟢 Quick quizzes, big results.
          </div>
          <div className="content-highlights" data-aos="fade-up" data-aos-delay="140">
            🟢 Master Korean, one quiz at a time.
          </div>
        </div>
        <div className="content-in">
          <img className="quiz-img" data-aos="fade-up" data-aos-delay="100" src={quizImg} alt="" />
        </div>
        <div className="content-in cin cin1">
          <div className="ins-main-title" data-aos="fade-up" data-aos-delay="100">
            {t("quiz")}
          </div>
          <div className="ins-main-desc" data-aos="fade-up" data-aos-delay="200">
            {t("quizDetails")}
          </div>
          <div onClick={() => navigate("/quizes")} style={{ color: "#0047aa", display: "flex", alignItems: "center !important", gap: "10px", cursor: "pointer" }} className="ins-main-desc" data-aos="fade-up" data-aos-delay="200">
            <Forward /> {t("quiz")}
          </div>
        </div>
      </div>

      <div className="third-outer bg-layer">

        <div className="space"></div>
        <div className="space"></div>

        <div className="ins-inner">
          <div className="ins-inner1">
            <div className="ins-in14" data-aos="fade-up" data-aos-delay="100">
              <div className="ins-main-title" data-aos="fade-up" data-aos-delay="100">
                {t("lang")}
              </div>
              <div className="ins-main-desc" data-aos="fade-up" data-aos-delay="200">
                {t("langDetails")}
              </div>
              <div onClick={() => navigate("/user-language-practice")} style={{ color: "#0047aa", display: "flex", alignItems: "center !important", gap: "10px", cursor: "pointer" }} className="ins-main-desc" data-aos="fade-up" data-aos-delay="200">
                <Forward /> {t("lang")}
              </div>
              <div className="lang-sub-cards-outer">
                <div className="lang-sub-card">
                  <div className="card-inner">
                    <div className="card-front">
                      <img className="lang-sub-img" src={lang1} alt="" />
                    </div>
                    <div className="card-back">
                      <p>Speak with Confidence</p>
                    </div>
                  </div>
                </div>

                <div className="lang-sub-card">
                  <div className="card-inner">
                    <div className="card-front">
                      <img className="lang-sub-img" src={lang2} alt="" />
                    </div>
                    <div className="card-back">
                      <p>Master Everyday Words</p>
                    </div>
                  </div>
                </div>

                <div className="lang-sub-card">
                  <div className="card-inner">
                    <div className="card-front">
                      <img className="lang-sub-img" src={lang3} alt="" />
                    </div>
                    <div className="card-back">
                      <p>Train Your Listening</p>
                    </div>
                  </div>
                </div>

                <div className="lang-sub-card">
                  <div className="card-inner">
                    <div className="card-front">
                      <img className="lang-sub-img" src={lang4} alt="" />
                    </div>
                    <div className="card-back">
                      <p>Practice Made Easy</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <div className="ins-in14">
              <div className="img14">
                <img style={{ width: "100%", objectFit: "cover", borderRadius: "10px" }} src={langImg} alt="" />
              </div>
            </div>
          </div>
        </div>

        <div className="space"></div>
        <div className="space"></div>
        <div className="space"></div>
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
          {books.slice(visibleIndex1, visibleIndex1 + 4).map((b, index) => (
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
                } className="purchase-btn">{t("purchase")}</button>
              </div>
            </div>
          </div>
        )}

        <div className="arrow-buttons-row1">
          <div
            className="arrow-button1"
            onClick={handlePrev2}
            style={{ visibility: visibleIndex1 === 0 ? "hidden" : "visible" }}
          >
            <ArrowBackIosIcon />
          </div>

          <div
            className="arrow-button1"
            onClick={handleNext2}
            style={{
              visibility: visibleIndex1 + 4 >= books.length ? "hidden" : "visible",
            }}
          >
            <ArrowForwardIosIcon />
          </div>
        </div>
      </div>

      <div id="who" className="space"></div>
      <div className="space"></div>
      <div className="space"></div>
      <div className="space"></div>
      <div className="space"></div>

      <div className="third-outer bg-layer">
        <div className="third-inner">
          <div className="ti">
            <div className="third-inner-title" data-aos="fade-up" data-aos-delay="100">
              {t("who")}
            </div>
          </div>
        </div>

        <div className="space"></div>
        <div className="space"></div>
        <div className="to" data-aos="fade-up" data-aos-delay="100">
          <div className="to-in">
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
              <Verified style={{ color: "#4caf50", marginRight: '10px' }} />{t("who-content5")}
            </div>
            <div className="second-content" data-aos="fade-up" data-aos-delay="200">
              <Verified style={{ color: "#4caf50", marginRight: '10px' }} />{t("who-content6")}
            </div>
          </div>
          <div className="to-in1"></div>
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
          {videos.slice(visibleIndex, visibleIndex + 4).map((u, index) => (
            <div className="i1" key={u.id}>
              <iframe
                className="video-embed1"
                src={convertToEmbedUrl(u.link)}
                title={`YouTube video ${u.id}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                data-aos="fade-up"
                data-aos-delay="500"
              ></iframe>
            </div>
          ))}

        </div>
        <div className="arrow-buttons-row1">
          <div
            className="arrow-button1"
            onClick={handlePrev1}
            style={{ visibility: visibleIndex === 0 ? "hidden" : "visible" }}
          >
            <ArrowBackIosIcon />
          </div>

          <div
            className="arrow-button1"
            onClick={handleNext1}
            style={{
              visibility: visibleIndex + 4 >= videos.length ? "hidden" : "visible",
            }}
          >
            <ArrowForwardIosIcon />
          </div>
        </div>
      </div>

      <div id="us" className="space"></div>
      <div className="space"></div>
      <div className="space"></div>
      <div className="space"></div>

      <div className="third-outer bg-layer1">
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

              <div className="img2" data-aos="fade-up" data-aos-delay="100">
                <div className="ins-info">
                  <img className="img22" src={insImg} alt="" data-aos="fade-left" data-aos-delay="700" />
                  <div className="ins">
                    <div className="int-name" data-aos="fade-up" data-aos-delay="100">{t("ins")}</div>
                    <div className="ins-items" data-aos="fade-up" data-aos-delay="100">
                      <div className="l">Korean Language</div>
                      <div className="l">Trainer</div>
                      <div className="l">Korean Culture</div>
                    </div>
                    <div className="ins-items small-t" data-aos="fade-up" data-aos-delay="100">
                      B/A Kelaniya University, BA/MA (Uiduk University South Korea), Legal Interpreter, KiiP 6,
                      Topik 6,South Korea & Sri Lanka international Affairs Committee
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="ins-in" data-aos="fade-up" data-aos-delay="100">
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

      {/* <div className="third-outer p-zero">
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
      </div> */}

      <div className="space"></div>
      <div className="space"></div>

      {<div className="third-outer bg-layer">
        <div className="ul-outer">
          <div className="ul-inner">
            <div className="ul-title" data-aos="fade-up" data-aos-delay="100">{t("ul")}</div>
          </div>
        </div>
        <div className="space"></div>
        <div className="space"></div>
        <div className="ul-outer">
          <div className="ul-inner1">
            <a data-aos="fade-up" data-aos-delay="100" style={{ textDecoration: "none" }} href="https://www.slbfe.lk/" target="_blank" rel="noopener noreferrer" className="ul">
              Sri Lanka Bureau of Foreign Employment
            </a>
            <a data-aos="fade-up" data-aos-delay="100" style={{ textDecoration: "none" }} href="http://www.slembassykorea.com/eng/" target="_blank" rel="noopener noreferrer" className="ul">
              Sri Lankan Embassy in South Korea
            </a>
            <a data-aos="fade-up" data-aos-delay="100" style={{ textDecoration: "none" }} href="https://overseas.mofa.go.kr/lk-ko/index.do" target="_blank" rel="noopener noreferrer" className="ul">
              Korean Embassy in Sri Lanka
            </a>
            <a data-aos="fade-up" data-aos-delay="100" style={{ textDecoration: "none" }} href="https://www.topik.go.kr/usr/cmm/subLocation.do?menuSeq=2110601" target="_blank" rel="noopener noreferrer" className="ul">
              Topic Exam Korea
            </a>
          </div>
        </div>
        <div className="space"></div>
        <div className="space"></div>
      </div>}

      <Footer />

      <div className="fab-container">
        <a href="https://www.facebook.com/share/1BiH9u5kgC/?mibextid=wwXIfr" target="_blank" className="fab fab-icon facebook"><Facebook /></a>
        <a href="https://www.tiktok.com/@korean.live.class?_t=ZS-8wDKjn6VeBs&_r=1" target="_blank" className="fab fab-icon tiktok"><TikTokFilled /></a>
        <a href="https://www.instagram.com/korean_live_class/" target="_blank" className="fab fab-icon instagram"><Instagram /></a>
        <a href="https://www.youtube.com/@koreanliveclassrev.mangala5996" target="_blank" className="fab fab-icon youtube"><YouTube /></a>
      </div>


      {rows.length > 0 && (
        <div
          className="tl-outer1"
          onClick={handleOpenModal1}
          style={{ cursor: "pointer" }}
          title={t("extra")}
        >
          <AutoStories />
        </div>
      )}

      <Modal open={modalOpen1} onClose={handleCloseModal1}>
        <div className="words-outer" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: "auto",
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#e5e7eb',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center',
          outline: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}>
          <IconButton onClick={handleCloseModal1} style={{ position: 'absolute', top: 10, right: 10 }}>
            <Close />
          </IconButton>

          <div className="word-label">
            {t("extra")} -{new Date().toISOString().split("T")[0]}
          </div>
          <div className="word-inner">
            {rows.length > 0 && rows.map((row) => (
              <div className="word-inner1" key={row.id} style={{ marginBottom: "2rem" }}>
                {row.imageUrl && (
                  <div className="word-img" style={{ position: "relative", width: "50%", minHeight: "150px" }}>
                    <img
                      src={row.imageUrl.replace("dl=0", "raw=1")}
                      alt="word"
                      className="w-img"
                      style={{
                        width: "50%",
                        height: "auto",
                        borderRadius: "8px",
                        marginTop: "1rem"
                      }}
                    />
                  </div>
                )}
                <div className="word-text">
                  {row.korean.split(',').map((word: any, index: any) => (
                    <h2 key={index}>{word.trim()}</h2>
                  ))}

                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}