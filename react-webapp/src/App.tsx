import React from "react";
import logo from "./logo.svg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing/LandingPage";
import HomePage from "./pages/home/HomePage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/home/sources" element={<HomePage urlView="sources" />} />
      <Route path="/home/search" element={<HomePage urlView="search" />} />
      <Route path="/home/studio" element={<HomePage urlView="studio" />} />
    </Routes>
  );
}

export default App;
