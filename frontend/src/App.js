import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import RecipeForm from "./components/RecipeForm"; // ✅ Merged AddRecipe here
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import RecipeList from "./components/RecipeList";
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
            <Route path="/" element={<Home />} />  {/* ✅ Default Landing Page */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/recipes" element={<RecipeList />} />  
            <Route path="/add-recipe" element={<RecipeForm />} />  {/* ✅ Fixed Route for Adding Recipes */}
            <Route path="/recipe/:id" element={<Recipe />} /> {/* ✅ Dynamic route for viewing a recipe */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
