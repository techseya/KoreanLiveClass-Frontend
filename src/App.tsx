import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./Pages/HomePage";

const App: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <Routes>
      <Route path="/" element={<HomePage/>} />
    </Routes>
  );
};

export default App;
