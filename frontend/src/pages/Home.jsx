import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel, Container, Row, Col, Card, Button, Form, Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
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

    axios
      .get("https://flavournest.onrender.com/recipes")
      .then((response) => {
        setRecipes(response.data);
        setFilteredRecipes(response.data);
      })
      .catch((error) => {
        console.error("❌ Error fetching recipes:", error);
        setRecipes([]);
        setFilteredRecipes([]);
      });

    // Load saved favorites
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, [navigate]);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilteredRecipes(
        recipes.filter((recipe) =>
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery, recipes]);

  // Handle favorites
  const handleFavorite = (id) => {
    setFavorites((prev) => {
      const updatedFavorites = prev.includes(id)
        ? prev.filter((fav) => fav !== id)
        : [...prev, id];
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  return (
    <Container className="mt-4">
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

      <Form className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search for recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Form>

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
                  <Button variant="light" className="favorite-btn ms-2" onClick={() => handleFavorite(recipe._id)}>
                    {favorites.includes(recipe._id) ? <FaHeart color="red" /> : <FaRegHeart />}
                  </Button>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Recipe Modal */}
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

