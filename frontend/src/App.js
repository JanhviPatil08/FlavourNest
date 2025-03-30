import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import axios from "axios";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import RecipeForm from "./components/RecipeForm";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import RecipeList from "./components/RecipeList";
import Recipe from "./components/Recipe";
import SplashScreen from "./components/SplashScreen";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

  // ✅ Update axios headers whenever the token changes
  useEffect(() => {
    if (authToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [authToken]);

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setAuthToken(null);
    window.location.href = "/login"; // Force refresh to clear state
  };

  // ✅ Auto-hide splash screen
  useEffect(() => {
    setTimeout(() => setShowSplash(false), 3000);
  }, []);

  // ✅ Protected Route Component
  const PrivateRoute = ({ element }) => {
    return authToken ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      {showSplash ? (
        <SplashScreen />
      ) : (
        <div className="app-container">
          <Navbar authToken={authToken} handleLogout={handleLogout} />
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
              <Route path="/home" element={<Home />} />
              <Route path="/recipes" element={<RecipeList />} />
              <Route path="/add-recipe" element={<PrivateRoute element={<RecipeForm />} />} />
              <Route path="/recipe/:id" element={<Recipe />} />
              <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
            </Routes>
          </div>
          <Footer />
        </div>
      )}
    </Router>
  );
}

export default App;
