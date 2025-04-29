import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Navbar from "./Layout/Navbar";
import AdvancedNavbar from "./Layout/AdvancedNavbar";

const App: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      {!isHomePage ? (
        <AdvancedNavbar>
          <Routes>
            <Route path="/home" element={<HomePage />} />
          </Routes>
        </AdvancedNavbar>
      ) : (
        <Navbar>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Navbar>
      )}
    </>
  );
};

export default App;
