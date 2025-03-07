import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import RecipeForm from "./components/RecipeForm";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import RecipeList from "./components/RecipeList";  // ✅ Updated
import Recipe from "./components/Recipe";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />  {/* ✅ Ensures toasts appear */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />  {/* ✅ Changed `/home` to `/` for default landing */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/recipes" element={<RecipeList />} />  {/* ✅ Fixed route to show recipe list */}
            <Route path="/recipe/:id" element={<Recipe />} />  {/* ✅ Dynamic route for individual recipes */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
