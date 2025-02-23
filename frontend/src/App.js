import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import RecipeForm from "./components/RecipeForm";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import RecipeList from "./components/RecipeList";
import Recipes from "./pages/Recipes";  // ✅ Changed from RecipeData to Recipes
import Recipe from "./components/Recipe";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-recipe" element={<RecipeForm />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/recipes" element={<Recipes />} />  {/* ✅ Fixed Route */}
            <Route path="/recipe/:id" element={<Recipe />} />  {/* ✅ Fixed Dynamic Recipe Route */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
