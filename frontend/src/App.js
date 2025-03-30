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
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || null);

  useEffect(() => {
    setTimeout(() => setShowSplash(false), 3000); // Show splash for 3 seconds

    // ✅ Ensure Axios always has the token on app load
    if (authToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
    }
  }, [authToken]);

  // ✅ Check if user is logged in
  const isAuthenticated = !!authToken;

  return (
    <Router>
      {showSplash ? (
        <SplashScreen />
      ) : (
        <div className="app-container">
          <Navbar />
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
              <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
              <Route path="/home" element={<Home />} />
              <Route path="/recipes" element={<RecipeList />} />
              <Route path="/add-recipe" element={isAuthenticated ? <RecipeForm /> : <Navigate to="/login" />} />
              <Route path="/recipe/:id" element={<Recipe />} />
              <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
            </Routes>
          </div>
          <Footer />
        </div>
      )}
    </Router>
  );
}

export default App;

