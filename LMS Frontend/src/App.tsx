import React, { use } from "react";
import { Route, Routes, useLocation, useMatch } from "react-router-dom";
import Navbar from "./Layout/Navbar";
import AdvancedNavbar from "./Layout/AdvancedNavbar";
import Landing from "./Pages/User/LandingPage";
import Dashboard from "./Pages/Admin/Dashboard";
import UserMaintenance from "./Pages/Admin/UserMaintenance/UserMaintenance";
import Users from "./Pages/Admin/UserMaintenance";
import Courses from "./Pages/User/Courses";
import Course from "./Pages/User/Course";
import Register from "./Pages/User/Register";
import MyCourses from "./Pages/User/MyCourses";
import MyCourse from "./Pages/User/MyCourse";
import Categories from "./Pages/Admin/CategoryMaintenance";
import CoursesM from "./Pages/Admin/CourseMaintenance";
import Sections from "./Pages/Admin/SectionMaintenance";
import Recordings from "./Pages/Admin/RecordingMaintenance";
import KoreanWordMaintenance from "./Pages/Admin/KoreanWord/KoreanWordMaintenance";
import Category from "./Pages/User/Category";
import CategoryCourses from "./Pages/User/CategoryCourse";
import KoreanVideos from "./Pages/Admin/KoreanVideoMaintenance";
import PrivacyPolicy from "./Pages/User/PrivacyPolicy";
import Terms from "./Pages/User/Terms";
import NoticeMaintenance from "./Pages/Admin/NoticeMaintenance/NoticeMaintenance";
import Quizes from "./Pages/Admin/QuizMaintenance";
import Profile from "./Pages/User/Profile";
import InstructorChat from "./Pages/Admin/Chat/InstructorChat";
import UserQuizes from "./Pages/User/Quizes";
import LanguagePractice from "./Pages/Admin/LanguagePractice";
import UserLanguagePractice from "./Pages/User/UserLanguagePractice";
import UserLanguagePracticeDemo from "./Pages/User/UserLanguagePracticeDemo";
import MyLanguagePracticeDemo from "./Pages/User/MyLanguagePracticeDemo";

const App: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isCourses = location.pathname === "/courses"
  const isCategory = location.pathname === "/categories"
  const isCategoryC = location.pathname === "/category-courses"
  const isMyCourses = location.pathname === "/my-courses"
  const isCourse = useMatch("/course/:id") !== null;
  const isMyCourse = location.pathname === "/my-course"
  const isRegister = location.pathname === "/register"
  const isPrivacy = location.pathname === "/privacy-policy"
  const isTerms = location.pathname === "/terms-services"
  const isProfile = location.pathname === "/profile"
  const isQuiz = location.pathname === "/quizes";
  const isUserLanguagePractice = location.pathname === "/user-language-practice";
  const isUserLanguagePracticeDemo = useMatch("/language-practice-demo/:id") !== null;
  const isMyLanguagePracticeDemo = useMatch("/my-language-practice-demo/:id") !== null;

  return (
    <>
      {!isQuiz && !isProfile && !isHomePage && !isCourses && !isCategory && !isCourse && !isRegister && !isMyCourses && !isMyCourse && !isCategoryC && !isPrivacy && !isTerms && !isUserLanguagePractice && !isUserLanguagePracticeDemo && !isMyLanguagePracticeDemo ? (
        <AdvancedNavbar>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user-maintenance" element={<Users />} />
            <Route path="/category-maintenance" element={<Categories />} />
            <Route path="/course-maintenance" element={<CoursesM />} />
            <Route path="/section-maintenance" element={<Sections />} />
            <Route path="/recording-maintenance" element={<Recordings />} />
            <Route path="/quiz-maintenance" element={<Quizes />} />
            <Route path="/video-maintenance" element={<KoreanVideos />} />
            <Route path="/notice" element={<NoticeMaintenance />} />
            <Route path="/k-lesson" element={<KoreanWordMaintenance />} />
            <Route path="/messages" element={<InstructorChat />} />
            <Route path="/language-practice" element={<LanguagePractice />} />
          </Routes>
        </AdvancedNavbar>
      ) : (
        <Navbar>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/courses" element={<Courses/>} />
            <Route path="/categories" element={<Category/>} />
            <Route path="/category-courses" element={<CategoryCourses/>} />
            <Route path="/my-courses" element={<MyCourses/>} />
            <Route path="/course/:id" element={<Course />} />
            <Route path="/my-course" element={<MyCourse />} />
            <Route path="/register" element={<Register />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-services" element={<Terms />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/quizes" element={<UserQuizes />} />
            <Route path="/user-language-practice" element={<UserLanguagePractice />} />
            <Route path="/language-practice-demo/:id" element={<UserLanguagePracticeDemo />} />
            <Route path="/my-language-practice-demo/:id" element={<MyLanguagePracticeDemo />} />            
          </Routes>
        </Navbar>
      )}
    </>
  );
};

export default App;
