import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
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

const App: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isCourses = location.pathname === "/courses"
  const isMyCourses = location.pathname === "/my-courses"
  const isCourse = location.pathname === "/course"
  const isMyCourse = location.pathname === "/my-course"
  const isRegister = location.pathname === "/register"

  return (
    <>
      {!isHomePage && !isCourses && !isCourse && !isRegister && !isMyCourses && !isMyCourse ?(
        <AdvancedNavbar>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user-maintenance" element={<Users />} />
            <Route path="/category-maintenance" element={<Categories />} />
            <Route path="/course-maintenance" element={<CoursesM />} />
            <Route path="/section-maintenance" element={<Sections />} />
            <Route path="/recording-maintenance" element={<Recordings />} />
          </Routes>
        </AdvancedNavbar>
      ) : (
        <Navbar>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/courses" element={<Courses/>} />
            <Route path="/my-courses" element={<MyCourses/>} />
            <Route path="/course" element={<Course />} />
            <Route path="/my-course" element={<MyCourse />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Navbar>
      )}
    </>
  );
};

export default App;
