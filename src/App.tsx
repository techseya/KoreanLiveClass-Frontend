import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Landing from "./Pages/LandingPage";

const App: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <Routes>
      <Route path="/" element={<Landing/>} />
    </Routes>
  );
};

export default App;
