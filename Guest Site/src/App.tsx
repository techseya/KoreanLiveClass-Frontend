import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Navbar from "./Layout/Navbar";

const App: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      <Navbar>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Navbar>
    </>
  );
};

export default App;
