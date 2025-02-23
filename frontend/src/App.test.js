import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navbar";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import AddRecipe from "./pages/AddRecipe";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/add-recipe" element={<AddRecipe />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
