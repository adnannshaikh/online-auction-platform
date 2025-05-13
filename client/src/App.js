import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ListItemPage from "./pages/ListItemPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import NotificationPage from "./pages/NotificationPage";
import HomePage from "./pages/HomePage";
import BrowseItemsPage from "./pages/BrowseItemsPage";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<h1 className="text-center mt-5">Welcome to Online Auction Platform</h1>} />
        <Route path="/browse" element={<BrowseItemsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/list-item" element={<ListItemPage />} />
        <Route path="/item/:id" element={<ItemDetailPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
      </Routes>
    </Router>
  );
};

export default App;
