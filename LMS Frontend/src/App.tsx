import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./Layout/Navbar";
import AdvancedNavbar from "./Layout/AdvancedNavbar";
import Landing from "./Pages/User/LandingPage";
import Dashboard from "./Pages/Admin/Dashboard";
import UserMaintenance from "./Pages/Admin/UserMaintenance";

const App: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      {!isHomePage ? (
        <AdvancedNavbar>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user-maintenance" element={<UserMaintenance />} />
          </Routes>
        </AdvancedNavbar>
      ) : (
        <Navbar>
          <Routes>
            <Route path="/" element={<Landing />} />
          </Routes>
        </Navbar>
      )}
    </>
  );
};

export default App;
