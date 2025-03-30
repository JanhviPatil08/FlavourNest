import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { Carousel, Container, Row, Col, Card, Button, Form, Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]); // Fetch from the backend
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [show, setShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("🔴 No token found, redirecting to login...");
      navigate("/login", { replace: true });
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // ✅ Fetch recipes
    axios
      .get("https://flavournest.onrender.com/recipes")
      .then((response) => {
        setRecipes(response.data);
        setFilteredRecipes(response.data);
      })
      .catch((error) => {
        console.error("❌ Error fetching recipes:", error);
      });

    // ✅ Fetch user's favorite recipes
    fetchFavorites();
  }, [navigate]);

  // Function to fetch updated favorites
  const fetchFavorites = () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    axios
      .get("https://flavournest.onrender.com/users/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setFavorites(response.data.map((fav) => fav._id)); // Extract only IDs
      })
      .catch((error) => {
        console.error("❌ Error fetching favorites:", error);
      });
  };

  // ✅ Handle favorites API call (Add/Remove from backend)
  const handleFavorite = async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("🔴 User not logged in, redirecting...");
      navigate("/login");
      return;
    }

    try {
      let updatedFavorites;

      if (favorites.includes(id)) {
        // ❌ Remove from favorites
        await axios.delete(`https://flavournest.onrender.com/users/favorites/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        updatedFavorites = favorites.filter((favId) => favId !== id);
      } else {
        // ✅ Add to favorites
        await axios.post(
          "https://flavournest.onrender.com/users/favorites",
          { recipeId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        updatedFavorites = [...favorites, id];
      }

      setFavorites(updatedFavorites);
      fetchFavorites(); // ✅ Ensure UI updates with latest favorites
    } catch (error) {
      console.error("❌ Error updating favorites:", error);
    }
  };

  return (
    <Container className="mt-4">
      {/* 🚀 Carousel for latest recipes */}
      <Carousel className="mb-4 carousel-container">
        {recipes.slice(-5).reverse().map((recipe) => (
          <Carousel.Item key={recipe._id} className="carousel-item-custom">
            <motion.div initial={{ opacity: 0.8, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
              <img
                className="d-block w-100 carousel-image"
                src={recipe.imageUrl}
                alt={recipe.title}
                onError={(e) => { e.target.src = "https://via.placeholder.com/800x400"; }}
              />
            </motion.div>
            <div className="carousel-overlay">
              <h2 className="carousel-title">{recipe.title}</h2>
              <p className="carousel-description">{recipe.description}</p>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* 🔍 Search Bar */}
      <Form className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search for recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Form>

      {/* 🍽 Latest Recipes */}
      <h1 className="text-center text-success mb-4">Latest Recipes</h1>
      <Row>
        {filteredRecipes.map((recipe) => (
          <Col key={recipe._id} md={4} className="mb-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="shadow-sm recipe-card">
                <Card.Img variant="top" src={recipe.imageUrl} alt={recipe.title} className="recipe-img" onError={(e) => { e.target.src = "https://via.placeholder.com/400"; }} />
                <Card.Body>
                  <Card.Title>{recipe.title}</Card.Title>
                  <Card.Text>{recipe.description}</Card.Text>
                  <Button variant="success" onClick={() => { setSelectedRecipe(recipe); setShow(true); }}>View Recipe</Button>
                  {/* ❤️ Like Button */}
                  <Button variant="light" className="favorite-btn ms-2" onClick={() => handleFavorite(recipe._id)}>
                    {favorites.includes(recipe._id) ? <FaHeart color="red" /> : <FaRegHeart />}
                  </Button>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* 🍽 Recipe Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        {selectedRecipe && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedRecipe.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <img src={selectedRecipe.imageUrl} alt={selectedRecipe.title} className="w-100 mb-3" onError={(e) => { e.target.src = "https://via.placeholder.com/600"; }} />
              <p>{selectedRecipe.description}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </Container>
  );
};

export default Home;



