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

const App: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isCourses = location.pathname === "/courses"
  const isCourse = location.pathname === "/course"

  return (
    <>
      {!isHomePage && !isCourses && !isCourse ? (
        <AdvancedNavbar>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user-maintenance" element={<Users />} />
          </Routes>
        </AdvancedNavbar>
      ) : (
        <Navbar>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/courses" element={<Courses/>} />
            <Route path="/course" element={<Course />} />
          </Routes>
        </Navbar>
      )}
    </>
  );
};

export default App;
