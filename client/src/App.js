import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<h1 className="text-center mt-5">Welcome to Online Auction Platform</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
