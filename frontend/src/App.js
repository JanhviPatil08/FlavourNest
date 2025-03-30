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

// ✅ Store the token globally for API requests
const token = localStorage.getItem("authToken");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// ✅ Protected Route: Redirect to Login if Not Authenticated
const PrivateRoute = ({ element }) => {
  return token ? element : <Navigate to="/login" />;
};

function App() {
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        setTimeout(() => setShowSplash(false), 3000); // Show splash for 3 seconds
    }, []);

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
                            <Route path="/" element={<Navigate to="/login" />} />
                            <Route path="/login" element={<Login />} />
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
