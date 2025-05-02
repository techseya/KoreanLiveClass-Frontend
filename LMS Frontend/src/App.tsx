import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Navbar from "./Layout/Navbar";
import AdvancedNavbar from "./Layout/AdvancedNavbar";
import Landing from "./Pages/LandingPage";

const App: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      {!isHomePage ? (
        <AdvancedNavbar>
          <Routes>
            <Route path="/dashboard" element={<HomePage />} />
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
